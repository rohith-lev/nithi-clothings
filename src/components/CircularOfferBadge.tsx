import { useState, useEffect } from "react";
import { Link } from "react-router";

export default function CircularOfferBadge() {
  const [enabled, setEnabled] = useState(true);
  const [badgeText, setBadgeText] = useState("• LIMITED OFFER • SHOP NOW • NITHI COLLECTION • ");
  const [badgeLink, setBadgeLink] = useState("/shop?filter=sale");
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const raw = localStorage.getItem("nithi_db_settings_v4");
        if (raw) {
          const settings = JSON.parse(raw);
          if (settings.circularBadgeEnabled !== undefined) {
            setEnabled(settings.circularBadgeEnabled);
          }
          if (settings.circularBadgeText) {
            setBadgeText(settings.circularBadgeText);
          }
          if (settings.circularBadgeLink) {
            setBadgeLink(settings.circularBadgeLink);
          }
        }
      } catch (e) {
        console.warn("Could not load circular badge settings:", e);
      }
    };

    loadSettings();
    window.addEventListener("nithi_settings_updated", loadSettings);
    return () => window.removeEventListener("nithi_settings_updated", loadSettings);
  }, []);

  if (!enabled || dismissed) return null;

  return (
    <div className="fixed bottom-24 left-6 z-40 hidden sm:block font-body">
      <div className="relative group">
        {/* Dismiss button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setDismissed(true);
          }}
          className="absolute -top-1 -right-1 z-50 h-5 w-5 rounded-full bg-[#171A18] text-[#FAF8F1] hover:bg-[#C9A227] hover:text-[#171A18] flex items-center justify-center text-[10px] shadow-sm transition-colors"
          title="Dismiss offer badge"
          aria-label="Dismiss offer badge"
        >
          ✕
        </button>

        <Link
          to={badgeLink}
          className="relative flex items-center justify-center w-20 h-20 rounded-full bg-[#064E3B] text-[#FAF8F1] border-2 border-[#C9A227] shadow-xl hover:scale-105 transition-all duration-300"
          title="Click to view special offers"
        >
          {/* Rotating Circular Text SVG */}
          <svg
            className="animate-spin-slow absolute inset-0 w-full h-full p-1"
            viewBox="0 0 100 100"
          >
            <path
              id="circularOfferPath"
              d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              fill="transparent"
            />
            <text className="text-[9px] font-bold tracking-[0.2em] uppercase fill-[#C9A227]">
              <textPath href="#circularOfferPath" startOffset="0%">
                {badgeText}
              </textPath>
            </text>
          </svg>

          {/* Center Icon & Sale Tag */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <span className="text-xs">✨</span>
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#FAF8F1] leading-none mt-0.5">
              OFFER
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
