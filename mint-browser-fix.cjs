require('dotenv').config();

const { ethers } = require('ethers');

const RPC =
  'https://rpc.testnet.arc.network';

const PRIVATE_KEY =
  process.env.PRIVATE_KEY;

const CONTRACT =
  '0xE2e8Ab74dc95fF621c7492B233125fD87834a341';

const ABI = [

  "function mint(address to, string memory uri) public"
];

const URI =
  'https://gateway.pinata.cloud/ipfs/bafkreic3t4v4kxjj2faszhqza4n3zldtwluza5762np6gadx4hs7kmingi';

async function main() {

  const provider =
    new ethers.JsonRpcProvider(
      RPC
    );

  const wallet =
    new ethers.Wallet(
      PRIVATE_KEY,
      provider
    );

  const contract =
    new ethers.Contract(

      CONTRACT,
      ABI,
      wallet
    );

  console.log(
    'Minting NFT...'
  );

  const tx =
    await contract.mint(

      wallet.address,

      URI,

      {

        gasLimit: 500000
      }
    );

  console.log(
    'TX:',
    tx.hash
  );

  await tx.wait();

  console.log(
    'SUCCESS'
  );

  console.log(
    `https://testnet.arcscan.app/tx/${tx.hash}`
  );
}

main();