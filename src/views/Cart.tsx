import { Link, useNavigate } from "react-router";
import { useCart } from "../store/cart";
import { useState } from "react";
import FreeShippingProgress from "../components/FreeShippingProgress";

function calculateShipping(
  items: ReturnType<typeof useCart>["state"]["items"],
  state: string,
  cartTotal: number
): { charge: number; message: string; isFree: boolean; threshold: number } {
  const nightyCount = items.filter((i) => i.product.category === "nighty").reduce((s, i) => s + i.quantity, 0);
  const salwarCount = items.filter((i) => ["unstitched-salwar", "salwar-set"].includes(i.product.category)).reduce((s, i) => s + i.quantity, 0);
  const cordCount = items.filter((i) => i.product.category === "cord-set").reduce((s, i) => s + i.quantity, 0);

  if (cartTotal >= 999) {
    return { charge: 0, message: "🎉 Free Express Shipping Unlocked!", isFree: true, threshold: 999 };
  }

  if (state === "Tamil Nadu") {
    if (nightyCount >= 3 || salwarCount >= 2 || cordCount >= 2 || (salwarCount >= 1 && nightyCount >= 1)) {
      return { charge: 0, message: "🎉 You are eligible for FREE SHIPPING in Tamil Nadu!", isFree: true, threshold: 999 };
    }
    return { charge: 0, message: "Standard Express Delivery in Tamil Nadu", isFree: true, threshold: 999 };
  }

  if (["Andhra Pradesh", "Telangana", "Kerala", "Karnataka"].includes(state)) {
    if (salwarCount >= 2) return { charge: 0, message: "🎉 Free shipping on 2+ items!", isFree: true, threshold: 999 };
    return { charge: 60, message: "Standard South India Shipping (₹60)", isFree: false, threshold: 999 };
  }

  return { charge: 90, message: "Standard Pan-India Shipping (₹90)", isFree: false, threshold: 999 };
}

const indianStates = [
  "Tamil Nadu", "Andhra Pradesh", "Telangana", "Kerala", "Karnataka",
  "Maharashtra", "Delhi", "Gujarat", "Rajasthan", "West Bengal",
  "Uttar Pradesh", "Bihar", "Madhya Pradesh", "Odisha", "Punjab",
  "Haryana", "Assam", "Other",
];

export default function Cart() {
  const { state, dispatch, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("Tamil Nadu");
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);

  const shipping = calculateShipping(state.items, selectedState, cartTotal);
  const couponDiscount = couponApplied ? Math.round(cartTotal * 0.1) : 0;
  const grandTotal = cartTotal - couponDiscount + (shipping.isFree ? 0 : shipping.charge);

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "NITHI10") {
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code. Try using 'NITHI10'");
    }
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-body bg-[#FAF8F1]">
        <div className="text-center max-w-md p-8">
          <div className="text-6xl mb-4">🛍️</div>
          <h2 className="font-display text-2xl font-bold text-[#064E3B] mb-2">
            Your Shopping Bag is Empty
          </h2>
          <p className="text-xs text-[#5C635E] mb-6 leading-relaxed">
            Discover our authentic pure cotton nighties, elegant salwar sets, and handcrafted ensembles.
          </p>
          <Link
            to="/shop"
            className="inline-block rounded-xl bg-[#064E3B] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#FAF8F1] hover:bg-[#0B3D2E] transition-colors shadow-md"
          >
            Explore Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 font-body bg-[#FAF8F1]">
      <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#064E3B] mb-6">
        Shopping Bag ({cartCount} {cartCount === 1 ? "Item" : "Items"})
      </h1>

      {/* Free Shipping Dynamic Bar */}
      <div className="mb-6">
        <FreeShippingProgress
          cartTotal={cartTotal}
          threshold={shipping.threshold}
          freeShippingUnlocked={shipping.isFree}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {state.items.map((item) => {
            const itemKey = item.key || `${item.product.id}__${(item.selectedColor || 'Standard').toLowerCase()}__${(item.selectedSize || 'Free Size').toLowerCase()}`;
            const itemImage =
              item.colorImage ||
              (item.product.colorImages && item.selectedColor && item.product.colorImages[item.selectedColor]) ||
              (item.product.colorOptions && item.product.colorOptions.find(c => c.name.toLowerCase() === item.selectedColor?.toLowerCase())?.image) ||
              item.product.coverImage ||
              item.product.images[0] ||
              "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=400";

            const unitPrice = item.unitPrice !== undefined ? item.unitPrice : (item.product.finalPrice || item.product.price);
            const itemTotal = unitPrice * item.quantity;
            const itemMrp = item.mrp || item.product.mrp || item.product.price;
            const maxStock = (item.stock !== undefined && item.stock > 0) ? item.stock : 99;

            return (
              <div
                key={itemKey}
                className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-5 shadow-xs transition-all hover:border-[#C9A227]/60"
              >
                <Link to={`/product/${item.product.id}`} className="shrink-0">
                  <div className="w-24 h-32 bg-[#F3EFE3] rounded-xl overflow-hidden shadow-2xs">
                    <img
                      src={itemImage}
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </Link>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C9A227]">
                        {item.product.category}
                      </span>
                      <Link to={`/product/${item.product.id}`}>
                        <h3 className="font-display text-sm sm:text-base font-semibold text-[#171A18] hover:text-[#064E3B] transition-colors line-clamp-2 mt-0.5">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-[10px] font-mono text-[#5C635E] mt-0.5">
                        {item.product.sku || item.product.code}
                      </p>
                      
                      {/* Selected Variant Tags */}
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F1] border border-[#E8E2D5] text-xs font-semibold text-[#171A18]">
                          <span className="text-[#5C635E] text-[10px] uppercase font-bold">Color:</span>
                          <strong>{item.selectedColor || "Standard"}</strong>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF8F1] border border-[#E8E2D5] text-xs font-semibold text-[#171A18]">
                          <span className="text-[#5C635E] text-[10px] uppercase font-bold">Size:</span>
                          <strong>{item.selectedSize || "Free Size"}</strong>
                        </span>
                        <span className="text-xs font-bold text-[#064E3B]">
                          ₹{unitPrice.toLocaleString("en-IN")} / unit
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: itemKey })}
                      className="text-[#5C635E] hover:text-rose-600 transition-colors p-1"
                      title="Remove variant from bag"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-[#E8E2D5]/60">
                    <div className="flex items-center border border-[#E8E2D5] rounded-xl bg-[#FAF8F1] overflow-hidden">
                      <button
                        type="button"
                        onClick={() =>
                          item.quantity > 1
                            ? dispatch({
                                type: "UPDATE_QUANTITY",
                                payload: { key: itemKey, quantity: item.quantity - 1 },
                              })
                            : dispatch({ type: "REMOVE_FROM_CART", payload: itemKey })
                        }
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#171A18] hover:bg-[#F3EFE3]"
                      >
                        −
                      </button>
                      <span className="w-9 h-7 flex items-center justify-center text-xs font-semibold border-x border-[#E8E2D5] text-[#171A18]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_QUANTITY",
                            payload: { key: itemKey, quantity: Math.min(maxStock, item.quantity + 1) },
                          })
                        }
                        disabled={item.quantity >= maxStock}
                        className="w-7 h-7 flex items-center justify-center text-xs font-bold text-[#171A18] hover:bg-[#F3EFE3] disabled:opacity-30"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="font-display text-base sm:text-lg font-bold text-[#064E3B]">
                        ₹{itemTotal.toLocaleString("en-IN")}
                      </span>
                      {itemMrp > unitPrice && (
                        <p className="text-[10px] text-[#5C635E] line-through">
                          ₹{(itemMrp * item.quantity).toLocaleString("en-IN")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Box */}
        <div className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-2xl p-6 shadow-xs space-y-5">
          <h2 className="font-display text-lg font-bold text-[#064E3B] pb-3 border-b border-[#E8E2D5]">
            Order Summary
          </h2>

          {/* Destination State Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171A18] mb-1.5">
              Delivery State
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-[#FAF8F1] border border-[#E8E2D5] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#171A18] focus:outline-none focus:border-[#064E3B]"
            >
              {indianStates.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Coupon Code */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#171A18] mb-1.5">
              Promo / Gift Code
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="e.g. NITHI10"
                disabled={couponApplied}
                className="flex-1 bg-[#FAF8F1] border border-[#E8E2D5] rounded-xl px-3.5 py-2 text-xs uppercase font-mono focus:outline-none focus:border-[#064E3B] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={applyCoupon}
                disabled={couponApplied}
                className="rounded-xl bg-[#064E3B] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#FAF8F1] hover:bg-[#0B3D2E] disabled:opacity-50"
              >
                {couponApplied ? "Applied" : "Apply"}
              </button>
            </div>
            {couponApplied && (
              <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                ✓ 10% Discount Applied!
              </p>
            )}
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-2.5 text-xs border-t border-[#E8E2D5] pt-4">
            <div className="flex justify-between text-[#5C635E]">
              <span>Subtotal</span>
              <span className="font-semibold text-[#171A18]">
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>

            {couponApplied && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Coupon Discount (10%)</span>
                <span>-₹{couponDiscount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between text-[#5C635E]">
              <span>Shipping ({selectedState})</span>
              <span className={shipping.isFree ? "text-emerald-700 font-bold" : "font-semibold text-[#171A18]"}>
                {shipping.isFree ? "FREE" : `₹${shipping.charge}`}
              </span>
            </div>

            <div className="flex justify-between items-baseline border-t border-[#E8E2D5] pt-3 text-base font-bold text-[#064E3B]">
              <span>Grand Total</span>
              <span className="font-display text-xl">
                ₹{grandTotal.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="w-full rounded-xl bg-[#064E3B] py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#FAF8F1] shadow-md hover:bg-[#0B3D2E] transition-all"
          >
            Proceed to Checkout →
          </button>

          <p className="text-center text-[10px] text-[#5C635E]">
            🔒 256-Bit Encrypted Secure Checkout • Cash on Delivery Available
          </p>
        </div>
      </div>
    </div>
  );
}
