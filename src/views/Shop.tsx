import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router";
import type { Category } from "../types/store";
import { useStoreProducts, useStoreCategories } from "../services/storefront";
import ProductCard from "../components/ProductCard";
import MobileFilterDrawer from "../components/MobileFilterDrawer";
import RecentlyViewedSection from "../components/RecentlyViewedSection";
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
  const typeParam = searchParams.get("type") || "";
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

  const isCordSet = Boolean(
    categoryParam &&
    (categoryParam.toLowerCase().includes("cord") ||
      categoryParam.toLowerCase().includes("coord") ||
      (activeCatObj && (activeCatObj.name.toLowerCase().includes("cord") || activeCatObj.name.toLowerCase().includes("coord"))))
  );

  const subcategoriesForActiveCat = useMemo(() => {
    const set = new Set<string>();
    if (activeCatObj) {
      if (Array.isArray(activeCatObj.subcategories)) {
        for (const sub of activeCatObj.subcategories) {
          const name = typeof sub === "string" ? sub : sub?.name;
          if (name) set.add(name.trim());
        }
      }
    }
    for (const p of allProducts) {
      if (categoryParam && isCategoryMatch({ name: p.category, id: p.category } as Category, categoryParam)) {
        if (p.subcategory && typeof p.subcategory === "string" && p.subcategory.trim()) {
          let s = p.subcategory.trim();
          if (s.includes(" - ")) {
            s = s.split(" - ").slice(1).join(" - ").trim();
          }
          if (s) set.add(s);
        }
      }
    }
    if (isCordSet && set.size === 0) {
      set.add("Printed Cord Set");
      set.add("Solid Casual Cord Set");
      set.add("Embroidered Festive Cord Set");
      set.add("Cotton Cord Set");
    }
    return Array.from(set);
  }, [activeCatObj, allProducts, categoryParam, isCordSet]);

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

    if (typeParam) {
      const tLower = typeParam.toLowerCase().trim();
      list = list.filter((p) => {
        const hasType = p.productTypes && p.productTypes.some((pt: any) => pt.name && pt.name.toLowerCase().includes(tLower));
        return hasType || matchesSubcategory(p.subcategory, typeParam, p);
      });
    }

    if (filterParam === "new") list = list.filter((p) => p.newArrival || p.isNew);
    if (filterParam === "bestseller") list = list.filter((p) => p.isBestSeller);
    if (filterParam === "sale") list = list.filter((p) => p.discount >= 10);

    if (priceRange[1] < 5000) {
      list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);
    }

    if (selectedSizes.length > 0) {
      list = list.filter((p) => {
        const prodSizes = [
          ...(Array.isArray(p.sizes) ? p.sizes : []),
          ...(Array.isArray(p.sizeOptions) ? p.sizeOptions.map((so: any) => so.size) : []),
        ].map((s) => String(s || "").toUpperCase().trim());

        const nameUpper = (p.name || "").toUpperCase();

        return selectedSizes.some((sel) => {
          const selUpper = sel.toUpperCase().trim();
          if (selUpper === "ALL" || selUpper === "ALL SIZES") return true;

          // Direct match
          if (prodSizes.includes(selUpper)) return true;

          // 2XL <-> XXL alias
          if (
            (selUpper === "2XL" || selUpper === "XXL") &&
            (prodSizes.includes("2XL") || prodSizes.includes("XXL") || nameUpper.includes("XXL") || nameUpper.includes("2XL"))
          ) {
            return true;
          }

          // 3XL <-> XXXL alias
          if (
            (selUpper === "3XL" || selUpper === "XXXL") &&
            (prodSizes.includes("3XL") || prodSizes.includes("XXXL") || nameUpper.includes("3XL") || nameUpper.includes("XXXL"))
          ) {
            return true;
          }

          // 4XL
          if (selUpper === "4XL" && (prodSizes.includes("4XL") || nameUpper.includes("4XL"))) {
            return true;
          }

          // XL (exclusive of XXL/3XL)
          if (selUpper === "XL") {
            if (prodSizes.includes("XL")) return true;
            if (
              nameUpper.includes("XL") &&
              !nameUpper.includes("XXL") &&
              !nameUpper.includes("2XL") &&
              !nameUpper.includes("3XL") &&
              !nameUpper.includes("4XL")
            ) {
              return true;
            }
          }

          // L
          if (selUpper === "L") {
            if (prodSizes.includes("L")) return true;
            if (nameUpper.includes(" L ") || nameUpper.includes("L SIZE") || (p.category === "Nighty" && prodSizes.length === 0)) {
              return true;
            }
          }

          // M
          if (selUpper === "M" && (prodSizes.includes("M") || nameUpper.includes(" M ") || nameUpper.includes("M SIZE"))) {
            return true;
          }

          // S
          if (selUpper === "S" && (prodSizes.includes("S") || nameUpper.includes(" S ") || nameUpper.includes("S SIZE"))) {
            return true;
          }

          // Free Size
          if (
            selUpper === "FREE SIZE" &&
            (prodSizes.includes("FREE SIZE") || p.category === "Unstitched salwar material" || prodSizes.length === 0)
          ) {
            return true;
          }

          return false;
        });
      });
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

  const allSizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "Free Size"];

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
    name: `${pageTitle} | Nithi Collections`,
    description: `Browse our exclusive collection of ${pageTitle.toLowerCase()} crafted with 100% breathable pure cotton and premium designs at Nithi Collections.`,
    url: typeof window !== "undefined" ? window.location.href : "https://nithicollections.com/shop",
  };

  return (
    <div className="bg-[#FAF8F1] min-h-screen font-body">
      <SEO
        title={`${pageTitle} - Pure Cotton Nighties & Ethnic Wear`}
        description={`Explore ${pageTitle} at Nithi Collections. Handcrafted pure cotton nighties, feeding nighties, and loungewear with all-India shipping & COD.`}
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
            <span className="font-nav text-[11px] font-medium uppercase tracking-[0.16em] text-[#C9A227] block mb-1">
              Handpicked Coutures
            </span>
            <h1 className="font-collection text-3xl sm:text-4xl lg:text-5xl font-medium text-[#064E3B] tracking-[-0.015em]">
              {pageTitle}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] font-sans text-xs font-medium uppercase tracking-[0.1em] shadow-sm"
            >
              <svg className="w-3.5 h-3.5 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter & Sort</span>
            </button>

            {/* Desktop Sort Dropdown */}
            <div className="hidden lg:flex items-center gap-2 font-sans text-xs font-medium text-[#171A18]">
              <span>Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="bg-[#FFFFFF] border border-[#E8E2D5] rounded-xl px-3.5 py-2 font-sans text-xs font-medium text-[#171A18] focus:outline-none focus:border-[#064E3B] shadow-2xs"
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

        {/* TOP FILTER BAR: "Filter by Style / Subcategory" for any category with subcategories */}
        {subcategoriesForActiveCat.length > 0 && (
          <div className="w-full bg-[#FFFFFF] rounded-2xl border border-[#E8E2D5] p-4 mb-6 shadow-sm">
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-2 mb-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227]" />
                <span className="font-display text-xs sm:text-sm font-medium text-[#064E3B] uppercase tracking-[0.16em]">
                  Filter by Style / Subcategory
                </span>
                {subParam && (
                  <span className="text-[11px] bg-emerald-100 text-[#064E3B] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {subParam} Active
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
                {/* All Styles Button */}
                <button
                  type="button"
                  onClick={() => {
                    const currentCat = activeCatObj?.slug || activeCatObj?.id || categoryParam;
                    navigate(`/category/${encodeURIComponent(currentCat)}`);
                  }}
                  className={`min-w-[76px] sm:min-w-[88px] px-4 py-2 rounded-xl font-sans text-xs font-medium tracking-[0.04em] transition-all shadow-sm cursor-pointer ${!subParam
                    ? "bg-[#064E3B] text-white ring-2 ring-[#064E3B]/20 scale-105"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-[#064E3B] hover:bg-white"
                    }`}
                >
                  All {categoryDisplayName || "Styles"}
                </button>

                {/* Individual Subcategories / Styles */}
                {subcategoriesForActiveCat.map((style) => {
                  const isActive = subParam.toLowerCase() === style.toLowerCase();
                  const currentCat = activeCatObj?.slug || activeCatObj?.id || categoryParam;
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => {
                        if (isActive) {
                          navigate(`/category/${encodeURIComponent(currentCat)}`);
                        } else {
                          navigate(`/category/${encodeURIComponent(currentCat)}/${encodeURIComponent(style)}`);
                        }
                      }}
                      className={`px-3.5 py-2 rounded-xl font-sans text-xs font-medium tracking-[0.04em] transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${isActive
                        ? "bg-[#064E3B] text-white ring-2 ring-[#064E3B]/20 scale-105"
                        : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-[#064E3B] hover:bg-white"
                        }`}
                    >
                      <span>{style}</span>
                      {isActive && <span className="text-[10px] text-amber-300">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Filter by Size */}
        <div className="w-full bg-[#FFFFFF] rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#064E3B]" />
              <span className="font-display text-xs sm:text-sm font-medium text-[#064E3B] uppercase tracking-[0.16em]">
                Filter by Size
              </span>
              {selectedSizes.length > 0 && (
                <span className="text-[11px] bg-emerald-100 text-[#064E3B] font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {selectedSizes.join(", ")} Active
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {/* All Sizes Button */}
              <button
                type="button"
                onClick={() => setSelectedSizes([])}
                className={`min-w-[76px] sm:min-w-[88px] px-4 py-2 rounded-xl font-sans text-xs font-medium tracking-[0.04em] transition-all shadow-sm cursor-pointer ${selectedSizes.length === 0
                  ? "bg-[#064E3B] text-white ring-2 ring-[#064E3B]/20 scale-105"
                  : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-[#064E3B] hover:bg-white"
                  }`}
              >
                All Sizes
              </button>

              {/* Individual Size Pills */}
              {allSizes.map((sz) => {
                const isActive = selectedSizes.includes(sz) || (sz === "XXL" && selectedSizes.includes("2XL"));
                const label = sz === "XXL" ? "XXL / 2XL" : sz;
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    className={`min-w-[56px] sm:min-w-[64px] px-3.5 py-2 rounded-xl font-sans text-xs font-medium tracking-[0.04em] transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ${isActive
                      ? "bg-[#064E3B] text-white ring-2 ring-[#064E3B]/20 scale-105"
                      : "bg-slate-50 text-slate-700 border border-slate-200 hover:border-[#064E3B] hover:bg-white"
                      }`}
                  >
                    <span>{label}</span>
                    {isActive && <span className="text-[10px] text-amber-300">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

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
            {priceRange[1] < 5000 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#064E3B] px-3.5 py-1 text-[11px] font-bold text-[#FAF8F1] shadow-xs">
                Max Price: ₹{priceRange[1].toLocaleString("en-IN")}
                <button
                  type="button"
                  onClick={() => setPriceRange([0, 5000])}
                  className="ml-1 hover:text-[#C9A227]"
                >
                  ✕
                </button>
              </span>
            )}
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
            {/* Categories Navigation */}
            <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8E2D5] shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#E8E2D5]">
                <h3 className="font-display text-xs font-bold text-[#064E3B] uppercase tracking-[0.18em]">
                  Collections
                </h3>
                {categoryParam && (
                  <button
                    onClick={() => navigate("/shop")}
                    className="text-[11px] font-semibold text-[#C9A227] hover:underline cursor-pointer"
                  >
                    Clear Selection
                  </button>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <button
                  onClick={() => navigate("/shop")}
                  className={`block w-full text-left py-2 px-3 rounded-xl transition-colors cursor-pointer ${!categoryParam
                    ? "bg-[#064E3B] text-[#FAF8F1] font-semibold shadow-xs"
                    : "text-[#171A18] hover:text-[#064E3B] hover:bg-[#F3EFE3]/60"
                    }`}
                >
                  ✦ All Products
                </button>

                {/* All Categories - Always visible & accessible */}
                {categories.map((cat) => {
                  const isCatActive = isCategoryMatch(cat, categoryParam);
                  const catTarget = cat.slug || cat.id || cat.name;

                  return (
                    <div key={cat.id || cat.slug || cat.name} className="space-y-1">
                      <button
                        onClick={() => navigate(`/category/${encodeURIComponent(catTarget)}`)}
                        className={`block w-full text-left py-2 px-3 rounded-xl transition-colors cursor-pointer flex items-center justify-between ${isCatActive
                          ? "bg-[#064E3B] text-[#FAF8F1] font-semibold shadow-xs"
                          : "text-[#171A18] hover:text-[#064E3B] hover:bg-[#F3EFE3]/60"
                          }`}
                      >
                        <span className="font-medium">{cat.name}</span>
                        {isCatActive && <span className="text-amber-300 text-xs">✓ Active</span>}
                      </button>

                      {/* Styles/Subcategories under the active category */}
                      {isCatActive && subcategoriesForActiveCat.length > 0 && (
                        <div className="ml-3 pl-2.5 border-l-2 border-[#064E3B]/20 py-1 space-y-1 animate-fade-in">
                          <button
                            onClick={() => navigate(`/category/${encodeURIComponent(catTarget)}`)}
                            className={`block w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${!subParam
                              ? "bg-emerald-50 text-[#064E3B] font-bold border border-emerald-200"
                              : "text-slate-600 hover:text-[#064E3B] hover:bg-slate-50"
                              }`}
                          >
                            All {cat.name}
                          </button>
                          {subcategoriesForActiveCat.map((sub) => {
                            const isSubActive = subParam.toLowerCase() === sub.toLowerCase();
                            return (
                              <button
                                key={sub}
                                onClick={() => {
                                  if (isSubActive) {
                                    navigate(`/category/${encodeURIComponent(catTarget)}`);
                                  } else {
                                    navigate(`/category/${encodeURIComponent(catTarget)}/${encodeURIComponent(sub)}`);
                                  }
                                }}
                                className={`block w-full text-left py-1.5 px-2.5 rounded-lg text-xs transition-colors cursor-pointer ${isSubActive
                                  ? "bg-[#064E3B] text-white font-bold shadow-xs"
                                  : "text-slate-600 hover:text-[#064E3B] hover:bg-slate-50"
                                  }`}
                              >
                                {sub}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Sizes (Hidden when Cord set is selected) */}
            {!isCordSet && (
              <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8E2D5] shadow-xs">
                <h3 className="font-display text-xs font-bold text-[#064E3B] uppercase tracking-[0.18em] mb-3 pb-2 border-b border-[#E8E2D5]">
                  Filter by Size
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {allSizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${selectedSizes.includes(sz)
                        ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1]"
                        : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#C9A227]"
                        }`}
                    >
                      {sz === "XXL" ? "XXL / 2XL" : sz}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                  No matching products found
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
