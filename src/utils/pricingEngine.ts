import type { Product } from "../data/products";

export interface CartItemLike {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface PricingCalculationResult {
  cartSubtotal: number;
  comboDiscount: number;
  subtotalAfterDiscount: number;
  shippingCharge: number;
  grandTotal: number;
  isFreeShipping: boolean;
  freeShippingReason: string;
  comboDiscountBreakdown: string[];
  
  // Geographic flags
  isTN: boolean;
  isSouth4: boolean;
  isRestOfIndia: boolean;

  // COD specific
  codEligible: boolean;
  codIneligibleReason?: string;
  codAdvanceAmount: number;
  codAdvanceBreakdown: string[];
  balanceOnDelivery: number;

  // Unit breakdown
  salwarCount: number;
  nightyCount: number;
  cordCount: number;
  kurtiCount: number;
  maxiCount: number;
  totalUnits: number;
}

export function calculateOrderPricing(
  items: CartItemLike[],
  selectedState: string,
  paymentMethod: "online" | "cod"
): PricingCalculationResult {
  const normState = (selectedState || "Tamil Nadu").trim().toLowerCase();
  const isTN = normState === "tamil nadu" || normState === "tn" || normState === "tamilnadu";
  const isSouth4 = ["andhra pradesh", "telangana", "kerala", "karnataka"].includes(normState);
  const isRestOfIndia = !isTN && !isSouth4;

  let salwarCount = 0;
  let nightyCount = 0;
  let cordCount = 0;
  let kurtiCount = 0;
  let maxiCount = 0;
  let totalUnits = 0;
  let cartSubtotal = 0;

  for (const it of items) {
    const qty = it.quantity || 1;
    const cat = (it.product.category || "").toLowerCase();
    const effPrice = it.product.finalPrice || (it.product.discount > 0 ? Math.round(it.product.price * (1 - it.product.discount / 100)) : it.product.price);
    
    cartSubtotal += effPrice * qty;
    totalUnits += qty;

    if (cat.includes("salwar") || cat.includes("unstitched")) {
      salwarCount += qty;
    } else if (cat.includes("nighty") || cat.includes("night dress") || cat.includes("night-dress")) {
      nightyCount += qty;
    } else if (cat.includes("cord") || cat.includes("co-ord")) {
      cordCount += qty;
    } else if (cat.includes("kurti") || cat.includes("top")) {
      kurtiCount += qty;
    } else if (cat.includes("maxi")) {
      maxiCount += qty;
    }
  }

  // --- 1. COMBO DISCOUNTS ---
  let comboDiscount = 0;
  const comboDiscountBreakdown: string[] = [];

  if (paymentMethod === "online") {
    // ❖ Buy two or more Salwar sets: ₹30 price reduction for each set
    if (salwarCount >= 2) {
      const discount = salwarCount * 30;
      comboDiscount += discount;
      comboDiscountBreakdown.push(`₹30 off per Salwar Set (${salwarCount} sets = -₹${discount})`);
    }

    // ❖ Buy five or more Nighties: ₹15 discount for each nighty
    if (nightyCount >= 5) {
      const discount = nightyCount * 15;
      comboDiscount += discount;
      comboDiscountBreakdown.push(`₹15 off per Nighty (${nightyCount} nighties = -₹${discount})`);
    }
  }

  const subtotalAfterDiscount = Math.max(0, cartSubtotal - comboDiscount);

  // --- 2. FREE SHIPPING & SHIPPING CHARGE ---
  let isFreeShipping = false;
  let freeShippingReason = "";
  let shippingCharge = 0;

  if (totalUnits === 0) {
    isFreeShipping = true;
    shippingCharge = 0;
  } else if (paymentMethod === "online") {
    if (isTN) {
      // Online Tamil Nadu Criteria:
      // • Single Unstitched salwar suit/Salwar set = Free shipping
      // • Buy any 3 Nighties = Free shipping
      // • Buy any 2 Cord sets = Free shipping
      // • Buy any 3 Kurtis = Free shipping
      // • COMBO INHERITANCE: If ANY ONE criteria is met, all combination is Free Shipping!
      const salwarEligible = salwarCount >= 1;
      const nightyEligible = nightyCount >= 3;
      const cordEligible = cordCount >= 2;
      const kurtiEligible = kurtiCount >= 3;

      if (salwarEligible || nightyEligible || cordEligible || kurtiEligible) {
        isFreeShipping = true;
        shippingCharge = 0;
        if (salwarEligible) freeShippingReason = "Free Shipping within TN unlocked via Salwar Set (1+ set)";
        else if (nightyEligible) freeShippingReason = "Free Shipping within TN unlocked via Nighties (3+ units)";
        else if (cordEligible) freeShippingReason = "Free Shipping within TN unlocked via Cord Sets (2+ sets)";
        else if (kurtiEligible) freeShippingReason = "Free Shipping within TN unlocked via Kurtis (3+ tops)";
      } else {
        isFreeShipping = false;
        shippingCharge = 70; // Standard shipping fallback within TN
      }
    } else if (isSouth4) {
      // Online South 4 (AP, Telangana, Kerala, Karnataka):
      // • 2 or more Salwar sets = Free shipping
      // • Single set = ₹50 shipping extra
      if (salwarCount >= 2) {
        isFreeShipping = true;
        shippingCharge = 0;
        freeShippingReason = "Free Shipping to South India unlocked via 2+ Salwar Sets";
      } else if (salwarCount === 1) {
        isFreeShipping = false;
        shippingCharge = 50;
      } else {
        isFreeShipping = false;
        shippingCharge = 70;
      }
    } else {
      // Online Remaining States (Rest of India):
      // • 1 set = ₹70 shipping
      // • 2+ sets = ₹70 + ₹40 for each additional set (e.g. 2 sets = 110, 3 sets = 150)
      isFreeShipping = false;
      const baseCount = salwarCount > 0 ? salwarCount : totalUnits;
      shippingCharge = baseCount <= 1 ? 70 : 70 + (baseCount - 1) * 40;
    }
  } else {
    // --- CASH ON DELIVERY (COD) ---
    // (As of now only within Tamil Nadu)
    if (!isTN) {
      isFreeShipping = false;
      shippingCharge = 70;
    } else {
      // COD Tamil Nadu Criteria:
      // • Unstitched salwar suit/Salwar set: 2 or more = Free shipping, 1 set = ₹70 extra
      // • Nighty: 5 or more = Free shipping, 3 or 4 = ₹70 extra
      // • Cord set: 4 or more = Free shipping, 2 or 3 = ₹70 extra
      // • Kurtis: 5 or more = Free shipping
      // • COMBO INHERITANCE: If ANY ONE criteria is eligible, entire combo gets Free Shipping!
      // • TOTAL VALUE OVERRIDE: If total amount >= ₹2,000, Free Shipping on COD!
      const salwarCodFree = salwarCount >= 2;
      const nightyCodFree = nightyCount >= 5;
      const cordCodFree = cordCount >= 4;
      const kurtiCodFree = kurtiCount >= 5;
      const valueOver2000Free = subtotalAfterDiscount >= 2000;

      if (salwarCodFree || nightyCodFree || cordCodFree || kurtiCodFree || valueOver2000Free) {
        isFreeShipping = true;
        shippingCharge = 0;
        if (valueOver2000Free) freeShippingReason = "Free Shipping on COD unlocked! (Order value ₹2,000+)";
        else if (salwarCodFree) freeShippingReason = "Free Shipping on COD unlocked via 2+ Salwar Sets";
        else if (nightyCodFree) freeShippingReason = "Free Shipping on COD unlocked via 5+ Nighties";
        else if (cordCodFree) freeShippingReason = "Free Shipping on COD unlocked via 4+ Cord Sets";
        else if (kurtiCodFree) freeShippingReason = "Free Shipping on COD unlocked via 5+ Kurtis";
      } else {
        isFreeShipping = false;
        shippingCharge = 70; // Standard COD shipping charge within TN
      }
    }
  }

  // --- 3. COD ELIGIBILITY & ADVANCE AMOUNT ---
  let codEligible = isTN;
  let codIneligibleReason: string | undefined;

  if (!isTN) {
    codEligible = false;
    codIneligibleReason = "Cash on Delivery is currently available only for addresses in Tamil Nadu. Please choose Online Payment.";
  } else if (totalUnits > 0 && nightyCount === totalUnits && nightyCount < 3) {
    // ❖ For single nighty or any two not eligible for cash on delivery (Minimum 3 if only nighties)
    codEligible = false;
    codIneligibleReason = "Minimum 3 nighties are required for Cash on Delivery. Add more items or pay online.";
  }

  let codAdvanceAmount = 0;
  const codAdvanceBreakdown: string[] = [];

  if (paymentMethod === "cod" && codEligible) {
    // ➢ Unstitched salwar suit Advance:
    // • For 2 set : ₹100
    // • Upto 5 set : ₹160
    // • For each 2 set : ₹30 extra
    if (salwarCount >= 2) {
      let salAdvance = 0;
      if (salwarCount === 2) {
        salAdvance = 100;
        codAdvanceBreakdown.push(`Salwar Sets (${salwarCount} sets): ₹100 advance`);
      } else if (salwarCount <= 5) {
        salAdvance = 160;
        codAdvanceBreakdown.push(`Salwar Sets (${salwarCount} sets): ₹160 advance`);
      } else {
        const extraBlocks = Math.ceil((salwarCount - 5) / 2);
        salAdvance = 160 + extraBlocks * 30;
        codAdvanceBreakdown.push(`Salwar Sets (${salwarCount} sets): ₹${salAdvance} advance (₹160 + ₹${extraBlocks * 30} extra)`);
      }
      codAdvanceAmount += salAdvance;
    }

    // ➢ Nighty Advance:
    // • For 3 nighties : ₹100
    // • For 4 to 6 nighties : ₹130
    // • For each 3 nighties : ₹30 extra
    if (nightyCount >= 3) {
      let nigAdvance = 0;
      if (nightyCount === 3) {
        nigAdvance = 100;
        codAdvanceBreakdown.push(`Nighties (${nightyCount} items): ₹100 advance`);
      } else if (nightyCount <= 6) {
        nigAdvance = 130;
        codAdvanceBreakdown.push(`Nighties (${nightyCount} items): ₹130 advance`);
      } else {
        const extraBlocks = Math.ceil((nightyCount - 6) / 3);
        nigAdvance = 130 + extraBlocks * 30;
        codAdvanceBreakdown.push(`Nighties (${nightyCount} items): ₹${nigAdvance} advance (₹130 + ₹${extraBlocks * 30} extra)`);
      }
      codAdvanceAmount += nigAdvance;
    }
  }

  const grandTotal = subtotalAfterDiscount + (isFreeShipping ? 0 : shippingCharge);
  const balanceOnDelivery = paymentMethod === "cod" ? Math.max(0, grandTotal - codAdvanceAmount) : 0;

  return {
    cartSubtotal,
    comboDiscount,
    subtotalAfterDiscount,
    shippingCharge: isFreeShipping ? 0 : shippingCharge,
    grandTotal,
    isFreeShipping,
    freeShippingReason,
    comboDiscountBreakdown,
    isTN,
    isSouth4,
    isRestOfIndia,
    codEligible,
    codIneligibleReason,
    codAdvanceAmount,
    codAdvanceBreakdown,
    balanceOnDelivery,
    salwarCount,
    nightyCount,
    cordCount,
    kurtiCount,
    maxiCount,
    totalUnits,
  };
}
