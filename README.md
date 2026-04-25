# @dome/sdk-evm

TypeScript SDK for Dome shielded ETH/USDC flows on EVM chains using the **Dome Shielded EVM protocol**.

## Install (local monorepo)

```bash
npm install @dome/sdk-evm@file:../dome-sdk-evm
```

## Build

```bash
npm install
npm run build
```

## Environment

Configure these before running deposit/withdraw/balance:

- `NEXT_PUBLIC_DOME_EVM_INDEXER_URL` — Dome indexer API (browser: use same-origin proxy such as `/api/indexer`)
- `NEXT_PUBLIC_DOME_BASE_RPC` — EVM JSON-RPC endpoint
- `NEXT_PUBLIC_DOME_ETH_POOL_ADDRESS` — deployed shielded ETH pool proxy
- `NEXT_PUBLIC_DOME_FEE_RECIPIENT_ADDRESS` — relayer fee recipient
- `NEXT_PUBLIC_DOME_USDC_POOL_ADDRESS` — optional private USDC pool
- `NEXT_PUBLIC_DOME_USDC_TOKEN_ADDRESS` — optional USDC token address

Circuit proving artifacts must be served at a public `keyBasePath` (for example `/circuits/transaction` → `transaction2.wasm` / `transaction2.zkey`).

## Usage

```ts
import {
  deposit,
  withdraw,
  getBalance,
  DOME_SIGN_IN_MESSAGE,
} from '@dome/sdk-evm';
```

See [`example/eth.ts`](example/eth.ts) and the [`dome-web`](https://github.com/Dome-Foundation/dome-web) wallet UI.
