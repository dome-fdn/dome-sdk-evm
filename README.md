# @dome/sdk-evm

TypeScript SDK for Dome shielded ETH/USDC flows on EVM chains using the **Dome Shielded EVM protocol**.

## Install

Published package (after npm org setup):

```bash
npm install @dome/sdk-evm
```

Local monorepo install:

```bash
npm install @dome/sdk-evm@file:../dome-sdk-evm
```

## Publish (maintainers)

Scoped packages require an npm organization and CI secret:

1. Create the **`@dome`** org at [npmjs.com/org/create](https://www.npmjs.com/org/create)
2. Create an npm **Automation** or **Granular Access Token** with publish access to `@dome`
3. Add it to this repo as GitHub secret **`NPM_TOKEN`**
4. Bump `version` in `package.json` and push to `main`

The workflow publishes only when `package.json` changes and the version is new.

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
