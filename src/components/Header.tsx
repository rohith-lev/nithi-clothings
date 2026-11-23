import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useCart } from "../store/cart";
import { useCustomerAuth } from "../services/customerAuth";
import { useStoreCategories, isCorsetOrSareeCorsetItem } from "../services/storefront";
import type { Category } from "../types/store";
import BrandLogo from "./BrandLogo";
import MarqueeTicker from "./MarqueeTicker";
import InteractiveNavText from "./InteractiveNavText";

export default function Header() {
  const { cartCount, state } = useCart();
  const { customer, isLoggedIn } = useCustomerAuth();
  const rawCategories = useStoreCategories();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDropdownCatId, setActiveDropdownCatId] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setSearchOpen(false);
    setActiveDropdownCatId(null);
  }, [location.pathname, location.search]);

  // Trigger bounce animation whenever cartCount changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartAnimate(true);
      const timer = setTimeout(() => setCartAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  // Deduplicate and sanitize categories with product types
  const categoriesList = useMemo(() => {
    const seen = new Set<string>();
    const list: (Category & {
      cleanSubcategories: { id: string; name: string }[];
      cleanProductTypes: string[];
      nestedItems: { id: string; name: string; isType: boolean }[];
    })[] = [];

    for (const cat of rawCategories) {
      if (!cat || cat.isActive === false) continue;
      // Completely exclude any top-level item related to "Print Corset" or "Saree Corset"
      if (
        isCorsetOrSareeCorsetItem(cat.name) ||
        isCorsetOrSareeCorsetItem(cat.slug) ||
        isCorsetOrSareeCorsetItem(cat.id)
      ) {
        continue;
      }
      const key = (cat.slug || cat.id || cat.name || "").toLowerCase().trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);

      const cleanSubs: { id: string; name: string }[] = [];
      const subSeen = new Set<string>();

      if (Array.isArray(cat.subcategories)) {
        for (const sub of cat.subcategories) {
          const subName = typeof sub === "string" ? sub : sub?.name;
          const subId = typeof sub === "string" ? sub : sub?.id || sub?.name;
          if (
            subName &&
            !isCorsetOrSareeCorsetItem(subName) &&
            !subSeen.has(subName.toLowerCase().trim())
          ) {
            subSeen.add(subName.toLowerCase().trim());
            cleanSubs.push({ id: subId, name: subName.trim() });
          }
        }
      }

      // Collect product types dynamically stored in category or fallback defaults for clothing categories
      let types: string[] = [];
      if (Array.isArray((cat as any).productTypes) && (cat as any).productTypes.length > 0) {
        types = (cat as any).productTypes.filter((t: string) => !isCorsetOrSareeCorsetItem(t));
      } else if (key.includes("nighty") || key.includes("nighties")) {
        types = ["Zip Nighty", "Zipless Nighty", "Elite Nighty"];
      }

      // Merge product types and subcategories into unified nested items
      const nested: { id: string; name: string; isType: boolean }[] = [];
      const itemSeen = new Set<string>();

      for (const t of types) {
        const norm = t.toLowerCase().trim();
        if (!isCorsetOrSareeCorsetItem(t) && !itemSeen.has(norm)) {
          itemSeen.add(norm);
          nested.push({ id: `type-${norm}`, name: t.trim(), isType: true });
        }
      }

      for (const s of cleanSubs) {
        const norm = s.name.toLowerCase().trim();
        if (!isCorsetOrSareeCorsetItem(s.name) && !itemSeen.has(norm)) {
          itemSeen.add(norm);
          nested.push({ id: s.id, name: s.name, isType: false });
        }
      }

      list.push({
        ...cat,
        cleanSubcategories: cleanSubs,
        cleanProductTypes: types,
        nestedItems: nested,
      });
    }

    return list;
  }, [rawCategories]);

  return (
    <>
      {/* Animated Marquee Announcement & Order Tracking Bar */}
      <div className="bg-[#064E3B] text-white border-b border-[#0B3D2E]/40 text-[11px] py-1.5 px-3 select-none font-body overflow-hidden relative">
        <div className="flex items-center justify-between max-w-7xl mx-auto gap-4">
          {/* Smooth Scrolling Marquee Track */}
          <div className="flex-1 overflow-hidden whitespace-nowrap relative">
            <div className="inline-flex items-center gap-8 animate-marquee text-[11px] font-medium tracking-normal">
              {[1, 2].map((k) => (
                <div key={k} className="inline-flex items-center gap-8 shrink-0">
                  <span className="flex items-center gap-1.5 font-bold text-amber-300">
                    <span>🚚</span>
                    <span>FREE EXPRESS DELIVERY ON ORDERS ₹999+</span>
                  </span>
                  <span className="text-emerald-300">•</span>
                  <span className="flex items-center gap-1.5 text-slate-100">
                    <span>💵</span>
                    <span>CASH ON DELIVERY (COD) AVAILABLE PAN-INDIA</span>
                  </span>
                  <span className="text-emerald-300">•</span>
                  <span className="flex items-center gap-1.5 text-emerald-200 font-semibold">
                    <span>🧵</span>
                    <span>100% PURE COMBED COTTON QUALITY</span>
                  </span>
                  <span className="text-emerald-300">•</span>
                  <span className="flex items-center gap-1.5 text-slate-100">
                    <span>🔄</span>
                    <span>EASY 7-DAY EXCHANGE & REPLACEMENTS</span>
                  </span>
                  <span className="text-emerald-300">•</span>
                  <span className="flex items-center gap-1.5 text-amber-200">
                    <span>📦</span>
                    <span>FAST 2–4 BUSINESS DAYS DISPATCH</span>
                  </span>
                  <span className="text-emerald-300">•</span>
                </div>
              ))}
            </div>
          </div>

          {/* Persistent Order Tracking Link */}
          <div className="flex items-center gap-3 shrink-0 z-10 bg-[#064E3B] pl-2 text-xs font-semibold">
            <Link
              to="/track"
              className="flex items-center gap-1 text-white hover:text-amber-300 transition-colors bg-white/10 hover:bg-white/20 px-2.5 py-0.5 rounded-full text-[11px]"
            >
              <span>🔍</span>
              <span>Track Order</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-[#FAF8F1]/95 backdrop-blur-md shadow-sm border-b border-[#E8E2D5]"
          : "bg-[#FAF8F1] border-b border-[#E8E2D5]"
          }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24 gap-1 sm:gap-4">
            {/* Mobile Menu Toggle */}
            <div className="flex items-center lg:hidden shrink-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 sm:p-2 text-[#064E3B] hover:text-[#C9A227] transition-colors rounded-lg focus:outline-none"
                aria-label="Toggle Navigation"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7h16M4 12h16M4 17h16" />
                  )}
                </svg>
              </button>
            </div>

            {/* Prominent Nithi Collection Logo */}
            <div className="flex-1 lg:flex-none flex justify-center lg:justify-start min-w-0 px-0.5 sm:px-1">
              <BrandLogo variant="dark" size="md" showTagline={true} />
            </div>

            {/* Desktop Navigation — Categories first (database-driven) with clean normal tracking and larger text */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-8 font-body text-base font-semibold tracking-normal text-slate-800">
              {/* Home Link */}
              <Link
                to="/"
                className="relative text-slate-800 hover:text-[#064E3B] transition-colors py-1 group"
              >
                <InteractiveNavText text="Home" />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#064E3B] transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* Shop / Categories Dropdown */}
              <div
                className="relative group py-6"
                onMouseEnter={() => setActiveDropdownCatId("all-shop")}
                onMouseLeave={() => setActiveDropdownCatId(null)}
              >
                <Link
                  to="/shop"
                  className="flex items-center gap-1.5 text-slate-800 hover:text-[#064E3B] transition-colors relative py-1"
                >
                  <InteractiveNavText text="Shop" />
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C9A227] transition-all duration-300 group-hover:w-full" />
                </Link>

                {/* Categories & Product Types Dropdown (admin-defined order) */}
                <div className="absolute top-full -left-6 w-80 bg-[#FFFFFF] border border-[#E8E2D5] shadow-2xl rounded-2xl p-3.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2 border-b border-[#E8E2D5]/70 mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#C9A227] tracking-[0.2em] uppercase block">
                      Product Categories
                    </span>
                    <Link
                      to="/shop"
                      className="text-[10px] font-semibold text-[#064E3B] hover:underline"
                    >
                      View All →
                    </Link>
                  </div>
                  <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                    {categoriesList.map((cat) => {
                      const catSlug = cat.slug || cat.id;
                      return (
                        <div key={cat.id || cat.slug} className="group/item">
                          <Link
                            to={`/shop?category=${encodeURIComponent(catSlug)}`}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-[#FAF8F1] transition-colors mobile-touch-zoom"
                          >
                            <span className="font-display text-sm font-semibold text-[#064E3B] group-hover/item:text-[#C9A227] transition-colors">
                              <InteractiveNavText text={cat.name} />
                            </span>
                            {cat.cleanSubcategories.length > 0 && (
                              <span className="text-[10px] text-[#5C635E] font-normal">
                                {cat.cleanSubcategories.length} styles
                              </span>
                            )}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Standard Static Links */}
              <Link
                to="/shop?filter=new"
                className="relative text-slate-800 hover:text-[#064E3B] transition-colors py-1 group whitespace-nowrap"
              >
                <InteractiveNavText text="New Arrivals" />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#064E3B] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                to="/contact"
                className="relative text-slate-800 hover:text-[#064E3B] transition-colors py-1 group whitespace-nowrap"
              >
                <InteractiveNavText text="Contact" />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#064E3B] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                to="/track"
                className="relative text-slate-800 hover:text-[#064E3B] transition-colors py-1 group whitespace-nowrap"
              >
                <InteractiveNavText text="Track Order" />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#064E3B] transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            {/* Action Icons: Search, Wishlist, Account, Cart */}
            <div className="flex items-center gap-0.5 sm:gap-2 text-[#171A18] shrink-0">
              {/* Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 sm:p-2.5 rounded-full hover:text-[#064E3B] hover:bg-[#F3EFE3]/50 transition-colors"
                aria-label="Search Collection"
                title="Search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Wishlist / Favorites Icon */}
              <Link
                to="/wishlist"
                className="flex p-1.5 sm:p-2.5 rounded-full hover:text-[#064E3B] hover:bg-slate-100 transition-colors relative"
                aria-label="Wishlist / Favorites"
                title="Wishlist / Favorites"
              >
                <svg className="w-5 h-5 text-slate-700 hover:text-rose-600 transition-colors" fill={state.wishlist.length > 0 ? "#E11D48" : "none"} viewBox="0 0 24 24" stroke={state.wishlist.length > 0 ? "#E11D48" : "currentColor"}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.7} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {state.wishlist.length > 0 && (
                  <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 bg-rose-600 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                    {state.wishlist.length}
                  </span>
                )}
              </Link>

              {/* Customer Account & Tracking Icon (visible on tablets/desktops; on mobile in drawer) */}
              <Link
                to="/account"
                className="hidden sm:flex p-1.5 sm:p-2.5 rounded-full hover:text-[#C9A227] hover:bg-[#F3EFE3]/50 transition-colors relative items-center gap-1.5"
                aria-label="My Account and Tracking"
                title={isLoggedIn ? `Account: ${customer?.name}` : "Sign In & Track Orders"}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {isLoggedIn && (
                  <span className="hidden xl:inline text-[11px] font-semibold text-[#064E3B] max-w-[80px] truncate">
                    {customer?.name.split(" ")[0]}
                  </span>
                )}
              </Link>

              {/* Shopping Bag Icon with Bounce Micro-interaction */}
              <Link
                to="/cart"
                className={`p-1.5 sm:p-2.5 rounded-full hover:text-[#C9A227] hover:bg-[#F3EFE3]/50 transition-colors relative group ${cartAnimate ? "animate-cart-bounce" : ""
                  }`}
                aria-label="Shopping Bag"
                title="Shopping Bag"
              >
                <svg className="w-5 h-5 group-hover:scale-105 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 bg-[#064E3B] text-[#FAF8F1] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold border border-[#C9A227]">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Admin Panel Quick Access is removed from customer storefront */}
            </div>
          </div>
        </div>

        {/* Expandable Search Drawer */}
        {searchOpen && (
          <div className="bg-[#FAF8F1] border-t border-[#E8E2D5] px-4 py-4 sm:py-6 shadow-md transition-all animate-fade-in">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearch} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search pure cotton nighties, unstitched salwar, coord sets..."
                  autoFocus
                  className="w-full bg-[#FFFFFF] border border-[#C9A227]/40 rounded-sm pl-11 pr-24 py-3 text-sm text-[#171A18] placeholder-[#5C635E]/60 focus:outline-none focus:ring-1 focus:ring-[#C9A227] focus:border-[#C9A227]"
                />
                <svg className="w-5 h-5 text-[#C9A227] absolute left-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <div className="absolute right-2 flex items-center gap-1.5">
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-[#064E3B] text-[#FAF8F1] hover:bg-[#0B3D2E] text-xs font-semibold tracking-wider uppercase rounded-xs transition-colors"
                  >
                    Search
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 text-xs"
                  >
                    ✕
                  </button>
                </div>
              </form>
              <div className="flex items-center gap-2 mt-2.5 text-[11px] text-[#5C635E]">
                <span className="font-semibold text-[#C9A227] uppercase tracking-wider">Trending:</span>
                {["Cotton Nighty", "Unstitched Salwar", "Coord Sets", "Maternity Nighty"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      navigate(`/shop?q=${encodeURIComponent(tag)}`);
                      setSearchOpen(false);
                    }}
                    className="hover:text-[#064E3B] hover:underline"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F1] border-t border-[#E8E2D5] px-4 py-4 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto shadow-lg animate-fade-in">
            <nav className="flex flex-col space-y-2 font-body text-base font-semibold tracking-normal text-[#171A18]">
              {/* Home */}
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#064E3B] border-b border-[#E8E2D5]/50 flex items-center justify-between mobile-touch-zoom"
              >
                <InteractiveNavText text="Home" />
                <span className="text-[#C9A227] text-xs">→</span>
              </Link>

              {/* Categories — direct links without accordions */}
              {categoriesList.map((cat) => {
                const catSlug = cat.slug || cat.id;
                return (
                  <Link
                    key={cat.id || cat.slug}
                    to={`/shop?category=${encodeURIComponent(catSlug)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 hover:text-[#064E3B] border-b border-[#E8E2D5]/50 flex items-center justify-between mobile-touch-zoom"
                  >
                    <InteractiveNavText text={cat.name} />
                    <span className="text-[#C9A227] text-xs">→</span>
                  </Link>
                );
              })}

              {/* Standard Links — only commerce-relevant entries */}
              <Link
                to="/shop?filter=new"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#C9A227] border-b border-[#E8E2D5]/50 flex items-center justify-between mobile-touch-zoom"
              >
                <InteractiveNavText text="New Arrivals" />
                <span className="text-[#C9A227] text-xs">→</span>
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#C9A227] border-b border-[#E8E2D5]/50 flex items-center justify-between mobile-touch-zoom"
              >
                <InteractiveNavText text="Contact Us" />
                <span className="text-[#C9A227] text-xs">→</span>
              </Link>
              <Link
                to="/track"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#C9A227] flex items-center justify-between mobile-touch-zoom"
              >
                <InteractiveNavText text="Track Order" />
                <span className="text-[#C9A227] text-xs">→</span>
              </Link>
            </nav>
            <div className="pt-3 border-t border-[#E8E2D5] flex items-center justify-between text-xs text-[#5C635E]">
              <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#064E3B] font-semibold flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#064E3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{isLoggedIn ? customer?.name.split(" ")[0] : "Sign In / Track"}</span>
              </Link>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#064E3B] flex items-center gap-1.5">
                <svg className="w-4 h-4 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>Wishlist ({state.wishlist.length})</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
