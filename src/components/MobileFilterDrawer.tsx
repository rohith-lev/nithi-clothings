import { useEffect } from "react";
import type { Category } from "../types/store";
import { useStoreCategories } from "../services/storefront";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedSizes: string[];
  onToggleSize: (size: string) => void;
  priceRange: [number, number];
  onPriceChange: (range: [number, number]) => void;
  sort: string;
  onSortChange: (s: any) => void;
  totalResults: number;
  onClearAll: () => void;
}

export default function MobileFilterDrawer({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedSizes,
  onToggleSize,
  priceRange,
  onPriceChange,
  sort,
  onSortChange,
  totalResults,
  onClearAll,
}: MobileFilterDrawerProps) {
  const categories = useStoreCategories();
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-[#171A18]/70 backdrop-blur-xs font-body animate-fade-in">
      <div
        className="w-full max-h-[85vh] overflow-y-auto rounded-t-xl bg-[#FAF8F1] border-t border-[#E8E2D5] p-5 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-[#E8E2D5] pb-3">
          <div>
            <h3 className="font-display text-lg font-bold text-[#064E3B]">Filter & Sort</h3>
            <p className="text-[11px] text-[#5C635E]">{totalResults} products found</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs font-semibold text-[#C9A227] hover:underline"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#E8E2D5] text-sm font-bold text-[#171A18]"
              aria-label="Close filters"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-2">
            Sort By
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            {[
              { id: "featured", label: "Featured" },
              { id: "newest", label: "Newest Arrivals" },
              { id: "price-asc", label: "Price: Low to High" },
              { id: "price-desc", label: "Price: High to Low" },
              { id: "discount", label: "Discount %" },
              { id: "rating", label: "Top Rated" },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSortChange(s.id)}
                className={`py-2 px-3 rounded-xs border text-left transition-colors ${
                  sort === s.id
                    ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] font-semibold"
                    : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-2">
            Collections
          </label>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onSelectCategory("")}
              className={`px-3 py-1.5 rounded-xs border text-xs transition-colors ${
                !selectedCategory
                  ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] font-semibold"
                  : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18]"
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCategory(c.id)}
                className={`px-3 py-1.5 rounded-xs border text-xs transition-colors ${
                  selectedCategory === c.id
                    ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] font-semibold"
                    : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18]"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-2">
            Sizes
          </label>
          <div className="flex flex-wrap gap-2">
            {allSizes.map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => onToggleSize(sz)}
                className={`px-3 py-1.5 rounded-xs border text-xs font-semibold transition-colors ${
                  selectedSizes.includes(sz)
                    ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1]"
                    : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18]"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Max Price */}
        <div>
          <div className="flex justify-between text-xs font-bold text-[#064E3B] mb-1.5">
            <span>Price Range</span>
            <span>Up to ₹{priceRange[1].toLocaleString("en-IN")}</span>
          </div>
          <input
            type="range"
            min={300}
            max={5000}
            step={100}
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
            className="w-full accent-[#064E3B]"
          />
        </div>

        {/* Bottom Apply Bar */}
        <div className="pt-2 sticky bottom-0 bg-[#FAF8F1] pb-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xs bg-[#064E3B] py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#FAF8F1] shadow-md hover:bg-[#0B3D2E] transition-colors"
          >
            Apply Filters ({totalResults} Items)
          </button>
        </div>
      </div>
    </div>
  );
}
