import type { Product } from "../data/products";

export interface CartItemLike {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  unitPrice?: number;
  mrp?: number;
}

export interface PricingCalculationResult {
  cartSubtotal: number;
  comboDiscount: number;
  subtotalAfterDiscount: number;
  taxableSubtotal: number;
  cgstRate: number; // 2.5%
  sgstRate: number; // 2.5%
  totalTaxRate: number; // 5.0%
  cgstAmount: number;
  sgstAmount: number;
  totalTaxAmount: number;
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
    const cat = (it.product?.category || "").toLowerCase();
    const effPrice = it.unitPrice !== undefined
      ? it.unitPrice
      : (it.product?.finalPrice !== undefined && it.product.finalPrice > 0
          ? it.product.finalPrice
          : (it.product?.discount && it.product.discount > 0
              ? Math.round(it.product.price * (1 - it.product.discount / 100))
              : (it.product?.price || 0)));
    
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

  // --- 2. TAX CALCULATION (GST & SGST) ---
  // 5% Total Tax split into 2.5% GST/CGST and 2.5% SGST
  const cgstRate = 2.5;
  const sgstRate = 2.5;
  const totalTaxRate = 5.0;
  const taxableSubtotal = subtotalAfterDiscount;
  const cgstAmount = Math.round(taxableSubtotal * 0.025);
  const sgstAmount = Math.round(taxableSubtotal * 0.025);
  const totalTaxAmount = cgstAmount + sgstAmount;

  // --- 3. FREE SHIPPING ACROSS ALL ORDERS ---
  // Shipping fee calculation rules removed: shipping is 100% free across all orders
  const isFreeShipping = true;
  const shippingCharge = 0;
  const freeShippingReason = "FREE Delivery across all orders (Complimentary Express Shipping)";

  // --- 4. COD ELIGIBILITY & ADVANCE AMOUNT ---
  // Mandatory proportional advance payment rule: 10% advance
  // Remaining 90% balance is payable in cash upon delivery.
  const codEligible = totalUnits > 0;
  const codIneligibleReason: string | undefined = undefined;

  const grandTotal = taxableSubtotal + totalTaxAmount + shippingCharge;
  let codAdvanceAmount = 0;
  const codAdvanceBreakdown: string[] = [];

  if (paymentMethod === "cod" && codEligible && grandTotal > 0) {
    // 10% proportional advance rounded to nearest ₹10, minimum ₹50, capped at grandTotal
    codAdvanceAmount = Math.max(50, Math.round((grandTotal * 0.10) / 10) * 10);
    codAdvanceAmount = Math.min(codAdvanceAmount, grandTotal);

    codAdvanceBreakdown.push(
      `Mandatory 10% Partial Advance: ₹${codAdvanceAmount.toLocaleString("en-IN")} (Calculated proportionally based on order total)`
    );
    codAdvanceBreakdown.push(
      `Remaining Balance: ₹${(grandTotal - codAdvanceAmount).toLocaleString("en-IN")} payable in Cash upon Delivery`
    );
  }

  const balanceOnDelivery = paymentMethod === "cod" ? Math.max(0, grandTotal - codAdvanceAmount) : 0;

  return {
    cartSubtotal,
    comboDiscount,
    subtotalAfterDiscount,
    taxableSubtotal,
    cgstRate,
    sgstRate,
    totalTaxRate,
    cgstAmount,
    sgstAmount,
    totalTaxAmount,
    shippingCharge: 0,
    grandTotal,
    isFreeShipping: true,
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
