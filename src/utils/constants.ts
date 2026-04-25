function readEnv(...keys: string[]): string | undefined {
    for (const key of keys) {
        const value = process.env[key];
        if (value) return value;
    }
    return undefined;
}

export const CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_DOME_ETH_POOL_ADDRESS ??
    readEnv('DOME_ETH_POOL_ADDRESS') ??
    '0x0000000000000000000000000000000000000000';

export const FEE_RECIPIENT_ADDRESS =
    process.env.NEXT_PUBLIC_DOME_FEE_RECIPIENT_ADDRESS ??
    readEnv('DOME_FEE_RECIPIENT_ADDRESS') ??
    '0x0000000000000000000000000000000000000000';

export const INDEXER_URL =
    process.env.NEXT_PUBLIC_DOME_EVM_INDEXER_URL ??
    process.env.NEXT_PUBLIC_INDEXER_URL ??
    readEnv('DOME_EVM_INDEXER_URL') ??
    'http://127.0.0.1:8788';

export const BASE_SEPOLIA_RPC =
    process.env.NEXT_PUBLIC_DOME_BASE_RPC ??
    process.env.NEXT_PUBLIC_RPC_URL ??
    readEnv('DOME_BASE_RPC') ??
    'http://127.0.0.1:8545';

export const DOME_SIGN_IN_MESSAGE = 'Dome shielded account sign in';

export const PRIVATE_USDC_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_DOME_USDC_POOL_ADDRESS ??
    readEnv('DOME_USDC_POOL_ADDRESS') ??
    '0x0000000000000000000000000000000000000000';

export const USDC_CONTRACT_ADDRESS =
    process.env.NEXT_PUBLIC_DOME_USDC_TOKEN_ADDRESS ??
    readEnv('DOME_USDC_TOKEN_ADDRESS') ??
    '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';

export const USDC_DECIMALS = 6;
