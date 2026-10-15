import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../store/cart";
import { calculateOrderPricing } from "../utils/pricingEngine";
import { useCustomerAuth } from "../services/customerAuth";

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
  addressLine: string;
  areaLocality: string;
  city: string;
  state: string;
  pincode: string;
  saveAddressToProfile: boolean;
}

export default function Checkout() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const { customer, isLoggedIn, updateProfile, login } = useCustomerAuth();
  const [step, setStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">("online");
  const [processing, setProcessing] = useState(false);

  // Quick In-Checkout Sign In for Express Buy Now
  const [showCheckoutSignIn, setShowCheckoutSignIn] = useState(false);
  const [checkoutAuthInput, setCheckoutAuthInput] = useState("");
  const [checkoutAuthName, setCheckoutAuthName] = useState("");
  const [checkoutAuthError, setCheckoutAuthError] = useState<string | null>(null);
  const [isSubmittingCheckoutAuth, setIsSubmittingCheckoutAuth] = useState(false);

  const [info, setInfo] = useState<CustomerInfo>({
    fullName: "",
    mobile: "",
    email: "",
    addressLine: "",
    areaLocality: "",
    city: "",
    state: "Tamil Nadu",
    pincode: "",
    saveAddressToProfile: true,
  });

  // Pre-fill from customer account if logged in
  useEffect(() => {
    if (customer) {
      setInfo((prev) => ({
        fullName: prev.fullName || customer.name || "",
        mobile: prev.mobile || customer.phone || "",
        email: prev.email || customer.email || "",
        addressLine: prev.addressLine || customer.addressLine || customer.address || "",
        areaLocality: prev.areaLocality || customer.areaLocality || "",
        city: prev.city || customer.city || "",
        state: prev.state || customer.state || "Tamil Nadu",
        pincode: prev.pincode || customer.pincode || "",
        saveAddressToProfile: true,
      }));
    }
  }, [customer]);

  const handleCheckoutQuickSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutAuthInput.trim()) return;
    setIsSubmittingCheckoutAuth(true);
    setCheckoutAuthError(null);
    const res = await login(checkoutAuthInput, checkoutAuthName);
    setIsSubmittingCheckoutAuth(false);
    if (res.success && res.customer) {
      setShowCheckoutSignIn(false);
      setInfo((prev) => ({
        fullName: res.customer?.name || prev.fullName || "",
        mobile: res.customer?.phone || prev.mobile || "",
        email: res.customer?.email || prev.email || "",
        addressLine: res.customer?.addressLine || res.customer?.address || prev.addressLine || "",
        areaLocality: res.customer?.areaLocality || prev.areaLocality || "",
        city: res.customer?.city || prev.city || "",
        state: res.customer?.state || prev.state || "Tamil Nadu",
        pincode: res.customer?.pincode || prev.pincode || "",
        saveAddressToProfile: true,
      }));
    } else {
      setCheckoutAuthError(res.error || "Sign in failed. Please check your mobile or email.");
    }
  };

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

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInfo((prev) => ({ ...prev, saveAddressToProfile: e.target.checked }));
  };

  const step1Valid = Boolean(
    info.fullName.trim() &&
    info.mobile.trim().length >= 10 &&
    info.addressLine.trim() &&
    info.city.trim() &&
    info.state.trim() &&
    info.pincode.trim().length === 6
  );

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const createOrderInBackend = async (
    paymentMethodType: "Online" | "COD",
    paymentStatusType: "Paid" | "Pending",
    paymentReference: string = "",
    razorpayOrderId: string = "",
    razorpaySignature: string = ""
  ) => {
    const idempotencyKey = `idemp-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
    let finalOrderId = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Date.now().toString().slice(-4)}`;

    const fullAddress = [info.addressLine, info.areaLocality, info.city, `${info.state} - ${info.pincode}`].filter(Boolean).join(", ");

    // Persist to customer profile if requested and logged in
    if (isLoggedIn && info.saveAddressToProfile) {
      updateProfile({
        name: info.fullName,
        email: info.email,
        addressLine: info.addressLine,
        areaLocality: info.areaLocality,
        address: [info.addressLine, info.areaLocality].filter(Boolean).join(", "),
        city: info.city,
        state: info.state,
        pincode: info.pincode,
      }).catch(console.error);
    }

    const orderPayload = {
      idempotencyKey,
      customerId: customer?.customerId || "",
      customer: {
        customerId: customer?.customerId || "",
        name: info.fullName,
        phone: info.mobile,
        email: info.email,
        addressLine: info.addressLine,
        areaLocality: info.areaLocality,
        address: [info.addressLine, info.areaLocality].filter(Boolean).join(", "),
        city: info.city,
        state: info.state,
        pincode: info.pincode,
      },
      customerName: info.fullName,
      customerPhone: info.mobile,
      customerEmail: info.email,
      shippingAddress: fullAddress,
      shippingCity: info.city,
      shippingState: info.state,
      shippingPincode: info.pincode,
      items: state.items.map((it) => {
        const unitPrice = it.unitPrice !== undefined ? it.unitPrice : (it.product.finalPrice || it.product.price);
        const mappedImg =
          it.colorImage ||
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
          selectedColor: "Standard",
          image: mappedImg,
        };
      }),
      subtotal: cartSubtotal,
      discount: comboDiscount,
      shippingFee: shippingCharge,
      total: grandTotal,
      paymentMethod: paymentMethodType,
      paymentStatus: paymentStatusType,
      paymentReference,
      razorpay_order_id: razorpayOrderId,
      razorpay_signature: razorpaySignature,
    };

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderPayload),
    });

    const text = await res.text();
    let data: any = {};
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error("Invalid response from server when creating order");
    }
    if (!data.success && data.error) {
      throw new Error(data.error);
    }

    if (data.data?.orderId) {
      finalOrderId = data.data.orderId;
    } else if (data.orderId) {
      finalOrderId = data.orderId;
    }

    return finalOrderId;
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);

    try {
      if (paymentMethod === "online") {
        // 1. Load Razorpay Checkout Script
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          alert("Razorpay payment SDK failed to load. Please check your internet connection.");
          setProcessing(false);
          return;
        }

        // 2. Create Razorpay Order on Backend
        const rzpOrderRes = await fetch("/api/razorpay/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: grandTotal,
            currency: "INR",
            receipt: `rcpt_${Date.now().toString().slice(-6)}`,
            notes: {
              customerName: info.fullName,
              customerPhone: info.mobile,
            },
          }),
        });

        const rzpText = await rzpOrderRes.text();
        let rzpOrderData: any = {};
        try {
          rzpOrderData = JSON.parse(rzpText);
        } catch {
          alert("Failed to initiate payment: Invalid server response.");
          setProcessing(false);
          return;
        }
        if (!rzpOrderData.success || !rzpOrderData.data) {
          alert(`Could not initiate Razorpay payment: ${rzpOrderData.error || "Unknown error"}`);
          setProcessing(false);
          return;
        }

        const { orderId: rzpOrderId, key: rzpKey } = rzpOrderData.data;

        // 3. Open Razorpay Checkout Modal
        const options = {
          key: rzpKey,
          amount: Math.round(grandTotal * 100),
          currency: "INR",
          name: "Nithi Collection",
          description: "Luxury Indian Garments & Coutures",
          order_id: rzpOrderId,
          prefill: {
            name: info.fullName,
            email: info.email || "",
            contact: info.mobile,
          },
          theme: {
            color: "#064E3B",
          },
          modal: {
            ondismiss: () => {
              setProcessing(false);
            },
          },
          handler: async (response: {
            razorpay_payment_id: string;
            razorpay_order_id: string;
            razorpay_signature: string;
          }) => {
            try {
              // 4. Verify Payment Signature
              const verifyRes = await fetch("/api/razorpay/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id || rzpOrderId,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });

              const verifyText = await verifyRes.text();
              let verifyData: any = {};
              try {
                verifyData = JSON.parse(verifyText);
              } catch {
                alert("Payment verification failed: Invalid server response.");
                setProcessing(false);
                return;
              }
              if (!verifyData.success) {
                alert(`Payment verification failed: ${verifyData.error || "Signature invalid"}`);
                setProcessing(false);
                return;
              }

              // 5. Create Order upon Successful Verification
              const finalOrderId = await createOrderInBackend(
                "Online",
                "Paid",
                response.razorpay_payment_id,
                response.razorpay_order_id || rzpOrderId,
                response.razorpay_signature
              );

              dispatch({ type: "CLEAR_CART" });
              navigate(`/order-success?orderId=${finalOrderId}&total=${grandTotal}&method=Online`);
            } catch (err: any) {
              alert(`Error completing verified order: ${err.message}`);
              setProcessing(false);
            }
          },
        };

        const razorpayInstance = new (window as any).Razorpay(options);
        razorpayInstance.on("payment.failed", (failResponse: any) => {
          alert(`Payment failed: ${failResponse.error?.description || "Transaction cancelled"}`);
          setProcessing(false);
        });
        razorpayInstance.open();
      } else {
        // Cash on Delivery Flow
        const finalOrderId = await createOrderInBackend("COD", "Pending");
        dispatch({ type: "CLEAR_CART" });
        navigate(`/order-success?orderId=${finalOrderId}&total=${grandTotal}&method=COD`);
      }
    } catch (e: any) {
      alert(`Could not place order: ${e.message}`);
      setProcessing(false);
    }
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
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2 border-b border-[#E8E2D5]">
                <h2 className="font-display text-lg font-bold text-[#171A18]">Delivery Address & Contact Details</h2>
                {isLoggedIn ? (
                  <span className="text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded font-medium flex items-center gap-1.5">
                    <span>✓</span> Saved Profile: {customer?.name || customer?.phone}
                  </span>
                ) : (
                  <span className="text-xs text-[#6A6D65]">
                    No account required · Quick checkout
                  </span>
                )}
              </div>

              {/* Express Buy Now / Quick Sign In Banner */}
              {!isLoggedIn ? (
                <div className="bg-[#FAF8F1] border border-[#C9A227]/40 rounded-xl p-3.5 sm:p-4 text-xs space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">✨</span>
                      <div>
                        <span className="font-bold text-[#064E3B] text-xs block">
                          Already have an account with Nithi Clothings?
                        </span>
                        <span className="text-[11px] text-[#5C635E]">
                          Sign in to auto-fill your saved address & complete Buy Now in 1 click.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCheckoutSignIn(!showCheckoutSignIn)}
                      className="px-3.5 py-1.5 bg-[#064E3B] hover:bg-[#0B3D2E] text-white rounded-lg font-bold text-xs transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      {showCheckoutSignIn ? "✕ Close" : "Sign In to Auto-Fill →"}
                    </button>
                  </div>

                  {showCheckoutSignIn && (
                    <form onSubmit={handleCheckoutQuickSignIn} className="pt-3 border-t border-[#C9A227]/20 space-y-2.5 animate-in fade-in duration-200">
                      {checkoutAuthError && (
                        <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] rounded-lg">
                          ⚠️ {checkoutAuthError}
                        </div>
                      )}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          value={checkoutAuthInput}
                          onChange={(e) => setCheckoutAuthInput(e.target.value)}
                          placeholder="Mobile Number (e.g. 9840123456) or Email"
                          className="w-full px-3 py-2 bg-white border border-[#E8E2D5] rounded-lg text-xs focus:outline-none focus:border-[#064E3B]"
                        />
                        <input
                          type="text"
                          value={checkoutAuthName}
                          onChange={(e) => setCheckoutAuthName(e.target.value)}
                          placeholder="Your Name (Optional)"
                          className="w-full px-3 py-2 bg-white border border-[#E8E2D5] rounded-lg text-xs focus:outline-none focus:border-[#064E3B]"
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-[#5C635E]">Direct sign in — no OTP password delays.</span>
                        <button
                          type="submit"
                          disabled={isSubmittingCheckoutAuth}
                          className="px-4 py-2 bg-[#C9A227] hover:bg-[#DFC15E] text-[#171A18] rounded-lg font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {isSubmittingCheckoutAuth ? "Signing in..." : "Instant Sign In & Auto-fill"}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">✓</span>
                    <div>
                      <span className="font-bold text-emerald-900 block">
                        Signed In: {customer?.name || "Customer"} {customer?.phone && `(${customer.phone})`}
                      </span>
                      <span className="text-[11px] text-emerald-700">
                        Saved delivery address auto-filled for express Buy Now.
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-white text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                    Verified
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#171A18] uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={info.fullName}
                    onChange={update("fullName")}
                    placeholder="e.g. Priya Sundaram"
                    className="w-full border border-[#E8E2D5] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A227] text-[#171A18]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#171A18] uppercase tracking-wider mb-1.5">Mobile Number *</label>
                  <input
                    type="tel"
                    value={info.mobile}
                    onChange={update("mobile")}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    className="w-full border border-[#E8E2D5] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A227] text-[#171A18]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#171A18] uppercase tracking-wider mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={info.email}
                    onChange={update("email")}
                    placeholder="your@email.com (optional, for tracking updates)"
                    className="w-full border border-[#E8E2D5] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A227] text-[#171A18]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#171A18] uppercase tracking-wider mb-1.5">Address Line (Door/Flat No., Building, Street) *</label>
                  <input
                    type="text"
                    value={info.addressLine}
                    onChange={update("addressLine")}
                    placeholder="No. 12, Gandhi Nagar 2nd Street"
                    className="w-full border border-[#E8E2D5] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A227] text-[#171A18]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#171A18] uppercase tracking-wider mb-1.5">Area / Locality / Landmark</label>
                  <input
                    type="text"
                    value={info.areaLocality}
                    onChange={update("areaLocality")}
                    placeholder="Near Old Bus Stand, Post Office Road"
                    className="w-full border border-[#E8E2D5] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A227] text-[#171A18]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#171A18] uppercase tracking-wider mb-1.5">City / Town *</label>
                  <input
                    type="text"
                    value={info.city}
                    onChange={update("city")}
                    placeholder="e.g. Tiruppur"
                    className="w-full border border-[#E8E2D5] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A227] text-[#171A18]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#171A18] uppercase tracking-wider mb-1.5">PIN / Postal Code *</label>
                  <input
                    type="text"
                    value={info.pincode}
                    onChange={update("pincode")}
                    placeholder="6-digit PIN code"
                    maxLength={6}
                    className="w-full border border-[#E8E2D5] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A227] text-[#171A18]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-[#171A18] uppercase tracking-wider mb-1.5">State *</label>
                  <select
                    value={info.state}
                    onChange={update("state")}
                    className="w-full border border-[#E8E2D5] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A227] bg-white text-[#171A18]"
                  >
                    {indianStates.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {isLoggedIn && (
                <div className="pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-[#171A18] select-none">
                    <input
                      type="checkbox"
                      checked={info.saveAddressToProfile}
                      onChange={handleCheckbox}
                      className="accent-[#064E3B] rounded w-4 h-4"
                    />
                    <span>Save / update this delivery address to my account profile</span>
                  </label>
                </div>
              )}

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
              <div className="border border-[#E8E2D5] rounded-sm p-4 bg-[#FAF8F1]/60 space-y-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-[#064E3B] uppercase tracking-wider">Delivery Address</p>
                  <button onClick={() => setStep(1)} className="text-xs text-[#064E3B] underline font-semibold hover:text-[#0B3D2E]">Edit</button>
                </div>
                <p className="text-sm text-[#171A18] font-bold">{info.fullName}</p>
                <p className="text-xs text-[#4A4D45] mt-0.5 font-medium">{info.addressLine}</p>
                {info.areaLocality && <p className="text-xs text-[#4A4D45]">{info.areaLocality}</p>}
                <p className="text-xs text-[#4A4D45]">{info.city}, {info.state} - <span className="font-semibold">{info.pincode}</span></p>
                <div className="text-xs text-[#4A4D45] pt-1.5 border-t border-[#E8E2D5]/60 flex flex-wrap gap-x-4 gap-y-1">
                  <span>Phone: <strong className="font-mono text-[#171A18]">{info.mobile}</strong></span>
                  {info.email && <span>Email: <span className="text-[#171A18]">{info.email}</span></span>}
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {state.items.map((item, idx) => {
                  const itemImg =
                    item.colorImage ||
                    item.product.coverImage ||
                    item.product.images[0];
                  const itemKey = item.key ? `${item.key}-${idx}` : `${item.product.id}-${item.selectedColor || 'default'}-${item.selectedSize || 'default'}-${idx}`;
                  return (
                    <div key={itemKey} className="flex gap-3 items-center border-b border-[#E8E2D5]/50 pb-3">
                      <div className="w-14 h-16 bg-[#F3EFE3] rounded-sm overflow-hidden shrink-0">
                        <img src={itemImg} alt={item.product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#171A18] truncate">{item.product.name}</p>
                        <p className="text-xs text-[#6A6D65]">Size: {item.selectedSize || "Free Size"} · Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-[#064E3B] shrink-0">₹{((item.unitPrice || item.product.price) * item.quantity).toLocaleString("en-IN")}</p>
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
              {state.items.map((item, idx) => {
                const itemPrice = item.unitPrice !== undefined ? item.unitPrice : (item.product.finalPrice || item.product.price);
                return (
                  <div key={item.key ? `${item.key}-${idx}` : `${item.product.id}-${item.selectedColor || 'default'}-${item.selectedSize || 'default'}-${idx}`} className="flex justify-between text-[#4A4D45] text-xs">
                    <span className="truncate max-w-[150px]">{item.product.name} ×{item.quantity}</span>
                    <span className="shrink-0 ml-2 font-medium">₹{(itemPrice * item.quantity).toLocaleString("en-IN")}</span>
                  </div>
                );
              })}
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
