import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router";
import type { ComboOffer } from "../types/store";

const FALLBACK_COMBO_IMAGES: Record<string, string> = {
  nighty: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=800&fit=crop&auto=format",
  "night-dress": "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=800&fit=crop&auto=format",
  "unstitched-salwar": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=800&fit=crop&auto=format",
  "cord-set": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop&auto=format",
  kurtis: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&h=800&fit=crop&auto=format",
  "salwar-set": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=800&fit=crop&auto=format",
  maxi: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&h=800&fit=crop&auto=format",
};

export default function ComboOfferPopup() {
  const [combos, setCombos] = useState<ComboOffer[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe support for mobile
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Load published and active combo offers from database
  const loadActiveCombos = useCallback(async () => {
    try {
      const res = await fetch("/api/combo-offers");
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        const now = new Date().toISOString().split("T")[0];
        const activeList = data.data.filter((c: ComboOffer) => {
          if (c.status !== "active") return false;
          // Check expiration date if specified
          if (c.endDate && c.endDate < now) return false;
          return true;
        });

        setCombos(activeList);

        if (activeList.length > 0) {
          const activeIdsHash = activeList.map((c: ComboOffer) => c.id).sort().join("|");
          const dismissedHash = sessionStorage.getItem("nithi_combo_popup_dismissed_hash");

          if (dismissedHash !== activeIdsHash) {
            const timer = setTimeout(() => {
              setIsOpen(true);
            }, 1000);
            return () => clearTimeout(timer);
          }
        } else {
          setIsOpen(false);
        }
      }
    } catch (e) {
      console.warn("Could not load combo offers for popup:", e);
    }
  }, []);

  useEffect(() => {
    loadActiveCombos();
    window.addEventListener("focus", loadActiveCombos);
    window.addEventListener("nithi_combo_updated", loadActiveCombos);
    return () => {
      window.removeEventListener("focus", loadActiveCombos);
      window.removeEventListener("nithi_combo_updated", loadActiveCombos);
    };
  }, [loadActiveCombos]);

  // Carousel timer for multiple active offers
  useEffect(() => {
    if (!isOpen || combos.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % combos.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isOpen, combos.length, isPaused]);

  const handleClose = () => {
    setIsOpen(false);
    if (combos.length > 0) {
      const activeIdsHash = combos.map((c) => c.id).sort().join("|");
      sessionStorage.setItem("nithi_combo_popup_dismissed_hash", activeIdsHash);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    // Minimum 40px swipe distance
    if (diff > 40 && combos.length > 1) {
      // Swiped Left -> Next
      setCurrentIndex((prev) => (prev + 1) % combos.length);
    } else if (diff < -40 && combos.length > 1) {
      // Swiped Right -> Previous
      setCurrentIndex((prev) => (prev === 0 ? combos.length - 1 : prev - 1));
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const currentOffer = combos[currentIndex] || combos[0];

  const offerImage = useMemo(() => {
    if (!currentOffer) return FALLBACK_COMBO_IMAGES.nighty;
    const catKey = (currentOffer.category || "nighty").toLowerCase();
    return FALLBACK_COMBO_IMAGES[catKey] || FALLBACK_COMBO_IMAGES.nighty;
  }, [currentOffer]);

  if (!isOpen || !currentOffer || combos.length === 0) {
    return null;
  }

  const targetCategory = currentOffer.category || "nighty";
  const savings = currentOffer.discountValue || (currentOffer.normalTotal - currentOffer.comboPrice);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fade-in font-body select-none"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-[320px] xs:max-w-[360px] sm:max-w-md md:max-w-lg bg-[#FAF8F1] border border-[#C9A227] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up transition-all"
        onClick={(e) => e.stopPropagation()}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Top Gold Shimmer Border Bar */}
        <div className="h-1 w-full gold-gradient-bg" />

        {/* Circular Floating Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-30 w-7 h-7 sm:w-8 sm:h-8 bg-[#171A18]/80 hover:bg-[#064E3B] text-[#FAF8F1] rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold shadow-md transition-transform hover:scale-110 active:scale-90 border border-[#C9A227]/50"
          aria-label="Close Combo Offer Popup"
        >
          ✕
        </button>

        {/* ---------------- COMPACT MOBILE & DESKTOP LAYOUT ---------------- */}
        <div className="flex flex-col md:grid md:grid-cols-12 max-h-[80vh] overflow-y-auto">
          {/* Header Image Hero Container */}
          <div className="md:col-span-5 relative h-28 xs:h-32 sm:h-36 md:h-full md:min-h-[250px] bg-[#064E3B] shrink-0 overflow-hidden">
            <img
              src={offerImage}
              alt={currentOffer.name}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/70 via-black/20 to-transparent" />

            {/* Badges Overlay */}
            <div className="absolute top-2 left-2 flex flex-wrap gap-1 items-center z-10">
              <span className="px-2 py-0.5 rounded-full bg-[#064E3B]/95 text-[#FAF8F1] border border-[#C9A227] text-[8px] font-bold uppercase tracking-[0.14em] shadow-sm">
                ✦ COMBO DEAL
              </span>
              {currentOffer.freeShipping && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#C9A227] text-[#171A18] text-[7px] sm:text-[8px] font-bold uppercase tracking-wider shadow-xs">
                  FREE SHIPPING
                </span>
              )}
            </div>

            {/* Savings Callout on Mobile Image */}
            {savings > 0 && (
              <div className="absolute bottom-2 left-2 z-10 bg-[#FAF8F1]/95 border border-[#C9A227] px-2 py-0.5 rounded-lg shadow-xs md:hidden">
                <span className="text-[9px] font-extrabold text-[#064E3B] uppercase tracking-wide">
                  SAVE ₹{savings.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>

          {/* Details Content Container */}
          <div className="md:col-span-7 p-3.5 xs:p-4 sm:p-5 flex flex-col justify-between space-y-2.5">
            <div className="space-y-1.5 sm:space-y-2">
              {/* Category Tag */}
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-ping" />
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.18em] text-[#C9A227]">
                  Multi-Pack Offer
                </span>
              </div>

              {/* Title */}
              <h2 className="font-display text-sm xs:text-base sm:text-lg font-bold text-[#064E3B] leading-tight">
                {currentOffer.name}
              </h2>

              {/* Offer Detail Card */}
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#FFFFFF] border border-[#E8E2D5] space-y-1.5 text-xs shadow-2xs">
                <div className="flex items-center justify-between text-[#5C635E] text-[10px] sm:text-[11px]">
                  <span>Quantity:</span>
                  <span className="font-bold text-[#171A18] bg-[#FAF8F1] px-1.5 py-0.5 rounded-md border border-[#E8E2D5]">
                    Buy {currentOffer.requiredQuantity} {targetCategory.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-t border-[#E8E2D5]/70 pt-1.5">
                  <span className="text-[#5C635E] text-[10px] sm:text-[11px]">Price:</span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display text-base sm:text-lg font-bold text-[#064E3B]">
                      ₹{currentOffer.comboPrice.toLocaleString("en-IN")}
                    </span>
                    {currentOffer.normalTotal > currentOffer.comboPrice && (
                      <span className="text-[10px] sm:text-[11px] text-[#5C635E] line-through">
                        ₹{currentOffer.normalTotal.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                {savings > 0 && (
                  <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg">
                    <span>Benefit:</span>
                    <span>Save ₹{savings.toLocaleString("en-IN")} Instantly</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions & Carousel Indicators */}
            <div className="space-y-1.5 pt-0.5">
              <Link
                to={`/shop?category=${encodeURIComponent(targetCategory)}`}
                onClick={handleClose}
                className="w-full py-2 sm:py-2.5 bg-[#064E3B] hover:bg-[#0B3D2E] text-[#FAF8F1] rounded-xl font-bold text-[11px] sm:text-xs uppercase tracking-[0.14em] text-center shadow-md shadow-[#064E3B]/20 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-1.5 border border-[#C9A227]/40 block"
              >
                <span>Claim Offer</span>
                <span>→</span>
              </Link>

              {/* Multiple offers carousel controls */}
              {combos.length > 1 && (
                <div className="flex items-center justify-between pt-0.5 text-[9px] sm:text-[10px] text-[#5C635E]">
                  <button
                    type="button"
                    onClick={() =>
                      setCurrentIndex((prev) => (prev === 0 ? combos.length - 1 : prev - 1))
                    }
                    className="font-semibold hover:text-[#064E3B] flex items-center gap-0.5 px-1 py-0.5"
                  >
                    ‹ Prev
                  </button>

                  <div className="flex items-center gap-1">
                    {combos.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1 rounded-full transition-all duration-300 ${
                          currentIndex === idx ? "w-4 bg-[#C9A227]" : "w-1 bg-[#D8D0C0]"
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentIndex((prev) => (prev + 1) % combos.length)}
                    className="font-semibold hover:text-[#064E3B] flex items-center gap-0.5 px-1 py-0.5"
                  >
                    Next ›
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
