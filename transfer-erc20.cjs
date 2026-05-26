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
    '\nSending ERC20...\n'
  );

  const response =
    await client.createContractExecutionTransaction({

      walletId:
        process.env.WALLET_ID,

      blockchain:
        'ARC-TESTNET',

      contractAddress:
        '0x34f73e87d9ed92e6fbb00219952d1f5b51635220',

      abiFunctionSignature:
        'transfer(address,uint256)',

      // wallet tujuan + jumlah token
      abiParameters: [
        '0x5de7bd22Ba2a36DB7b925bf732eE01Dc066EB888',
        '1000000000000000000'
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
    '\n=== TRANSFER SUBMITTED ===\n'
  );

  console.log(
    JSON.stringify(
      response.data,
      null,
      2
    )
  );

  // tx hash kalau ada
  const txHash =
    response.data?.transactionId ||
    response.data?.txHash;

  if (txHash) {

    console.log(
      '\nExplorer URL:\n'
    );

    console.log(
      `https://testnet.arcscan.app/tx/${txHash}`
    );
  }
}

main().catch(console.error);