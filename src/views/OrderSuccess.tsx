import { Link, useSearchParams } from "react-router";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId") || "NC00000001";
  const total = params.get("total") || "0";
  const method = params.get("method") || "online";
  const isCOD = method === "cod";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-body bg-[#FDFBF7]">
      <div className="max-w-lg w-full text-center">
        {/* Order Confirmed Checkmark Animation */}
        <div className="w-18 h-18 bg-[#064E3B] border-4 border-[#C9A227]/40 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg text-white">
          <svg className="w-9 h-9 text-amber-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <span className="inline-block bg-emerald-100 text-[#064E3B] text-xs uppercase tracking-wider font-bold px-3 py-1 rounded-full mb-2">
          Order Successfully Placed
        </span>
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#064E3B] mb-2 tracking-tight">
          Thank You For Your Order!
        </h1>
        <p className="text-slate-600 text-xs sm:text-sm mb-6 max-w-md mx-auto leading-relaxed">
          Your order has been confirmed with Nithi Collections. A receipt confirmation has been dispatched.
        </p>

        {/* Order Details Card */}
        <div className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-2xl p-5 sm:p-6 text-left space-y-3 mb-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-2.5">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Order ID</span>
            <span className="text-sm font-bold text-[#064E3B] font-mono">#{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Total Amount</span>
            <span className="text-base font-bold text-[#0F172A]">₹{Number(total).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Payment Method</span>
            <span className="text-xs font-semibold text-[#0F172A] px-2.5 py-0.5 rounded-full bg-slate-100">
              {isCOD ? "Cash on Delivery (10% Advance)" : "Online Prepaid (UPI / Cards)"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Estimated Dispatch</span>
            <span className="text-xs font-semibold text-emerald-700">2–4 business days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 uppercase tracking-wider">Order Status</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              Confirmed & Packing
            </span>
          </div>
        </div>

        {isCOD && (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 mb-6 text-xs text-[#0F172A] text-left space-y-1">
            <p className="font-bold text-[#064E3B] flex items-center gap-1.5">
              <span>✦</span> Cash on Delivery Information
            </p>
            <p className="text-slate-600 leading-relaxed">
              Your 10% advance is recorded and the remaining 90% balance is payable in cash upon parcel delivery to your doorstep.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={`/account?trackId=${encodeURIComponent(orderId)}`}
            className="flex-1 border-2 border-[#064E3B] text-[#064E3B] py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-emerald-50 rounded-xl transition-colors"
          >
            Track My Order (#{orderId})
          </Link>
          <Link
            to="/shop"
            className="flex-1 bg-[#064E3B] text-white py-3.5 text-xs font-bold uppercase tracking-wider hover:bg-[#0B3D2E] rounded-xl shadow-md transition-colors"
          >
            Continue Shopping →
          </Link>
        </div>

        <p className="mt-8 text-xs text-slate-500">
          Need order assistance or delivery questions? Contact our customer support at{" "}
          <a
            href="tel:8122436850"
            className="text-[#064E3B] font-bold underline hover:text-[#0B3D2E]"
          >
            8122436850
          </a>{" "}
          /{" "}
          <a
            href="tel:9345136762"
            className="text-[#064E3B] font-bold underline hover:text-[#0B3D2E]"
          >
            9345136762
          </a>
        </p>
      </div>
    </div>
  );
}
