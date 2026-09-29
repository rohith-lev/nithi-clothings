import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useCart } from "../store/cart";
import { useCustomerAuth } from "../services/customerAuth";
import { useStoreCategories } from "../services/storefront";
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
  const [mobileExpandedCatIds, setMobileExpandedCatIds] = useState<Record<string, boolean>>({});
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

  // Deduplicate and sanitize categories
  const categoriesList = useMemo(() => {
    const seen = new Set<string>();
    const list: (Category & { cleanSubcategories: { id: string; name: string }[] })[] = [];

    for (const cat of rawCategories) {
      const key = (cat.slug || cat.id || cat.name || "").toLowerCase().trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);

      const cleanSubs: { id: string; name: string }[] = [];
      const subSeen = new Set<string>();

      if (Array.isArray(cat.subcategories)) {
        for (const sub of cat.subcategories) {
          const subName = typeof sub === "string" ? sub : sub?.name;
          const subId = typeof sub === "string" ? sub : sub?.id || sub?.name;
          if (subName && !subSeen.has(subName.toLowerCase().trim())) {
            subSeen.add(subName.toLowerCase().trim());
            cleanSubs.push({ id: subId, name: subName.trim() });
          }
        }
      }

      list.push({
        ...cat,
        cleanSubcategories: cleanSubs,
      });
    }

    return list;
  }, [rawCategories]);

  const toggleMobileCategory = (catId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMobileExpandedCatIds((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  return (
    <>
      {/* Top Luxury Announcement Marquee Ticker */}
      <MarqueeTicker />

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
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

            {/* Desktop Navigation - Clean, uncrowded layout */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10 font-body text-xs font-semibold tracking-[0.14em] uppercase text-[#171A18]">
              {/* Home Link */}
              <Link
                to="/"
                className="relative text-[#171A18] hover:text-[#064E3B] transition-colors py-1 group"
              >
                <InteractiveNavText text="Home" />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C9A227] transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* Shop / Categories Dropdown */}
              <div
                className="relative group py-6"
                onMouseEnter={() => setActiveDropdownCatId("all-shop")}
                onMouseLeave={() => setActiveDropdownCatId(null)}
              >
                <Link
                  to="/shop"
                  className="flex items-center gap-1.5 text-[#171A18] hover:text-[#064E3B] transition-colors relative py-1"
                >
                  <InteractiveNavText text="Shop" />
                  <svg
                    className={`w-3 h-3 text-[#C9A227] transition-transform duration-200 ${
                      activeDropdownCatId === "all-shop" ? "rotate-180" : "group-hover:rotate-180"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C9A227] transition-all duration-300 group-hover:w-full" />
                </Link>

                {/* Categories & Subcategories Dropdown */}
                <div className="absolute top-full -left-6 w-80 bg-[#FFFFFF] border border-[#E8E2D5] shadow-2xl rounded-2xl p-3.5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="p-2 border-b border-[#E8E2D5]/70 mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#C9A227] tracking-[0.2em] uppercase block">
                      Garment Categories
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
                className="relative text-[#171A18] hover:text-[#064E3B] transition-colors py-1 group whitespace-nowrap"
              >
                <InteractiveNavText text="New Arrivals" />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C9A227] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                to="/about"
                className="relative text-[#171A18] hover:text-[#064E3B] transition-colors py-1 group whitespace-nowrap"
              >
                <InteractiveNavText text="About Us" />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C9A227] transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                to="/contact"
                className="relative text-[#171A18] hover:text-[#064E3B] transition-colors py-1 group whitespace-nowrap"
              >
                <InteractiveNavText text="Contact" />
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#C9A227] transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            {/* Action Icons: Search, Wishlist, Account, Cart */}
            <div className="flex items-center gap-0.5 sm:gap-2 text-[#171A18] shrink-0">
              {/* Search Button */}
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 sm:p-2.5 rounded-full hover:text-[#C9A227] hover:bg-[#F3EFE3]/50 transition-colors"
                aria-label="Search Collection"
                title="Search"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {/* Wishlist Icon (visible on tablets/desktops; on mobile in drawer) */}
              <Link
                to="/wishlist"
                className="hidden xs:flex p-1.5 sm:p-2.5 rounded-full hover:text-[#C9A227] hover:bg-[#F3EFE3]/50 transition-colors relative"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {state.wishlist.length > 0 && (
                  <span className="absolute top-1 sm:top-1.5 right-1 sm:right-1.5 bg-[#C9A227] text-[#171A18] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
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
                className={`p-1.5 sm:p-2.5 rounded-full hover:text-[#C9A227] hover:bg-[#F3EFE3]/50 transition-colors relative group ${
                  cartAnimate ? "animate-cart-bounce" : ""
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

              {/* Admin Panel Quick Access (hidden on mobile, available in drawer) */}
              <Link
                to="/admin/products"
                className="hidden md:inline-flex items-center gap-1.5 bg-[#064E3B] hover:bg-[#0B3D2E] text-[#FAF8F1] text-[10px] font-bold uppercase tracking-wider px-3 py-2 rounded-xs border border-[#C9A227]/50 shadow-xs transition-colors shrink-0"
                title="Admin Dashboard & Product Creator"
              >
                <svg className="w-3.5 h-3.5 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Admin</span>
              </Link>
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
            <nav className="flex flex-col space-y-1.5 font-body text-sm font-semibold tracking-[0.08em] uppercase text-[#171A18]">
              {/* Home */}
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#C9A227] border-b border-[#E8E2D5]/50 flex items-center justify-between mobile-touch-zoom"
              >
                <InteractiveNavText text="Home" />
                <span className="text-[#C9A227] text-xs">→</span>
              </Link>

              {/* Dynamic Database Categories */}
              {categoriesList.map((cat) => {
                const catSlug = cat.slug || cat.id;
                const hasSubs = cat.cleanSubcategories.length > 0;
                const isExpanded = Boolean(mobileExpandedCatIds[cat.id]);

                if (hasSubs) {
                  return (
                    <div key={cat.id || cat.slug} className="border-b border-[#E8E2D5]/50 py-1">
                      <div className="flex items-center justify-between py-1">
                        <Link
                          to={`/shop?category=${encodeURIComponent(catSlug)}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 hover:text-[#064E3B] transition-colors mobile-touch-zoom"
                        >
                          <InteractiveNavText text={cat.name} />
                        </Link>
                        <button
                          type="button"
                          onClick={(e) => toggleMobileCategory(cat.id, e)}
                          className="p-1.5 text-[#C9A227] hover:bg-[#F3EFE3] rounded-sm transition-colors active:scale-125"
                          aria-label={`Toggle ${cat.name} subcategories`}
                        >
                          <svg
                            className={`w-4 h-4 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>

                      {/* Subcategories Accordion */}
                      {isExpanded && (
                        <div className="pl-3 py-2 space-y-2 text-xs normal-case tracking-normal font-normal text-[#5C635E] border-l-2 border-[#C9A227]/40 ml-1 animate-fade-in">
                          {cat.cleanSubcategories.map((sub) => (
                            <Link
                              key={sub.id || sub.name}
                              to={`/shop?category=${encodeURIComponent(catSlug)}&sub=${encodeURIComponent(sub.name)}`}
                              onClick={() => setMobileMenuOpen(false)}
                              className="block py-1 hover:text-[#064E3B] transition-colors mobile-touch-zoom"
                            >
                              ✦ <InteractiveNavText text={sub.name} />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={cat.id || cat.slug}
                    to={`/shop?category=${encodeURIComponent(catSlug)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="py-2 hover:text-[#C9A227] border-b border-[#E8E2D5]/50 flex items-center justify-between mobile-touch-zoom"
                  >
                    <InteractiveNavText text={cat.name} />
                    <span className="text-[#C9A227] text-xs">→</span>
                  </Link>
                );
              })}

              {/* Standard Static Links */}
              <Link
                to="/shop?filter=new"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#C9A227] border-b border-[#E8E2D5]/50 flex items-center justify-between mobile-touch-zoom"
              >
                <InteractiveNavText text="New Arrivals" />
                <span className="text-[#C9A227] text-xs">→</span>
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#C9A227] border-b border-[#E8E2D5]/50 flex items-center justify-between mobile-touch-zoom"
              >
                <InteractiveNavText text="About Us" />
                <span className="text-[#C9A227] text-xs">→</span>
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-[#C9A227] flex items-center justify-between mobile-touch-zoom"
              >
                <InteractiveNavText text="Contact Us" />
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
              <Link to="/admin/products" onClick={() => setMobileMenuOpen(false)} className="text-[#064E3B] font-bold flex items-center gap-1.5">
                <svg className="w-4 h-4 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Admin</span>
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
