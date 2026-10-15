// scripts/test_shipping_cod_api.mjs
async function runTests() {
  const baseUrl = "http://localhost:3000";
  console.log("--- Testing Shipping & COD Delivery Rules Endpoints ---");

  // 1. GET /api/shipping-rules
  console.log("\n1. GET /api/shipping-rules");
  const shipGetRes = await fetch(`${baseUrl}/api/shipping-rules`);
  const shipGetData = await shipGetRes.json();
  console.log("Status:", shipGetRes.status, "Rules Count:", shipGetData.data?.length);
  if (!shipGetData.success || !Array.isArray(shipGetData.data)) {
    throw new Error("Failed to get shipping rules");
  }

  // 2. POST /api/shipping-rules (Create)
  console.log("\n2. POST /api/shipping-rules (Create test rule)");
  const newRule = {
    id: "test-rule-temp-999",
    state: "Tamil Nadu",
    category: "Nighty",
    minQty: 5,
    maxQty: 999,
    minOrderValue: 500,
    shippingType: "FIXED",
    charge: 40,
    status: "active",
  };
  const shipCreateRes = await fetch(`${baseUrl}/api/shipping-rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newRule),
  });
  const shipCreateData = await shipCreateRes.json();
  console.log("Status:", shipCreateRes.status, "Created:", shipCreateData.data?.id, "Charge:", shipCreateData.data?.charge);
  if (!shipCreateData.success || shipCreateData.data?.charge !== 40) {
    throw new Error("Failed to create shipping rule");
  }

  // 3. POST /api/shipping-rules (Edit)
  console.log("\n3. POST /api/shipping-rules (Edit test rule)");
  const editRule = {
    ...newRule,
    charge: 65,
    minQty: 6,
    shippingType: "FIXED",
  };
  const shipEditRes = await fetch(`${baseUrl}/api/shipping-rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editRule),
  });
  const shipEditData = await shipEditRes.json();
  console.log("Status:", shipEditRes.status, "Updated Charge:", shipEditData.data?.charge, "MinQty:", shipEditData.data?.minQty);
  if (!shipEditData.success || shipEditData.data?.charge !== 65 || shipEditData.data?.minQty !== 6) {
    throw new Error("Failed to update shipping rule");
  }

  // 4. DELETE /api/shipping-rules (Delete)
  console.log("\n4. DELETE /api/shipping-rules?id=test-rule-temp-999");
  const shipDelRes = await fetch(`${baseUrl}/api/shipping-rules?id=test-rule-temp-999`, {
    method: "DELETE",
  });
  const shipDelData = await shipDelRes.json();
  console.log("Status:", shipDelRes.status, "Success:", shipDelData.success, "Msg:", shipDelData.message);
  if (!shipDelData.success) {
    throw new Error("Failed to delete shipping rule");
  }

  // 5. GET /api/cod-rules
  console.log("\n5. GET /api/cod-rules");
  const codGetRes = await fetch(`${baseUrl}/api/cod-rules`);
  const codGetData = await codGetRes.json();
  console.log(
    "Status:", codGetRes.status,
    "General COD Rules:", codGetData.data?.codRules?.length,
    "Advance Tiers:", codGetData.data?.advanceRules?.length
  );
  if (!codGetData.success || !Array.isArray(codGetData.data?.advanceRules)) {
    throw new Error("Failed to get COD rules");
  }

  // 6. POST /api/cod-rules (Create Advance Tier)
  console.log("\n6. POST /api/cod-rules (Create advance tier)");
  const newAdvRule = {
    id: "test-coda-temp-999",
    type: "advance",
    category: "Kurtis",
    quantityRange: "5 to 10 Pcs",
    minQty: 5,
    maxQty: 10,
    advanceAmount: 200,
    status: "active",
  };
  const codAdvCreateRes = await fetch(`${baseUrl}/api/cod-rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newAdvRule),
  });
  const codAdvCreateData = await codAdvCreateRes.json();
  console.log("Status:", codAdvCreateRes.status, "Created Advance Rule:", codAdvCreateData.data?.id, "Advance:", codAdvCreateData.data?.advanceAmount);
  if (!codAdvCreateData.success || codAdvCreateData.data?.advanceAmount !== 200) {
    throw new Error("Failed to create advance rule");
  }

  // 7. POST /api/cod-rules (Edit Advance Tier)
  console.log("\n7. POST /api/cod-rules (Edit advance tier)");
  const editAdvRule = {
    ...newAdvRule,
    advanceAmount: 250,
    quantityRange: "5 to 12 Pcs",
  };
  const codAdvEditRes = await fetch(`${baseUrl}/api/cod-rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editAdvRule),
  });
  const codAdvEditData = await codAdvEditRes.json();
  console.log("Status:", codAdvEditRes.status, "Updated Advance:", codAdvEditData.data?.advanceAmount, "Label:", codAdvEditData.data?.quantityRange);
  if (!codAdvEditData.success || codAdvEditData.data?.advanceAmount !== 250) {
    throw new Error("Failed to edit advance rule");
  }

  // 8. DELETE /api/cod-rules?id=...&type=advance
  console.log("\n8. DELETE /api/cod-rules?id=test-coda-temp-999&type=advance");
  const codAdvDelRes = await fetch(`${baseUrl}/api/cod-rules?id=test-coda-temp-999&type=advance`, {
    method: "DELETE",
  });
  const codAdvDelData = await codAdvDelRes.json();
  console.log("Status:", codAdvDelRes.status, "Success:", codAdvDelData.success, "Msg:", codAdvDelData.message);
  if (!codAdvDelData.success) {
    throw new Error("Failed to delete advance rule");
  }

  console.log("\n>>> ALL SHIPPING & COD RULES CRUD & EDIT TESTS PASSED! <<<");
}

runTests().catch((err) => {
  console.error("Test failed with error:", err);
  process.exit(1);
});
