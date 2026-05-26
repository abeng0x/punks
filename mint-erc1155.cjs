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
    '\nMinting ERC1155...\n'
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
        'mint(address,uint256,uint256)',

      // to, tokenId, amount
      abiParameters: [
        '0x5de7bd22Ba2a36DB7b925bf732eE01Dc066EB888',
        '1',
        '10'
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
    '\n=== ERC1155 MINT SUBMITTED ===\n'
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