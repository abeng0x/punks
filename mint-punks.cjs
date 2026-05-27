require('dotenv').config();

const crypto = require('crypto');

const {
  initiateSmartContractPlatformClient
} = require('@circle-fin/smart-contract-platform');

async function main() {

  const client =
    initiateSmartContractPlatformClient({
      apiKey:
        process.env.CIRCLE_API_KEY,

      entitySecret:
        process.env.CIRCLE_ENTITY_SECRET,
    });

  const response =
    await client.createContractExecutionTransaction({

      walletId:
        process.env.WALLET_ID,

      blockchain:
        'ARC-TESTNET',

      contractAddress:
        '0x0de634871908926c7183a553f8bf8119f5fcb175',

      abiFunctionSignature:
        'mint(uint256,uint256)',

      abiParameters: [
        1,
        1
      ],

      amount: '0',

      fee: {
        type: 'level',
        config: {
          feeLevel: 'MEDIUM'
        }
      },

      idempotencyKey:
        crypto.randomUUID()
    });

  console.log(
    JSON.stringify(
      response.data,
      null,
      2
    )
  );
}

main().catch(console.error);
