import 'dotenv/config';
import { initiateDeveloperControlledWalletsClient } from "@circle-fin/developer-controlled-wallets";

const circleDeveloperSdk = initiateDeveloperControlledWalletsClient({
  apiKey: process.env.CIRCLE_API_KEY,
  entitySecret: process.env.CIRCLE_ENTITY_SECRET,
});

async function checkTransaction() {
  try {
    const response = await circleDeveloperSdk.getTransaction({
      id: process.env.TRANSACTION_ID
    });

    console.log("Transaction status:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error checking transaction:", error);
  }
}

checkTransaction();