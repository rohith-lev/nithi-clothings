import { useState } from "react";
import { Link } from "react-router";
import { useStoreProducts } from "../services/storefront";
import ProductCard from "../components/ProductCard";
import CircularOfferBadge from "../components/CircularOfferBadge";

export default function Home() {
  const products = useStoreProducts();
  const activeProducts = products.filter((p) => p.status === "ACTIVE" || (!p.status && p.stock > 0));

  const [activeTab, setActiveTab] = useState<"featured" | "bestseller" | "new">("featured");

  // Editorial category collections
  const luxuryCollections = [
    {
      id: "nighty",
      name: "Nighties",
      subtitle: "Pure Cotton, Smocking & Maternity",
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=700&h=900&fit=crop&auto=format",
      to: "/shop?category=nighty",
    },
    {
      id: "night-dress",
      name: "Night Dress",
      subtitle: "2-Piece Sets & Sleepwear",
      image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=700&h=900&fit=crop&auto=format",
      to: "/shop?category=night-dress",
    },
    {
      id: "unstitched-salwar",
      name: "Unstitched Salwar",
      subtitle: "Pure Cotton & Chanderi Silk Material",
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=700&h=900&fit=crop&auto=format",
      to: "/shop?category=unstitched-salwar",
    },
    {
      id: "cord-set",
      name: "Coord Sets",
      subtitle: "Trendy 2-Piece Western & Ethnic",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700&h=900&fit=crop&auto=format",
      to: "/shop?category=cord-set",
    },
    {
      id: "kurtis",
      name: "Kurtis & Tops",
      subtitle: "A-Line, Straight Cut & Anarkali",
      image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=700&h=900&fit=crop&auto=format",
      to: "/shop?category=kurtis",
    },
    {
      id: "salwar-set",
      name: "Salwar Sets",
      subtitle: "Ready to Wear Stitched Suits",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=700&h=900&fit=crop&auto=format",
      to: "/shop?category=salwar-set",
    },
    {
      id: "maxi",
      name: "Maxi Gowns",
      subtitle: "Breezy Cotton Flared Daily Wear",
      image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=700&h=900&fit=crop&auto=format",
      to: "/shop?category=maxi",
    },
  ];

  // Specific curated product subsets
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
      icon: "⚜️",
      title: "Artisanal Craftsmanship",
      desc: "Fine tailoring, durable dyes, and master stitchwork built for lasting elegance.",
    },
    {
      icon: "🌿",
      title: "100% Breathable Fabrics",
      desc: "Pure combed cotton, mulmul, and handpicked silks designed for tropical comfort.",
    },
    {
      icon: "⚡",
      title: "Express Pan-India Delivery",
      desc: "Rapid dispatch with Cash on Delivery and complimentary shipping above ₹999.",
    },
    {
      icon: "💬",
      title: "WhatsApp Personal Concierge",
      desc: "Direct stylist assistance on WhatsApp for size selection and order guidance.",
    },
  ];

  return (
    <div className="bg-[#FAF8F1] text-[#171A18] font-body relative">
      {/* Circular Floating Offer Badge */}
      <CircularOfferBadge />

      {/* 1. HERO SECTION (Editorial Fashion Design) */}
      <section className="relative min-h-[580px] lg:min-h-[720px] flex items-center overflow-hidden bg-[#064E3B]">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&h=900&fit=crop&auto=format"
            alt="Nithi Collection Indian Couture Hero"
            className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#064E3B]/95 via-[#064E3B]/80 to-[#0B3D2E]/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(201,162,39,0.18),transparent_60%)]" />
        </div>

        {/* Hero Text & CTA Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full animate-fade-in-up">
          <div className="max-w-2xl text-[#FAF8F1] space-y-6">
            {/* Top luxury badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#FAF8F1]/10 border border-[#C9A227]/50 backdrop-blur-sm shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#C9A227] animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A227]">
                Authentic Indian Couture & Daily Wear
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.12] text-[#FAF8F1] tracking-tight">
              Elegance Woven <br />
              <span className="text-[#C9A227] italic font-normal">With Heritage & Grace</span>
            </h1>

            {/* Supporting Copy */}
            <p className="text-sm sm:text-base text-[#FAF8F1]/85 leading-relaxed font-normal max-w-xl">
              Immerse yourself in authentic Indian fashion. Handpicked pure cotton nightwear, artisanal
              salwar sets, and celebratory drapes designed for effortless beauty and everyday comfort.
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/shop"
                className="px-8 py-3.5 bg-[#C9A227] hover:bg-[#E2C467] text-[#064E3B] font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-black/20 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <span>Shop Collection</span>
                <span>→</span>
              </Link>
              <Link
                to="/shop?filter=new"
                className="px-8 py-3.5 border border-[#FAF8F1]/40 hover:border-[#C9A227] hover:bg-[#FAF8F1]/10 text-[#FAF8F1] font-semibold text-xs uppercase tracking-[0.2em] rounded-xl backdrop-blur-xs transition-all"
              >
                Explore New Arrivals
              </Link>
            </div>

            {/* Highlights Bar */}
            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-[#C9A227]/25 max-w-md text-[#FAF8F1]">
              <div>
                <span className="font-display text-2xl lg:text-3xl font-bold text-[#C9A227]">100%</span>
                <p className="text-[10px] text-[#FAF8F1]/70 uppercase tracking-wider mt-0.5">Pure Cotton</p>
              </div>
              <div>
                <span className="font-display text-2xl lg:text-3xl font-bold text-[#C9A227]">50k+</span>
                <p className="text-[10px] text-[#FAF8F1]/70 uppercase tracking-wider mt-0.5">Happy Shoppers</p>
              </div>
              <div>
                <span className="font-display text-2xl lg:text-3xl font-bold text-[#C9A227]">Pan-India</span>
                <p className="text-[10px] text-[#FAF8F1]/70 uppercase tracking-wider mt-0.5">COD Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED CATEGORIES SECTION */}
      <section className="py-16 lg:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="w-8 h-[1px] bg-[#C9A227]" />
            <span className="text-xs uppercase tracking-[0.28em] text-[#C9A227] font-semibold">
              Curated Wardrobe
            </span>
            <span className="w-8 h-[1px] bg-[#C9A227]" />
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-[#064E3B] tracking-tight">
            Explore Collections
          </h2>
          <p className="text-xs sm:text-sm text-[#5C635E] mt-2.5 leading-relaxed">
            From breathable nightwear to festive silk sets, discover pieces tailored to elevate your daily grace.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 overflow-x-auto pb-2">
          {luxuryCollections.map((col) => (
            <Link
              key={col.id}
              to={col.to}
              className="group relative overflow-hidden rounded-2xl border border-[#E8E2D5] bg-[#FFFFFF] shadow-xs hover:shadow-lg transition-all duration-500 flex flex-col"
            >
              <div className="aspect-[3/4] overflow-hidden bg-[#F3EFE3] relative rounded-2xl">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#064E3B]/90 via-[#064E3B]/25 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                <div className="absolute bottom-0 inset-x-0 p-3 text-center text-[#FAF8F1]">
                  <h3 className="font-display text-sm sm:text-base font-bold group-hover:text-[#C9A227] transition-colors leading-tight">
                    {col.name}
                  </h3>
                  <p className="text-[9px] text-[#FAF8F1]/80 font-medium tracking-wide mt-0.5 line-clamp-1">
                    {col.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. NEW ARRIVALS SECTION */}
      <section className="py-16 bg-[#F3EFE3]/50 border-y border-[#E8E2D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-[1px] bg-[#C9A227]" />
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
                  Fresh Off The Loom
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#064E3B] tracking-tight">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?filter=new"
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#064E3B] hover:text-[#C9A227] transition-colors pb-1 border-b border-[#064E3B]"
            >
              <span>View All</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {(newArrivals.length > 0 ? newArrivals : activeProducts.slice(0, 4)).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRENDING NOW SECTION */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-6 h-[1px] bg-[#C9A227]" />
              <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
                Customer Favorites
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#064E3B] tracking-tight">
              Trending Now
            </h2>
          </div>
          <Link
            to="/shop?filter=sale"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#064E3B] hover:text-[#C9A227] transition-colors pb-1 border-b border-[#064E3B]"
          >
            <span>Explore Offers</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {(trendingProducts.length > 0 ? trendingProducts : activeProducts.slice(0, 4)).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. BESTSELLERS & FEATURED SECTION TABS */}
      <section className="py-16 bg-[#F3EFE3]/40 border-y border-[#E8E2D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-6 h-[1px] bg-[#C9A227]" />
                <span className="text-xs uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
                  Heritage Selections
                </span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#064E3B] tracking-tight">
                Featured Collections
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 bg-[#FFFFFF] p-1.5 rounded-xl border border-[#E8E2D5] text-xs font-semibold uppercase tracking-wider shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab("featured")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "featured"
                    ? "bg-[#064E3B] text-[#FAF8F1] shadow-xs"
                    : "text-[#5C635E] hover:text-[#064E3B]"
                }`}
              >
                Featured
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bestseller")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "bestseller"
                    ? "bg-[#064E3B] text-[#FAF8F1] shadow-xs"
                    : "text-[#5C635E] hover:text-[#064E3B]"
                }`}
              >
                Best Sellers
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("new")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "new"
                    ? "bg-[#064E3B] text-[#FAF8F1] shadow-xs"
                    : "text-[#5C635E] hover:text-[#064E3B]"
                }`}
              >
                New Arrivals
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {displayedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#FFFFFF] border-2 border-[#064E3B] text-[#064E3B] hover:bg-[#064E3B] hover:text-[#FAF8F1] text-xs font-bold uppercase tracking-[0.2em] rounded-xl shadow-xs transition-all"
            >
              <span>View Entire Catalogue</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. PROMOTIONAL COMBO BANNER */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#064E3B] text-[#FAF8F1] p-8 sm:p-12 lg:p-16 border border-[#C9A227]/40 shadow-xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <span className="inline-block rounded-full bg-[#C9A227] px-4 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#171A18]">
              Limited Time Combo Offer
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold leading-tight">
              Buy Any 3 Cotton Nighties & Get Free Express Shipping
            </h2>
            <p className="text-sm text-[#FAF8F1]/85 leading-relaxed">
              Mix and match colors and patterns across our pure combed cotton collection. Save instantly with bundled pricing.
            </p>
            <div className="pt-2">
              <Link
                to="/shop?category=nighty"
                className="inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#064E3B] hover:bg-[#E2C467] transition-all shadow-md"
              >
                <span>Shop Nighty Combos</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE NITHI COLLECTION */}
      <section className="py-16 bg-[#FFFFFF] border-t border-[#E8E2D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-[#FAF8F1] border border-[#E8E2D5]/70 shadow-2xs">
                <span className="text-2xl shrink-0 p-3 rounded-full bg-[#FFFFFF] border border-[#E8E2D5] shadow-2xs">
                  {item.icon}
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-[#064E3B] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#5C635E] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
