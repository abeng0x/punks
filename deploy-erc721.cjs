require('dotenv').config();

const fs = require('fs');
const crypto = require('crypto');

const {
  initiateSmartContractPlatformClient
} = require('@circle-fin/smart-contract-platform');

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function main() {

  // init client
  const client =
    initiateSmartContractPlatformClient({
      apiKey:
        process.env.CIRCLE_API_KEY,

      entitySecret:
        process.env.CIRCLE_ENTITY_SECRET,
    });

  // baca hasil compile forge
  const artifact = JSON.parse(
    fs.readFileSync(
      './out/MyNFT.sol/MyNFT.json',
      'utf8'
    )
  );

  console.log(
    '\nDeploying ERC721...\n'
  );

  // deploy contract
  const deployResponse =
    await client.deployContract({

      idempotencyKey:
        crypto.randomUUID(),

      walletId:
        process.env.WALLET_ID,

      blockchain:
        'ARC-TESTNET',

      name:
        'MyNFT',

      description:
        'ERC721 NFT',

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

  // polling
  for (let i = 0; i < 60; i++) {

    await sleep(5000);

    try {

      const res =
        await client.getContract({
          id: contractId
        });

      // debug raw response
      console.log(
        '\nRAW RESPONSE:\n'
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

      // kalau deploy selesai
      if (
        contract?.status === 'COMPLETE'
      ) {

        // auto detect address field
        const nftAddress =
          contract.address ||
          contract.contractAddress ||
          contract.deployedAddress;

        const txHash =
          contract.deployTransactionHash ||
          contract.transactionHash ||
          contract.txHash;

        console.log(
          '\n=== ERC721 DEPLOYED ===\n'
        );

        console.log(
          'NFT Address:\n'
        );

        console.log(
          nftAddress
        );

        console.log(
          '\nTX HASH:\n'
        );

        console.log(
          txHash
        );

        console.log(
          '\nVerification Status:\n'
        );

        console.log(
          contract.verificationStatus
        );

        if (nftAddress) {

          console.log(
            '\nNFT Explorer:\n'
          );

          console.log(
            `https://testnet.arcscan.app/address/${nftAddress}`
          );
        }

        if (txHash) {

          console.log(
            '\nTX Explorer:\n'
          );

          console.log(
            `https://testnet.arcscan.app/tx/${txHash}`
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