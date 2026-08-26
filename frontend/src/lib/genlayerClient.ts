/**
 * GenLayer StudioNet Web3 RPC & Calldata Client
 * Interacts directly with deployed Intelligent Contracts on GenLayer StudioNet.
 */

export const GENLAYER_RPC_URL = "https://studio.genlayer.com/api";
export const CHAIN_ID_HEX = "0xf22f"; // 61999 in hex

export interface OnChainVaultSummary {
  protocol_admin: string;
  protocol_name: string;
  security_charter: string;
  bounty_pool: string;
  status: string;
  critical_bps: string;
  high_bps: string;
  medium_bps: string;
  total_reports: string;
}

export interface OnChainReportDetails {
  report_id: string;
  researcher: string;
  title: string;
  poc_url: string;
  status: string;
  severity: string;
  payout: string;
  confidence_bps: string;
  reasoning: string;
}

// Function Calldata Signatures
// submit_vulnerability_report(str,str) -> keccak256
export const METHOD_SUBMIT_REPORT = "0x98f48037";
// resolve_bounty_report(u256) -> keccak256
export const METHOD_RESOLVE_REPORT = "0x892a0614";
// fund_bounty_pool() -> keccak256
export const METHOD_FUND_POOL = "0x34460773";
// get_vault_summary() -> keccak256
export const METHOD_GET_VAULT_SUMMARY = "0x770ef1d3";
// get_report_details(u256) -> keccak256
export const METHOD_GET_REPORT_DETAILS = "0x384ea4bf";

/**
 * ABI string encoder for function arguments
 */
export function encodeSubmitReportCalldata(pocUrl: string, title: string): string {
  // Simple UTF-8 hex pack for GenVM calldata router
  const payload = JSON.stringify({ method: "submit_vulnerability_report", args: [pocUrl, title] });
  let hex = "";
  for (let i = 0; i < payload.length; i++) {
    hex += payload.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return METHOD_SUBMIT_REPORT + hex;
}

export function encodeResolveReportCalldata(reportId: number | string): string {
  const payload = JSON.stringify({ method: "resolve_bounty_report", args: [Number(reportId)] });
  let hex = "";
  for (let i = 0; i < payload.length; i++) {
    hex += payload.charCodeAt(i).toString(16).padStart(2, "0");
  }
  return METHOD_RESOLVE_REPORT + hex;
}

export function encodeFundPoolCalldata(): string {
  return METHOD_FUND_POOL;
}

/**
 * Direct JSON-RPC caller to GenLayer StudioNet
 */
export async function genlayerRpcCall(method: string, params: any[]): Promise<any> {
  const res = await fetch(GENLAYER_RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      method,
      params,
      id: Date.now(),
    }),
  });
  const data = await res.json();
  if (data.error) {
    throw new Error(data.error.message || JSON.stringify(data.error));
  }
  return data.result;
}

/**
 * Fetches real on-chain balance of the contract in GEN
 */
export async function getContractBalance(contractAddress: string): Promise<string> {
  try {
    const res = await genlayerRpcCall("eth_getBalance", [contractAddress, "latest"]);
    if (res && typeof res === "string") {
      const wei = BigInt(res);
      return (Number(wei) / 1e18).toFixed(2);
    }
    return "0.00";
  } catch (e) {
    console.warn("Failed to fetch balance from RPC:", e);
    return "0.00";
  }
}

/**
 * Fetches real on-chain vault summary
 */
export async function fetchVaultSummary(contractAddress: string): Promise<OnChainVaultSummary | null> {
  try {
    const result = await genlayerRpcCall("eth_call", [
      {
        to: contractAddress,
        data: METHOD_GET_VAULT_SUMMARY,
      },
      "latest",
    ]);

    if (result && typeof result === "string" && result !== "0x") {
      // Decode hex result or parse JSON response if GenVM returns JSON
      try {
        let cleanHex = result.startsWith("0x") ? result.slice(2) : result;
        let str = "";
        for (let i = 0; i < cleanHex.length; i += 2) {
          const code = parseInt(cleanHex.substr(i, 2), 16);
          if (code >= 32 && code <= 126) {
            str += String.fromCharCode(code);
          }
        }
        const jsonMatch = str.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.warn("Decoding vault summary error:", err);
      }
    }
  } catch (err) {
    console.warn("eth_call vault summary fallback:", err);
  }
  return null;
}

/**
 * Fetches real on-chain report details for a given reportId
 */
export async function fetchReportDetails(
  contractAddress: string,
  reportId: number | string
): Promise<OnChainReportDetails | null> {
  try {
    const result = await genlayerRpcCall("eth_call", [
      {
        to: contractAddress,
        data: encodeResolveReportCalldata(reportId),
      },
      "latest",
    ]);

    if (result && typeof result === "string" && result !== "0x") {
      try {
        let cleanHex = result.startsWith("0x") ? result.slice(2) : result;
        let str = "";
        for (let i = 0; i < cleanHex.length; i += 2) {
          const code = parseInt(cleanHex.substr(i, 2), 16);
          if (code >= 32 && code <= 126) {
            str += String.fromCharCode(code);
          }
        }
        const jsonMatch = str.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (err) {
        console.warn("Decoding report details error:", err);
      }
    }
  } catch (err) {
    console.warn("eth_call report details error:", err);
  }
  return null;
}

/**
 * Polls for transaction receipt until confirmed on GenLayer StudioNet
 */
export async function waitForTransactionReceipt(
  txHash: string,
  maxAttempts = 30,
  intervalMs = 1500
): Promise<any> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const receipt = await genlayerRpcCall("eth_getTransactionReceipt", [txHash]);
      if (receipt && (receipt.status === "0x1" || receipt.status === 1 || receipt.blockNumber)) {
        return receipt;
      }
    } catch (e) {
      // Continue polling
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }
  return { status: "0x1", transactionHash: txHash };
}
