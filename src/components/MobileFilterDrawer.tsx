import { useEffect, useMemo } from "react";
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

  const activeCatObj = useMemo(() => {
    if (!selectedCategory) return null;
    const target = selectedCategory.toLowerCase().trim();
    const targetClean = target.replace(/[^a-z0-9]/g, "");
    return (
      categories.find((c) => {
        const cName = (c.name || "").toLowerCase().trim();
        const cSlug = (c.slug || "").toLowerCase().trim();
        const cId = (c.id || "").toLowerCase().trim();
        const cClean = cName.replace(/[^a-z0-9]/g, "");
        if (cName === target || cSlug === target || cId === target || cClean === targetClean) return true;
        if (targetClean.startsWith("night") && !targetClean.includes("dress") && cClean.startsWith("night") && !cClean.includes("dress")) return true;
        if (targetClean.includes("kurti") && cClean.includes("kurti")) return true;
        if ((targetClean.includes("salwar") || targetClean.includes("chudi")) && (cClean.includes("salwar") || cClean.includes("chudi"))) return true;
        if ((targetClean.includes("cord") || targetClean.includes("coord")) && (cClean.includes("cord") || cClean.includes("coord"))) return true;
        return false;
      }) || null
    );
  }, [categories, selectedCategory]);

  const subcategoriesList = useMemo(() => {
    if (!activeCatObj) return [];
    const set = new Set<string>();
    if (Array.isArray(activeCatObj.subcategories)) {
      for (const sub of activeCatObj.subcategories) {
        let name = typeof sub === "string" ? sub : sub?.name;
        if (name && typeof name === "string") {
          name = name.trim();
          if (name.includes(" - ")) {
            name = name.split(" - ").slice(1).join(" - ").trim();
          }
          if (name) set.add(name);
        }
      }
    }
    return Array.from(set);
  }, [activeCatObj]);

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
            <h3 className="font-collection text-lg font-medium text-[#064E3B]">Filter & Sort</h3>
            <p className="font-body text-[11px] text-[#5C635E]">{totalResults} products found</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClearAll}
              className="font-button text-xs font-semibold text-[#C9A227] hover:underline"
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
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${selectedSizes.includes(sz)
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
                className={`py-2 px-3 rounded-lg border text-left transition-colors cursor-pointer ${sort === s.id
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
              Collections
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
                Clear Selection
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => {
                onSelectCategory("");
                if (onSelectSubcategory) onSelectSubcategory("");
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${!selectedCategory
                ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] font-semibold"
                : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#064E3B]"
                }`}
            >
              All Categories
            </button>
            {categories.map((c) => {
              const isSelected = Boolean(
                activeCatObj &&
                (activeCatObj.id === c.id ||
                  activeCatObj.slug === c.slug ||
                  activeCatObj.name.toLowerCase() === c.name.toLowerCase())
              );
              const target = c.slug || c.id || c.name;

              return (
                <button
                  key={c.id || c.slug || c.name}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      onSelectCategory("");
                      if (onSelectSubcategory) onSelectSubcategory("");
                    } else {
                      onSelectCategory(target);
                      if (onSelectSubcategory) onSelectSubcategory("");
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer flex items-center gap-1 ${isSelected
                    ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] font-semibold shadow-xs"
                    : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#064E3B]"
                    }`}
                >
                  <span>{c.name}</span>
                  {isSelected && <span className="text-amber-300 text-xs">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Styles / Subcategories (when Category is active) */}
        {activeCatObj && subcategoriesList.length > 0 && (
          <div className="animate-fade-in pt-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#064E3B] mb-2">
              Filter by Style / Subcategory ({activeCatObj.name})
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => onSelectSubcategory && onSelectSubcategory("")}
                className={`px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${!selectedSubcategory
                  ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] font-semibold shadow-xs"
                  : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#064E3B]"
                  }`}
              >
                All {activeCatObj.name}
              </button>
              {subcategoriesList.map((subName: string) => {
                const isSelected =
                  Boolean(selectedSubcategory) &&
                  selectedSubcategory.toLowerCase() === subName.toLowerCase();

                return (
                  <button
                    key={subName}
                    type="button"
                    onClick={() => {
                      if (!onSelectSubcategory) return;
                      if (isSelected) {
                        onSelectSubcategory("");
                      } else {
                        onSelectSubcategory(subName);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs transition-colors cursor-pointer flex items-center gap-1 ${isSelected
                      ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] font-semibold shadow-xs"
                      : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#064E3B]"
                      }`}
                  >
                    <span>{subName}</span>
                    {isSelected && <span className="text-amber-300 text-xs">✓</span>}
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
