import { Link, useSearchParams } from "react-router";

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const orderId = params.get("orderId") || "NC00000001";
  const total = params.get("total") || "0";
  const method = params.get("method") || "online";
  const isCOD = method === "cod";

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-body bg-[#FAF8F1]">
      <div className="max-w-lg w-full text-center">
        {/* Luxury Gold Insignia Animation */}
        <div className="w-20 h-20 bg-[#064E3B] border-2 border-[#C9A227] rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
          <svg className="w-10 h-10 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <p className="text-[#C9A227] text-xs uppercase tracking-[0.3em] font-semibold mb-2">
          Boutique Order Confirmed
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#064E3B] mb-2 tracking-tight">
          Thank You For Choosing Us
        </h1>
        <p className="text-[#5C635E] text-xs sm:text-sm mb-8 max-w-md mx-auto leading-relaxed">
          Your order has been safely placed with Nithi Collection. A dispatch confirmation slip and tracking link
          will be sent via SMS & WhatsApp.
        </p>

        {/* Order Details Card */}
        <div className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-xs p-6 text-left space-y-3.5 mb-8 shadow-xs">
          <div className="flex justify-between items-center border-b border-[#E8E2D5] pb-3">
            <span className="text-xs text-[#5C635E] uppercase tracking-wider font-semibold">Order Reference</span>
            <span className="text-sm font-bold text-[#064E3B] font-mono">#{orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#5C635E] uppercase tracking-wider">Total Amount Paid</span>
            <span className="text-sm font-bold text-[#064E3B]">₹{Number(total).toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#5C635E] uppercase tracking-wider">Payment Mode</span>
            <span className="text-xs font-semibold text-[#171A18] px-2.5 py-0.5 rounded-xs bg-[#F3EFE3]">
              {isCOD ? "Cash on Delivery" : "Online Prepaid (UPI / Card)"}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#5C635E] uppercase tracking-wider">Estimated Dispatch</span>
            <span className="text-xs font-semibold text-[#171A18]">2–4 business days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-[#5C635E] uppercase tracking-wider">Status</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-xs font-bold">
              Processing in Atelier
            </span>
          </div>
        </div>

        {isCOD && (
          <div className="bg-[#FAF8F1] border border-[#C9A227] rounded-xs p-4 mb-8 text-xs text-[#171A18] text-left space-y-1">
            <p className="font-bold text-[#064E3B] flex items-center gap-1.5">
              <span>✦</span> Cash on Delivery Confirmation Notice
            </p>
            <p className="text-[#5C635E] leading-relaxed">
              Our concierge team will verify your address and coordinate the standard nominal advance via UPI prior to
              courier dispatch to reserve your garments.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={`/account?trackId=${encodeURIComponent(orderId)}`}
            className="flex-1 border border-[#064E3B] text-[#064E3B] py-3.5 text-xs font-bold uppercase tracking-[0.16em] hover:bg-[#064E3B] hover:text-[#FAF8F1] rounded-xs transition-colors"
          >
            Track My Order (#{orderId})
          </Link>
          <Link
            to="/shop"
            className="flex-1 bg-[#064E3B] text-[#FAF8F1] py-3.5 text-xs font-bold uppercase tracking-[0.16em] hover:bg-[#0B3D2E] rounded-xs shadow-xs transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        <p className="mt-8 text-xs text-[#5C635E]">
          Need sizing assistance or order questions?{" "}
          <a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noreferrer"
            className="text-[#064E3B] font-bold underline hover:text-[#C9A227]"
          >
            WhatsApp Client Concierge
          </a>
        </p>
      </div>
    </div>
  );
}
