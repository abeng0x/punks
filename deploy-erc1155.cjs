require('dotenv').config();

const fs = require('fs');
const crypto = require('crypto');

const {
  initiateSmartContractPlatformClient
} = require('@circle-fin/smart-contract-platform');

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function main() {

  const client =
    initiateSmartContractPlatformClient({
      apiKey:
        process.env.CIRCLE_API_KEY,

      entitySecret:
        process.env.CIRCLE_ENTITY_SECRET,
    });

  const artifact = JSON.parse(
    fs.readFileSync(
      './out/MyERC1155.sol/MyERC1155.json',
      'utf8'
    )
  );

  console.log(
    '\nDeploying ERC1155...\n'
  );

  const deployResponse =
    await client.deployContract({

      idempotencyKey:
        crypto.randomUUID(),

      walletId:
        process.env.WALLET_ID,

      blockchain:
        'ARC-TESTNET',

      name:
        'MyERC1155',

      description:
        'ERC1155 Multi Token',

      abiJson:
        JSON.stringify(
          artifact.abi
        ),

      bytecode:
        artifact.bytecode.object.startsWith('0x')
          ? artifact.bytecode.object
          : `0x${artifact.bytecode.object}`,

      constructorParameters: [],

      fee: {
        type: 'level',
        config: {
          feeLevel: 'MEDIUM'
        }
      }
    });

  const contractId =
    deployResponse.data.contractId;

  console.log(
    'Contract ID:',
    contractId
  );

  console.log(
    '\nWaiting deployment...\n'
  );

  for (let i = 0; i < 60; i++) {

    await sleep(5000);

    const res =
      await client.getContract({
        id: contractId
      });

    const contract =
      res.data.contract;

    console.log(
      `Check ${i + 1}:`,
      contract?.status
    );

    if (
      contract?.status === 'COMPLETE'
    ) {

      const address =
        contract.address ||
        contract.contractAddress ||
        contract.deployedAddress;

      const txHash =
        contract.deployTransactionHash ||
        contract.transactionHash ||
        contract.txHash;

      console.log(
        '\n=== ERC1155 DEPLOYED ===\n'
      );

      console.log(
        'ERC1155 Address:\n'
      );

      console.log(
        address
      );

      console.log(
        '\nTX HASH:\n'
      );

      console.log(
        txHash
      );

      console.log(
        '\nExplorer:\n'
      );

      console.log(
        `https://testnet.arcscan.app/address/${address}`
      );

      return;
    }
  }
}

main().catch(console.error);