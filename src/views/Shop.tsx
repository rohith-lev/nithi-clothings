import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router";
import type { Category } from "../types/store";
import { useStoreProducts, useStoreCategories } from "../services/storefront";
import ProductCard from "../components/ProductCard";
import MobileFilterDrawer from "../components/MobileFilterDrawer";
import RecentlyViewedSection from "../components/RecentlyViewedSection";
import CircularCategoryBrowser from "../components/CircularCategoryBrowser";
import SEO from "../components/SEO";
import { useRecentlyViewed } from "../utils/recentlyViewed";
import { ProductGridSkeleton } from "../components/SkeletonLoaders";

type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "rating" | "discount" | "name-asc" | "name-desc";

export default function Shop() {
  const { slug, sub: routeSub } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const categories = useStoreCategories();
  const allProducts = useStoreProducts();
  const recentProducts = useRecentlyViewed(allProducts);

  const categoryParam = slug || searchParams.get("category") || "";
  const subParam = routeSub || searchParams.get("sub") || searchParams.get("subcategory") || "";
  const filterParam = searchParams.get("filter") || "";
  const searchQuery = searchParams.get("q") || "";
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sort, setSort] = useState<SortOption>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const productGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (subParam && productGridRef.current) {
      productGridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [subParam]);

  const isCategoryMatch = (cat: Category, target: string): boolean => {
    if (!cat || !target) return false;
    const targetNorm = target.toLowerCase().trim();
    const targetClean = targetNorm.replace(/[^a-z0-9]/g, "");

    const cId = (cat.id || "").toLowerCase().trim();
    const cSlug = (cat.slug || "").toLowerCase().trim();
    const cName = (cat.name || "").toLowerCase().trim();
    const cClean = cName.replace(/[^a-z0-9]/g, "");
    const cIdClean = cId.replace(/[^a-z0-9]/g, "");
    const cSlugClean = cSlug.replace(/[^a-z0-9]/g, "");

    if (
      cId === targetNorm ||
      cSlug === targetNorm ||
      cName === targetNorm ||
      cName.replace(/[^a-z0-9]+/g, "-") === targetNorm ||
      cClean === targetClean ||
      cIdClean === targetClean ||
      cSlugClean === targetClean
    ) {
      return true;
    }

    if (
      targetClean.startsWith("night") &&
      !targetClean.includes("dress") &&
      cClean.startsWith("night") &&
      !cClean.includes("dress")
    ) {
      return true;
    }

    if (
      (targetClean.includes("nightdress") || targetClean === "nightdress") &&
      (cClean.includes("nightdress") || cClean === "nightdress")
    ) {
      return true;
    }

    if (targetClean.includes("kurti") && cClean.includes("kurti")) {
      return true;
    }

    if (
      (targetClean.includes("salwar") || targetClean.includes("chudi")) &&
      (cClean.includes("salwar") || cClean.includes("chudi"))
    ) {
      if (
        targetClean.includes("unstitched") ||
        targetClean.includes("material") ||
        targetClean.includes("chudi")
      ) {
        return cClean.includes("unstitched") || cClean.includes("material");
      }
      if (targetClean.includes("set")) {
        return cClean.includes("set");
      }
    }

    if (
      (targetClean.includes("cord") || targetClean.includes("coord")) &&
      (cClean.includes("cord") || cClean.includes("coord"))
    ) {
      return true;
    }

    return false;
  };

  const matchesSubcategory = (productSubcategory: string | undefined, targetSub: string, product?: any): boolean => {
    if (!targetSub) return true;
    const targetNorm = targetSub.toLowerCase().trim();
    const targetClean = targetNorm.replace(/[^a-z0-9]/g, "");
    const targetSlug = targetNorm.replace(/[^a-z0-9]+/g, "-");

    if (!productSubcategory || typeof productSubcategory !== "string") {
      if (product) {
        const pNameClean = (product.name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const pDescClean = (product.description || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        if (pNameClean.includes(targetClean) || pDescClean.includes(targetClean)) {
          return true;
        }
      }
      return false;
    }

    const pSub = productSubcategory.toLowerCase().trim();
    const pSubClean = pSub.replace(/[^a-z0-9]/g, "");
    const pSubSlug = pSub.replace(/[^a-z0-9]+/g, "-");

    // Negative constraints to prevent false-positive overlap between distinct models
    if (targetClean.includes("zipless") && !pSubClean.includes("zipless")) {
      return false;
    }
    if (!targetClean.includes("zipless") && targetClean.includes("zip") && pSubClean.includes("zipless")) {
      return false;
    }
    if (targetClean.includes("nonfeeding") && !pSubClean.includes("nonfeeding")) {
      return false;
    }
    if (!targetClean.includes("nonfeeding") && targetClean.includes("feeding") && pSubClean.includes("nonfeeding")) {
      return false;
    }

    // 1. Direct, Slug, or Clean match of entire subcategory string
    if (
      pSub === targetNorm ||
      pSubClean === targetClean ||
      pSubSlug === targetSlug
    ) {
      return true;
    }

    // 2. Parse parentGroup and item (e.g. "Normal Nighty (55 inches) - Zip nighty")
    let pGroup = "";
    let pItem = pSub;
    if (pSub.includes(" - ")) {
      const parts = pSub.split(" - ");
      pGroup = parts[0].trim();
      pItem = parts.slice(1).join(" - ").trim();
    }

    const pGroupClean = pGroup.replace(/[^a-z0-9]/g, "");
    const pGroupSlug = pGroup.replace(/[^a-z0-9]+/g, "-");
    const pItemClean = pItem.replace(/[^a-z0-9]/g, "");
    const pItemSlug = pItem.replace(/[^a-z0-9]+/g, "-");

    if (
      (pGroup && (pGroup === targetNorm || pGroupClean === targetClean || pGroupSlug === targetSlug)) ||
      (pItem && (pItem === targetNorm || pItemClean === targetClean || pItemSlug === targetSlug))
    ) {
      return true;
    }

    // 3. Clean string inclusion
    if (
      pSubClean === targetClean ||
      pItemClean === targetClean ||
      pGroupClean === targetClean ||
      pSubClean.includes(targetClean) ||
      pItemClean.includes(targetClean) ||
      (pGroupClean && pGroupClean.includes(targetClean))
    ) {
      return true;
    }

    // 4. Token match
    const keywords = targetNorm
      .replace(/[()\-]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 3 && !["model", "wear", "inch", "inches"].includes(w));
    if (
      keywords.length > 0 &&
      keywords.every((kw) => pSub.includes(kw) || (product?.name && product.name.toLowerCase().includes(kw)))
    ) {
      return true;
    }

    return false;
  };

  const activeCatObj = useMemo(() => {
    if (!categoryParam) return null;
    return categories.find((c) => isCategoryMatch(c, categoryParam)) || null;
  }, [categories, categoryParam]);

  const categoryDisplayName = activeCatObj ? activeCatObj.name : categoryParam;

  const filtered = useMemo(() => {
    let list = allProducts.filter((p) => p.status === "ACTIVE" || (!p.status && p.stock > 0));

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.code.toLowerCase().includes(q) ||
          (p.sku && p.sku.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          (p.color && p.color.toLowerCase().includes(q)) ||
          (p.fabric && p.fabric.toLowerCase().includes(q))
      );
    }

    if (categoryParam) {
      const targetClean = (activeCatObj?.name || categoryParam).toLowerCase().replace(/[^a-z0-9]/g, "");
      const targetSlugClean = (activeCatObj?.slug || categoryParam).toLowerCase().replace(/[^a-z0-9]/g, "");
      const targetNorm = categoryParam.toLowerCase().trim();

      list = list.filter((p) => {
        if (!p.category) return false;
        const pCat = p.category.toLowerCase().trim();
        const pCatClean = pCat.replace(/[^a-z0-9]/g, "");
        const pCatSlug = pCat.replace(/[^a-z0-9]+/g, "-");

        if (
          pCat === targetNorm ||
          pCatClean === targetClean ||
          pCatClean === targetSlugClean ||
          pCatSlug === targetSlugClean ||
          (activeCatObj && (pCat === activeCatObj.name.toLowerCase() || pCat === activeCatObj.slug.toLowerCase()))
        ) {
          return true;
        }

        if (
          targetClean.startsWith("night") &&
          !targetClean.includes("dress") &&
          pCatClean.startsWith("night") &&
          !pCatClean.includes("dress")
        ) {
          return true;
        }

        if (targetClean.includes("nightdress") && pCatClean.includes("nightdress")) {
          return true;
        }

        if (targetClean.includes("kurti") && pCatClean.includes("kurti")) {
          return true;
        }

        if (
          (targetClean.includes("salwar") || targetClean.includes("chudi")) &&
          (pCatClean.includes("salwar") || pCatClean.includes("chudi"))
        ) {
          if (
            targetClean.includes("unstitched") ||
            targetClean.includes("material") ||
            targetClean.includes("chudi")
          ) {
            return pCatClean.includes("unstitched") || pCatClean.includes("material");
          }
          if (targetClean.includes("set")) {
            return pCatClean.includes("set");
          }
        }

        if (
          (targetClean.includes("cord") || targetClean.includes("coord")) &&
          (pCatClean.includes("cord") || pCatClean.includes("coord"))
        ) {
          return true;
        }

        return false;
      });
    }

    if (subParam) {
      list = list.filter((p) => matchesSubcategory(p.subcategory, subParam, p));
    }

    if (filterParam === "new") list = list.filter((p) => p.newArrival || p.isNew);
    if (filterParam === "bestseller") list = list.filter((p) => p.isBestSeller);
    if (filterParam === "sale") list = list.filter((p) => p.discount >= 10);

    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    if (selectedSizes.length > 0) {
      list = list.filter((p) => p.sizes && p.sizes.some((s) => selectedSizes.includes(s)));
    }

    switch (sort) {
      case "newest":
        list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "price-asc":
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        list = [...list].sort((a, b) => (a.name || "").localeCompare(b.name || "", undefined, { sensitivity: "base" }));
        break;
      case "name-desc":
        list = [...list].sort((a, b) => (b.name || "").localeCompare(a.name || "", undefined, { sensitivity: "base" }));
        break;
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        list = [...list].sort((a, b) => b.discount - a.discount);
        break;
    }

    return list;
  }, [allProducts, activeCatObj, categoryParam, subParam, filterParam, searchQuery, sort, priceRange, selectedSizes]);

  const pageTitle = searchQuery
    ? `Search: "${searchQuery}"`
    : categoryParam
    ? subParam
      ? `${subParam}`
      : categoryDisplayName
    : filterParam === "new"
    ? "New Arrivals"
    : filterParam === "bestseller"
    ? "Best Sellers"
    : filterParam === "sale"
    ? "Special Offers & Sale"
    : "All Luxury Collections";

  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

  const toggleSize = (size: string) =>
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );

  const clearAllFilters = () => {
    navigate("/shop");
    setSearchParams({});
    setPriceRange([0, 5000]);
    setSelectedSizes([]);
    setSort("featured");
  };

  const hasActiveFilters = Boolean(
    categoryParam || subParam || filterParam || searchQuery || selectedSizes.length > 0 || priceRange[1] < 5000
  );

  const shopSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${pageTitle} | Nithi Clothings`,
    description: `Browse our exclusive collection of ${pageTitle.toLowerCase()} crafted with 100% breathable pure cotton and premium designs at Nithi Clothings.`,
    url: typeof window !== "undefined" ? window.location.href : "https://nithiclothings.com/shop",
  };

  return (
    <div className="bg-[#FAF8F1] min-h-screen font-body">
      <SEO
        title={`${pageTitle} - Pure Cotton Nighties & Ethnic Wear`}
        description={`Explore ${pageTitle} at Nithi Clothings. Handcrafted pure cotton nighties, feeding nighties, and loungewear with all-India shipping & COD.`}
        canonical={categoryParam ? `/category/${encodeURIComponent(categoryParam)}` : "/shop"}
        structuredData={shopSchema}
      />
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#5C635E] mb-6 flex items-center gap-1.5 flex-wrap">
          <Link to="/" className="hover:text-[#064E3B]">Home</Link>
          <span>/</span>
          {categoryParam ? (
            <>
              <Link to="/shop" className="hover:text-[#064E3B]">Shop</Link>
              <span>/</span>
              {subParam ? (
                <>
                  <Link to={`/category/${encodeURIComponent(categoryParam)}`} className="hover:text-[#064E3B]">
                    {categoryDisplayName}
                  </Link>
                  <span>/</span>
                  <span className="text-[#171A18] font-semibold">{subParam}</span>
                </>
              ) : (
                <span className="text-[#171A18] font-semibold">{categoryDisplayName}</span>
              )}
            </>
          ) : (
            <span className="text-[#171A18] font-semibold">{pageTitle}</span>
          )}
        </nav>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 mb-8 border-b border-[#E8E2D5] gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#C9A227] block mb-1">
              Handpicked Coutures
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#064E3B]">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <svg className="w-3.5 h-3.5 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter & Sort</span>
            </button>

            {/* Desktop Sort Dropdown */}
            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-[#171A18]">
              <span>Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-xl px-3.5 py-2 text-xs font-medium text-[#171A18] focus:outline-none focus:border-[#064E3B] shadow-2xs"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest First</option>
                <option value="name-asc">Alphabetical: A to Z</option>
                <option value="name-desc">Alphabetical: Z to A</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Discount %</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Circular Category & Subcategory Interactive Display */}
        <CircularCategoryBrowser
          categories={categories}
          products={allProducts}
          selectedCategory={categoryParam}
          selectedSubcategory={subParam}
          showSubcategories={true}
          onSelectCategory={(catId) => {
            if (!catId) {
              const params = new URLSearchParams(searchParams);
              params.delete("category");
              params.delete("sub");
              params.delete("subcategory");
              setSearchParams(params);
              navigate("/shop");
            } else {
              navigate(`/category/${encodeURIComponent(catId)}`);
            }
          }}
          onSelectSubcategory={(subName) => {
            const currentCat = activeCatObj?.slug || activeCatObj?.id || categoryParam;
            if (currentCat) {
              if (subName) {
                navigate(`/category/${encodeURIComponent(currentCat)}/${encodeURIComponent(subName)}`);
              } else {
                navigate(`/category/${encodeURIComponent(currentCat)}`);
              }
            } else {
              const params = new URLSearchParams(searchParams);
              if (subName) {
                params.set("sub", subName);
              } else {
                params.delete("sub");
                params.delete("subcategory");
              }
              setSearchParams(params);
            }
          }}
          title="Select Category"
          subtitle="Explore all handpicked categories and styles"
        />

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-[#5C635E] font-medium">Active Filters:</span>
            {categoryParam && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#064E3B] px-3.5 py-1 text-[11px] font-bold text-[#FAF8F1] shadow-xs">
                Category: {categoryDisplayName}
                <button
                  type="button"
                  onClick={() => navigate("/shop")}
                  className="ml-1 hover:text-[#C9A227]"
                >
                  ✕
                </button>
              </span>
            )}
            {subParam && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#064E3B] px-3.5 py-1 text-[11px] font-bold text-[#FAF8F1] shadow-xs">
                Style: {subParam}
                <button
                  type="button"
                  onClick={() => {
                    if (categoryParam) {
                      navigate(`/category/${encodeURIComponent(categoryParam)}`);
                    } else {
                      const params = new URLSearchParams(searchParams);
                      params.delete("sub");
                      params.delete("subcategory");
                      setSearchParams(params);
                    }
                  }}
                  className="ml-1 hover:text-[#C9A227]"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedSizes.map((s) => (
              <span
                key={s}
                className="inline-flex items-center gap-1 rounded-full bg-[#064E3B] px-3.5 py-1 text-[11px] font-bold text-[#FAF8F1] shadow-xs"
              >
                Size: {s}
                <button type="button" onClick={() => toggleSize(s)} className="ml-1 hover:text-[#C9A227]">
                  ✕
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-xs font-bold text-[#C9A227] underline hover:text-[#A8811A]"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Grid & Desktop Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            {/* Categories */}
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8E2D5] shadow-xs">
              <h3 className="font-display text-xs font-bold text-[#064E3B] uppercase tracking-[0.18em] mb-3 pb-2 border-b border-[#E8E2D5]">
                Collections
              </h3>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => navigate("/shop")}
                  className={`block w-full text-left py-2 px-3 rounded-xl transition-colors ${
                    !categoryParam && !filterParam
                      ? "bg-[#064E3B] text-[#FAF8F1] font-semibold"
                      : "text-[#171A18] hover:text-[#064E3B] hover:bg-[#F3EFE3]/60"
                  }`}
                >
                  ✦ All Products
                </button>
                {categories.map((cat) => {
                  const isCatSelected =
                    Boolean(categoryParam) &&
                    ((cat.id && cat.id.toLowerCase() === categoryParam.toLowerCase()) ||
                      (cat.slug && cat.slug.toLowerCase() === categoryParam.toLowerCase()) ||
                      (cat.name && cat.name.toLowerCase() === categoryParam.toLowerCase()));
                  return (
                    <button
                      key={cat.id || cat.slug || cat.name}
                      onClick={() => navigate(`/category/${encodeURIComponent(cat.slug || cat.id || cat.name)}`)}
                      className={`block w-full text-left py-2 px-3 rounded-xl transition-colors ${
                        isCatSelected
                          ? "bg-[#064E3B] text-[#FAF8F1] font-semibold"
                          : "text-[#171A18] hover:text-[#064E3B] hover:bg-[#F3EFE3]/60"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sizes */}
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8E2D5] shadow-xs">
              <h3 className="font-display text-xs font-bold text-[#064E3B] uppercase tracking-[0.18em] mb-3 pb-2 border-b border-[#E8E2D5]">
                Sizes
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {allSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                      selectedSizes.includes(sz)
                        ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1]"
                        : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#C9A227]"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-3">
              <h3 className="font-display text-xs font-bold text-[#064E3B] uppercase tracking-[0.18em] pb-2 border-b border-[#E8E2D5]">
                Price Limit
              </h3>
              <div className="flex justify-between text-xs font-bold text-[#064E3B]">
                <span>₹0</span>
                <span>Up to ₹{priceRange[1].toLocaleString("en-IN")}</span>
              </div>
              <input
                type="range"
                min={300}
                max={5000}
                step={100}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="w-full accent-[#064E3B]"
              />
            </div>
          </aside>

          {/* Product Grid Area */}
          <main ref={productGridRef} id="shop-product-grid" className="lg:col-span-3 scroll-mt-24">
            {allProducts.length === 0 ? (
              <ProductGridSkeleton count={6} />
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-[#E8E2D5] bg-[#FFFFFF] p-12 text-center shadow-xs">
                <div className="flex justify-center mb-3">
                  <div className="w-12 h-12 rounded-full bg-[#064E3B]/10 flex items-center justify-center text-[#064E3B]">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-[#064E3B] mb-2">
                  No matching garments found
                </h3>
                <p className="text-xs text-[#5C635E] max-w-sm mx-auto mb-6">
                  Try adjusting your filter options, clearing size selections, or searching for other designs.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="rounded-xl bg-[#064E3B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#FAF8F1] hover:bg-[#0B3D2E] transition-colors shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Bottom Recently Viewed Section */}
        <RecentlyViewedSection products={recentProducts} />
      </div>

      {/* Mobile Bottom-sheet Filter Drawer */}
      <MobileFilterDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        selectedCategory={categoryParam}
        onSelectCategory={(cat) => {
          if (cat) {
            navigate(`/category/${encodeURIComponent(cat)}`);
          } else {
            navigate("/shop");
          }
        }}
        selectedSubcategory={subParam}
        onSelectSubcategory={(sub) => {
          if (categoryParam) {
            if (sub) {
              navigate(`/category/${encodeURIComponent(categoryParam)}/${encodeURIComponent(sub)}`);
            } else {
              navigate(`/category/${encodeURIComponent(categoryParam)}`);
            }
          } else {
            const params = new URLSearchParams(searchParams);
            if (sub) params.set("sub", sub);
            else {
              params.delete("sub");
              params.delete("subcategory");
            }
            setSearchParams(params);
          }
        }}
        selectedSizes={selectedSizes}
        onToggleSize={toggleSize}
        priceRange={priceRange}
        onPriceChange={setPriceRange}
        sort={sort}
        onSortChange={setSort}
        totalResults={filtered.length}
        onClearAll={clearAllFilters}
      />
    </div>
  );
}
