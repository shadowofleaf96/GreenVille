const axios = require("axios");

const BASE_URL = "http://127.0.0.1:3000/v1";

async function runSecurityTests() {
  console.log("--- STARTING SECURITY VERIFICATION ---\n");

  const testEndpoint = async (name, method, endpoint, data = {}) => {
    try {
      console.log(`[${name}] Testing ${method} ${endpoint}...`);
      await axios({
        method,
        url: `${BASE_URL}${endpoint}`,
        data,
      });
      console.error(`FAIL: ${name} - Request should have been blocked!`);
    } catch (error) {
      if (error.response?.status === 401) {
        console.log(`PASS: ${name} - Correctly rejected with 401 Unauthorized`);
      } else if (error.response?.status === 403) {
        console.log(`PASS: ${name} - Correctly rejected with 403 Forbidden`);
      } else {
        console.error(
          `FAIL: ${name} - Unexpected error:`,
          error.response?.status || error.code || error.message
        );
      }
    }
  };

  await testEndpoint("Site Settings Update", "PUT", "/site-settings", {
    website_title: { en: "Hacked" },
  });
  await testEndpoint(
    "Payment Info Save",
    "POST",
    "/payments/save-payment-info",
    { amount: 1 }
  );
  await testEndpoint("Order Creation", "POST", "/orders", { order_items: [] });
  await testEndpoint("Vendor Status Update", "PATCH", "/vendors/status/any", {
    status: "approved",
  });

  console.log("\n--- SECURITY VERIFICATION COMPLETE ---");
}

runSecurityTests();
