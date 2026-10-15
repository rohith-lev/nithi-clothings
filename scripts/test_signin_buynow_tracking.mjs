// scripts/test_signin_buynow_tracking.mjs
async function run() {
  const baseUrl = "http://localhost:3000";
  console.log("=== Testing Sign In > Buy Now & Sign In > Tracking ID Flows ===");

  // 1. Sign In (Auth)
  console.log("\n1. Testing Customer Sign In (/api/customers/auth)");
  const authRes = await fetch(`${baseUrl}/api/customers/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      identifier: "9840123456",
      name: "Priya Rajendran",
    }),
  });
  const authData = await authRes.json();
  console.log("Auth Status:", authRes.status, "Customer Name:", authData.customer?.name, "Token:", authData.token ? "Present" : "Missing");
  if (!authData.success || !authData.token) {
    throw new Error("Customer auth failed");
  }

  // 2. Buy Now Flow: Pre-filled Delivery Profile & Order Placement
  console.log("\n2. Testing Buy Now Flow with Signed-In Customer (/api/orders)");
  const orderRes = await fetch(`${baseUrl}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idempotencyKey: `test-bn-${Date.now()}`,
      customerId: authData.customer.customerId,
      customerName: authData.customer.name,
      customerPhone: authData.customer.phone,
      customerEmail: "priya@example.com",
      shippingAddress: {
        fullName: authData.customer.name,
        phone: authData.customer.phone,
        addressLine: "124 Temple View, Flat 3B",
        areaLocality: "Gandhipuram",
        city: "Coimbatore",
        state: "Tamil Nadu",
        pincode: "641012",
      },
      items: [
        {
          productId: "prod-nighty-1",
          name: "100% Pure Cotton Nighty",
          quantity: 1,
          price: 599,
          finalPrice: 599,
          selectedSize: "L",
          selectedColor: "Maroon",
          image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800",
        },
      ],
      subtotal: 599,
      discount: 0,
      shippingFee: 0,
      total: 599,
      paymentMethod: "COD",
      paymentStatus: "Pending",
    }),
  });
  const orderData = await orderRes.json();
  console.log("Order Status:", orderRes.status, "Order ID:", orderData.data?.orderId);
  if (!orderData.success || !orderData.data?.orderId) {
    throw new Error("Order creation failed in Buy Now flow");
  }
  const createdOrderId = orderData.data.orderId;

  // 3. Admin Assigns Courier Tracking ID to the Order (PATCH /api/orders/[id])
  console.log("\n3. Testing Tracking ID Assignment (PATCH /api/orders/[id])");
  const assignTrackingRes = await fetch(`${baseUrl}/api/orders/${createdOrderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      trackingId: "TRACK-PRIYA-98401-IN",
      courierName: "ST Courier Pan-India",
      dispatchDate: "Tomorrow Morning",
      orderStatus: "Shipped",
    }),
  });
  const assignData = await assignTrackingRes.json();
  console.log("Tracking Assignment Status:", assignTrackingRes.status, "Success:", assignData.success);
  if (!assignData.success) {
    throw new Error("Failed to assign tracking ID");
  }

  // 4. Customer Sign In > View Tracking ID (/api/customers/orders)
  console.log("\n4. Testing Sign In > Customer Orders with Tracking ID (/api/customers/orders)");
  const custOrdersRes = await fetch(`${baseUrl}/api/customers/orders`, {
    headers: {
      Authorization: `Bearer ${authData.token}`,
    },
  });
  const custOrdersData = await custOrdersRes.json();
  console.log("Customer Orders Status:", custOrdersRes.status, "Orders Found:", custOrdersData.data?.length);
  const foundOrder = custOrdersData.data?.find((o) => o.orderId === createdOrderId);
  console.log("Found Order Tracking ID:", foundOrder?.trackingId, "Courier:", foundOrder?.courierName);
  if (!foundOrder || foundOrder.trackingId !== "TRACK-PRIYA-98401-IN") {
    throw new Error("Tracking ID not returned for signed in customer");
  }

  // 5. Track Order via Tracking ID (/api/orders/track?id=...)
  console.log("\n5. Testing Live Consignment Lookup via Tracking ID (/api/orders/track)");
  const trackRes = await fetch(`${baseUrl}/api/orders/track?id=TRACK-PRIYA-98401-IN`);
  const trackData = await trackRes.json();
  console.log("Track Status:", trackRes.status, "Consignment Status:", trackData.data?.orderStatus, "Courier:", trackData.data?.courierName);
  if (!trackData.success || trackData.data?.trackingId !== "TRACK-PRIYA-98401-IN") {
    throw new Error("Tracking lookup failed");
  }

  console.log("\n>>> ALL SIGN IN > BUY NOW & SIGN IN > TRACKING ID TESTS PASSED! <<<");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
