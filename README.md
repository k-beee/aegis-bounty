# AegisBounty

[![GenLayer StudioNet](https://img.shields.io/badge/GenLayer-StudioNet%20Compatible-blue)](https://studio.genlayer.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**AegisBounty** is a decentralized bug bounty and vulnerability disclosure adjudication control plane built natively for GenLayer. It eliminates the conflict of interest in Web3 security bounties by locking protocol reward pools on-chain and using multi-validator AI consensus over live exploit proof-of-concept (PoC) repositories.

---

## Why GenLayer?

Traditional bug bounty platforms suffer from a fundamental counterparty conflict: protocols have an economic incentive to downplay vulnerability severity or deny payouts after a bug is privately reported.

AegisBounty solves this by:
1. **On-Chain Bounty Vaults**: Protocols lock native GEN into `@gl.public.write.payable` pools with binding security charters.
2. **Live PoC Web Ingestion**: Validators fetch real-time vulnerability evidence from GitHub or Gists using `gl.nondet.web.render`.
3. **Equivalence Principle Adjudication**: Custom `gl.vm.run_nondet_unsafe` consensus requires independent nodes to agree on severity classification (`CRITICAL`, `HIGH`, `MEDIUM`, `LOW`, `INVALID`) and confidence within strict bounds.
4. **Autonomous Payouts**: Automatically calculates and triggers reward transfers via `gl.chain.Account(researcher).emit_transfer()`.

---

## Repository Structure

```
aegis-bounty/
├── contracts/
│   ├── AegisBounty.py        # Core Bug Bounty Arbiter & Severity Matrix
│   └── AegisBountyFactory.py # Multi-Vault Registry
├── tests/
│   ├── test_aegis_bounty.py  # Unit & consensus tolerance tests
│   └── test_factory.py       # Factory indexing tests
├── scripts/
│   └── deploy.mjs            # genlayer-js deployment automation
├── docs/
│   ├── ARCHITECTURE.md       # Architecture & threat model
│   └── STUDIONET_GUIDE.md    # Step-by-step StudioNet testing guide
├── frontend/                 # Next.js 14 Web3 Security Terminal dApp
├── pyproject.toml
├── pytest.ini
└── README.md
```

---

## Quickstart & Testing

```bash
# Run pytest test suite
pip install pytest
pytest tests/ -v
```

---

## Deployed Contracts (StudioNet)

| Contract | Role | Address | Explorer Link |
| :--- | :--- | :--- | :--- |
| **AegisBounty** | Core Bug Bounty Vault | `0x0c88a8916A09464d00f265fe6349E4C13EF7296c` | [View on Explorer](https://explorer-studio.genlayer.com/address/0x0c88a8916A09464d00f265fe6349E4C13EF7296c) |
| **AegisBountyFactory** | Multi-Vault Registry | `0xf3696DF739f725951DaEC63488FB5D9B1719Ee50` | [View on Explorer](https://explorer-studio.genlayer.com/address/0xf3696DF739f725951DaEC63488FB5D9B1719Ee50) |

---

## License

MIT License. See [LICENSE](LICENSE) for details.
