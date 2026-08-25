import pytest
import json
import re

def _parse_verdict_json(raw: str) -> dict:
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


def _normalize_address(addr: str) -> str:
    return addr.strip().lower()


class TestAegisBountyParsing:
    def test_clean_severity_parsing(self):
        valid = '{"severity": "CRITICAL", "confidence_bps": 9500, "reasoning": "Direct fund drain verified"}'
        parsed = _parse_verdict_json(valid)
        assert parsed.get("severity") == "CRITICAL"
        assert parsed.get("confidence_bps") == 9500

    def test_markdown_fence_severity_parsing(self):
        fenced = '```json\n{"severity": "HIGH", "confidence_bps": 8200, "reasoning": "State deadlock possible"}\n```'
        parsed = _parse_verdict_json(fenced)
        assert parsed.get("severity") == "HIGH"
        assert parsed.get("confidence_bps") == 8200

    def test_invalid_json_fallback(self):
        assert _parse_verdict_json("No json here") == {}
        assert _parse_verdict_json("") == {}


class TestBountyPayoutCalculation:
    def test_payout_formula(self):
        pool = 100_000
        critical_bps = 5000  # 50%
        high_bps = 2000      # 20%
        medium_bps = 500     # 5%

        critical_payout = (pool * critical_bps) // 10000
        high_payout = (pool * high_bps) // 10000
        medium_payout = (pool * medium_bps) // 10000

        assert critical_payout == 50_000
        assert high_payout == 20_000
        assert medium_payout == 5_000


class TestConsensusTolerance:
    def test_validator_severity_agreement(self):
        def check_agreement(leader: dict, validator: dict) -> bool:
            if leader.get("severity") != validator.get("severity"):
                return False
            return abs(leader.get("confidence_bps", 0) - validator.get("confidence_bps", 0)) <= 1500

        l1 = {"severity": "CRITICAL", "confidence_bps": 9000}
        v1 = {"severity": "CRITICAL", "confidence_bps": 8500}
        assert check_agreement(l1, v1) is True

        l2 = {"severity": "CRITICAL", "confidence_bps": 9000}
        v2 = {"severity": "HIGH", "confidence_bps": 9000}
        assert check_agreement(l2, v2) is False
