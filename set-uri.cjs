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

  const contractAddress =
    '0xdae42f0f1a2670474a8392a240fc0a770d178874';

  const uris = [
    "ipfs://bafybeicfi5qhcsfs2xpz4xzufpbijnvnuounyqi5une2wefqpv6esxnpoq/kuci.json",

    "ipfs://bafybeicfi5qhcsfs2xpz4xzufpbijnvnuounyqi5une2wefqpv6esxnpoq/beru.json",

    "ipfs://bafybeicfi5qhcsfs2xpz4xzufpbijnvnuounyqi5une2wefqpv6esxnpoq/ora.json",

    "ipfs://bafybeicfi5qhcsfs2xpz4xzufpbijnvnuounyqi5une2wefqpv6esxnpoq/sing.json",

    "ipfs://bafybeicfi5qhcsfs2xpz4xzufpbijnvnuounyqi5une2wefqpv6esxnpoq/pisa.json",

    "ipfs://bafybeicfi5qhcsfs2xpz4xzufpbijnvnuounyqi5une2wefqpv6esxnpoq/anji.json"
  ];

  for (let i = 0; i < uris.length; i++) {

    const tokenId = i + 1;

    console.log(
      `Setting token ${tokenId}...`
    );

    const response =
      await client.createTransaction({

        idempotencyKey:
          crypto.randomUUID(),

        walletId:
          process.env.WALLET_ID,

        blockchain:
          'ARC-TESTNET',

        contractAddress,

        abiFunctionSignature:
          'setTokenURI(uint256,string)',

        abiParameters: [
          tokenId,
          uris[i]
        ],

        amount: '0',

        fee: {
          type: 'level',
          config: {
            feeLevel: 'MEDIUM'
          }
        }
      });

    console.log(
      response.data
    );
  }
}

main().catch(console.error);