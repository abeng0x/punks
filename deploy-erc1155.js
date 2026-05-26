require('dotenv').config()

const { v4: uuidv4 } = require('uuid')

const {
  initiateSmartContractPlatformClient,
  Blockchain,
} = require('@circle-fin/smart-contract-platform')

const client =
  initiateSmartContractPlatformClient({
    apiKey: process.env.CIRCLE_API_KEY,
    entitySecret:
      process.env.CIRCLE_ENTITY_SECRET,
  })

async function main() {
  try {
    console.log('🚀 Deploying contract...\n')

    console.log('API KEY:', !!process.env.CIRCLE_API_KEY)
    console.log('ENTITY SECRET:', !!process.env.CIRCLE_ENTITY_SECRET)
    console.log('WALLET ID:', process.env.WALLET_ID)

    const response =
      await client.deployContractTemplate({
        idempotencyKey: uuidv4(),
        name: 'AbengERC1155',
        walletId: process.env.WALLET_ID,
        blockchain: Blockchain.ArcTestnet,
        templateId:
          'aea21da6-0aa2-4971-9a1a-5098842b1248',
      })

    console.log('\n✅ SUCCESS\n')

    console.log(
      JSON.stringify(response.data, null, 2)
    )

  } catch (e) {
    console.log('\n❌ FULL ERROR\n')

    console.log(e)

    console.log('\n=== RESPONSE ===\n')

    console.log(e.response)

    console.log('\n=== DATA ===\n')

    console.log(e.response?.data)

    console.log('\n=== STACK ===\n')

    console.log(e.stack)
  }
}

main()