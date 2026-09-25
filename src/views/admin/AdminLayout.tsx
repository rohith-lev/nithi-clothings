import React, { useState, useEffect, createContext, useContext, useRef, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useAdminAuth } from "../../services/auth";
import { adminApi } from "../../services/api";
import type { Product } from "../../types/store";
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
  SearchIcon,
  BellIcon,
  ExternalLinkIcon,
  LogOutIcon,
  CheckIcon,
  AlertTriangleIcon,
} from "../../components/admin/AdminIcons";

// Unsaved changes protection context
interface UnsavedChangesContextType {
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  confirmNavigation: (to: string) => boolean;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType>({
  isDirty: false,
  setIsDirty: () => {},
  confirmNavigation: () => true,
});

export const useUnsavedChanges = () => useContext(UnsavedChangesContext);

export default function AdminLayout() {
  const { user, isAuthenticated, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [lowStockItems, setLowStockItems] = useState<{ id: string; name: string; stock: number; thresh: number }[]>([]);

  // Command Palette (Ctrl + K) State
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");
  const [paletteSelectedIndex, setPaletteSelectedIndex] = useState(0);
  const paletteInputRef = useRef<HTMLInputElement>(null);

  // Auth Guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/admin/login", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Global Ctrl + K Keyboard Shortcut Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setShowCommandPalette((prev) => !prev);
      } else if (e.key === "Escape" && showCommandPalette) {
        setShowCommandPalette(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showCommandPalette]);

  // Auto-focus search input when Command Palette opens
  useEffect(() => {
    if (showCommandPalette) {
      setPaletteQuery("");
      setPaletteSelectedIndex(0);
      setTimeout(() => {
        paletteInputRef.current?.focus();
      }, 50);
    }
  }, [showCommandPalette]);

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Load low stock alerts & products
  useEffect(() => {
    let mounted = true;
    adminApi.getProducts().then((products) => {
      if (!mounted) return;
      setAllProducts(products);
      const alerts = products
        .filter((p) => (p.stock || 0) <= 10)
        .map((p) => ({ id: p.id, name: p.name, stock: p.stock || 0, thresh: 10 }));
      setLowStockCount(alerts.length);
      setLowStockItems(alerts);
    });

    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  const handleNavClick = (e: React.MouseEvent, path: string) => {
    if (isDirty) {
      e.preventDefault();
      setPendingNavigation(path);
      setShowUnsavedModal(true);
    } else {
      navigate(path);
      setSidebarOpen(false);
    }
  };

  const handleDiscardAndNavigate = () => {
    setIsDirty(false);
    setShowUnsavedModal(false);
    if (pendingNavigation) {
      navigate(pendingNavigation);
      setPendingNavigation(null);
    }
  };

  const confirmNavigation = (to: string) => {
    if (isDirty) {
      setPendingNavigation(to);
      setShowUnsavedModal(true);
      return false;
    }
    return true;
  };

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: DashboardIcon },
    { label: "Products", path: "/admin/products", icon: ProductsIcon, badge: "Live" },
    { label: "Categories", path: "/admin/categories", icon: CategoriesIcon },
    { label: "Inventory", path: "/admin/inventory", icon: InventoryIcon, alert: lowStockCount > 0 ? `${lowStockCount} Low` : undefined },
    { label: "Orders", path: "/admin/orders", icon: OrdersIcon },
    { label: "Customers", path: "/admin/customers", icon: CustomersIcon },
    { label: "Bookings", path: "/admin/bookings", icon: InventoryIcon },
    { label: "Coupons & Combos", path: "/admin/combos", icon: CombosIcon },
    { label: "Shipping", path: "/admin/shipping", icon: ShippingIcon },
    { label: "COD Settings", path: "/admin/cod", icon: CodIcon },
    { label: "Payments", path: "/admin/payments", icon: AuditIcon },
    { label: "Returns", path: "/admin/returns", icon: OrdersIcon },
    { label: "Reports", path: "/admin/reports", icon: DashboardIcon },
    { label: "Audit Logs", path: "/admin/audit", icon: AuditIcon },
    { label: "Settings", path: "/admin/settings", icon: SettingsIcon },
  ];

  // Command Palette Items & Filtering
  const paletteResults = useMemo(() => {
    const q = paletteQuery.toLowerCase().trim();

    // Quick Actions
    const actions = [
      {
        id: "action-add-product",
        type: "action" as const,
        title: "Add New Garment / Product",
        subtitle: "Create a new garment entry in the catalogue",
        icon: "✨",
        action: () => navigate("/admin/products/new"),
      },
      {
        id: "action-view-storefront",
        type: "action" as const,
        title: "View Live Customer Storefront",
        subtitle: "Opens live customer website in new tab",
        icon: "🌐",
        action: () => window.open("/", "_blank"),
      },
      {
        id: "action-inventory-alerts",
        type: "action" as const,
        title: "Check Low Stock Radar",
        subtitle: `${lowStockCount} item(s) currently below threshold`,
        icon: "⚠️",
        action: () => navigate("/admin/inventory"),
      },
      {
        id: "action-products-list",
        type: "action" as const,
        title: "Open Product Management",
        subtitle: "View, filter, edit prices and restock garments",
        icon: "👗",
        action: () => navigate("/admin/products"),
      },
    ].filter((a) => !q || a.title.toLowerCase().includes(q) || a.subtitle.toLowerCase().includes(q));

    // Nav Links
    const navigationLinks = navItems
      .map((item) => ({
        id: `nav-${item.path}`,
        type: "navigation" as const,
        title: item.label,
        subtitle: `Jump to ${item.label} workspace`,
        icon: "🧭",
        path: item.path,
        action: () => navigate(item.path),
      }))
      .filter((n) => !q || n.title.toLowerCase().includes(q));

    // Products Search
    const matchingProducts = allProducts
      .filter(
        (p) =>
          !q ||
          p.name.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          (p.code && p.code.toLowerCase().includes(q)) ||
          (p.category && p.category.toLowerCase().includes(q)) ||
          (p.color && p.color.toLowerCase().includes(q))
      )
      .slice(0, 8)
      .map((p) => {
        const finalPr = p.finalPrice || (p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price);
        return {
          id: `product-${p.id}`,
          type: "product" as const,
          product: p,
          title: p.name,
          sku: p.sku || p.code || "N/A",
          price: finalPr,
          stock: p.stock ?? 0,
          category: p.category,
          image: p.coverImage || p.images?.[0] || "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=100&h=100&fit=crop",
          action: () => navigate(`/admin/products/edit/${p.id}`),
        };
      });

    return {
      actions,
      navigation: navigationLinks,
      products: matchingProducts,
      totalCount: actions.length + navigationLinks.length + matchingProducts.length,
      flatList: [...actions, ...matchingProducts, ...navigationLinks],
    };
  }, [paletteQuery, navigate, lowStockCount]);

  // Keyboard navigation for Command Palette results
  const handlePaletteKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setPaletteSelectedIndex((prev) =>
        prev < paletteResults.flatList.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setPaletteSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : Math.max(0, paletteResults.flatList.length - 1)
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const sel = paletteResults.flatList[paletteSelectedIndex];
      if (sel) {
        sel.action();
        setShowCommandPalette(false);
      }
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <UnsavedChangesContext.Provider value={{ isDirty, setIsDirty, confirmNavigation }}>
      <div className="min-h-screen bg-[#F8F6F0] flex font-body text-[#1A1A1A] antialiased selection:bg-[#C9A227]/30 selection:text-[#041D16]">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#041D16] text-[#E3E8E5] border-r border-[#C9A227]/20 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 shadow-2xl ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Brand header */}
          <div className="h-20 px-6 border-b border-white/10 flex items-center justify-between bg-black/20">
            <Link to="/admin" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-white p-0.5 shadow-md shadow-[#C9A227]/20 border border-[#C9A227]/50 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                <img
                  src="/nithi-logo.png"
                  alt="Nithi Collection Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-display font-bold text-white text-base tracking-tight block leading-tight group-hover:text-[#DFC15E] transition-colors">
                  Nithi Collection
                </span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227] animate-pulse" />
                  Merchant Console
                </span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/60 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Quick Primary Actions */}
          <div className="p-4 border-b border-white/10 space-y-2 bg-[#06261E]/50">
            <Link
              to="/admin/products/new"
              onClick={() => setSidebarOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#DFBF55] hover:from-[#DFC15E] hover:to-[#EBD58A] text-[#041D16] text-xs font-bold shadow-md shadow-[#C9A227]/15 transition-all transform hover:-translate-y-0.5 uppercase tracking-wider"
            >
              <PlusIcon size={16} />
              <span>Add New Product</span>
            </Link>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#DFC15E] font-medium border border-[#C9A227]/25 transition-all"
            >
              <span className="inline-flex items-center gap-2">
                <ExternalLinkIcon size={14} /> View Live Storefront
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#C9A227]/20 text-[#DFC15E]">
                Active
              </span>
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
            <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
              Navigation Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/admin"
                  ? location.pathname === "/admin"
                  : location.pathname.startsWith(item.path);
              return (
                <a
                  key={item.path}
                  href={item.path}
                  onClick={(e) => handleNavClick(e, item.path)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#0B3D2E] to-[#0E4D3A] text-white font-semibold shadow-md border border-[#C9A227]/40 text-[#DFC15E]"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={isActive ? "text-[#DFC15E]" : "text-white/60"}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.alert && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                      {item.alert}
                    </span>
                  )}
                  {item.badge && !item.alert && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                      {item.badge}
                    </span>
                  )}
                </a>
              );
            })}
          </nav>

          {/* User profile footer */}
          <div className="p-4 border-t border-white/10 bg-[#02130E]">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/5">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop"}
                alt={user?.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#C9A227]"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <p className="text-[10px] text-[#DFC15E] font-medium truncate">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/admin/login");
                }}
                title="Log Out"
                className="text-white/50 hover:text-red-400 hover:bg-red-950/40 p-2 rounded-lg transition-colors"
              >
                <LogOutIcon size={16} />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Viewport */}
        <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-20 bg-white/85 backdrop-blur-md border-b border-[#E8E2D5] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 transition-colors"
                aria-label="Open sidebar"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Status pill & Interactive Global Search Trigger (Ctrl + K) */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Real-time Sync Active</span>
                </div>

                {/* Clickable Search Bar that activates Command Palette */}
                <button
                  type="button"
                  onClick={() => setShowCommandPalette(true)}
                  className="flex items-center gap-2.5 text-xs text-stone-500 border border-stone-200 hover:border-stone-400 hover:text-stone-900 rounded-2xl px-3.5 py-2 bg-stone-50/80 hover:bg-white transition-all shadow-2xs group cursor-pointer"
                  title="Search products, pages, orders, and actions (Ctrl + K)"
                >
                  <SearchIcon size={14} className="text-stone-400 group-hover:text-stone-700 transition-colors" />
                  <span className="font-medium hidden md:inline">Search anything...</span>
                  <kbd className="font-mono bg-white group-hover:bg-stone-100 px-2 py-0.5 rounded-lg border border-stone-200 text-[10px] font-bold text-stone-600 shadow-2xs transition-all">
                    Ctrl + K
                  </kbd>
                </button>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-3">
              {/* Notification bell for low stock */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2.5 rounded-xl border border-stone-200 hover:border-[#C9A227] hover:bg-[#FAF8F1] relative text-stone-700 transition-all"
                  title="Stock & System Notifications"
                >
                  <BellIcon size={18} />
                  {lowStockCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A227] text-[#041D16] text-[10px] font-black rounded-full flex items-center justify-center shadow-sm">
                      {lowStockCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-3 w-88 bg-white border border-[#E8E2D5] rounded-2xl shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                      <div className="flex items-center gap-2">
                        <AlertTriangleIcon size={16} className="text-amber-500" />
                        <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                          Inventory Radar ({lowStockCount})
                        </span>
                      </div>
                      <button
                        onClick={() => setShowNotifications(false)}
                        className="text-stone-400 hover:text-stone-700 text-xs p-1 rounded-md hover:bg-stone-100"
                      >
                        ✕
                      </button>
                    </div>

                    {lowStockItems.length === 0 ? (
                      <div className="py-6 text-center space-y-1">
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                          <CheckIcon size={20} />
                        </div>
                        <p className="text-xs font-bold text-stone-800">All Stock Healthy</p>
                        <p className="text-[11px] text-stone-500">
                          Every product SKU is well above its safety threshold.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                        {lowStockItems.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs flex justify-between items-center hover:bg-amber-50 transition-colors"
                          >
                            <div className="truncate pr-3">
                              <p className="font-bold text-amber-950 truncate">{item.name}</p>
                              <p className="text-[11px] text-amber-700 mt-0.5">
                                <span className="font-semibold text-rose-700">{item.stock} left</span> (Alert limit: &le; {item.thresh})
                              </p>
                            </div>
                            <Link
                              to={`/admin/products/edit/${item.id}`}
                              onClick={() => setShowNotifications(false)}
                              className="px-3 py-1.5 rounded-lg bg-[#064E3B] text-white text-[11px] font-bold hover:bg-[#0B3D2E] transition-colors shrink-0 shadow-xs"
                            >
                              Restock
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Add Product Button */}
              <Link
                to="/admin/products/new"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#0B3D2E] text-white text-xs font-bold shadow-md shadow-[#064E3B]/20 transition-all transform hover:-translate-y-0.5 border border-[#C9A227]/30"
              >
                <PlusIcon size={14} />
                <span>Add Product</span>
              </Link>
            </div>
          </header>

          {/* Main View Area */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>

        {/* SPOTLIGHT COMMAND PALETTE MODAL (Ctrl + K) */}
        {showCommandPalette && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150"
            onClick={() => setShowCommandPalette(false)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl border border-stone-200/90 max-w-2xl w-full overflow-hidden text-stone-800 animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input Header */}
              <div className="relative p-4 border-b border-stone-200/80 flex items-center gap-3 bg-stone-50/50">
                <SearchIcon size={20} className="text-stone-400 shrink-0" />
                <input
                  ref={paletteInputRef}
                  type="text"
                  value={paletteQuery}
                  onChange={(e) => {
                    setPaletteQuery(e.target.value);
                    setPaletteSelectedIndex(0);
                  }}
                  onKeyDown={handlePaletteKeyDown}
                  placeholder="Search products, SKUs, colors, pages, or quick actions..."
                  className="w-full bg-transparent text-sm sm:text-base font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none"
                />
                {paletteQuery && (
                  <button
                    onClick={() => {
                      setPaletteQuery("");
                      paletteInputRef.current?.focus();
                    }}
                    className="w-5 h-5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 flex items-center justify-center text-[10px] transition-colors"
                  >
                    ✕
                  </button>
                )}
                <kbd className="hidden sm:inline-block font-mono bg-stone-200/80 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold">
                  ESC
                </kbd>
              </div>

              {/* Search Results Area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-4 max-h-[55vh]">
                {paletteResults.totalCount === 0 ? (
                  <div className="py-12 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                      🔍
                    </div>
                    <p className="text-xs font-bold text-stone-700">No results found for "{paletteQuery}"</p>
                    <p className="text-[11px] text-stone-400">
                      Try searching by dress name, SKU (e.g. NC-), category, or navigation section.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Quick Actions Group */}
                    {paletteResults.actions.length > 0 && (
                      <div>
                        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          Quick Actions
                        </div>
                        <div className="space-y-1">
                          {paletteResults.actions.map((act) => {
                            const flatIdx = paletteResults.flatList.findIndex((item) => item.id === act.id);
                            const isSel = paletteSelectedIndex === flatIdx;
                            return (
                              <div
                                key={act.id}
                                onClick={() => {
                                  act.action();
                                  setShowCommandPalette(false);
                                }}
                                onMouseEnter={() => setPaletteSelectedIndex(flatIdx)}
                                className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                                  isSel ? "bg-[#041D16] text-white shadow-sm" : "hover:bg-stone-100 text-stone-800"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="text-base">{act.icon}</span>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold truncate">{act.title}</p>
                                    <p
                                      className={`text-[10px] truncate ${
                                        isSel ? "text-stone-300" : "text-stone-400"
                                      }`}
                                    >
                                      {act.subtitle}
                                    </p>
                                  </div>
                                </div>
                                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${isSel ? "bg-white/20 text-[#DFC15E]" : "bg-stone-100 text-stone-500"}`}>
                                  Jump ↵
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Products Search Results */}
                    {paletteResults.products.length > 0 && (
                      <div>
                        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 flex items-center justify-between">
                          <span>Garments & Products ({paletteResults.products.length})</span>
                          <span className="text-[9px] text-stone-400 font-normal">Click to edit details</span>
                        </div>
                        <div className="space-y-1">
                          {paletteResults.products.map((item) => {
                            const flatIdx = paletteResults.flatList.findIndex((it) => it.id === item.id);
                            const isSel = paletteSelectedIndex === flatIdx;
                            return (
                              <div
                                key={item.id}
                                onClick={() => {
                                  item.action();
                                  setShowCommandPalette(false);
                                }}
                                onMouseEnter={() => setPaletteSelectedIndex(flatIdx)}
                                className={`flex items-center justify-between p-2.5 rounded-2xl cursor-pointer transition-all ${
                                  isSel ? "bg-[#041D16] text-white shadow-sm" : "hover:bg-stone-100 text-stone-800"
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-10 h-11 rounded-xl object-cover border border-stone-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold truncate">{item.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className={`text-[10px] font-mono px-1.5 rounded ${isSel ? "bg-white/20 text-[#DFC15E]" : "bg-stone-100 text-stone-600"}`}>
                                        {item.sku}
                                      </span>
                                      <span className={`text-[10px] capitalize ${isSel ? "text-stone-300" : "text-stone-400"}`}>
                                        {item.category}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-right shrink-0">
                                  <div className="font-bold text-xs">₹{item.price.toLocaleString("en-IN")}</div>
                                  <div className="text-[10px] mt-0.5">
                                    {item.stock <= 0 ? (
                                      <span className="text-rose-400 font-bold">Out of Stock</span>
                                    ) : item.stock <= 10 ? (
                                      <span className="text-amber-400 font-bold">{item.stock} left (Low)</span>
                                    ) : (
                                      <span className={isSel ? "text-emerald-300" : "text-emerald-600 font-semibold"}>
                                        {item.stock} in stock
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Navigation Pages Group */}
                    {paletteResults.navigation.length > 0 && (
                      <div>
                        <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          Navigation Pages
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {paletteResults.navigation.map((nav) => {
                            const flatIdx = paletteResults.flatList.findIndex((item) => item.id === nav.id);
                            const isSel = paletteSelectedIndex === flatIdx;
                            return (
                              <div
                                key={nav.id}
                                onClick={() => {
                                  nav.action();
                                  setShowCommandPalette(false);
                                }}
                                onMouseEnter={() => setPaletteSelectedIndex(flatIdx)}
                                className={`flex items-center gap-2.5 p-2.5 rounded-2xl cursor-pointer transition-all ${
                                  isSel ? "bg-[#041D16] text-white shadow-sm" : "hover:bg-stone-100 text-stone-800"
                                }`}
                              >
                                <span className="text-sm">{nav.icon}</span>
                                <span className="text-xs font-bold truncate">{nav.title}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Command Palette Footer Hints */}
              <div className="p-3 bg-stone-50 border-t border-stone-200/80 text-[11px] text-stone-500 flex items-center justify-between px-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <kbd className="bg-white px-1.5 py-0.5 rounded border border-stone-300 font-mono text-[9px]">↑</kbd>
                    <kbd className="bg-white px-1.5 py-0.5 rounded border border-stone-300 font-mono text-[9px]">↓</kbd>
                    <span>navigate</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-white px-1.5 py-0.5 rounded border border-stone-300 font-mono text-[9px]">↵</kbd>
                    <span>select</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <kbd className="bg-white px-1.5 py-0.5 rounded border border-stone-300 font-mono text-[9px]">esc</kbd>
                    <span>close</span>
                  </span>
                </div>
                <span className="text-[10px] text-stone-400 font-medium hidden sm:inline">
                  Antigravity Global Spotlight
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Unsaved Changes Protection Modal */}
        {showUnsavedModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-md w-full p-6 text-stone-800 animate-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mb-4">
                <AlertTriangleIcon size={24} />
              </div>
              <h3 className="font-display text-xl font-bold text-stone-900 mb-1.5">
                Unsaved Catalog Changes
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed mb-6">
                You have modified this product details or business rule without saving. Navigating away now will permanently discard your pending changes.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowUnsavedModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-100 transition-colors"
                >
                  Stay on Page
                </button>
                <button
                  type="button"
                  onClick={handleDiscardAndNavigate}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm"
                >
                  Discard & Leave
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UnsavedChangesContext.Provider>
  );
}
