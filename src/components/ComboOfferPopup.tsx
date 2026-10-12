import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router";
import type { ComboOffer } from "../types/store";

const SESSION_DISMISSED_KEY = "nithi_combo_popup_dismissed_session";

const FALLBACK_CATEGORY_IMAGES: Record<string, string> = {
  nighty: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=900&fit=crop&auto=format",
  nighties: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=900&fit=crop&auto=format",
  "night-dress": "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=900&fit=crop&auto=format",
  "unstitched-salwar": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=900&fit=crop&auto=format",
  "cord-set": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=900&fit=crop&auto=format",
  kurtis: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=900&fit=crop&auto=format",
  "salwar-set": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=900&fit=crop&auto=format",
  maxi: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=900&fit=crop&auto=format",
  default: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=900&fit=crop&auto=format",
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeLeft(endDateStr?: string): TimeLeft {
  if (!endDateStr) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
  }

  let endTime: number;
  if (endDateStr.length === 10) {
    endTime = new Date(`${endDateStr}T23:59:59`).getTime();
  } else {
    endTime = new Date(endDateStr).getTime();
  }

  if (isNaN(endTime)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false };
  }

  const now = Date.now();
  const diff = endTime - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds, isExpired: false };
}

export default function ComboOfferPopup() {
  const [combos, setCombos] = useState<ComboOffer[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: false });

  // Load active combo offers from API
  const loadCombos = useCallback(async () => {
    try {
      // Check session dismissal first
      const isDismissed = sessionStorage.getItem(SESSION_DISMISSED_KEY);
      if (isDismissed === "true") {
        setIsOpen(false);
        return;
      }

      const res = await fetch("/api/combo-offers?activeOnly=true");
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        setCombos([]);
        setIsOpen(false);
        return;
      }
      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        setCombos([]);
        setIsOpen(false);
        return;
      }
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        setCombos(data.data);
        // Show once per session with a smooth entrance
        if (!isDismissed) {
          const timer = setTimeout(() => {
            setIsOpen(true);
          }, 800);
          return () => clearTimeout(timer);
        }
      } else {
        setCombos([]);
        setIsOpen(false);
      }
    } catch {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    loadCombos();
    window.addEventListener("nithi_combo_updated", loadCombos);
    window.addEventListener("focus", loadCombos);
    return () => {
      window.removeEventListener("nithi_combo_updated", loadCombos);
      window.removeEventListener("focus", loadCombos);
    };
  }, [loadCombos]);

  const currentOffer: ComboOffer | undefined = combos[currentIndex] || combos[0];

  // Live 1-second countdown timer
  useEffect(() => {
    if (!currentOffer || !isOpen) return;

    // Initial calculation
    const initial = calculateTimeLeft(currentOffer.endDate);
    setTimeLeft(initial);

    if (initial.isExpired) {
      setIsOpen(false);
      return;
    }

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft(currentOffer.endDate);
      setTimeLeft(remaining);
      if (remaining.isExpired) {
        setIsOpen(false);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentOffer, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    try {
      sessionStorage.setItem(SESSION_DISMISSED_KEY, "true");
    } catch {}
  };

  const offerImage = useMemo(() => {
    if (!currentOffer) return FALLBACK_CATEGORY_IMAGES.default;
    if (currentOffer.image && currentOffer.image.trim()) {
      return currentOffer.image.trim();
    }
    const catKey = (currentOffer.category || "").toLowerCase().trim();
    return FALLBACK_CATEGORY_IMAGES[catKey] || FALLBACK_CATEGORY_IMAGES.default;
  }, [currentOffer]);

  if (!isOpen || !currentOffer || timeLeft.isExpired) {
    return null;
  }

  const targetCategory = currentOffer.category || "nighty";
  const savings = currentOffer.discountValue || Math.max(0, currentOffer.normalTotal - currentOffer.comboPrice);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs font-body animate-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="combo-offer-title"
    >
      <div
        className="relative w-full max-w-sm sm:max-w-md md:max-w-xl bg-[#FAF8F1] border border-[#C9A227]/70 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Gold Accent Border */}
        <div className="h-1 w-full bg-gradient-to-r from-[#064E3B] via-[#C9A227] to-[#064E3B]" />

        {/* Circular Floating Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-30 w-7 h-7 sm:w-8 sm:h-8 bg-[#171A18]/80 hover:bg-[#064E3B] text-[#FAF8F1] rounded-full flex items-center justify-center text-xs font-bold shadow-md transition-all hover:scale-105 active:scale-95 border border-[#C9A227]/40 cursor-pointer focus:outline-none"
          aria-label="Close Combo Offer"
        >
          ✕
        </button>

        {/* Modal Body: Responsive Layout */}
        <div className="flex flex-col sm:grid sm:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left: Dress Showcase Image */}
          <div className="sm:col-span-5 relative h-36 xs:h-40 sm:h-full sm:min-h-[280px] bg-[#064E3B] overflow-hidden">
            <img
              src={offerImage}
              alt={currentOffer.name}
              className="w-full h-full object-cover object-center"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

            {/* Badge Overlay */}
            <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 z-10">
              <span className="px-2.5 py-0.5 rounded-full bg-[#064E3B] text-[#FAF8F1] border border-[#C9A227] text-[9px] font-bold uppercase tracking-wider shadow-sm">
                ✦ SPECIAL COMBO
              </span>
              {currentOffer.freeShipping && (
                <span className="px-2 py-0.5 rounded-full bg-[#C9A227] text-[#064E3B] text-[8px] font-extrabold uppercase tracking-wider shadow-2xs">
                  FREE SHIPPING
                </span>
              )}
            </div>

            {/* Savings Callout on Image */}
            {savings > 0 && (
              <div className="absolute bottom-2.5 left-2.5 z-10 bg-[#064E3B]/90 backdrop-blur-xs border border-[#C9A227] px-2.5 py-1 rounded-lg text-[#FAF8F1] shadow-xs">
                <span className="text-[10px] sm:text-xs font-bold text-[#C9A227] uppercase tracking-wide block leading-none">
                  SAVE ₹{savings.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>

          {/* Right: Offer Details, Countdown & CTA */}
          <div className="sm:col-span-7 p-4 sm:p-5 flex flex-col justify-between space-y-3">
            <div className="space-y-2">
              {/* Category & Status Header */}
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                  Limited Time Multi-Pack Deal
                </span>
              </div>

              {/* Offer Title */}
              <h3
                id="combo-offer-title"
                className="font-display text-base sm:text-lg font-bold text-[#064E3B] leading-snug"
              >
                {currentOffer.name}
              </h3>

              {currentOffer.description && (
                <p className="text-xs text-[#5C635E] line-clamp-2 leading-relaxed">
                  {currentOffer.description}
                </p>
              )}

              {/* Pricing Box */}
              <div className="p-3 rounded-xl bg-[#FFFFFF] border border-[#E8E2D5] space-y-1.5 shadow-2xs">
                <div className="flex items-center justify-between text-xs text-[#5C635E]">
                  <span>Package:</span>
                  <span className="font-bold text-[#171A18] bg-[#FAF8F1] px-2 py-0.5 rounded-md border border-[#E8E2D5]">
                    Buy Any {currentOffer.requiredQuantity} Dresses
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-t border-[#E8E2D5]/70 pt-1.5">
                  <span className="text-xs text-[#5C635E]">Special Price:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-lg sm:text-xl font-bold text-[#064E3B]">
                      ₹{currentOffer.comboPrice.toLocaleString("en-IN")}
                    </span>
                    {currentOffer.normalTotal > currentOffer.comboPrice && (
                      <span className="text-xs text-[#5C635E] line-through">
                        ₹{currentOffer.normalTotal.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* 4-Box Countdown Section */}
              {currentOffer.endDate && !timeLeft.isExpired && (
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C635E] block text-center">
                    ⚡ Offer Ends In
                  </span>
                  <div className="grid grid-cols-4 gap-1.5 text-center">
                    {/* DAYS */}
                    <div className="bg-[#064E3B] text-[#FAF8F1] rounded-lg p-1.5 border border-[#C9A227]/40 shadow-2xs">
                      <span className="font-display text-sm sm:text-base font-bold block leading-tight text-[#FAF8F1]">
                        {formatNumber(timeLeft.days)}
                      </span>
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-[#C9A227] block">
                        DAYS
                      </span>
                    </div>

                    {/* HOURS */}
                    <div className="bg-[#064E3B] text-[#FAF8F1] rounded-lg p-1.5 border border-[#C9A227]/40 shadow-2xs">
                      <span className="font-display text-sm sm:text-base font-bold block leading-tight text-[#FAF8F1]">
                        {formatNumber(timeLeft.hours)}
                      </span>
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-[#C9A227] block">
                        HOURS
                      </span>
                    </div>

                    {/* MINS */}
                    <div className="bg-[#064E3B] text-[#FAF8F1] rounded-lg p-1.5 border border-[#C9A227]/40 shadow-2xs">
                      <span className="font-display text-sm sm:text-base font-bold block leading-tight text-[#FAF8F1]">
                        {formatNumber(timeLeft.minutes)}
                      </span>
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-[#C9A227] block">
                        MINS
                      </span>
                    </div>

                    {/* SECS */}
                    <div className="bg-[#064E3B] text-[#FAF8F1] rounded-lg p-1.5 border border-[#C9A227]/40 shadow-2xs">
                      <span className="font-display text-sm sm:text-base font-bold block leading-tight text-[#C9A227]">
                        {formatNumber(timeLeft.seconds)}
                      </span>
                      <span className="text-[8px] font-semibold uppercase tracking-wider text-[#FAF8F1]/80 block">
                        SECS
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Prominent Action Button */}
            <div className="pt-1">
              <Link
                to={`/shop?category=${encodeURIComponent(targetCategory)}`}
                onClick={handleClose}
                className="w-full py-2.5 sm:py-3 bg-gradient-to-r from-[#064E3B] to-[#0B3D2E] hover:from-[#0B3D2E] hover:to-[#064E3B] text-[#FAF8F1] rounded-xl font-bold text-xs uppercase tracking-[0.14em] text-center shadow-md shadow-[#064E3B]/20 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 border border-[#C9A227]/50 block cursor-pointer"
              >
                <span>Grab This Offer</span>
                <span className="text-[#C9A227]">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
