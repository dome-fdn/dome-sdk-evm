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

Configure these `DOME_*` variables before running deposit/withdraw/balance:

- `DOME_EVM_INDEXER_URL` — Dome indexer API (browser apps often use a same-origin proxy such as `/api/indexer`)
- `DOME_BASE_RPC` — EVM JSON-RPC endpoint
- `DOME_ETH_POOL_ADDRESS` — deployed shielded ETH pool proxy
- `DOME_FEE_RECIPIENT_ADDRESS` — relayer fee recipient
- `DOME_CHAIN_ID` — optional; target chain id
- `DOME_USDC_POOL_ADDRESS` — optional private USDC pool
- `DOME_USDC_TOKEN_ADDRESS` — optional USDC token address
- `DOME_RELAYER_SECRET` — optional; forwarded on withdraw when calling the relayer directly
- `DOME_RELAYER_WITHDRAW_URL` — optional; override relayer withdraw endpoint

Host apps (Next.js, Expo, Node scripts) may use framework-specific env vars at build time and map them to these keys **before importing** the SDK. For example, `dome-mobile/src/dome/configureSdk.ts` maps Expo runtime config into `DOME_*` keys, while `dome-web` exposes same-origin API routes and passes the exported wallet app `EXPO_PUBLIC_*` values during build.

Circuit proving artifacts must be served at a public `keyBasePath` (for example `/circuits/transaction` → `transaction2.wasm` / `transaction2.zkey`). Web/mobile apps usually expose this via `DOME_CIRCUIT_KEY_BASE_PATH` at the app layer.

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
