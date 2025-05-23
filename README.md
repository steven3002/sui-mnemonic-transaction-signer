# sui-mnemonic-transaction-signer

> A standalone TypeScript/Node.js script that derives a Sui Ed25519 keypair from a BIP-39 mnemonic and submits a Move call transaction to a Sui network (testnet/devnet/mainnet).

---

## 🚀 Features

* **Mnemonic-based signing**: Derive your keypair from a BIP-39 mnemonic phrase.
* **Move calls**: Easily invoke any Move function from your package.
* **Network-agnostic**: Switch between `testnet`, `devnet`, or a custom RPC endpoint.
* **Lightweight**: No framework required—pure Node.js script.

---

## 📋 Prerequisites

* **Node.js** v16 or higher
* **Yarn** (or npm)
* A valid **BIP-39 mnemonic phrase**
* Your Sui **package ID**, **system object ID**, and any **coin object ID**

---

## 🔧 Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/steven3002/sui-mnemonic-transaction-signer.git
   cd sui-mnemonic-transaction-signer
   ```

2. **Install dependencies**

   ```bash
   yarn add @mysten/sui bip39 ed25519-hd-key
   yarn add --dev typescript ts-node-esm @types/node
   ```

3. **Initialize TypeScript**

   ```bash
   npx tsc --init
   ```

---

## ⚙️ Configuration

Copy `test.cjs` (or `test.ts`) to your working directory and open it. Update the placeholders:

```js
const MNEMONIC           = process.env.MNEMONIC || '__YOUR_MNEMONIC_PHRASE_HERE__';
const WARLOT_PACKAGE_ID  = '__YOUR_PACKAGE_ID_HERE__';
const WARLOT_SYSTEM_ID   = '__YOUR_SYSTEM_OBJECT_ID_HERE__';
const COIN_OBJECT_ID     = '__YOUR_COIN_OBJECT_ID_HERE__';
```

Or set the mnemonic via environment variable:

```bash
export MNEMONIC="word1 word2 ... word12"
```

---

## 💻 Usage

### ES Module (`.mjs` / `type: module`)

```bash
# Run with ts-node-esm
yarn ts-node-esm test.ts
```

### CommonJS (`.cjs` extension)

```bash
# Rename and run
mv test.js test.cjs
node test.cjs
```

You should see:

```
Transaction Digest: <digest>
Status: success
```

---

## 📝 Code Snippet

```js
import { Ed25519Keypair }   from '@mysten/sui/keypairs/ed25519';
import { Transaction }      from '@mysten/sui/transactions';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';

async function main() {
  const MNEMONIC = process.env.MNEMONIC || '__YOUR_MNEMONIC_PHRASE_HERE__';
  const keypair = Ed25519Keypair.deriveKeypair(MNEMONIC, "m/44'/784'/0'/0'/0'");
  const client = new SuiClient({ url: getFullnodeUrl('testnet') });

  const tx = new Transaction();
  tx.moveCall({
    target: `${WARLOT_PACKAGE_ID}::setandrenew::deposit_coin`,
    arguments: [ tx.object(WARLOT_SYSTEM_ID), tx.object(COIN_OBJECT_ID), tx.pure.u64(27005000) ],
  });

  const result = await client.signAndExecuteTransaction({ signer: keypair, transaction: tx, options: { showEffects: true }});
  console.log('Transaction Digest:', result.digest);
  console.log('Status:', result.effects?.status?.status);
}

main().catch(console.error);
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📄 License

MIT © Gally-\<Steven Hert>
