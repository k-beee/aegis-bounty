# GenLayer StudioNet Deployment & Verification Guide

This guide walks through deploying and testing **AegisBounty** on GenLayer StudioNet.

## Step 1: Deploy `AegisBounty.py`

1. Open [GenLayer Studio](https://studio.genlayer.com) and ensure the active network is set to **StudioNet**.
2. Create a file named `AegisBounty.py` and paste the source from `contracts/AegisBounty.py`.
3. Constructor Arguments:
   - `protocol_name`: `"Aegis Vault Alpha"`
   - `security_charter`: `"In-scope: Direct fund drain, reentrancy, oracle price manipulation, and state freeze. Out-of-scope: UI bugs and DDoS."`
   - `critical_bps`: `5000` (50%)
   - `high_bps`: `2000` (20%)
   - `medium_bps`: `500` (5%)
4. Click **Deploy**.

## Step 2: Test the Bounty Lifecycle

1. **Fund Vault Pool**:
   - Under Write Methods, call `fund_bounty_pool()` with `Value` set to `1000000000000000000` (1 GEN).
   - Check `get_vault_summary()` to verify `bounty_pool = "1000000000000000000"`.
2. **Submit Exploit PoC**:
   - Switch to Researcher Account in Studio.
   - Call `submit_vulnerability_report(poc_evidence_url="https://github.com/torvalds/linux", claim_title="Reentrancy exploit in token vault")`.
3. **Execute AI Consensus Adjudication**:
   - Call `resolve_bounty_report(report_id=0)`.
   - GenLayer validators fetch the PoC URL, evaluate severity against the charter, reach Equivalence Principle consensus, and automatically transfer the reward.
4. **Inspect Adjudication**:
   - Call `get_report_details(report_id=0)` to inspect the finalized severity classification, confidence score, and emitted payout amount.
