import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../store/cart";
import { calculateOrderPricing } from "../utils/pricingEngine";

type Step = 1 | 2 | 3;

const indianStates = [
  "Tamil Nadu", "Andhra Pradesh", "Telangana", "Kerala", "Karnataka",
  "Maharashtra", "Delhi", "Gujarat", "Rajasthan", "West Bengal",
  "Uttar Pradesh", "Bihar", "Madhya Pradesh", "Odisha", "Punjab",
  "Haryana", "Assam", "Other",
];

interface CustomerInfo {
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
}

export default function Checkout() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [processing, setProcessing] = useState(false);

  const [info, setInfo] = useState<CustomerInfo>({
    fullName: "",
    mobile: "",
    email: "",
    address: "",
    landmark: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
  });

  const pricing = calculateOrderPricing(state.items, info.state, paymentMethod);
  const {
    cartSubtotal,
    comboDiscount,
    subtotalAfterDiscount,
    shippingCharge,
    grandTotal,
    isFreeShipping,
    freeShippingReason,
    comboDiscountBreakdown,
    codEligible,
    codIneligibleReason,
    codAdvanceAmount,
    codAdvanceBreakdown,
    balanceOnDelivery,
  } = pricing;

  const update = (field: keyof CustomerInfo) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setInfo((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const step1Valid = info.fullName && info.mobile.length === 10 && info.address && info.city && info.state && info.pincode.length === 6;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    const idempotencyKey = `idemp-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    let finalOrderId = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}`;
    
    try {
      const orderPayload = {
        idempotencyKey,
        customer: {
          name: info.fullName,
          phone: info.mobile,
          email: info.email,
          address: info.address,
          city: info.city,
          state: info.state,
          pincode: info.pincode,
        },
        shippingAddress: `${info.address}, ${info.landmark ? `${info.landmark}, ` : ""}${info.city}, ${info.state} - ${info.pincode}`,
        shippingCity: info.city,
        shippingState: info.state,
        shippingPincode: info.pincode,
        items: state.items.map((it) => {
          const unitPrice = it.unitPrice !== undefined ? it.unitPrice : (it.product.finalPrice || it.product.price);
          const mappedImg =
            it.colorImage ||
            (it.product.colorImages && it.selectedColor && it.product.colorImages[it.selectedColor]) ||
            it.product.coverImage ||
            it.product.images[0] ||
            "";
          return {
            productId: it.product.id,
            name: it.product.name,
            quantity: it.quantity,
            price: unitPrice,
            finalPrice: unitPrice,
            selectedSize: it.selectedSize || "Free Size",
            selectedColor: it.selectedColor || "Standard",
            image: mappedImg,
          };
        }),
        subtotal: cartSubtotal,
        discount: comboDiscount,
        shippingFee: shippingCharge,
        total: grandTotal,
        paymentMethod: paymentMethod === "cod" ? "COD" : "Online",
        paymentStatus: paymentMethod === "cod" ? "Pending" : "Paid",
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!data.success && data.error) {
        alert(`Could not place order: ${data.error}`);
        setProcessing(false);
        return;
      }

      if (data.data?.orderId) {
        finalOrderId = data.data.orderId;
      } else if (data.orderId) {
        finalOrderId = data.orderId;
      }
    } catch (e) {
      console.warn("Could not post order to backend:", e);
    }

    dispatch({ type: "CLEAR_CART" });
    navigate(`/order-success?orderId=${finalOrderId}&total=${grandTotal}&method=${paymentMethod}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 font-body">
      <h1 className="font-display text-2xl lg:text-3xl font-bold text-[#171A18] mb-6">Checkout</h1>

      {/* Step Progress */}
      <div className="flex items-center mb-8">
        {[
          { n: 1, label: "Your Details" },
          { n: 2, label: "Delivery & Payment" },
          { n: 3, label: "Review Order" },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center flex-1">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s.n ? "bg-[#064E3B] text-[#FAF8F1]" : "bg-[#F3EFE3] text-[#6A6D65]"}`}>
                {step > s.n ? "✓" : s.n}
              </div>
              <span className={`text-xs font-semibold hidden sm:block ${step >= s.n ? "text-[#064E3B]" : "text-[#6A6D65]"}`}>{s.label}</span>
            </div>
            {i < 2 && <div className={`flex-1 h-0.5 mx-3 ${step > s.n ? "bg-[#064E3B]" : "bg-[#E8E2D5]"}`} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Customer Info */}
          {step === 1 && (
            <div className="bg-white border border-[#E8E2D5] rounded-sm p-6 space-y-4 shadow-xs">
              <h2 className="font-display text-lg font-bold text-[#171A18]">Your Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: "Full Name *", field: "fullName", type: "text", placeholder: "Your full name" },
                  { label: "Mobile Number *", field: "mobile", type: "tel", placeholder: "10-digit mobile number" },
                  { label: "Email Address", field: "email", type: "email", placeholder: "your@email.com" },
                  { label: "Landmark", field: "landmark", type: "text", placeholder: "Near school, temple, landmark..." },
                  { label: "City *", field: "city", type: "text", placeholder: "City / Town" },
                  { label: "Pincode *", field: "pincode", type: "text", placeholder: "6-digit pincode" },
                ].map((f) => (
                  <div key={f.field}>
                    <label className="block text-xs font-semibold text-[#171A18] uppercase tracking-wider mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      value={info[f.field as keyof CustomerInfo]}
                      onChange={update(f.field as keyof CustomerInfo)}
                      placeholder={f.placeholder}
                      className="w-full border border-[#E8E2D5] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A227] text-[#171A18]"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#171A18] uppercase tracking-wider mb-1.5">Full Address *</label>
                <textarea
                  value={info.address}
                  onChange={update("address")}
                  placeholder="House/Flat No., Street, Colony, Village/Town..."
                  rows={2}
                  className="w-full border border-[#E8E2D5] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A227] text-[#171A18] resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#171A18] uppercase tracking-wider mb-1.5">State *</label>
                <select
                  value={info.state}
                  onChange={update("state")}
                  className="w-full border border-[#E8E2D5] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A227] bg-white text-[#171A18]"
                >
                  {indianStates.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!step1Valid}
                className="w-full bg-[#064E3B] text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#0B3D2E] transition-colors disabled:opacity-50 rounded-sm shadow-sm"
              >
                Continue to Delivery →
              </button>
            </div>
          )}

          {/* Step 2: Delivery & Payment */}
          {step === 2 && (
            <div className="bg-white border border-[#E8E2D5] rounded-sm p-6 space-y-5 shadow-xs">
              <h2 className="font-display text-lg font-bold text-[#171A18]">Delivery & Payment</h2>

              {/* Free Shipping or Shipping Notice */}
              <div className={`p-3.5 rounded-sm text-sm font-medium ${isFreeShipping ? "bg-[#064E3B]/10 border border-[#064E3B]/30 text-[#064E3B]" : "bg-[#F3EFE3] border border-[#E8E2D5] text-[#171A18]"}`}>
                {isFreeShipping ? (
                  <div className="flex items-center gap-2">
                    <span>🎉</span>
                    <span>{freeShippingReason || "Your order qualifies for FREE SHIPPING!"}</span>
                  </div>
                ) : (
                  <span>Shipping charge: ₹{shippingCharge} ({info.state})</span>
                )}
              </div>

              {/* Combo Discounts Notice */}
              {comboDiscountBreakdown.length > 0 && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-800 space-y-1">
                  <p className="font-bold">✨ Combo Discounts Applied:</p>
                  {comboDiscountBreakdown.map((msg, i) => (
                    <p key={i} className="flex items-center gap-1.5">
                      <span>✓</span> {msg}
                    </p>
                  ))}
                </div>
              )}

              <div>
                <h3 className="text-sm font-semibold text-[#171A18] mb-3">Select Payment Method</h3>
                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${paymentMethod === "online" ? "border-[#064E3B] bg-[#064E3B]/5 ring-1 ring-[#064E3B]/30" : "border-[#E8E2D5] hover:border-[#064E3B]/50"}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => setPaymentMethod("online")}
                      className="mt-0.5 accent-[#064E3B]"
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#171A18]">Online Payment (Instant & Extra Savings)</p>
                      <p className="text-xs text-[#6A6D65] mt-0.5">UPI, GPay, PhonePe, Cards, Net Banking, Wallets</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {["UPI / QR", "GPay / PhonePe", "Visa / Master", "RuPay", "NetBanking"].map((m) => (
                          <span key={m} className="text-[10px] border border-[#E8E2D5] px-2 py-0.5 rounded text-[#4A4D45] bg-[#FAF8F1]">{m}</span>
                        ))}
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-start gap-3 p-4 border rounded-sm cursor-pointer transition-colors ${!codEligible ? "opacity-60 bg-gray-50 cursor-not-allowed" : paymentMethod === "cod" ? "border-[#064E3B] bg-[#064E3B]/5 ring-1 ring-[#064E3B]/30" : "border-[#E8E2D5] hover:border-[#064E3B]/50"}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => codEligible && setPaymentMethod("cod")}
                      disabled={!codEligible}
                      className="mt-0.5 accent-[#064E3B]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#171A18]">Cash on Delivery (COD)</p>
                        {!codEligible && (
                          <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded">Not Available</span>
                        )}
                      </div>
                      {codEligible ? (
                        <p className="text-xs text-[#6A6D65] mt-0.5">
                          {codAdvanceAmount > 0
                            ? `Advance booking amount: ₹${codAdvanceAmount}. Pay remaining ₹${balanceOnDelivery} at delivery.`
                            : "Pay complete order amount upon delivery."}
                        </p>
                      ) : (
                        <p className="text-xs text-red-600 mt-1 font-medium">
                          {codIneligibleReason}
                        </p>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              {paymentMethod === "cod" && codAdvanceAmount > 0 && (
                <div className="bg-[#FAF8F1] border border-[#C9A227]/40 rounded-sm p-4 text-sm space-y-2">
                  <p className="font-semibold text-[#171A18] flex items-center gap-1.5">
                    <span className="text-[#C9A227]">●</span> COD Advance Payment Breakdown
                  </p>
                  {codAdvanceBreakdown.length > 0 && (
                    <div className="space-y-1 text-xs text-[#6A6D65] border-b border-[#E8E2D5] pb-2">
                      {codAdvanceBreakdown.map((b, idx) => (
                        <p key={idx}>• {b}</p>
                      ))}
                    </div>
                  )}
                  <div className="space-y-1.5 text-xs text-[#4A4D45]">
                    <div className="flex justify-between"><span>Total Order Amount</span><span>₹{grandTotal.toLocaleString("en-IN")}</span></div>
                    <div className="flex justify-between font-bold text-[#064E3B]"><span>Advance to Pay Online Now</span><span>₹{codAdvanceAmount}</span></div>
                    <div className="flex justify-between font-semibold text-[#171A18]"><span>Balance Payable on Delivery</span><span>₹{balanceOnDelivery.toLocaleString("en-IN")}</span></div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 border border-[#E8E2D5] py-3.5 text-xs font-semibold uppercase tracking-wider text-[#171A18] hover:border-[#064E3B] transition-colors rounded-sm">
                  ← Back
                </button>
                <button onClick={() => setStep(3)} className="flex-1 bg-[#064E3B] text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#0B3D2E] transition-colors rounded-sm shadow-sm">
                  Review Order →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="bg-white border border-[#E8E2D5] rounded-sm p-6 space-y-5 shadow-xs">
              <h2 className="font-display text-lg font-bold text-[#171A18]">Review Your Order</h2>

              {/* Delivery Address */}
              <div className="border border-[#E8E2D5] rounded-sm p-4 bg-[#FAF8F1]/50">
                <p className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider mb-2">Shipping Destination</p>
                <p className="text-sm text-[#171A18] font-bold">{info.fullName}</p>
                <p className="text-xs text-[#4A4D45] mt-0.5">{info.address}{info.landmark ? `, ${info.landmark}` : ""}</p>
                <p className="text-xs text-[#4A4D45]">{info.city}, {info.state} - {info.pincode}</p>
                <p className="text-xs text-[#4A4D45] mt-1 font-mono">Mobile: {info.mobile}</p>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {state.items.map((item) => {
                  const itemImg =
                    (item.product.colorImages && item.selectedColor && item.product.colorImages[item.selectedColor]) ||
                    item.product.coverImage ||
                    item.product.images[0];
                  return (
                    <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-3 items-center border-b border-[#E8E2D5]/50 pb-3">
                      <div className="w-14 h-16 bg-[#F3EFE3] rounded-sm overflow-hidden shrink-0">
                        <img src={itemImg} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#171A18] truncate">{item.product.name}</p>
                        <p className="text-xs text-[#6A6D65]">{item.selectedColor} · {item.selectedSize} · Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-[#064E3B] shrink-0">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</p>
                    </div>
                  );
                })}
              </div>

              {/* Totals */}
              <div className="border-t border-[#E8E2D5] pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#4A4D45]"><span>Subtotal</span><span>₹{cartSubtotal.toLocaleString("en-IN")}</span></div>
                {comboDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Combo Discount</span>
                    <span>-₹{comboDiscount.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#4A4D45]">
                  <span>Shipping</span>
                  <span className={isFreeShipping ? "text-[#064E3B] font-semibold" : ""}>
                    {isFreeShipping ? "FREE" : `₹${shippingCharge}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-[#171A18] text-base border-t border-[#E8E2D5] pt-2">
                  <span>Total</span>
                  <span className="text-[#064E3B]">₹{grandTotal.toLocaleString("en-IN")}</span>
                </div>
                {paymentMethod === "cod" && codAdvanceAmount > 0 && (
                  <>
                    <div className="flex justify-between text-[#C9A227] font-semibold">
                      <span>Advance to Pay Now</span>
                      <span>₹{codAdvanceAmount}</span>
                    </div>
                    <div className="flex justify-between text-[#4A4D45]">
                      <span>Balance on Delivery</span>
                      <span>₹{balanceOnDelivery.toLocaleString("en-IN")}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center gap-2 pt-2 border-t border-[#E8E2D5]/50">
                  <span className="text-[#6A6D65] text-xs">Payment Method:</span>
                  <span className="text-xs font-semibold text-[#171A18]">
                    {paymentMethod === "online" ? "Online Payment (UPI/Card/NetBanking)" : "Cash on Delivery"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(2)} className="flex-1 border border-[#E8E2D5] py-3.5 text-xs font-semibold uppercase tracking-wider text-[#171A18] hover:border-[#064E3B] transition-colors rounded-sm">
                  ← Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={processing}
                  className="flex-1 bg-[#064E3B] text-white py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#0B3D2E] transition-colors disabled:opacity-70 flex items-center justify-center gap-2 rounded-sm shadow-md"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Confirm & Place Order"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-[#E8E2D5] rounded-sm p-6 sticky top-24 shadow-xs">
            <h3 className="font-display text-base font-bold text-[#171A18] mb-4 pb-2 border-b border-[#E8E2D5]">Order Summary</h3>
            <div className="space-y-2 text-sm">
              {state.items.map((item) => (
                <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex justify-between text-[#4A4D45] text-xs">
                  <span className="truncate max-w-[150px]">{item.product.name} ×{item.quantity}</span>
                  <span className="shrink-0 ml-2 font-medium">₹{(item.product.price * item.quantity).toLocaleString("en-IN")}</span>
                </div>
              ))}
              {comboDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 text-xs font-medium">
                  <span>Combo Discount</span>
                  <span>-₹{comboDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="border-t border-[#E8E2D5] pt-2 flex justify-between text-[#4A4D45] text-xs">
                <span>Shipping ({info.state})</span>
                <span className={isFreeShipping ? "text-[#064E3B] font-semibold" : ""}>
                  {isFreeShipping ? "FREE" : `₹${shippingCharge}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[#171A18] pt-2 border-t border-[#E8E2D5]">
                <span>Grand Total</span>
                <span className="text-[#064E3B]">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
              {paymentMethod === "cod" && codAdvanceAmount > 0 && (
                <div className="pt-2 border-t border-[#E8E2D5] text-xs space-y-1">
                  <div className="flex justify-between text-[#C9A227] font-semibold">
                    <span>Advance Online</span>
                    <span>₹{codAdvanceAmount}</span>
                  </div>
                  <div className="flex justify-between text-[#6A6D65]">
                    <span>At Delivery</span>
                    <span>₹{balanceOnDelivery.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-[#E8E2D5] text-xs text-[#6A6D65] flex items-center gap-1.5">
              <span>🔒</span>
              <span>Encrypted & secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
