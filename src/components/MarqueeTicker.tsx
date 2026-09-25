import { useState, useEffect } from "react";
import { Link } from "react-router";

export default function MarqueeTicker() {
  const [tickerItems, setTickerItems] = useState<string[]>([
    "COMPLIMENTARY EXPRESS SHIPPING ON ORDERS ABOVE ₹999",
    "NEW ARRIVALS: PURE COTTON & SILK FESTIVE COUTURE",
    "CASH ON DELIVERY AVAILABLE PAN-INDIA",
    "EXCLUSIVE COMBO OFFERS: BUY 3 NIGHTIES & GET FREE SHIPPING",
    "USE CODE NITHI10 FOR 10% OFF ON FIRST PURCHASE",
  ]);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    const loadSettings = () => {
      try {
        const raw = localStorage.getItem("nithi_db_settings_v4");
        if (raw) {
          const settings = JSON.parse(raw);
          if (settings.marqueeEnabled !== undefined) {
            setEnabled(settings.marqueeEnabled);
          }
          if (settings.marqueeTexts && Array.isArray(settings.marqueeTexts) && settings.marqueeTexts.length > 0) {
            setTickerItems(settings.marqueeTexts);
          }
        }
      } catch (e) {
        console.warn("Could not load marquee settings:", e);
      }
    };

    loadSettings();
    window.addEventListener("nithi_settings_updated", loadSettings);
    return () => window.removeEventListener("nithi_settings_updated", loadSettings);
  }, []);

  if (!enabled) return null;

  return (
    <div className="relative overflow-hidden bg-[#064E3B] text-[#FAF8F1] border-b border-[#C9A227]/30 py-2 select-none z-30 font-body">
      <div className="animate-marquee flex items-center gap-10 whitespace-nowrap text-[11px] lg:text-xs font-semibold tracking-[0.14em] uppercase">
        {/* Render twice for seamless infinite loop */}
        {[...tickerItems, ...tickerItems].map((item, idx) => (
          <div key={idx} className="flex items-center gap-6 shrink-0">
            <span className="text-[#C9A227] text-xs">✦</span>
            <span className="hover:text-[#C9A227] transition-colors">{item}</span>
            <span className="text-[#C9A227]/50">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
