require('dotenv').config();

const crypto = require('crypto');

const {
  initiateDeveloperControlledWalletsClient,
  generateEntitySecretCiphertext
} = require(
  '@circle-fin/developer-controlled-wallets'
);

async function main() {

  // fresh ciphertext
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
    '\nBatch Mint ERC1155...\n'
  );

  const response =
    await client.createContractExecutionTransaction({

      walletId:
        process.env.WALLET_ID,

      blockchain:
        'ARC-TESTNET',

      // ERC1155 contract
      contractAddress:
        '0x76aFF6A3f68b54c09dbC4ac06BA1CE6c731aeb65',

      abiFunctionSignature:
        'mintBatch(address,uint256[],uint256[])',

      // to, ids[], amounts[]
      abiParameters: [
        '0x5de7bd22Ba2a36DB7b925bf732eE01Dc066EB888',

        // token IDs
        ['1', '2', '3'],

        // amounts
        ['10', '5', '99']
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
    '\n=== BATCH MINT SUBMITTED ===\n'
  );

  console.log(
    JSON.stringify(
      response.data,
      null,
      2
    )
  );
}

main().catch(console.error);