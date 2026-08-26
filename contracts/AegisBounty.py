# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

import json
import re
from genlayer import *
import genlayer.gl as gl

STATUS_ACTIVE = "ACTIVE"
STATUS_SUBMITTED = "SUBMITTED"
STATUS_RESOLVING = "RESOLVING"
STATUS_SETTLED = "SETTLED"
STATUS_REJECTED = "REJECTED"

SEVERITY_CRITICAL = "CRITICAL"
SEVERITY_HIGH = "HIGH"
SEVERITY_MEDIUM = "MEDIUM"
SEVERITY_LOW = "LOW"
SEVERITY_INVALID = "INVALID"

MAX_POC_LEN = 3500
CONFIDENCE_THRESHOLD_BPS = 7000  # 70.00% minimum confidence


def _to_address(val) -> Address:
    """Safely coerces Address, string, or hex int into a valid GenLayer Address object."""
    if isinstance(val, Address):
        return val
    if isinstance(val, str):
        return Address(val)
    if isinstance(val, int):
        hex_str = hex(val)
        hex_body = hex_str[2:].rjust(40, "0")
        return Address("0x" + hex_body)
    return Address(str(val))


def _normalize_address(addr: str) -> str:
    """Normalize addresses to prevent casing/EIP-55 comparison mismatches."""
    return addr.strip().lower()


def _parse_verdict_json(raw: str) -> dict:
    """Defensive JSON extraction from LLM output."""
    if isinstance(raw, dict):
        return raw
    if not isinstance(raw, str):
        return {}
    first = raw.find("{")
    last = raw.rfind("}")
    if first == -1 or last == -1 or last < first:
        return {}
    snippet = raw[first : last + 1]
    snippet = re.sub(r",(?!\s*?[\{\[\"\'\w])", "", snippet)
    try:
        return json.loads(snippet)
    except (json.JSONDecodeError, ValueError):
        return {}


class AegisBounty(gl.Contract):
    """
    Decentralized Bug Bounty & Exploit Adjudication Protocol.
    Protocols lock bounty funds in native GEN; whitehats submit live PoC evidence URLs.
    GenLayer validators verify exploit severity against the security charter and
    automatically disburse on-chain payouts via the Equivalence Principle.
    """
    protocol_admin: Address
    protocol_name: str
    security_charter: str
    bounty_pool: u256
    status: str

    # Bounty percentages in basis points (10000 = 100%)
    critical_bps: u256
    high_bps: u256
    medium_bps: u256

    reports_count: u256
    report_researcher: TreeMap[u256, Address]
    report_poc_url: TreeMap[u256, str]
    report_title: TreeMap[u256, str]
    report_status: TreeMap[u256, str]
    report_severity: TreeMap[u256, str]
    report_payout: TreeMap[u256, u256]
    report_confidence: TreeMap[u256, u256]
    report_reasoning: TreeMap[u256, str]

    def __init__(
        self,
        protocol_name: str,
        security_charter: str,
        critical_bps: u256,
        high_bps: u256,
        medium_bps: u256,
    ):
        self.protocol_admin = gl.message.sender_address
        self.protocol_name = str(protocol_name)
        self.security_charter = str(security_charter)
        self.bounty_pool = u256(0)
        self.status = STATUS_ACTIVE
        self.critical_bps = critical_bps
        self.high_bps = high_bps
        self.medium_bps = medium_bps
        self.reports_count = u256(0)

    @gl.public.write.payable
    def fund_bounty_pool(self) -> None:
        """Protocol admin or donors deposit native GEN into the bounty pool."""
        if gl.message.value <= 0:
            gl.vm.UserError("Deposit value must be greater than 0")
        self.bounty_pool = u256(int(self.bounty_pool) + int(gl.message.value))

    @gl.public.write
    def submit_vulnerability_report(self, poc_evidence_url: str, claim_title: str) -> u256:
        """Whitehat researcher submits vulnerability proof of concept URL."""
        clean_url = poc_evidence_url.strip()
        clean_title = claim_title.strip()

        if not clean_url.startswith("http://") and not clean_url.startswith("https://"):
            gl.vm.UserError("PoC evidence URL must start with http:// or https://")
        if len(clean_url) > 500:
            gl.vm.UserError("PoC evidence URL exceeds maximum allowed length of 500 characters")
        if len(clean_title) == 0:
            gl.vm.UserError("Report title cannot be empty")
        if len(clean_title) > 200:
            gl.vm.UserError("Report title exceeds maximum allowed length of 200 characters")

        report_id = self.reports_count
        self.report_researcher[report_id] = gl.message.sender_address
        self.report_poc_url[report_id] = clean_url
        self.report_title[report_id] = clean_title
        self.report_status[report_id] = STATUS_SUBMITTED
        self.report_severity[report_id] = "PENDING"
        self.report_payout[report_id] = u256(0)
        self.report_confidence[report_id] = u256(0)
        self.report_reasoning[report_id] = ""

        self.reports_count = u256(int(report_id) + 1)
        return report_id

    @gl.public.write
    def resolve_bounty_report(self, report_id: u256) -> None:
        """
        Validators fetch the live PoC URL, evaluate against the protocol security charter,
        and reach consensus on exploit severity and payout execution.
        Strict contract guards ensure settled or in-flight reports can never be resolved or paid twice.
        """
        # Guard 1: Bounds check
        if int(report_id) >= int(self.reports_count):
            gl.vm.UserError(f"Report ID {report_id} does not exist")

        # Guard 2: Terminal and in-flight state verification
        current_status = self.report_status[report_id]
        if current_status in [STATUS_SETTLED, STATUS_REJECTED, STATUS_RESOLVING]:
            gl.vm.UserError(f"Report {report_id} already in terminal or processing state: {current_status}. Cannot resolve again.")

        # Guard 3: Double-payout prevention guard
        if int(self.report_payout[report_id]) > 0:
            gl.vm.UserError(f"Report {report_id} has already been paid out")

        # Set processing state to prevent re-entrancy or duplicate parallel executions
        self.report_status[report_id] = STATUS_RESOLVING

        poc_url = self.report_poc_url[report_id]
        charter = self.security_charter
        title = self.report_title[report_id]

        def eval_task() -> dict:
            # 1. Fetch live PoC content from submitted evidence URL
            live_poc = ""
            try:
                live_poc = gl.nondet.web.render(poc_url, mode="text")[:MAX_POC_LEN]
            except Exception:
                live_poc = "FAILED_TO_FETCH_LIVE_POC_URL"

            # 2. Instruct LLM to analyze the PoC against the security charter
            prompt = f"""You are an expert security auditor on GenLayer adjudicating a decentralized bug bounty.
Protocol Security Scope & Charter:
{charter}

Vulnerability Submission: {title}
Live PoC Evidence Fetched from ({poc_url}):
{live_poc}

Task:
Classify the vulnerability severity into exactly one category:
- "CRITICAL": Direct theft of user funds, contract drain, or frozen state.
- "HIGH": Temporary lock of assets or severe logic breakdown without direct drain.
- "MEDIUM": Griefing, gas optimization exploit, or unauthorized parameter disruption.
- "LOW": Minor edge case or informational discrepancy.
- "INVALID": Not an exploit, fabricated PoC, or out of scope.

Respond ONLY with a JSON object in this exact schema:
{{
    "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INVALID",
    "confidence_bps": integer between 0 and 10000 (e.g. 8500 = 85.00%),
    "reasoning": "Concise technical explanation (max 200 chars)"
}}"""
            raw_response = gl.nondet.exec_prompt(prompt)
            parsed = _parse_verdict_json(raw_response)
            sev = str(parsed.get("severity", "INVALID")).upper()
            if sev not in [SEVERITY_CRITICAL, SEVERITY_HIGH, SEVERITY_MEDIUM, SEVERITY_LOW, SEVERITY_INVALID]:
                sev = SEVERITY_INVALID

            conf = parsed.get("confidence_bps", 0)
            if not isinstance(conf, int):
                try:
                    conf = int(conf)
                except (ValueError, TypeError):
                    conf = 0
            conf = max(0, min(10000, conf))

            reasoning = str(parsed.get("reasoning", "No technical reasoning provided"))[:200]
            return {
                "severity": sev,
                "confidence_bps": conf,
                "reasoning": reasoning
            }

        def validate_verdict(leader_out: dict) -> bool:
            my_out = eval_task()
            if leader_out.get("severity") != my_out.get("severity"):
                return False
            leader_conf = leader_out.get("confidence_bps", 0)
            my_conf = my_out.get("confidence_bps", 0)
            return abs(leader_conf - my_conf) <= 1500

        # Run custom Equivalence Principle consensus
        result = gl.vm.run_nondet_unsafe(eval_task, validate_verdict)

        severity = result.get("severity", "INVALID")
        conf = result.get("confidence_bps", 0)
        reasoning = result.get("reasoning", "")

        self.report_severity[report_id] = severity
        self.report_confidence[report_id] = u256(conf)
        self.report_reasoning[report_id] = reasoning

        # Calculate payout strictly if confidence >= 70%
        payout_amount = 0
        if conf >= CONFIDENCE_THRESHOLD_BPS:
            pool_val = int(self.bounty_pool)
            if severity == SEVERITY_CRITICAL:
                payout_amount = (pool_val * int(self.critical_bps)) // 10000
            elif severity == SEVERITY_HIGH:
                payout_amount = (pool_val * int(self.high_bps)) // 10000
            elif severity == SEVERITY_MEDIUM:
                payout_amount = (pool_val * int(self.medium_bps)) // 10000

        # Ensure payout cannot exceed available pool
        payout_amount = min(payout_amount, int(self.bounty_pool))
        self.report_payout[report_id] = u256(payout_amount)

        # Checks-Effects-Interactions: Update state before external transfer
        if payout_amount > 0:
            self.report_status[report_id] = STATUS_SETTLED
            self.bounty_pool = u256(int(self.bounty_pool) - payout_amount)
            researcher = self.report_researcher[report_id]
            gl.chain.Account(researcher).emit_transfer(u256(payout_amount))
        else:
            self.report_status[report_id] = STATUS_REJECTED if severity == SEVERITY_INVALID else STATUS_SETTLED

    @gl.public.view
    def get_vault_summary(self) -> dict:
        """Returns protocol vault overview."""
        return {
            "protocol_admin": self.protocol_admin.as_hex,
            "protocol_name": self.protocol_name,
            "security_charter": self.security_charter,
            "bounty_pool": str(self.bounty_pool),
            "status": self.status,
            "critical_bps": str(self.critical_bps),
            "high_bps": str(self.high_bps),
            "medium_bps": str(self.medium_bps),
            "total_reports": str(self.reports_count),
        }

    @gl.public.view
    def get_report_details(self, report_id: u256) -> dict:
        """Returns detailed report adjudication record."""
        if int(report_id) >= int(self.reports_count):
            return {}
        return {
            "report_id": str(report_id),
            "researcher": self.report_researcher[report_id].as_hex,
            "title": self.report_title[report_id],
            "poc_url": self.report_poc_url[report_id],
            "status": self.report_status[report_id],
            "severity": self.report_severity[report_id],
            "payout": str(self.report_payout[report_id]),
            "confidence_bps": str(self.report_confidence[report_id]),
            "reasoning": self.report_reasoning[report_id],
        }
