import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router";
import type { Category } from "../types/store";
import { useStoreProducts, useStoreCategories } from "../services/storefront";
import ProductCard from "../components/ProductCard";
import MobileFilterDrawer from "../components/MobileFilterDrawer";
import RecentlyViewedSection from "../components/RecentlyViewedSection";
import { useRecentlyViewed } from "../utils/recentlyViewed";
import { ProductGridSkeleton } from "../components/SkeletonLoaders";

type SortOption = "featured" | "newest" | "price-asc" | "price-desc" | "rating" | "discount";

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const categories = useStoreCategories();
  const allProducts = useStoreProducts();
  const recentProducts = useRecentlyViewed(allProducts);

  const categoryParam = searchParams.get("category") || "";
  const filterParam = searchParams.get("filter") || "";
  const searchQuery = searchParams.get("q") || "";
  const [sort, setSort] = useState<SortOption>("featured");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

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
      const activeCatObj = categories.find((c) => c.id === categoryParam || c.slug === categoryParam);
      const targetName = (activeCatObj ? activeCatObj.name : categoryParam).toLowerCase();
      const targetSlug = (activeCatObj ? activeCatObj.slug : categoryParam).toLowerCase();

      list = list.filter((p) => {
        const pCat = (p.category || "").toLowerCase();
        const pSub = (p.subcategory || "").toLowerCase();
        return (
          pCat === targetName ||
          pCat === targetSlug ||
          pCat.replace(/\s+/g, "-") === targetSlug ||
          pSub === targetName ||
          pSub.includes(targetName)
        );
      });
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
      case "rating":
        list = [...list].sort((a, b) => b.rating - a.rating);
        break;
      case "discount":
        list = [...list].sort((a, b) => b.discount - a.discount);
        break;
    }

    return list;
  }, [allProducts, categoryParam, filterParam, searchQuery, sort, priceRange, selectedSizes]);

  const pageTitle = searchQuery
    ? `Search: "${searchQuery}"`
    : categoryParam
    ? categories.find((c) => c.id === categoryParam)?.name || "Products"
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
    setSearchParams({});
    setPriceRange([0, 5000]);
    setSelectedSizes([]);
    setSort("featured");
  };

  const hasActiveFilters = Boolean(
    categoryParam || filterParam || searchQuery || selectedSizes.length > 0 || priceRange[1] < 5000
  );

  return (
    <div className="bg-[#FAF8F1] min-h-screen font-body">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#5C635E] mb-6 flex items-center gap-1.5">
          <Link to="/" className="hover:text-[#064E3B]">Home</Link>
          <span>/</span>
          <span className="text-[#171A18] font-semibold">{pageTitle}</span>
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
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <span>⚙️</span>
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
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="discount">Discount %</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <span className="text-[#5C635E] font-medium">Active Filters:</span>
            {categoryParam && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#064E3B] px-3.5 py-1 text-[11px] font-bold text-[#FAF8F1] shadow-xs">
                Category: {categories.find((c) => c.id === categoryParam)?.name || categoryParam}
                <button
                  type="button"
                  onClick={() => {
                    const params = new URLSearchParams(searchParams);
                    params.delete("category");
                    setSearchParams(params);
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
                  onClick={() => setSearchParams({})}
                  className={`block w-full text-left py-2 px-3 rounded-xl transition-colors ${
                    !categoryParam && !filterParam
                      ? "bg-[#064E3B] text-[#FAF8F1] font-semibold"
                      : "text-[#171A18] hover:text-[#064E3B] hover:bg-[#F3EFE3]/60"
                  }`}
                >
                  ✦ All Collections
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSearchParams({ category: cat.id })}
                    className={`block w-full text-left py-2 px-3 rounded-xl transition-colors ${
                      categoryParam === cat.id
                        ? "bg-[#064E3B] text-[#FAF8F1] font-semibold"
                        : "text-[#171A18] hover:text-[#064E3B] hover:bg-[#F3EFE3]/60"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
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
          <main className="lg:col-span-3">
            {allProducts.length === 0 ? (
              <ProductGridSkeleton count={6} />
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-[#E8E2D5] bg-[#FFFFFF] p-12 text-center shadow-xs">
                <div className="text-4xl mb-3">🔍</div>
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
          if (cat) setSearchParams({ category: cat });
          else setSearchParams({});
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
