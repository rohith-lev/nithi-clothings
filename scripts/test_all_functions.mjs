import assert from "node:assert/strict";

console.log("=================================================");
console.log("NITHI COLLECTIONS — EXHAUSTIVE FUNCTION TEST SUITE");
console.log("=================================================\n");

let passedTests = 0;
let totalTests = 0;

function runTest(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${name}:`, err.message);
  }
}

// ---------------------------------------------------------------------------
// 1. PRICING & COD ENGINE (10% Advance Rules, Balance, Shipping)
// ---------------------------------------------------------------------------
console.log("1. Testing Pricing Engine, Shipping & COD 10% Advance Rules...");

function calculateCodAdvance(grandTotal) {
  return Math.max(50, Math.round((grandTotal * 0.10) / 10) * 10);
}

function calculateOrderPricing({ items, state = "Tamil Nadu", paymentMethod = "online", codSettings = { enabled: true, advancePercent: 10, minAdvance: 50, freeShippingThreshold: 2000 } }) {
  const itemsSubtotal = items.reduce((acc, it) => acc + it.price * it.quantity, 0);
  
  let shippingFee = 0;
  const isTN = state.toLowerCase().includes("tamil nadu");
  if (itemsSubtotal < (isTN ? 1000 : 1500)) {
    shippingFee = isTN ? 50 : 80;
  }
  
  if (paymentMethod === "cod" && codSettings.freeShippingThreshold && itemsSubtotal >= codSettings.freeShippingThreshold) {
    shippingFee = 0;
  }

  const grandTotal = itemsSubtotal + shippingFee;
  let advancePayable = 0;
  let balancePayable = 0;

  if (paymentMethod === "cod") {
    advancePayable = Math.max(codSettings.minAdvance, Math.round((grandTotal * (codSettings.advancePercent / 100)) / 10) * 10);
    balancePayable = grandTotal - advancePayable;
  } else {
    advancePayable = grandTotal;
    balancePayable = 0;
  }

  return { itemsSubtotal, shippingFee, grandTotal, advancePayable, balancePayable };
}

runTest("COD 10% advance on ₹1,000 subtotal with ₹0 shipping (TN >= ₹1000 threshold)", () => {
  const result = calculateOrderPricing({
    items: [{ id: "p1", price: 1000, quantity: 1 }],
    state: "Tamil Nadu",
    paymentMethod: "cod"
  });
  assert.equal(result.itemsSubtotal, 1000);
  assert.equal(result.shippingFee, 0);
  assert.equal(result.grandTotal, 1000);
  assert.equal(result.advancePayable, 100); // 10% of 1000
  assert.equal(result.balancePayable, 900); // 90% of 1000
});

runTest("COD 10% advance on ₹2,450 cart with Free Shipping", () => {
  const result = calculateOrderPricing({
    items: [{ id: "p1", price: 490, quantity: 5 }],
    state: "Tamil Nadu",
    paymentMethod: "cod"
  });
  assert.equal(result.itemsSubtotal, 2450);
  assert.equal(result.shippingFee, 0);
  assert.equal(result.grandTotal, 2450);
  // 10% of 2450 = 245 -> rounded to nearest 10 = 250
  assert.equal(result.advancePayable, 250);
  assert.equal(result.balancePayable, 2200);
});

runTest("COD minimum advance guardrail (minimum ₹50 on low cart value)", () => {
  const advance = calculateCodAdvance(300);
  // 10% of 300 = 30 -> Math.max(50, 30) = 50
  assert.equal(advance, 50);
});

runTest("Online Payment full advance payable (0 balance on delivery)", () => {
  const result = calculateOrderPricing({
    items: [{ id: "p1", price: 999, quantity: 2 }],
    state: "Tamil Nadu",
    paymentMethod: "online"
  });
  assert.equal(result.itemsSubtotal, 1998);
  assert.equal(result.advancePayable, 1998);
  assert.equal(result.balancePayable, 0);
});

// ---------------------------------------------------------------------------
// 2. SPECIAL ₹350 PROMOTIONAL OFFER HANDLING
// ---------------------------------------------------------------------------
console.log("\n2. Testing Special ₹350 Promotional Offer Isolation...");

function is350Offer(product) {
  if (!product) return false;
  const p = Number(product.discountPrice ?? product.price ?? 0);
  const name = String(product.name || "").toLowerCase();
  return p === 350 || name.includes("350") || name.includes("₹350");
}

function getProductActions(product) {
  if (is350Offer(product)) {
    return {
      canAddToBag: false,
      canBuyNow: false,
      action: "VIEW_DETAILS_ONLY"
    };
  }
  return {
    canAddToBag: true,
    canBuyNow: true,
    action: "STANDARD_PURCHASE"
  };
}

runTest("₹350 product correctly flags is350Offer = true and blocks Add to Bag & Buy Now", () => {
  const offerProduct = { id: "p-350", name: "Premium Cotton Printed Nighty", price: 350 };
  assert.equal(is350Offer(offerProduct), true);
  const actions = getProductActions(offerProduct);
  assert.equal(actions.canAddToBag, false);
  assert.equal(actions.canBuyNow, false);
  assert.equal(actions.action, "VIEW_DETAILS_ONLY");
});

runTest("Product with discounted price ₹350 correctly flags is350Offer = true", () => {
  const discountOffer = { id: "p-sale", name: "Special Sale Kurti", price: 499, discountPrice: 350 };
  assert.equal(is350Offer(discountOffer), true);
  const actions = getProductActions(discountOffer);
  assert.equal(actions.canAddToBag, false);
  assert.equal(actions.canBuyNow, false);
});

runTest("Standard ₹499 non-offer product permits Add to Bag & Buy Now", () => {
  const normalProduct = { id: "p-norm", name: "Pure Cotton Feeding Nighty", price: 499 };
  assert.equal(is350Offer(normalProduct), false);
  const actions = getProductActions(normalProduct);
  assert.equal(actions.canAddToBag, true);
  assert.equal(actions.canBuyNow, true);
  assert.equal(actions.action, "STANDARD_PURCHASE");
});

// ---------------------------------------------------------------------------
// 3. CATEGORY MATCHING, SLUGS & ALIASES
// ---------------------------------------------------------------------------
console.log("\n3. Testing Category Matching, Slugs & Aliases...");

function normalizeSlug(str) {
  return String(str || "").toLowerCase().trim().replace(/[\s_]+/g, "-");
}

function matchesCategory(productCategory, selectedCategory) {
  if (!selectedCategory || selectedCategory === "all") return true;
  const pCat = normalizeSlug(productCategory);
  const sCat = normalizeSlug(selectedCategory);

  if (pCat === sCat) return true;

  const aliases = {
    "cord-set": ["coord-set", "co-ord-set", "cord-sets", "coord-sets"],
    "coord-set": ["cord-set", "co-ord-set", "cord-sets"],
    "nighty": ["nighties", "night-dress", "night-gown", "nightwear"],
    "nighties": ["nighty", "night-dress"],
    "salwar-set": ["salwar", "salwar-suits", "salwar-material"],
    "kurtis": ["kurti", "kurthis", "tops"]
  };

  for (const [key, list] of Object.entries(aliases)) {
    if (sCat === key && list.includes(pCat)) return true;
    if (pCat === key && list.includes(sCat)) return true;
  }

  return false;
}

runTest("Matches exact category names and slugs", () => {
  assert.equal(matchesCategory("Cord Set", "cord-set"), true);
  assert.equal(matchesCategory("Salwar Set", "salwar-set"), true);
  assert.equal(matchesCategory("Maxi", "maxi"), true);
});

runTest("Matches category aliases (Cord set vs Coord set)", () => {
  assert.equal(matchesCategory("co-ord-set", "cord-set"), true);
  assert.equal(matchesCategory("coord-sets", "cord-set"), true);
});

runTest("Matches Nighties alias to Nighty without false matches", () => {
  assert.equal(matchesCategory("nighties", "nighty"), true);
  assert.equal(matchesCategory("kurtis", "nighty"), false);
});

// ---------------------------------------------------------------------------
// 4. CART & WISHLIST REDUCERS & STATE IMMUTABILITY
// ---------------------------------------------------------------------------
console.log("\n4. Testing Shopping Cart Operations (Add, Qty, Remove, Clear)...");

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingIndex = state.items.findIndex(
        (it) => it.id === action.item.id && it.selectedSize === action.item.selectedSize && it.selectedColor === action.item.selectedColor
      );
      if (existingIndex > -1) {
        const nextItems = [...state.items];
        nextItems[existingIndex] = {
          ...nextItems[existingIndex],
          quantity: nextItems[existingIndex].quantity + (action.item.quantity || 1)
        };
        return { ...state, items: nextItems };
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: action.item.quantity || 1 }] };
    }
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (it) => !(it.id === action.id && it.selectedSize === action.selectedSize && it.selectedColor === action.selectedColor)
          )
        };
      }
      return {
        ...state,
        items: state.items.map((it) => {
          if (it.id === action.id && it.selectedSize === action.selectedSize && it.selectedColor === action.selectedColor) {
            return { ...it, quantity: action.quantity };
          }
          return it;
        })
      };
    }
    case "REMOVE_FROM_CART": {
      return {
        ...state,
        items: state.items.filter(
          (it) => !(it.id === action.id && it.selectedSize === action.selectedSize && it.selectedColor === action.selectedColor)
        )
      };
    }
    case "CLEAR_CART":
      return { ...state, items: [] };
    default:
      return state;
  }
}

function wishlistReducer(state, action) {
  switch (action.type) {
    case "TOGGLE_WISHLIST": {
      const exists = state.items.includes(action.productId);
      return {
        ...state,
        items: exists ? state.items.filter((id) => id !== action.productId) : [...state.items, action.productId]
      };
    }
    default:
      return state;
  }
}

runTest("Adding item to cart creates item with correct quantity", () => {
  const initial = { items: [] };
  const s1 = cartReducer(initial, { type: "ADD_TO_CART", item: { id: "p1", name: "Nighty", price: 499, selectedSize: "XL", quantity: 1 } });
  assert.equal(s1.items.length, 1);
  assert.equal(s1.items[0].quantity, 1);
});

runTest("Adding same item increments quantity rather than duplicating", () => {
  const initial = { items: [{ id: "p1", name: "Nighty", price: 499, selectedSize: "XL", quantity: 1 }] };
  const s2 = cartReducer(initial, { type: "ADD_TO_CART", item: { id: "p1", name: "Nighty", price: 499, selectedSize: "XL", quantity: 2 } });
  assert.equal(s2.items.length, 1);
  assert.equal(s2.items[0].quantity, 3);
});

runTest("Adding same product ID with different size creates distinct cart row", () => {
  const initial = { items: [{ id: "p1", name: "Nighty", price: 499, selectedSize: "XL", quantity: 1 }] };
  const s2 = cartReducer(initial, { type: "ADD_TO_CART", item: { id: "p1", name: "Nighty", price: 499, selectedSize: "XXL", quantity: 1 } });
  assert.equal(s2.items.length, 2);
  assert.equal(s2.items[0].selectedSize, "XL");
  assert.equal(s2.items[1].selectedSize, "XXL");
});

runTest("Updating quantity to 0 removes the item", () => {
  const initial = { items: [{ id: "p1", name: "Nighty", price: 499, selectedSize: "XL", quantity: 2 }] };
  const s2 = cartReducer(initial, { type: "UPDATE_QUANTITY", id: "p1", selectedSize: "XL", quantity: 0 });
  assert.equal(s2.items.length, 0);
});

runTest("Clear cart empties all items completely", () => {
  const initial = { items: [{ id: "p1", quantity: 2 }, { id: "p2", quantity: 1 }] };
  const s2 = cartReducer(initial, { type: "CLEAR_CART" });
  assert.equal(s2.items.length, 0);
});

runTest("Toggle wishlist adds and removes product IDs", () => {
  let state = { items: [] };
  state = wishlistReducer(state, { type: "TOGGLE_WISHLIST", productId: "prod-101" });
  assert.deepEqual(state.items, ["prod-101"]);
  state = wishlistReducer(state, { type: "TOGGLE_WISHLIST", productId: "prod-101" });
  assert.deepEqual(state.items, []);
});

// ---------------------------------------------------------------------------
// 5. INVENTORY & STOCK CHECK
// ---------------------------------------------------------------------------
console.log("\n5. Testing Stock Deduction & Availability Logic...");

function deductStock(inventory, requestedId, quantity) {
  const item = inventory.find((p) => p.id === requestedId);
  if (!item) throw new Error("Product not found in catalog");
  if (item.stock < quantity) {
    throw new Error(`Insufficient stock for ${item.name}: requested ${quantity}, available ${item.stock}`);
  }
  item.stock -= quantity;
  return item.stock;
}

runTest("Stock deduction succeeds when stock is sufficient", () => {
  const inventory = [{ id: "p1", name: "Cotton Nighty", stock: 10 }];
  const remaining = deductStock(inventory, "p1", 3);
  assert.equal(remaining, 7);
});

runTest("Stock deduction throws error when requested quantity exceeds stock", () => {
  const inventory = [{ id: "p1", name: "Cotton Nighty", stock: 2 }];
  assert.throws(() => {
    deductStock(inventory, "p1", 5);
  }, /Insufficient stock/);
});

// ---------------------------------------------------------------------------
// 6. SIZE FILTERING (M, L, XL, XXL / 2XL, 3XL, 4XL)
// ---------------------------------------------------------------------------
console.log("\n6. Testing Size Filtering Across Product Grids...");

function matchesSize(productSizes, selectedSize) {
  if (!selectedSize || selectedSize === "all") return true;
  if (!Array.isArray(productSizes)) return false;

  const target = selectedSize.toUpperCase().trim();
  const normalizedProductSizes = productSizes.map((s) => s.toUpperCase().trim());

  if (target === "XXL" || target === "2XL") {
    return normalizedProductSizes.some((s) => s === "XXL" || s === "2XL");
  }
  if (target === "3XL" || target === "XXXL") {
    return normalizedProductSizes.some((s) => s === "3XL" || s === "XXXL");
  }
  if (target === "4XL" || target === "XXXXL") {
    return normalizedProductSizes.some((s) => s === "4XL" || s === "XXXXL");
  }

  return normalizedProductSizes.includes(target);
}

runTest("Size filter matches products with direct size in array", () => {
  const product = { sizes: ["M", "L", "XL"] };
  assert.equal(matchesSize(product.sizes, "L"), true);
  assert.equal(matchesSize(product.sizes, "XXL"), false);
});

runTest("Size filter handles XXL and 2XL synonymously", () => {
  const productWith2XL = { sizes: ["2XL"] };
  const productWithXXL = { sizes: ["XXL"] };

  assert.equal(matchesSize(productWith2XL.sizes, "XXL"), true);
  assert.equal(matchesSize(productWithXXL.sizes, "2XL"), true);
});

runTest("Size filter handles 3XL and XXXL synonymously", () => {
  const product = { sizes: ["3XL"] };
  assert.equal(matchesSize(product.sizes, "XXXL"), true);
  assert.equal(matchesSize(product.sizes, "3XL"), true);
});

// ---------------------------------------------------------------------------
// 7. ORDER TRACKING PARSER & QUERY SANITIZATION
// ---------------------------------------------------------------------------
console.log("\n7. Testing Order Tracking Query Sanitization & Prefix Handling...");

function parseTrackingInput(query) {
  if (!query || typeof query !== "string" || !query.trim()) {
    return { valid: false, error: "Empty query" };
  }
  const cleanId = query.trim();

  // Guard against pure phone numbers
  const isPurePhoneNumber =
    /^[0-9+ -]{7,15}$/.test(cleanId) &&
    !cleanId.toUpperCase().startsWith("ORD-") &&
    !cleanId.toUpperCase().startsWith("NC") &&
    !cleanId.toLowerCase().includes("order");

  if (isPurePhoneNumber) {
    return { valid: false, error: "Phone number lookups restricted" };
  }

  const candidates = new Set();
  candidates.add(cleanId);

  const stripped = cleanId
    .replace(/^(order|consignment|track|tracking|id|ref|no|#|\s|:)+/gi, "")
    .trim();
  if (stripped) candidates.add(stripped);

  const ordMatch = cleanId.match(/ORD-?[0-9]+/i);
  if (ordMatch) {
    candidates.add(ordMatch[0]);
    candidates.add(ordMatch[0].replace(/^ORD-?/i, "ORD-"));
  }

  return { valid: true, candidates: Array.from(candidates) };
}

runTest("Tracking input properly parses 'Order #ORD-10928'", () => {
  const res = parseTrackingInput("Order #ORD-10928");
  assert.equal(res.valid, true);
  assert.ok(res.candidates.includes("ORD-10928"));
});

runTest("Tracking input blocks phone-number-only lookups for privacy", () => {
  const res = parseTrackingInput("9345136762");
  assert.equal(res.valid, false);
  assert.equal(res.error, "Phone number lookups restricted");
});

runTest("Tracking input accepts custom courier consignment tracking number", () => {
  const res = parseTrackingInput("DTDC8829104");
  assert.equal(res.valid, true);
  assert.ok(res.candidates.includes("DTDC8829104"));
});

console.log("\n=================================================");
console.log(`TEST RESULTS: ${passedTests}/${totalTests} PASSED, ${totalTests - passedTests} FAILED`);
console.log("=================================================");

if (passedTests !== totalTests) {
  process.exit(1);
}
