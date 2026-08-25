import { createClient, createAccount } from "genlayer-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const rpcUrl = process.env.GENLAYER_RPC_URL || "https://studio.genlayer.com/api";
  const privateKey = process.env.PRIVATE_KEY;
  
  if (!privateKey) {
    console.error("Please provide PRIVATE_KEY environment variable");
    process.exit(1);
  }

  const account = createAccount(privateKey);
  const client = createClient({ endpoint: rpcUrl, account });

  console.log(`Deploying AegisBounty from: ${account.address}`);

  const contractPath = path.join(__dirname, "../contracts/AegisBounty.py");
  const contractCode = fs.readFileSync(contractPath, "utf-8");

  const protocolName = "Aegis Vault Alpha";
  const securityCharter = "In-scope: Direct fund drain, reentrancy, oracle manipulation, and contract freeze.";
  const criticalBps = 5000;
  const highBps = 2000;
  const mediumBps = 500;

  console.log("Submitting deployment transaction to GenLayer...");
  const txHash = await client.deployContract({
    code: contractCode,
    args: [protocolName, securityCharter, criticalBps, highBps, mediumBps],
  });

  console.log(`Submitted. Hash: ${txHash}`);
  const receipt = await client.waitForTransactionReceipt({ hash: txHash });
  console.log(`AegisBounty successfully deployed at: ${receipt.contractAddress}`);
}

main().catch(console.error);
