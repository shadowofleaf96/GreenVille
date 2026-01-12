const axios = require("axios");

const BASE_URL = "http://localhost:3000/v1/site-settings";

async function verifySettings() {
  try {
    console.log("Fetching current settings...");
    const getRes = await axios.get(BASE_URL);
    const settings = getRes.data.data;
    console.log(
      "Current Shipping Config:",
      JSON.stringify(settings.shipping_config, null, 2)
    );

    console.log("\n--- Status Check ---");
    const config = settings.shipping_config;
    const requiredFields = [
      "standard_shipping_enabled",
      "express_shipping_enabled",
      "overnight_shipping_enabled",
      "default_shipping_cost",
      "express_shipping_cost",
      "overnight_shipping_cost",
    ];

    requiredFields.forEach((field) => {
      if (config.hasOwnProperty(field)) {
        console.log(`[OK] ${field}: ${config[field]}`);
      } else {
        console.log(`[MISSING] ${field}`);
      }
    });
  } catch (error) {
    console.error("Error verifying settings:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
}

verifySettings();
