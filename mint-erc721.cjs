require('dotenv').config();

const crypto = require('crypto');

const {
  initiateDeveloperControlledWalletsClient,
  generateEntitySecretCiphertext
} = require(
  '@circle-fin/developer-controlled-wallets'
);

async function main() {

  // generate fresh ciphertext
  const entitySecretCiphertext =
    await generateEntitySecretCiphertext({

      apiKey:
        process.env.CIRCLE_API_KEY,

      entitySecret:
        process.env.CIRCLE_ENTITY_SECRET
    });

  // init client
  const client =
    initiateDeveloperControlledWalletsClient({

      apiKey:
        process.env.CIRCLE_API_KEY,

      entitySecret:
        process.env.CIRCLE_ENTITY_SECRET
    });

  console.log(
    '\nMinting Metadata NFT...\n'
  );

  const response =
    await client.createContractExecutionTransaction({

      walletId:
        process.env.WALLET_ID,

      blockchain:
        'ARC-TESTNET',

      // metadata NFT contract
      contractAddress:
        '0xE2e8Ab74dc95fF621c7492B233125fD87834a341',

      // mint(address,string)
      abiFunctionSignature:
        'mint(address,string)',

      abiParameters: [

        // receiver wallet
        '0x5de7bd22Ba2a36DB7b925bf732eE01Dc066EB888',

        // metadata URI
        'https://gateway.pinata.cloud/ipfs/bafkreic3t4v4kxjj2faszhqza4n3zldtwluza5762np6gadx4hs7kmingi'
      ],

      fee: {
        type: 'level',
        config: {
          feeLevel: 'MEDIUM'
        }
      },

      entitySecretCiphertext,

      idempotencyKey:
        crypto.randomUUID()
    });

  console.log(
    '\n=== METADATA NFT MINT SUBMITTED ===\n'
  );

  console.log(
    JSON.stringify(
      response.data,
      null,
      2
    )
  );

  const txHash =
    response.data?.transactionId ||
    response.data?.txHash;

  if (txHash) {

    console.log(
      '\nTX Explorer:\n'
    );

    console.log(
      `https://testnet.arcscan.app/tx/${txHash}`
    );
  }
}

main().catch(console.error);