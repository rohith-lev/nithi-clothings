import { useEffect } from "react";
import type { Category } from "../types/store";
import { useStoreCategories } from "../services/storefront";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedSubcategory?: string;
  onSelectSubcategory?: (sub: string) => void;
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
  selectedSubcategory = "",
  onSelectSubcategory,
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

  const activeCatObj = categories.find(
    (c) => c.id === selectedCategory || c.slug === selectedCategory || c.name.toLowerCase() === selectedCategory.toLowerCase()
  );

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

  const allSizes = ["S", "M", "L", "XL", "XXL", "3XL", "4XL", "Free Size"];

  const isCordSet = Boolean(
    selectedCategory &&
    (selectedCategory.toLowerCase().includes("cord") ||
     selectedCategory.toLowerCase().includes("coord") ||
     (activeCatObj && (activeCatObj.name.toLowerCase().includes("cord") || activeCatObj.name.toLowerCase().includes("coord"))))
  );

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

        {/* Conditional Size Filter: Hidden when Cord set is selected */}
        {!isCordSet && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-2 flex items-center justify-between">
              <span>Filter by Size</span>
              {selectedSizes.length > 0 && (
                <span className="text-[10px] text-[#064E3B] font-bold">
                  {selectedSizes.join(", ")} Active
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {allSizes.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => onToggleSize(sz)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                    selectedSizes.includes(sz)
                      ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1]"
                      : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#064E3B]"
                  }`}
                >
                  {sz === "XXL" ? "XXL / 2XL" : sz}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sort */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-2">
            Sort By
          </label>
          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            {[
              { id: "featured", label: "Featured" },
              { id: "newest", label: "Newest Arrivals" },
              { id: "name-asc", label: "Alphabetical: A to Z" },
              { id: "name-desc", label: "Alphabetical: Z to A" },
              { id: "price-asc", label: "Price: Low to High" },
              { id: "price-desc", label: "Price: High to Low" },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSortChange(s.id)}
                className={`py-2 px-3 rounded-lg border text-left transition-colors cursor-pointer ${
                  sort === s.id
                    ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] font-semibold"
                    : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#064E3B]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Collections */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold uppercase tracking-wider text-[#064E3B]">
              {selectedCategory ? "Active Collection" : "Collections"}
            </label>
            {selectedCategory && (
              <button
                type="button"
                onClick={() => {
                  onSelectCategory("");
                  if (onSelectSubcategory) onSelectSubcategory("");
                }}
                className="text-[11px] font-semibold text-[#C9A227] hover:underline cursor-pointer"
              >
                ← All Categories
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {selectedCategory ? (
              // When a specific category is selected, hide other categories!
              <div className="w-full space-y-2">
                <div className="px-3.5 py-2 rounded-xl bg-[#064E3B] text-[#FAF8F1] font-bold text-xs flex items-center justify-between">
                  <span>{activeCatObj ? activeCatObj.name : selectedCategory}</span>
                  <span className="text-amber-300">✓ Active</span>
                </div>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory("");
                    if (onSelectSubcategory) onSelectSubcategory("");
                  }}
                  className="px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] font-semibold"
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(c.id);
                      if (onSelectSubcategory) onSelectSubcategory("");
                    }}
                    className="px-3 py-1.5 rounded-lg border border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] text-xs transition-colors cursor-pointer hover:border-[#064E3B]"
                  >
                    {c.name}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Styles / Subcategories (when Category is active) */}
        {activeCatObj && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#C9A227] mb-2">
              Filter by Style ({activeCatObj.name})
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onSelectSubcategory && onSelectSubcategory("")}
                className={`px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                  !selectedSubcategory
                    ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] font-semibold"
                    : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18]"
                }`}
              >
                All Styles
              </button>
              {(activeCatObj.subcategories || []).map((sub) => {
                const subName = sub.name;
                const isSelected =
                  selectedSubcategory === sub.id ||
                  selectedSubcategory.toLowerCase() === subName.toLowerCase();

                return (
                  <button
                    key={sub.id || subName}
                    type="button"
                    onClick={() => onSelectSubcategory && onSelectSubcategory(subName)}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                      isSelected
                        ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] font-semibold"
                        : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18]"
                    }`}
                  >
                    {subName}
                  </button>
                );
              })}
            </div>
          </div>
        )}

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
