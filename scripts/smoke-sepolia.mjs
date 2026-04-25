import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const deployFile = resolve(root, ".dome-local/base-sepolia-deploy.json");

function loadEnvFile(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx < 0) continue;
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(resolve(root, "dome-backend/.env"));
loadEnvFile(resolve(root, ".env.sepolia"));

if (existsSync(deployFile)) {
  const deploy = JSON.parse(readFileSync(deployFile, "utf8"));
  process.env.DOME_ETH_POOL_ADDRESS ||= deploy.ethPoolAddress;
  process.env.DOME_BASE_RPC ||= deploy.rpcUrl;
  process.env.DOME_FEE_RECIPIENT_ADDRESS ||= deploy.feeRecipientAddress;
  process.env.DOME_CHAIN_ID ||= String(deploy.chainId);
}

const privateKey = process.env.PRIVATE_KEY || process.env.DOME_RELAYER_PRIVATE_KEY;
if (!privateKey) {
  console.error("Set PRIVATE_KEY (user wallet) for smoke test");
  process.exit(1);
}

const rpcUrl =
  process.env.DOME_BASE_RPC ||
  process.env.DOME_BASE_RPC_UPSTREAM ||
  "https://base-sepolia.g.alchemy.com/v2/demo";
const indexerUrl = process.env.DOME_EVM_INDEXER_URL || process.env.DOME_BACKEND_URL;
const circuitBase =
  process.env.DOME_CIRCUIT_KEY_BASE_PATH ||
  resolve(root, "dome-sdk-evm/circuits/transaction");

process.env.DOME_EVM_INDEXER_URL = indexerUrl;
process.env.DOME_BASE_RPC = rpcUrl;

const { ethers } = await import("ethers");
const { getBalance, deposit, withdraw, DOME_SIGN_IN_MESSAGE } = await import("../dist/index.js");

const action = process.argv[2] || "balance";
const amountArg = process.argv[3];

async function main() {
  if (!indexerUrl) {
    throw new Error("Set DOME_EVM_INDEXER_URL to your hosted backend");
  }

  const chainId = Number(process.env.DOME_CHAIN_ID || 84532);
  const provider = new ethers.providers.JsonRpcProvider(rpcUrl, {
    name: "base-sepolia",
    chainId,
  });
  const signer = new ethers.Wallet(privateKey, provider);
  const address = await signer.getAddress();
  const signature = await signer.signMessage(DOME_SIGN_IN_MESSAGE);

  console.log(`Network: Base Sepolia (${chainId})`);
  console.log(`Wallet: ${address}`);
  console.log(`Indexer: ${indexerUrl}`);
  console.log(`Pool: ${process.env.DOME_ETH_POOL_ADDRESS}`);

  const health = await fetch(`${indexerUrl}/health`).then((r) => r.json());
  console.log("Backend health:", health);

  if (action === "balance") {
    const walletBalance = await provider.getBalance(address);
    console.log(`Wallet ETH: ${ethers.utils.formatEther(walletBalance)}`);
    const shielded = await getBalance({ signature, address });
    console.log(`Shielded ETH: ${shielded.balance}`);
    return;
  }

  if (action === "deposit") {
    const amount = Number(amountArg);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Usage: node scripts/smoke-sepolia.mjs deposit 0.001");
    }
    const txSender = async (unsignedTx) => {
      const tx = await signer.sendTransaction(unsignedTx);
      await tx.wait();
      return tx.hash;
    };
    const tx = await deposit({
      depositAmountInput: amount,
      keyBasePath: circuitBase,
      signature,
      address,
      txSender,
    });
    console.log("Deposit tx:", tx);
    return;
  }

  if (action === "withdraw") {
    const amount = Number(amountArg);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Usage: node scripts/smoke-sepolia.mjs withdraw 0.0006");
    }
    const txHash = await withdraw({
      withdrawAmountInput: amount,
      recipient: address,
      keyBasePath: circuitBase,
      signature,
      address,
    });
    console.log("Withdraw tx:", txHash);
    return;
  }

  console.log("Usage:");
  console.log("  node scripts/smoke-sepolia.mjs balance");
  console.log("  node scripts/smoke-sepolia.mjs deposit 0.001");
  console.log("  node scripts/smoke-sepolia.mjs withdraw 0.0006");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
