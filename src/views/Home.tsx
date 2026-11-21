import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import { useStoreProducts, useStoreCategories } from "../services/storefront";
import ProductCard from "../components/ProductCard";
import CircularCategoryBrowser from "../components/CircularCategoryBrowser";
import SEO from "../components/SEO";

export default function Home() {
  const navigate = useNavigate();
  const categories = useStoreCategories();
  const products = useStoreProducts();
  const activeProducts = products.filter((p) => p.status === "ACTIVE" || (!p.status && p.stock > 0));

  const [activeTab, setActiveTab] = useState<"featured" | "bestseller" | "new">("featured");

  // Scroll Reveal Intersection Observer
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    const elements = root.querySelectorAll(
      ".reveal-on-scroll, .reveal-on-scroll-scale, .reveal-up, .reveal-down, .reveal-left, .reveal-right, .reveal-scale"
    );
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // Filter categories enabled for Home Page and sort by priority order
  const homeCategories = useMemo(() => {
    return categories
      .filter((cat) => cat && cat.isActive !== false && cat.showOnHome !== false)
      .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }, [categories]);

  // Total products belonging to currently enabled Home Page categories
  const homeCategoryProducts = useMemo(() => {
    if (homeCategories.length === 0) return activeProducts;
    const activeNames = homeCategories.map((c) => (c.name || "").toLowerCase().trim());
    const activeSlugs = homeCategories.map((c) => (c.slug || "").toLowerCase().trim());
    const activeIds = homeCategories.map((c) => (c.id || "").toLowerCase().trim());

    return activeProducts.filter((p) => {
      if (!p || !p.category) return false;
      const pCat = p.category.toLowerCase().trim();
      const pCatSlug = pCat.replace(/[^a-z0-9]+/g, "-");
      return (
        activeNames.includes(pCat) ||
        activeSlugs.includes(pCat) ||
        activeIds.includes(pCat) ||
        activeSlugs.includes(pCatSlug)
      );
    });
  }, [activeProducts, homeCategories]);

  // Specific curated product subsets for non-filtered default home view
  const newArrivals = activeProducts.filter((p) => p.newArrival || p.isNew).slice(0, 8);
  const bestsellers = activeProducts.filter((p) => p.isBestSeller).slice(0, 8);
  const trendingProducts = activeProducts.filter((p) => p.discount >= 15 || p.isBestSeller || p.rating >= 4.7).slice(0, 8);

  const displayedProducts = (() => {
    if (activeTab === "bestseller") {
      return bestsellers.length > 0 ? bestsellers : activeProducts.slice(0, 8);
    }
    if (activeTab === "new") {
      return newArrivals.length > 0 ? newArrivals : activeProducts.slice(0, 8);
    }
    return activeProducts.slice(0, 8);
  })();

  const whyChooseUs = [
    {
      icon: (
        <svg className="w-5 h-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: "Quality Stitching & Finish",
      desc: "Reinforced seams, colorfast dyes, and durable cotton tailored for long-lasting comfort.",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#064E3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "100% Breathable Cotton",
      desc: "Pure combed cotton, mulmul, and soft everyday fabrics designed for daily comfort.",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Pan-India Express Delivery",
      desc: "Fast dispatch with Cash on Delivery (COD) and free shipping on orders above ₹999.",
    },
    {
      icon: (
        <svg className="w-5 h-5 text-[#064E3B]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Customer Support Helpline",
      desc: "Dedicated support team at 8122436850 & 9345136762 for order tracking and sizing help.",
    },
  ];

  return (
    <div ref={containerRef} className="bg-slate-50 text-slate-800 font-body relative overflow-x-hidden">
      <SEO
        title="Pure Cotton Nighties, Feeding Nighties & Ethnic Loungewear"
        description="Shop online at Nithi Collections for 100% pure cotton nighties, nursing zip nighties, and daily ethnic wear. Breathable quality fabrics with all-India cash on delivery."
        canonical="/"
      />

      {/* 1. HERO SECTION (Clean Retail Design) */}
      <section className="relative min-h-[540px] lg:min-h-[640px] flex items-center overflow-hidden bg-[#041D16]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&h=900&fit=crop&auto=format"
            alt="Nithi Collections Everyday Pure Cotton Wear"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#041D16]/95 via-[#041D16]/85 to-[#064E3B]/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.18),transparent_60%)]" />

          {/* Ambient Decorative Glowing Orbs */}
          <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl animate-hero-glow" />
          <div className="pointer-events-none absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-[#064E3B]/30 blur-2xl animate-hero-glow [animation-delay:3s]" />
        </div>

        {/* Hero Text & CTA Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full animate-fade-in-up">
          <div className="max-w-2xl text-white space-y-6">
            {/* Top retail badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm shadow-sm transition-transform duration-500 hover:scale-105">
              <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-200">
                100% Pure Combed Cotton & Everyday Wear
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] text-white tracking-tight">
              Everyday Comfort <br />
              <span className="text-[#DFC15E] font-normal">Crafted In Pure Cotton</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-slate-200 max-w-lg leading-relaxed font-light">
              Shop online for premium pure cotton nighties, nursing zip nighties, cord sets, and daily ethnic wear designed for soft, breathable comfort.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#064E3B] text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:bg-[#0B3D2E] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Shop All Collections</span>
                <span className="ml-2">→</span>
              </Link>
              <Link
                to="/shop?category=nighty"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-white/10 text-white border border-white/30 font-semibold text-xs uppercase tracking-wider backdrop-blur-sm hover:bg-white hover:text-[#064E3B] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Nighty Special</span>
              </Link>
            </div>

            {/* Trust Badges in Hero */}
            <div className="pt-8 border-t border-white/15 grid grid-cols-3 gap-4 max-w-md">
              <div className="transition-transform duration-300 hover:-translate-y-1">
                <span className="font-display text-2xl lg:text-3xl font-bold text-[#DFC15E]">100%</span>
                <p className="text-[10px] text-slate-300 uppercase tracking-wider mt-0.5">Pure Cotton</p>
              </div>
              <div className="transition-transform duration-300 hover:-translate-y-1">
                <span className="font-display text-2xl lg:text-3xl font-bold text-amber-300">50k+</span>
                <p className="text-[10px] text-slate-300 uppercase tracking-wider mt-0.5">Happy Shoppers</p>
              </div>
              <div className="transition-transform duration-300 hover:-translate-y-1">
                <span className="font-display text-2xl lg:text-3xl font-bold text-amber-300">Pan-India</span>
                <p className="text-[10px] text-slate-300 uppercase tracking-wider mt-0.5">COD Delivery</p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Feature Card on Desktop */}
        <div className="hidden lg:block absolute right-12 xl:right-20 top-1/2 -translate-y-1/2 z-20 pointer-events-none animate-hero-float">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-2xl max-w-xs text-white space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">Special Focus</span>
            </div>
            <p className="font-display text-lg font-semibold leading-snug">
              Combed Cotton Nighties & Daily Wear
            </p>
            <div className="flex items-center justify-between text-[11px] text-white/80 pt-2 border-t border-white/15">
              <span>Standard Retail Quality</span>
              <span className="text-amber-300 font-bold">100% Cotton</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC "SELECT CATEGORY" DISCOVERY SHOWCASE (Navigation Only) */}
      <section className="py-4 sm:py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-2 sm:mb-3 reveal-up">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="w-8 h-[1px] bg-[#C9A227]" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-[#064E3B] font-semibold">
              Storefront Categories
            </span>
            <span className="w-8 h-[1px] bg-[#C9A227]" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#064E3B] tracking-tight">
            Select Category
          </h2>
        </div>

        {/* Category Cards - Only Category Discovery, Click to Navigate to Separate Category Page */}
        <CircularCategoryBrowser
          categories={homeCategories}
          products={homeCategoryProducts}
          showSubcategories={false}
          onSelectCategory={(targetIdentifier) => {
            if (!targetIdentifier) {
              navigate("/shop");
            } else {
              navigate(`/shop?category=${encodeURIComponent(targetIdentifier)}`);
            }
          }}
          title="Select Category"
          subtitle="Explore our retail collections designed for daily comfort"
        />
      </section>

      {/* 3. NEW ARRIVALS SECTION */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div className="reveal-left">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-[1px] bg-[#C9A227]" />
                <span className="text-xs uppercase tracking-wider text-[#064E3B] font-semibold">
                  Latest Drops
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#064E3B] tracking-tight">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?filter=new"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#064E3B] hover:text-[#0B3D2E] transition-colors pb-1 border-b border-[#064E3B] reveal-right"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(newArrivals.length > 0 ? newArrivals : activeProducts.slice(0, 4)).map((product, idx) => (
              <div key={product.id} className={`reveal-up reveal-delay-${(idx % 4) + 1}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRENDING NOW SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div className="reveal-left">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-[1px] bg-[#C9A227]" />
              <span className="text-xs uppercase tracking-wider text-[#064E3B] font-semibold">
                Customer Favorites
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#064E3B] tracking-tight">
              Trending Now
            </h2>
          </div>
          <Link
            to="/shop?filter=sale"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#064E3B] hover:text-[#0B3D2E] transition-colors pb-1 border-b border-[#064E3B] reveal-right"
          >
            <span>Explore Offers</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(trendingProducts.length > 0 ? trendingProducts : activeProducts.slice(0, 4)).map((product, idx) => (
            <div key={product.id} className={`reveal-up reveal-delay-${(idx % 4) + 1}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* 5. BESTSELLERS & FEATURED SECTION TABS */}
      <section className="py-16 bg-slate-100/60 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="reveal-left">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-[1px] bg-[#C9A227]" />
                <span className="text-xs uppercase tracking-wider text-[#064E3B] font-semibold">
                  Popular Picks
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#064E3B] tracking-tight">
                Featured Collections
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 text-xs font-semibold uppercase tracking-wider shadow-2xs reveal-right">
              <button
                type="button"
                onClick={() => setActiveTab("featured")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === "featured"
                  ? "bg-[#064E3B] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#064E3B]"
                  }`}
              >
                Featured
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bestseller")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === "bestseller"
                  ? "bg-[#064E3B] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#064E3B]"
                  }`}
              >
                Best Sellers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("new")}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${activeTab === "new"
                  ? "bg-[#064E3B] text-white shadow-xs"
                  : "text-slate-600 hover:text-[#064E3B]"
                  }`}
              >
                New Arrivals
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedProducts.map((product, idx) => (
              <div key={product.id} className={`reveal-up reveal-delay-${(idx % 4) + 1}`}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BRAND VALUE PILLARS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {whyChooseUs.map((pillar, idx) => (
            <div
              key={pillar.title}
              className={`p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#064E3B] hover:shadow-md transition-all duration-300 reveal-up reveal-delay-${idx + 1}`}
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                {pillar.icon}
              </div>
              <h3 className="font-display text-base font-bold text-[#064E3B] mb-2">
                {pillar.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
