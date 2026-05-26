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
      apiKey: process.env.CIRCLE_API_KEY,
      entitySecret:
        process.env.CIRCLE_ENTITY_SECRET,
    });

  const artifact = JSON.parse(
    fs.readFileSync(
      './out/MyToken.sol/MyToken.json',
      'utf8'
    )
  );

  console.log('\nDeploying ERC20...\n');

  const deployResponse =
    await client.deployContract({

      idempotencyKey:
        crypto.randomUUID(),

      walletId:
        process.env.WALLET_ID,

      blockchain:
        'ARC-TESTNET',

      name:
        'MyToken',

      description:
        'ERC20 Token',

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
    '\nWaiting for deployment...\n'
  );

  for (let i = 0; i < 60; i++) {

    await sleep(5000);

    try {

      const res =
        await client.getContract({
          id: contractId
        });

      // tampilkan raw object
      console.log(
        '\nRAW CONTRACT DATA:\n'
      );

      console.log(
        JSON.stringify(
          res.data,
          null,
          2
        )
      );

      const contract =
        res.data.contract;

      console.log(
        `\nCheck ${i + 1}:`,
        contract?.status
      );

      if (
        contract?.status === 'COMPLETE'
      ) {

        // cari field address otomatis
        const possibleAddress =
          contract.address ||
          contract.contractAddress ||
          contract.deployedAddress;

        const possibleTxHash =
          contract.deployTransactionHash ||
          contract.transactionHash ||
          contract.txHash;

        console.log(
          '\n=== DEPLOY SUCCESS ===\n'
        );

        console.log(
          'Contract Address:'
        );

        console.log(
          possibleAddress
        );

        console.log(
          '\nTX HASH:'
        );

        console.log(
          possibleTxHash
        );

        console.log(
          '\nVerification Status:'
        );

        console.log(
          contract.verificationStatus
        );

        if (possibleAddress) {

          console.log(
            '\nContract Explorer URL:'
          );

          console.log(
            `https://testnet.arcscan.app/address/${possibleAddress}`
          );
        }

        if (possibleTxHash) {

          console.log(
            '\nTX Explorer URL:'
          );

          console.log(
            `https://testnet.arcscan.app/tx/${possibleTxHash}`
          );
        }

        return;
      }

    } catch (err) {

      console.error(err);
    }
  }

  console.log(
    '\nTimeout waiting deployment.'
  );
}

main().catch(console.error);