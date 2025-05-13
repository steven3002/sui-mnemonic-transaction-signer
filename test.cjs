/**
 * Standalone script to call a Move function on Sui using a mnemonic-derived keypair.
 *
 * Usage:
 *   1. yarn add @mysten/sui bip39 ed25519-hd-key
 *   2. Set your MNEMONIC env var, or replace the placeholder below.
 *   3. node test.cjs
 */

const { Ed25519Keypair }   = require('@mysten/sui/keypairs/ed25519');
const { Transaction }      = require('@mysten/sui/transactions');
const { getFullnodeUrl, SuiClient } = require('@mysten/sui/client');

async function main() {
  // === 1) MNEMONIC ===
  // You can hardcode your 12/24-word phrase here for testing,
  // or set it in your shell:   export MNEMONIC="word1 word2 …"
  const MNEMONIC = process.env.MNEMONIC || '__YOUR_MNEMONIC_PHRASE_HERE__';
  if (!MNEMONIC) {
    throw new Error('Please set the MNEMONIC env var or replace the placeholder in the script.');
  }

  // === 2) Derive keypair ===
  // Uses the Sui-standard derivation path m/44'/784'/0'/0'/0'
  const keypair = Ed25519Keypair.deriveKeypair(
    MNEMONIC,
    "m/44'/784'/0'/0'/0'"
  );

  // === 3) RPC client setup ===
  // Change 'testnet' → 'devnet' or a custom URL if needed.
  const client = new SuiClient({
    url: getFullnodeUrl('testnet')
  });

  // === 4) Package & object IDs ===
  // Replace these with your own package and object IDs.
  const WARLOT         = '__YOUR_PACKAGE_ID_HERE__';        // e.g. '0xabc123...'
  const WARLOTSYSTEM   = '__YOUR_SYSTEM_OBJECT_ID_HERE__';  // e.g. '0xdef456...'

  // === 5) Build the transaction ===
  const tx = new Transaction();
  tx.moveCall({
    // Fully-qualified function name
    target: `${WARLOT}::setandrenew::deposit_coin`,
    arguments: [
      tx.object(WARLOTSYSTEM),                               // system object
      tx.object('__YOUR_COIN_OBJECT_ID_HERE__'),              // coin object
      tx.pure.u64(27005000),                                 // amount as u64
    ],
    // typeArguments: [], // if your Move call needs generic type params
  });

  // === 6) Sign & execute ===
  const result = await client.signAndExecuteTransaction({
    signer:      keypair,
    transaction: tx,
    options: {
      showEffects:       true,
      showObjectChanges: true,
    },
  });

  // === 7) Log results ===
  console.log('Transaction Digest:', result.digest);
  console.log('Status:', result.effects?.status?.status);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
