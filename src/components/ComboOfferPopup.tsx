import { useState, useEffect } from "react";
import { Link } from "react-router";

export default function ComboOfferPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Only show once per session or when explicitly toggled
    const isDismissed = sessionStorage.getItem("nithi_combo_dismissed");
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setIsOpen(false);
    sessionStorage.setItem("nithi_combo_dismissed", "true");
  };

  if (dismissed && !isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 lg:bottom-6 left-4 z-40 bg-[#1E3A8A] hover:bg-[#1E40AF] text-white px-3.5 py-2 rounded-full shadow-lg border border-blue-400 text-xs font-bold flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
        title="View Active Combo Offers"
      >
        <span>🎁</span>
        <span>Combo Deals</span>
      </button>
    );
  }

  return (
    <>
      {/* Floating Bottom-Left Offer Pill when minimized */}
      {!isOpen && !dismissed && (
        <div className="fixed bottom-20 lg:bottom-6 left-4 z-40 animate-fade-in font-body">
          <div className="relative group flex items-center bg-[#1E3A8A] text-white rounded-2xl shadow-xl border border-blue-400 p-3 pr-8 text-xs">
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-1.5 right-2 text-blue-200 hover:text-white text-xs font-bold p-0.5"
              title="Close"
            >
              ✕
            </button>
            <div
              onClick={() => setIsOpen(true)}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                🎁
              </div>
              <div>
                <p className="font-bold text-xs text-amber-300">Special Combo Offers Active!</p>
                <p className="text-[11px] text-blue-100">Save up to ₹30 per item. Tap to view →</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Combo Offers Modal / Card */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-fade-in font-body">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="bg-[#1E3A8A] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">🎁</span>
                <div>
                  <h3 className="font-collection text-base font-medium text-white">Active Combo Offers</h3>
                  <p className="text-[11px] text-blue-200">Automatically applied at checkout!</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Offer Cards List */}
            <div className="p-4 sm:p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              {/* Offer 1: Salwars */}
              <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E3A8A] flex items-center gap-1.5">
                    <span>👗</span>
                    <span>Salwar Sets Multi-Buy</span>
                  </span>
                  <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-full">
                    Save ₹30 / set
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Buy <strong>2 or more Salwar sets</strong> and get an instant <strong>₹30 discount</strong> on every set.
                </p>
                <Link
                  to="/shop?category=salwar-set"
                  onClick={() => setIsOpen(false)}
                  className="inline-block text-xs font-bold text-[#1E3A8A] hover:underline pt-1"
                >
                  Shop Salwar Sets →
                </Link>
              </div>

              {/* Offer 2: Nighties */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                    <span>🌙</span>
                    <span>Nighties Bulk Value Pack</span>
                  </span>
                  <span className="text-[10px] bg-emerald-600 text-white font-bold px-2 py-0.5 rounded-full">
                    Save ₹15 / item
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Buy <strong>5 or more Nighties</strong> and enjoy a flat <strong>₹15 price reduction</strong> per nighty.
                </p>
                <Link
                  to="/shop?category=nighty"
                  onClick={() => setIsOpen(false)}
                  className="inline-block text-xs font-bold text-emerald-800 hover:underline pt-1"
                >
                  Shop Pure Cotton Nighties →
                </Link>
              </div>

              {/* Offer 3: Free Shipping */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <span>🚚</span>
                    <span>Free Pan-India Delivery</span>
                  </span>
                  <span className="text-[10px] bg-amber-600 text-white font-bold px-2 py-0.5 rounded-full">
                    Orders ₹999+
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Qualify for 100% Free Express Shipping on all orders above ₹999 across all states!
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#1E3A8A] hover:bg-[#1E40AF] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm text-center"
              >
                Got It, Start Shopping
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}