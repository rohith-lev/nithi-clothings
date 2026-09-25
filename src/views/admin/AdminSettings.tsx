import React, { useState, useEffect } from "react";
import type { SiteSettings } from "../../types/store";
import { CheckIcon, AlertTriangleIcon, SettingsIcon } from "../../components/admin/AdminIcons";
import AdminStorageManager from "../../components/admin/AdminStorageManager";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState<"storage" | "store" | "notifications">("storage");

  const [settings, setSettings] = useState<SiteSettings>({
    storeName: "Nithi Collection",
    tagline: "Everyday Elegance in Nighties & Ethnic Wear",
    supportPhone: "+91 98765 43210",
    supportEmail: "support@nithicollection.com",
    defaultLowThreshold: 10,
    marqueeEnabled: true,
    marqueeTexts: [
      "COMPLIMENTARY EXPRESS SHIPPING ON ORDERS ABOVE ₹999",
      "NEW ARRIVALS: PURE COTTON & SILK FESTIVE COUTURE",
      "CASH ON DELIVERY AVAILABLE PAN-INDIA",
      "EXCLUSIVE COMBO OFFERS: BUY 3 NIGHTIES & GET FREE SHIPPING",
      "USE CODE NITHI10 FOR 10% OFF ON FIRST PURCHASE",
    ],
    circularBadgeEnabled: true,
    circularBadgeText: "• LIMITED OFFER • SHOP NOW • NITHI COLLECTION • ",
    circularBadgeLink: "/shop?filter=sale",
    freeShippingThreshold: 999,
  });

  const [marqueeRawText, setMarqueeRawText] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nithi_db_settings_v4");
      if (raw) {
        const current = JSON.parse(raw);
        setSettings(current);
        setMarqueeRawText((current.marqueeTexts || []).join("\n"));
      }
    } catch (e) {}
  }, []);

  const handleSave = () => {
    const lines = marqueeRawText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const updated: SiteSettings = {
      ...settings,
      marqueeTexts: lines.length > 0 ? lines : settings.marqueeTexts,
    };

    localStorage.setItem("nithi_db_settings_v4", JSON.stringify(updated));
    window.dispatchEvent(new Event("nithi_settings_updated"));
    setSettings(updated);
    setToast("Store & promotional settings saved successfully.");
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="space-y-6 font-body max-w-6xl">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#041D16] text-white border border-[#C9A227] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckIcon size={14} />
          </div>
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            System & Store Management
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F1] border border-[#C9A227]/40 text-[#8A5F38] text-xs font-bold font-mono">
            Admin Controlled
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Control MongoDB database capacity, 90% threshold alert notifications, offline backups/imports, promotional banners, and store metadata.
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
        <button
          type="button"
          onClick={() => setActiveTab("storage")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "storage"
              ? "bg-white text-stone-900 shadow-sm border border-stone-200"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          🗄️ Database Storage & Backups
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("store")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === "store"
              ? "bg-white text-stone-900 shadow-sm border border-stone-200"
              : "text-stone-600 hover:text-stone-900"
          }`}
        >
          🏪 Storefront & Promotional Marquee
        </button>
      </div>

      {/* Tab 1: Database Storage Monitoring, 90% Alert, & Excel/JSON Backup/Import */}
      {activeTab === "storage" && <AdminStorageManager />}

      {/* Tab 2: Storefront & Promotional Controls */}
      {activeTab === "store" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-6 text-xs">
            <div>
              <h3 className="font-display font-bold text-lg text-stone-900">
                Promotional Announcements & Marquee Ticker
              </h3>
              <p className="text-stone-500 text-xs mt-0.5">
                Controls the smooth horizontal continuous announcement bar at the top of the storefront.
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.marqueeEnabled ?? true}
                  onChange={(e) => setSettings({ ...settings, marqueeEnabled: e.target.checked })}
                  className="rounded border-stone-300 w-4 h-4 text-[#064E3B] focus:ring-[#064E3B]"
                />
                <span className="font-bold text-stone-900">Enable Promotional Announcement Marquee Bar</span>
              </label>

              <div>
                <label className="block font-bold mb-1 text-stone-700">
                  Announcement Lines (Enter one message per line):
                </label>
                <textarea
                  rows={5}
                  value={marqueeRawText}
                  onChange={(e) => setMarqueeRawText(e.target.value)}
                  className="w-full p-3.5 bg-stone-50 border border-stone-300 rounded-2xl font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227] leading-relaxed"
                  placeholder="e.g. COMPLIMENTARY EXPRESS SHIPPING ON ORDERS ABOVE ₹999..."
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-2xs space-y-5 text-xs">
            <h3 className="font-display font-bold text-lg text-stone-900">
              General Merchant Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1.5 text-stone-700">Storefront Brand Name</label>
                <input
                  type="text"
                  value={settings.storeName || ""}
                  onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>
              <div>
                <label className="block font-bold mb-1.5 text-stone-700">Marketing Tagline</label>
                <input
                  type="text"
                  value={settings.tagline || ""}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold mb-1.5 text-stone-700">Customer Support Phone / WhatsApp</label>
                <input
                  type="text"
                  value={settings.supportPhone || ""}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>
              <div>
                <label className="block font-bold mb-1.5 text-stone-700">Customer Support Email</label>
                <input
                  type="email"
                  value={settings.supportEmail || ""}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-100 flex justify-end">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-[#064E3B] text-white rounded-xl font-bold hover:bg-[#0B3D2E] shadow-sm uppercase tracking-wider text-xs"
              >
                Save All Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
