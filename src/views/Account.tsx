import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useCustomerAuth } from "../services/customerAuth";
import type { OrderRecord } from "../types/store";

export default function Account() {
  const { customer, isLoggedIn, login, logout } = useCustomerAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Mode: "signin", "track", "profile", "orders"
  const initialTrackId = searchParams.get("trackId") || searchParams.get("orderId") || "";
  const [trackInput, setTrackInput] = useState(initialTrackId);
  const [trackingOrder, setTrackingOrder] = useState<OrderRecord | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [isSearchingTrack, setIsSearchingTrack] = useState(false);

  // Sign In / Register Form State
  const [authIdentifier, setAuthIdentifier] = useState("");
  const [authName, setAuthName] = useState("");
  const [authOtp, setAuthOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer Orders List
  const [customerOrders, setCustomerOrders] = useState<OrderRecord[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrderModal, setSelectedOrderModal] = useState<OrderRecord | null>(null);

  // If trackId was given in URL, auto-track or auto-fill
  useEffect(() => {
    if (initialTrackId) {
      setTrackInput(initialTrackId);
      handleTrackQuery(initialTrackId);
    }
  }, [initialTrackId]);

  // Load customer orders when logged in
  useEffect(() => {
    if (isLoggedIn && customer) {
      loadCustomerOrders();
    }
  }, [isLoggedIn, customer]);

  const loadCustomerOrders = async () => {
    if (!customer) return;
    setLoadingOrders(true);
    try {
      const q = customer.phone || customer.email || customer.customerId;
      const res = await fetch(`/api/orders?search=${encodeURIComponent(q)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped: OrderRecord[] = json.data.map((o: any) => ({
          id: o.orderId || o.id,
          orderId: o.orderId || o.id,
          customerName: o.customerName || (o.customer?.name ?? "Customer"),
          customerPhone: o.customerPhone || (o.customer?.phone ?? ""),
          customerEmail: o.customerEmail || (o.customer?.email ?? ""),
          items: (o.items || []).map((it: any) => ({
            productId: it.productId,
            productName: it.productName || it.name,
            size: it.selectedSize || it.size || "Free Size",
            color: it.selectedColor || it.color || "Standard",
            quantity: it.quantity || 1,
            price: it.price || 0,
            image: it.image || "",
          })),
          subtotal: o.subtotal || o.total || 0,
          shippingFee: o.shippingFee || 0,
          discount: o.discount || 0,
          total: o.total || 0,
          status: o.orderStatus || o.status || "Pending",
          paymentMethod: o.paymentMethod || "COD",
          shippingState: o.shippingState || "Tamil Nadu",
          shippingAddress: o.shippingAddress || "",
          createdAt: o.createdAt || new Date().toISOString(),
        }));
        setCustomerOrders(mapped);
      }
    } catch (e) {
      console.warn("Could not fetch customer orders:", e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleTrackQuery = async (queryId: string) => {
    const cleanId = queryId.trim();
    if (!cleanId) return;
    setIsSearchingTrack(true);
    setTrackError(null);

    try {
      const res = await fetch(`/api/orders?search=${encodeURIComponent(cleanId)}`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const found = json.data.find(
          (o: any) => (o.orderId || o.id || "").toLowerCase() === cleanId.toLowerCase()
        ) || json.data[0];

        const mapped: OrderRecord = {
          id: found.orderId || found.id,
          orderId: found.orderId || found.id,
          customerName: found.customerName || found.customer?.name || "Customer",
          customerPhone: found.customerPhone || found.customer?.phone || "",
          customerEmail: found.customerEmail || found.customer?.email || "",
          items: (found.items || []).map((it: any) => ({
            productId: it.productId,
            productName: it.productName || it.name,
            size: it.selectedSize || it.size || "Free Size",
            color: it.selectedColor || it.color || "Standard",
            quantity: it.quantity || 1,
            price: it.price || 0,
            image: it.image || "",
          })),
          subtotal: found.subtotal || found.total || 0,
          shippingFee: found.shippingFee || 0,
          discount: found.discount || 0,
          total: found.total || 0,
          status: found.orderStatus || found.status || "Pending",
          paymentMethod: found.paymentMethod || "COD",
          shippingState: found.shippingState || "Tamil Nadu",
          shippingAddress: found.shippingAddress || "",
          createdAt: found.createdAt || new Date().toISOString(),
        };
        setTrackingOrder(mapped);
      } else {
        setTrackError(`No consignment found with Tracking / Order ID "${cleanId}". Please verify your reference number.`);
        setTrackingOrder(null);
      }
    } catch (e) {
      setTrackError("Unable to fetch consignment status. Please try again.");
      setTrackingOrder(null);
    } finally {
      setIsSearchingTrack(false);
    }
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authIdentifier.trim()) {
      setAuthError("Please enter your 10-digit mobile number or email");
      return;
    }
    setAuthError(null);
    setOtpSent(true);
  };

  const handleVerifySignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError(null);

    // Mock OTP verification (any 4-digit code works, or 1234)
    const res = await login(authIdentifier, authName);
    setIsSubmitting(false);

    if (res.success) {
      setOtpSent(false);
      // If there was a pending track ID, resolve it now
      if (trackInput.trim()) {
        handleTrackQuery(trackInput.trim());
      }
    } else {
      setAuthError(res.error || "Authentication failed. Try again.");
    }
  };

  // Helper status color classes
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "Shipped":
        return "bg-teal-100 text-teal-800 border-teal-300";
      case "Packed":
      case "Processing":
        return "bg-indigo-100 text-indigo-800 border-indigo-300";
      case "Confirmed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "Cancelled":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-amber-100 text-amber-800 border-amber-300";
    }
  };

  // Tracking Timeline steps
  const trackingSteps = [
    { label: "Order Placed", key: "Confirmed" },
    { label: "Atelier Processing", key: "Processing" },
    { label: "Quality Inspected & Packed", key: "Packed" },
    { label: "Dispatched (Courier)", key: "Shipped" },
    { label: "Delivered to Doorstep", key: "Delivered" },
  ];

  const getStepProgressIndex = (status: string) => {
    switch (status) {
      case "Pending":
        return 0;
      case "Confirmed":
        return 1;
      case "Processing":
        return 2;
      case "Packed":
        return 3;
      case "Shipped":
        return 4;
      case "Delivered":
        return 5;
      default:
        return 1;
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#FAF8F1] py-10 px-4 sm:px-6 lg:px-8 font-body">
      <div className="max-w-5xl mx-auto">
        {/* Page Top Header */}
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-bold block mb-2">
            ✦ Nithi Collection Client Concierge ✦
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#064E3B] tracking-tight">
            {isLoggedIn ? `Welcome Back, ${customer?.name}` : "Customer Sign In & Consignment Tracking"}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C635E] mt-2 max-w-lg mx-auto">
            Access your curated orders, verify live courier dispatch milestones, and manage your delivery details with ease.
          </p>
        </div>

        {/* Global Live Tracking Search Box */}
        <div className="bg-[#FFFFFF] border-2 border-[#C9A227]/40 rounded-2xl p-6 sm:p-8 shadow-sm mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A227]/5 rounded-bl-full pointer-events-none" />
          <div className="max-w-2xl mx-auto text-center">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F1] border border-[#C9A227] text-[11px] font-bold uppercase tracking-wider text-[#064E3B] mb-3">
              <span>📦</span> Instant Order & Consignment Tracker
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#171A18] mb-2">
              Have an Order or Tracking ID?
            </h2>
            <p className="text-xs text-[#5C635E] mb-5">
              Enter your Order Reference Number (e.g. <span className="font-mono font-bold text-[#064E3B]">ORD-20260924-001</span> or <span className="font-mono font-bold text-[#064E3B]">NC00000001</span>) to inspect live shipping milestones.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTrackQuery(trackInput);
              }}
              className="flex flex-col sm:flex-row gap-2.5 max-w-xl mx-auto"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  placeholder="Enter Tracking ID or Order ID..."
                  className="w-full bg-[#FAF8F1] border border-[#C9A227]/50 rounded-xl px-4 py-3.5 text-sm text-[#171A18] font-mono placeholder:font-sans placeholder-[#8A7060] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:bg-[#FFFFFF]"
                  required
                />
                {trackInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setTrackInput("");
                      setTrackingOrder(null);
                      setTrackError(null);
                    }}
                    className="absolute right-3 top-3.5 text-stone-400 hover:text-stone-700 text-xs p-1"
                  >
                    ✕
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isSearchingTrack}
                className="px-6 py-3.5 bg-[#064E3B] text-[#FAF8F1] hover:bg-[#0B3D2E] text-xs font-bold uppercase tracking-[0.16em] rounded-xl transition-all shadow-md disabled:opacity-50 shrink-0 flex items-center justify-center gap-2"
              >
                {isSearchingTrack ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-[#C9A227]" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Tracking...</span>
                  </>
                ) : (
                  <>
                    <span>🔍 Track Order</span>
                  </>
                )}
              </button>
            </form>

            {trackError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center justify-center gap-2 text-left max-w-xl mx-auto">
                <span>⚠️</span>
                <span>{trackError}</span>
              </div>
            )}
          </div>

          {/* Tracking Result Card */}
          {trackingOrder && (
            <div className="mt-8 border-t border-[#E8E2D5] pt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="max-w-3xl mx-auto bg-[#FAF8F1] border border-[#C9A227]/40 rounded-xl p-5 sm:p-6 text-left">
                {/* Header status bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E2D5] gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#C9A227] font-bold">Consignment Details</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-xs font-mono font-bold text-[#064E3B]">#{trackingOrder.id}</span>
                    </div>
                    <h3 className="font-display font-bold text-lg text-[#171A18]">
                      Shipment for {trackingOrder.customerName}
                    </h3>
                    <p className="text-[11px] text-[#5C635E]">
                      Destination: {trackingOrder.shippingAddress || trackingOrder.shippingState}
                    </p>
                  </div>
                  <div className="flex flex-col sm:items-end gap-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getStatusBadge(trackingOrder.status)}`}>
                      {trackingOrder.status}
                    </span>
                    <span className="text-[10px] text-[#5C635E]">
                      Ordered on {new Date(trackingOrder.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Tracking Milestones Visual Stepper */}
                <div className="py-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#064E3B] block mb-4">
                    Live Dispatch Progress:
                  </span>
                  <div className="relative">
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {trackingSteps.map((st, idx) => {
                        const currentIdx = getStepProgressIndex(trackingOrder.status);
                        const isDone = currentIdx >= idx + 1;
                        const isCurrent = currentIdx === idx + 1;

                        return (
                          <div
                            key={st.key}
                            className={`p-3 rounded-xl border text-center transition-all ${
                              isCurrent
                                ? "bg-[#064E3B] text-[#FAF8F1] border-[#C9A227] shadow-md scale-102"
                                : isDone
                                ? "bg-white text-[#064E3B] border-emerald-300"
                                : "bg-stone-50 text-stone-400 border-stone-200 opacity-60"
                            }`}
                          >
                            <div className={`w-7 h-7 mx-auto mb-1.5 rounded-full flex items-center justify-center text-xs font-bold ${
                              isCurrent
                                ? "bg-[#C9A227] text-[#064E3B]"
                                : isDone
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-stone-200 text-stone-500"
                            }`}>
                              {isDone ? "✓" : idx + 1}
                            </div>
                            <span className="text-[11px] font-bold block leading-tight">{st.label}</span>
                            {isCurrent && (
                              <span className="text-[9px] uppercase tracking-wider text-[#C9A227] font-semibold block mt-1">
                                Current Stage
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Items in this order */}
                <div className="pt-4 border-t border-[#E8E2D5]">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#5C635E] block mb-2">
                    Ensembles in Consignment ({trackingOrder.items.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {trackingOrder.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-[#E8E2D5]">
                        {item.image && (
                          <img src={item.image} alt={item.productName} className="w-12 h-14 object-cover rounded-md border border-stone-200" />
                        )}
                        <div className="text-xs">
                          <p className="font-bold text-[#171A18] line-clamp-1">{item.productName}</p>
                          <p className="text-[10px] text-[#5C635E]">
                            Size: <span className="font-semibold text-[#064E3B]">{item.size}</span> • Qty: {item.quantity}
                          </p>
                          <p className="text-xs font-bold text-[#064E3B] mt-0.5">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dispatch note */}
                <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-[11px] text-amber-900 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="font-bold">Courier Partner:</span> ST Courier & India Post Registered Parcel
                  </div>
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-[#064E3B] hover:text-[#C9A227] underline"
                  >
                    Need Expedited Delivery Support? Chat on WhatsApp →
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Section: Logged In Account Dashboard OR Sign In / Register Portal */}
        {isLoggedIn && customer ? (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Customer Profile Banner */}
            <div className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-2xl p-6 sm:p-7 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#064E3B] border-2 border-[#C9A227] flex items-center justify-center text-2xl font-display font-bold text-[#C9A227] shadow-md">
                  {customer.name.slice(0, 1).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-xl sm:text-2xl font-bold text-[#171A18]">
                      {customer.name}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F1] border border-[#C9A227] text-[10px] font-bold uppercase tracking-wider text-[#064E3B]">
                      Verified Shopper
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#5C635E] mt-1 font-mono">
                    {customer.phone && <span>📞 {customer.phone}</span>}
                    {customer.email && <span>✉️ {customer.email}</span>}
                    <span>🆔 {customer.customerId}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center">
                <Link
                  to="/shop"
                  className="px-4 py-2.5 bg-[#064E3B] text-[#FAF8F1] hover:bg-[#0B3D2E] text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs"
                >
                  Browse Shop
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="px-4 py-2.5 border border-stone-300 hover:border-stone-400 text-stone-700 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-stone-50 transition-all"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Customer Orders History Section */}
            <div className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-2xl p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E8E2D5] mb-6 gap-3">
                <div>
                  <h3 className="font-display text-xl font-bold text-[#171A18]">
                    Your Purchase History & Consignments
                  </h3>
                  <p className="text-xs text-[#5C635E] mt-0.5">
                    Click any order reference or "Track" button to inspect live packing and courier status.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={loadCustomerOrders}
                  className="text-xs font-bold text-[#064E3B] hover:text-[#C9A227] inline-flex items-center gap-1 self-start sm:self-auto"
                >
                  <span>🔄 Refresh Orders</span>
                </button>
              </div>

              {loadingOrders ? (
                <div className="py-12 text-center text-xs text-[#5C635E]">
                  <svg className="animate-spin h-6 w-6 text-[#C9A227] mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  <span>Fetching your orders...</span>
                </div>
              ) : customerOrders.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#5C635E] space-y-3">
                  <div className="text-4xl">🛍️</div>
                  <p className="font-display text-base font-bold text-[#171A18]">No orders found yet</p>
                  <p className="max-w-xs mx-auto">
                    You haven't placed an order with this phone/email yet. Explore our handcrafted cotton nighties and unstitched suits.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-block px-5 py-2.5 bg-[#064E3B] text-[#FAF8F1] text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs hover:bg-[#0B3D2E] transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {customerOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="border border-[#E8E2D5] rounded-xl p-4 sm:p-5 hover:border-[#C9A227] transition-all bg-[#FAF8F1]/40"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E8E2D5] gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-[#064E3B]">#{ord.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(ord.status)}`}>
                            {ord.status}
                          </span>
                        </div>
                        <div className="text-xs text-[#5C635E]">
                          Placed on: {new Date(ord.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 overflow-x-auto">
                          {ord.items.slice(0, 3).map((it, idx) => (
                            <div key={idx} className="flex items-center gap-2 shrink-0">
                              {it.image && (
                                <img src={it.image} alt={it.productName} className="w-10 h-12 object-cover rounded-md border border-stone-200" />
                              )}
                              <div className="text-xs">
                                <p className="font-bold text-[#171A18] max-w-[140px] truncate">{it.productName}</p>
                                <p className="text-[10px] text-[#5C635E]">Qty: {it.quantity} • {it.size}</p>
                              </div>
                            </div>
                          ))}
                          {ord.items.length > 3 && (
                            <span className="text-xs font-semibold text-stone-500">
                              +{ord.items.length - 3} more
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-4 justify-between sm:justify-end">
                          <div className="text-right">
                            <span className="text-[10px] text-[#5C635E] uppercase block">Total</span>
                            <span className="font-display font-bold text-sm text-[#064E3B]">
                              ₹{ord.total.toLocaleString("en-IN")}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setTrackInput(ord.id);
                                handleTrackQuery(ord.id);
                                window.scrollTo({ top: 120, behavior: "smooth" });
                              }}
                              className="px-3.5 py-2 bg-[#064E3B] text-[#FAF8F1] hover:bg-[#0B3D2E] text-xs font-bold uppercase tracking-wider rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                            >
                              <span>🚚 Track Consignment</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSelectedOrderModal(ord)}
                              className="px-3 py-2 border border-stone-300 hover:border-stone-400 text-stone-700 text-xs font-bold rounded-lg hover:bg-stone-50 transition-colors"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Customer Sign In / Verification Portal */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Sign In Form */}
            <div className="bg-[#FFFFFF] border-2 border-[#C9A227]/30 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#C9A227] block mb-1">
                  Customer Portal
                </span>
                <h3 className="font-display text-2xl font-bold text-[#064E3B]">
                  Sign In to My Account
                </h3>
                <p className="text-xs text-[#5C635E] mt-1">
                  Enter your mobile number or email to automatically sync your previous bookings, wishlists, and delivery addresses.
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl mb-4">
                  ⚠️ {authError}
                </div>
              )}

              {!otpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
                      Mobile Number or Email Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={authIdentifier}
                      onChange={(e) => setAuthIdentifier(e.target.value)}
                      placeholder="e.g. 9840123456 or customer@example.com"
                      className="w-full bg-[#FAF8F1] border border-[#E8E2D5] focus:border-[#C9A227] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#171A18] focus:outline-none transition-colors"
                    />
                    <p className="text-[10px] text-[#5C635E] mt-1">
                      No complex passwords required. Quick verification via instant OTP slip.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
                      Your Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Priya Rajendran"
                      className="w-full bg-[#FAF8F1] border border-[#E8E2D5] focus:border-[#C9A227] focus:bg-white rounded-xl px-4 py-3 text-sm text-[#171A18] focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#064E3B] text-[#FAF8F1] hover:bg-[#0B3D2E] text-xs font-bold uppercase tracking-[0.16em] rounded-xl shadow-md transition-all mt-2"
                  >
                    Continue with OTP Verification →
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifySignIn} className="space-y-4">
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                    <p className="font-bold">Verification code sent to {authIdentifier}</p>
                    <p className="text-[11px] text-amber-700 mt-0.5">Demo instant code: enter any 4 digits (e.g. 1234)</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#171A18] uppercase tracking-wider mb-1.5">
                      Enter 4-Digit OTP Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={authOtp}
                      onChange={(e) => setAuthOtp(e.target.value)}
                      placeholder="1 2 3 4"
                      autoFocus
                      className="w-full bg-[#FAF8F1] border border-[#C9A227] focus:bg-white rounded-xl px-4 py-3 text-center text-lg font-mono tracking-widest text-[#171A18] focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="flex-1 py-3 border border-stone-300 text-stone-700 text-xs font-bold uppercase rounded-xl hover:bg-stone-50"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-[#064E3B] text-[#FAF8F1] hover:bg-[#0B3D2E] text-xs font-bold uppercase tracking-wider rounded-xl shadow-md transition-all disabled:opacity-50"
                    >
                      {isSubmitting ? "Verifying..." : "Verify & Sign In"}
                    </button>
                  </div>
                </form>
              )}

              {/* Quick Demo Customer Sign In */}
              <div className="mt-8 pt-6 border-t border-[#E8E2D5]">
                <span className="text-[10px] uppercase font-bold text-[#5C635E] tracking-wider block mb-2">
                  Instant One-Click Customer Login:
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Priya Rajendran", phone: "+91 98401 23456" },
                    { name: "Saranya Devi", phone: "+91 97890 54321" },
                  ].map((demo) => (
                    <button
                      key={demo.phone}
                      type="button"
                      onClick={async () => {
                        await login(demo.phone, demo.name);
                        if (trackInput.trim()) handleTrackQuery(trackInput.trim());
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#FAF8F1] border border-[#C9A227]/40 hover:bg-[#C9A227]/10 text-xs text-[#064E3B] font-semibold transition-colors"
                    >
                      👤 {demo.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Why Create / Sign In Account Benefits Card */}
            <div className="bg-[#0B3D2E] text-[#FAF8F1] rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-[#C9A227]/30 shadow-md">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-bold block mb-2">
                Boutique Privileges
              </span>
              <h3 className="font-display text-2xl font-bold text-[#FAF8F1] mb-4">
                Why Sign In with Nithi Collection?
              </h3>

              <ul className="space-y-4 text-xs text-[#FAF8F1]/85">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#C9A227] text-[#064E3B] flex items-center justify-center font-bold shrink-0 text-xs">
                    ✦
                  </span>
                  <div>
                    <strong className="text-white block">Automated Consignment Updates:</strong>
                    Direct SMS & WhatsApp courier dispatch tracking links for every order placed.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#C9A227] text-[#064E3B] flex items-center justify-center font-bold shrink-0 text-xs">
                    ✦
                  </span>
                  <div>
                    <strong className="text-white block">Speedy 1-Click Checkout:</strong>
                    Saved delivery addresses across Tamil Nadu, Kerala, Karnataka, and Pan-India.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#C9A227] text-[#064E3B] flex items-center justify-center font-bold shrink-0 text-xs">
                    ✦
                  </span>
                  <div>
                    <strong className="text-white block">Advance Booking & COD Status:</strong>
                    Inspect nominal UPI token advances and reserve handloom collections ahead of time.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#C9A227] text-[#064E3B] flex items-center justify-center font-bold shrink-0 text-xs">
                    ✦
                  </span>
                  <div>
                    <strong className="text-white block">Order Invoices & Tax Slips:</strong>
                    Download GST compliant packing slips anytime for tailoring or gifting.
                  </div>
                </li>
              </ul>

              <div className="mt-8 p-4 rounded-xl bg-black/20 border border-[#C9A227]/30 text-xs text-[#C9A227] flex items-center justify-between">
                <span>Need immediate concierge support?</span>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold underline hover:text-white"
                >
                  WhatsApp Us →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrderModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 text-stone-800 text-xs animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#C9A227] tracking-wider block">
                    Order Confirmation Summary
                  </span>
                  <h3 className="font-display font-bold text-lg text-stone-900">
                    Order #{selectedOrderModal.id}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOrderModal(null)}
                  className="text-stone-400 hover:text-stone-700 text-sm p-1 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-3 bg-stone-50 rounded-xl space-y-1">
                  <p className="font-bold text-stone-900">{selectedOrderModal.customerName}</p>
                  <p className="text-stone-600">{selectedOrderModal.shippingAddress}</p>
                  <p className="font-mono text-stone-500 text-[11px]">📞 {selectedOrderModal.customerPhone}</p>
                </div>

                <div>
                  <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px] block mb-2">
                    Items ({selectedOrderModal.items.length})
                  </span>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedOrderModal.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-stone-50 rounded-lg">
                        <div className="flex items-center gap-2.5">
                          {it.image && (
                            <img src={it.image} alt={it.productName} className="w-10 h-12 object-cover rounded border" />
                          )}
                          <div>
                            <p className="font-bold text-stone-900 line-clamp-1">{it.productName}</p>
                            <p className="text-[10px] text-stone-500">Size: {it.size} | Qty: {it.quantity}</p>
                          </div>
                        </div>
                        <span className="font-bold text-stone-900">₹{(it.price * it.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-200 space-y-1 text-xs">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal:</span>
                    <span>₹{selectedOrderModal.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Shipping Fee:</span>
                    <span>₹{selectedOrderModal.shippingFee}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 text-sm pt-2 border-t">
                    <span>Total:</span>
                    <span className="text-[#064E3B]">₹{selectedOrderModal.total.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setTrackInput(selectedOrderModal.id);
                    setSelectedOrderModal(null);
                    handleTrackQuery(selectedOrderModal.id);
                    window.scrollTo({ top: 120, behavior: "smooth" });
                  }}
                  className="px-4 py-2 bg-[#064E3B] text-[#FAF8F1] text-xs font-bold rounded-xl hover:bg-[#0B3D2E]"
                >
                  Track This Consignment
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedOrderModal(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 text-xs font-bold rounded-xl hover:bg-stone-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
