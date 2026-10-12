import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  DashboardIcon,
  ProductsIcon,
  CategoriesIcon,
  InventoryIcon,
  OrdersIcon,
  CustomersIcon,
  CombosIcon,
  ShippingIcon,
  CodIcon,
  AuditIcon,
  SettingsIcon,
  PlusIcon,
  ExternalLinkIcon,
  CheckIcon,
  AlertTriangleIcon,
} from "./AdminIcons";

export interface MobileCustomizerSettings {
  density: "compact" | "comfortable" | "spacious";
  headerTheme: "emerald" | "champagne" | "white" | "dark";
  pinnedShortcuts: string[]; // paths like "/admin/products", "/admin/orders", etc.
  showFloatingDock: boolean;
  hapticFeedback: boolean;
  storeStatus: "LIVE" | "MAINTENANCE";
}

const DEFAULT_SETTINGS: MobileCustomizerSettings = {
  density: "comfortable",
  headerTheme: "emerald",
  pinnedShortcuts: [
    "/admin/products/new",
    "/admin/products",
    "/admin/inventory",
    "/admin/orders",
    "/",
  ],
  showFloatingDock: true,
  hapticFeedback: true,
  storeStatus: "LIVE",
};

interface AdminMobileCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  lowStockCount: number;
}

export const ALL_SHORTCUT_OPTIONS = [
  { id: "new-product", label: "Add Garment", path: "/admin/products/new", icon: PlusIcon, isExternal: false, badge: "New" },
  { id: "products", label: "Products", path: "/admin/products", icon: ProductsIcon, isExternal: false },
  { id: "inventory", label: "Inventory", path: "/admin/inventory", icon: InventoryIcon, isExternal: false, alert: true },
  { id: "orders", label: "Orders", path: "/admin/orders", icon: OrdersIcon, isExternal: false },
  { id: "combos", label: "Combos & Offers", path: "/admin/combos", icon: CombosIcon, isExternal: false },
  { id: "customers", label: "Customers", path: "/admin/customers", icon: CustomersIcon, isExternal: false },
  { id: "categories", label: "Categories", path: "/admin/categories", icon: CategoriesIcon, isExternal: false },
  { id: "shipping", label: "Shipping", path: "/admin/shipping", icon: ShippingIcon, isExternal: false },
  { id: "cod", label: "COD Rules", path: "/admin/cod", icon: CodIcon, isExternal: false },
  { id: "reports", label: "Sales Reports", path: "/admin/reports", icon: DashboardIcon, isExternal: false },
  { id: "settings", label: "System Settings", path: "/admin/settings", icon: SettingsIcon, isExternal: false },
  { id: "storefront", label: "Customer Storefront", path: "/", icon: ExternalLinkIcon, isExternal: true },
];

export function useMobileCustomizer() {
  const [customSettings, setCustomSettings] = useState<MobileCustomizerSettings>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("nithi_admin_mobile_customizer_v1");
        if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      } catch (e) {}
    }
    return DEFAULT_SETTINGS;
  });

  const updateSettings = (partial: Partial<MobileCustomizerSettings>) => {
    setCustomSettings((prev) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem("nithi_admin_mobile_customizer_v1", JSON.stringify(updated));
        window.dispatchEvent(new CustomEvent("nithi_mobile_customizer_updated", { detail: updated }));
      } catch (e) {}
      return updated;
    });
  };

  useEffect(() => {
    const handleStorage = (e: any) => {
      if (e.detail) {
        setCustomSettings(e.detail);
      }
    };
    window.addEventListener("nithi_mobile_customizer_updated", handleStorage);
    return () => window.removeEventListener("nithi_mobile_customizer_updated", handleStorage);
  }, []);

  return { customSettings, updateSettings };
}

export default function AdminMobileCustomizer({
  isOpen,
  onClose,
  lowStockCount,
}: AdminMobileCustomizerProps) {
  const { customSettings, updateSettings } = useMobileCustomizer();
  const [activeTab, setActiveTab] = useState<"shortcuts" | "appearance" | "store" | "allPages">("shortcuts");
  const [toast, setToast] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  if (!isOpen) return null;

  const showFeedback = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const toggleShortcut = (path: string) => {
    const current = customSettings.pinnedShortcuts;
    let updated: string[];
    if (current.includes(path)) {
      if (current.length <= 2) {
        showFeedback("Keep at least 2 quick shortcuts pinned.");
        return;
      }
      updated = current.filter((p) => p !== path);
    } else {
      if (current.length >= 6) {
        showFeedback("Maximum 6 shortcuts allowed for mobile dock.");
        return;
      }
      updated = [...current, path];
    }
    updateSettings({ pinnedShortcuts: updated });
    showFeedback("Quick navigation updated.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Drawer / Modal */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-stone-200 max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200 font-body text-stone-800">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-[#041D16] via-[#083025] to-[#124235] p-5 text-white flex items-center justify-between border-b border-[#C9A227]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#C9A227] to-[#DFC15E] text-[#041D16] flex items-center justify-center font-black text-lg shadow-md shadow-[#C9A227]/20">
              🎨
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-base text-white tracking-tight">
                  Mobile Navbar Customizer
                </h3>
                <span className="px-2 py-0.2 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#DFC15E] text-[10px] font-bold font-mono">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-[#CBD5D0]">
                Customize your mobile navigation bar, dock shortcuts, and theme.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs font-bold transition-colors"
            title="Close Customizer"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 bg-stone-50/90 px-3 pt-2 gap-1 overflow-x-auto scrollbar-none text-xs font-semibold">
          {[
            { id: "shortcuts" as const, label: "⚡ Quick Pins", desc: "Top & Dock Shortcuts" },
            { id: "appearance" as const, label: "✨ Appearance", desc: "Theme & Density" },
            { id: "store" as const, label: "📡 Store Radar", desc: "Quick Controls" },
            { id: "allPages" as const, label: "🧭 All Pages", desc: "1-Tap Jump" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[90px] py-2.5 px-3 rounded-t-xl border-t border-x transition-all text-center ${
                activeTab === tab.id
                  ? "bg-white border-stone-200 text-[#064E3B] font-bold border-b-white -mb-[1px] shadow-2xs"
                  : "border-transparent text-stone-500 hover:text-stone-900"
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Toast Feedback */}
        {toast && (
          <div className="bg-[#041D16] text-[#DFC15E] border-y border-[#C9A227]/40 px-4 py-2 text-xs font-bold flex items-center justify-between animate-in fade-in duration-150">
            <span className="flex items-center gap-2">
              <CheckIcon size={14} className="text-emerald-400" /> {toast}
            </span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 text-xs">
          {/* TAB 1: PINNED SHORTCUTS */}
          {activeTab === "shortcuts" && (
            <div className="space-y-4">
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200/80 text-emerald-950 flex items-start gap-2.5">
                <span className="text-base">📌</span>
                <div>
                  <span className="font-bold block text-xs">Mobile Navbar & Quick Dock Pins</span>
                  <span className="text-[11px] text-emerald-800 leading-relaxed">
                    Select 2 to 6 tools that appear directly on your mobile top navbar ribbon and floating bottom dock.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {ALL_SHORTCUT_OPTIONS.map((opt) => {
                  const isPinned = customSettings.pinnedShortcuts.includes(opt.path);
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => toggleShortcut(opt.path)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isPinned
                          ? "bg-[#041D16] border-[#041D16] text-white shadow-sm"
                          : "bg-stone-50 hover:bg-white border-stone-200 text-stone-700"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isPinned ? "bg-white/15 text-[#DFC15E]" : "bg-stone-200/70 text-stone-700"
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="truncate">
                          <span className="font-bold block truncate">{opt.label}</span>
                          <span className={`text-[10px] block ${isPinned ? "text-[#CBD5D0]" : "text-stone-400"}`}>
                            {opt.path}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ml-1 ${
                          isPinned ? "bg-[#C9A227] text-stone-950" : "bg-stone-200 text-stone-400"
                        }`}
                      >
                        {isPinned ? "✓" : "+"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Floating Dock Toggle */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-900 block">Mobile Bottom Floating Dock</span>
                  <span className="text-[11px] text-stone-500">
                    Display quick 1-tap floating navigation dock at the bottom of mobile screens.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={customSettings.showFloatingDock}
                  onChange={(e) => {
                    updateSettings({ showFloatingDock: e.target.checked });
                    showFeedback(e.target.checked ? "Floating dock enabled." : "Floating dock disabled.");
                  }}
                  className="w-5 h-5 rounded text-[#064E3B] focus:ring-[#064E3B] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 2: APPEARANCE & DENSITY */}
          {activeTab === "appearance" && (
            <div className="space-y-5">
              {/* Header Style */}
              <div>
                <label className="block font-bold text-stone-900 mb-2">
                  Mobile Navbar Color Theme
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { id: "emerald" as const, name: "Royal Emerald", bg: "bg-[#041D16]", text: "text-white", border: "border-[#C9A227]" },
                    { id: "champagne" as const, name: "Champagne Cream", bg: "bg-[#FAF8F1]", text: "text-[#064E3B]", border: "border-[#C9A227]" },
                    { id: "white" as const, name: "Minimal Clean White", bg: "bg-white", text: "text-stone-900", border: "border-stone-300" },
                    { id: "dark" as const, name: "Midnight Obsidian", bg: "bg-stone-950", text: "text-stone-100", border: "border-stone-700" },
                  ].map((thm) => (
                    <button
                      key={thm.id}
                      type="button"
                      onClick={() => {
                        updateSettings({ headerTheme: thm.id });
                        showFeedback(`Theme set to ${thm.name}`);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all ${thm.bg} ${thm.text} ${
                        customSettings.headerTheme === thm.id
                          ? `ring-2 ring-[#C9A227] shadow-md ${thm.border}`
                          : "border-stone-200/80 opacity-85 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{thm.name}</span>
                        {customSettings.headerTheme === thm.id && (
                          <span className="w-4 h-4 rounded-full bg-[#C9A227] text-stone-950 flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Density */}
              <div>
                <label className="block font-bold text-stone-900 mb-2">
                  Mobile Screen Display Density
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "compact" as const, name: "Compact", desc: "For smaller phones" },
                    { id: "comfortable" as const, name: "Comfortable", desc: "Balanced standard" },
                    { id: "spacious" as const, name: "Spacious", desc: "Large touch targets" },
                  ].map((dns) => (
                    <button
                      key={dns.id}
                      type="button"
                      onClick={() => {
                        updateSettings({ density: dns.id });
                        showFeedback(`Density set to ${dns.name}`);
                      }}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        customSettings.density === dns.id
                          ? "bg-[#064E3B] text-white border-[#064E3B] shadow-sm font-bold"
                          : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-white"
                      }`}
                    >
                      <span className="block text-xs">{dns.name}</span>
                      <span className={`text-[9px] block mt-0.5 ${customSettings.density === dns.id ? "text-emerald-200" : "text-stone-400"}`}>
                        {dns.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Haptic & Sound */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-900 block">Touch Haptic Feedback</span>
                  <span className="text-[11px] text-stone-500">
                    Vibrate lightly on mobile actions & quick button taps.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={customSettings.hapticFeedback}
                  onChange={(e) => {
                    updateSettings({ hapticFeedback: e.target.checked });
                    showFeedback("Haptic settings saved.");
                  }}
                  className="w-5 h-5 rounded text-[#064E3B] focus:ring-[#064E3B] cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* TAB 3: QUICK STORE RADAR & CONTROLS */}
          {activeTab === "store" && (
            <div className="space-y-4">
              {/* Storefront status */}
              <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/70 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-emerald-950 text-xs">Customer Storefront Status</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Currently accepting live customer orders & payments.
                  </p>
                </div>
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl bg-[#064E3B] text-white font-bold text-xs hover:bg-[#0B3D2E] shadow-sm shrink-0"
                >
                  Visit Store ↗
                </a>
              </div>

              {/* Low Stock Summary */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                    <AlertTriangleIcon size={16} />
                  </div>
                  <div>
                    <span className="font-bold text-amber-950 text-xs block">Inventory Low Stock Alert</span>
                    <span className="text-[11px] text-amber-800">{lowStockCount} items need attention</span>
                  </div>
                </div>
                <Link
                  to="/admin/inventory"
                  onClick={onClose}
                  className="px-3 py-1.5 rounded-xl bg-amber-700 text-white font-bold text-xs hover:bg-amber-800 shadow-sm"
                >
                  Inspect Radar
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                  Emergency Store Quick Actions
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="/api/admin/export/excel"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl font-semibold text-stone-800 flex items-center gap-2"
                  >
                    <span>📥</span>
                    <span>Download Backup (.xlsx)</span>
                  </a>
                  <Link
                    to="/admin/settings"
                    onClick={onClose}
                    className="p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl font-semibold text-stone-800 flex items-center gap-2"
                  >
                    <span>⚙️</span>
                    <span>Store Settings</span>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 1-TAP FAST SWITCHER */}
          {activeTab === "allPages" && (
            <div className="space-y-3">
              <span className="font-bold text-stone-700 uppercase tracking-wider text-[10px]">
                Instant 1-Tap Module Navigation
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ALL_SHORTCUT_OPTIONS.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.path === "/admin"
                      ? location.pathname === "/admin"
                      : location.pathname.startsWith(item.path);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (item.isExternal) {
                          window.open(item.path, "_blank");
                        } else {
                          navigate(item.path);
                        }
                        onClose();
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                        isActive
                          ? "bg-[#041D16] text-[#DFC15E] border-[#041D16] font-bold shadow-sm"
                          : "bg-stone-50 hover:bg-white border-stone-200 text-stone-800"
                      }`}
                    >
                      <Icon size={16} className={isActive ? "text-[#DFC15E]" : "text-stone-500"} />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              updateSettings(DEFAULT_SETTINGS);
              showFeedback("Reset to factory defaults.");
            }}
            className="text-stone-500 hover:text-stone-900 font-semibold text-xs flex items-center gap-1"
          >
            <span>↩</span>
            <span>Reset Defaults</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-[#041D16] hover:bg-[#083025] text-white rounded-xl font-bold text-xs shadow-md"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
}
