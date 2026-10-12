import React, { useMemo } from "react";
import type { Category, SubCategory, Product } from "../types/store";
import { CATEGORY_HIERARCHY } from "../data/products";

interface Props {
  categories: Category[];
  products?: Product[];
  selectedCategory?: string;
  selectedSubcategory?: string;
  onSelectCategory: (categoryId: string) => void;
  onSelectSubcategory?: (subcategoryId: string) => void;
  showSubcategories?: boolean;
  title?: string;
  subtitle?: string;
}

// Curated high-resolution fallback image map for all fashion categories
const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  nighty: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=400&h=400&fit=crop&auto=format",
  nighties: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=400&h=400&fit=crop&auto=format",
  "night-dress": "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=400&fit=crop&auto=format",
  "night dress": "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=400&h=400&fit=crop&auto=format",
  "90s": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop&auto=format",
  "90s-dress": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop&auto=format",
  "90s dress": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop&auto=format",
  sales: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop&auto=format",
  unstitched: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&auto=format",
  "unstitched-salwar": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&auto=format",
  "unstitched salwar material": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&auto=format",
  chudis: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&auto=format",
  "cord-set": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop&auto=format",
  "cord set": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop&auto=format",
  "coord-set": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop&auto=format",
  "coord sets": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop&auto=format",
  kurtis: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop&auto=format",
  "kurtis(tops)": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop&auto=format",
  "kurtis & tops": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=400&h=400&fit=crop&auto=format",
  "salwar-set": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&auto=format",
  "salwar set": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&auto=format",
  "salwar sets": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&auto=format",
  maxi: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop&auto=format",
  "maxi gowns": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop&auto=format",
  default: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=400&h=400&fit=crop&auto=format",
};

export default function CircularCategoryBrowser({
  categories = [],
  products = [],
  selectedCategory = "",
  selectedSubcategory = "",
  onSelectCategory,
  onSelectSubcategory,
  showSubcategories = true,
  title = "Select Category",
  subtitle = "Explore our handcrafted collections designed for daily luxury",
}: Props) {
  const normSelectedCategory = (selectedCategory || "").toLowerCase().trim();
  const normSelectedSubcategory = (selectedSubcategory || "").toLowerCase().trim();

  // Robust matching helper to check if a category matches the selected category parameter
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

    // Direct and normalized slug/id/name matching
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

    // Common fashion aliases matching
    if (
      targetClean.startsWith("night") &&
      !targetClean.includes("dress") &&
      cClean.startsWith("night") &&
      !cClean.includes("dress")
    ) {
      return true; // Nighty / Nighties
    }

    if (
      (targetClean.includes("nightdress") || targetClean === "nightdress") &&
      (cClean.includes("nightdress") || cClean === "nightdress")
    ) {
      return true; // Night Dress
    }

    if (targetClean.includes("kurti") && cClean.includes("kurti")) {
      return true; // Kurtis / Kurtis(Tops)
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

    if (targetClean.includes("zipless") && !pSubClean.includes("zipless")) return false;
    if (!targetClean.includes("zipless") && targetClean.includes("zip") && pSubClean.includes("zipless")) return false;
    if (targetClean.includes("nonfeeding") && !pSubClean.includes("nonfeeding")) return false;
    if (!targetClean.includes("nonfeeding") && targetClean.includes("feeding") && pSubClean.includes("nonfeeding")) return false;

    if (pSub === targetNorm || pSubClean === targetClean || pSubSlug === targetSlug) return true;

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

  // Find currently active category object safely
  const activeCategoryObj = useMemo(() => {
    if (!normSelectedCategory) return null;
    return categories.find((c) => isCategoryMatch(c, normSelectedCategory)) || null;
  }, [categories, normSelectedCategory]);

  // Extract subcategories dynamically from category, taxonomy hierarchy, and products
  const activeSubcategories = useMemo<SubCategory[]>(() => {
    if (!activeCategoryObj) return [];
    const subMap = new Map<string, SubCategory>();

    // 1. From Category object in database
    if (Array.isArray(activeCategoryObj.subcategories)) {
      for (const sub of activeCategoryObj.subcategories) {
        if (sub && typeof sub === "object" && sub.name && typeof sub.name === "string" && sub.name.trim()) {
          const key = sub.name.toLowerCase().trim();
          if (!subMap.has(key)) {
            subMap.set(key, {
              id: sub.id || `sub-${key.replace(/[^a-z0-9]+/g, "-")}`,
              name: sub.name.trim(),
              parentGroup: sub.parentGroup || "",
              image: sub.image || "",
            });
          }
        }
      }
    }

    // 2. From CATEGORY_HIERARCHY standard taxonomy
    const catNameLower = (activeCategoryObj.name || "").toLowerCase().trim();
    const hierarchyKey = Object.keys(CATEGORY_HIERARCHY).find((k) =>
      isCategoryMatch(activeCategoryObj, k)
    );
    const hierarchy = hierarchyKey ? CATEGORY_HIERARCHY[hierarchyKey] : undefined;

    if (hierarchy) {
      if (hierarchy.groups) {
        for (const grp of hierarchy.groups) {
          const grpKey = grp.name.toLowerCase().trim();
          if (!subMap.has(grpKey)) {
            subMap.set(grpKey, {
              id: `grp-${grpKey.replace(/[^a-z0-9]+/g, "-")}`,
              name: grp.name.trim(),
              parentGroup: grp.name,
            });
          }
          for (const item of grp.items) {
            const key = item.toLowerCase().trim();
            if (!subMap.has(key)) {
              subMap.set(key, {
                id: `sub-${key.replace(/[^a-z0-9]+/g, "-")}`,
                name: item.trim(),
                parentGroup: grp.name,
              });
            }
          }
        }
      } else if (hierarchy.items) {
        for (const item of hierarchy.items) {
          const key = item.toLowerCase().trim();
          if (!subMap.has(key)) {
            subMap.set(key, {
              id: `sub-${key.replace(/[^a-z0-9]+/g, "-")}`,
              name: item.trim(),
              parentGroup: "",
            });
          }
        }
      }
    }

    // 3. Dynamic discovery from loaded products
    if (Array.isArray(products) && products.length > 0) {
      for (const p of products) {
        if (!p) continue;
        const pCat = (p.category || "").toLowerCase().trim();
        const activeSlug = (activeCategoryObj.slug || "").toLowerCase().trim();
        const activeId = (activeCategoryObj.id || "").toLowerCase().trim();

        if (
          pCat === catNameLower ||
          pCat === activeSlug ||
          pCat === activeId ||
          pCat.replace(/\s+/g, "-") === activeSlug ||
          isCategoryMatch(activeCategoryObj, pCat)
        ) {
          if (p.subcategory && typeof p.subcategory === "string" && p.subcategory.trim()) {
            let subName = p.subcategory.trim();
            let parentGroup = "";

            if (subName.includes(" - ")) {
              const parts = subName.split(" - ");
              parentGroup = parts[0].trim();
              const itemPart = parts.slice(1).join(" - ").trim();
              
              const grpKey = parentGroup.toLowerCase().trim();
              if (parentGroup && !subMap.has(grpKey)) {
                subMap.set(grpKey, {
                  id: `grp-${grpKey.replace(/[^a-z0-9]+/g, "-")}`,
                  name: parentGroup,
                  parentGroup,
                  image: (p.coverImage || (p.images && p.images[0])) || "",
                });
              }
              subName = itemPart;
            }

            const key = subName.toLowerCase().trim();
            if (subName && !subMap.has(key)) {
              subMap.set(key, {
                id: `sub-${key.replace(/[^a-z0-9]+/g, "-")}`,
                name: subName,
                parentGroup,
                image: (p.coverImage || (p.images && p.images[0])) || "",
              });
            }
          }
        }
      }
    }

    return Array.from(subMap.values());
  }, [activeCategoryObj, products]);

  // Helper to safely resolve a category's ONE fixed primary image with guaranteed fallback
  const getResolvedCategoryImage = (cat: Category): string => {
    if (cat.image && typeof cat.image === "string" && cat.image.trim().length > 0 && !cat.image.includes("[object")) {
      return cat.image.trim();
    }
    const slugKey = (cat.slug || "").toLowerCase().trim();
    const nameKey = (cat.name || "").toLowerCase().trim();
    const idKey = (cat.id || "").toLowerCase().trim();
    return (
      CATEGORY_FALLBACK_IMAGES[slugKey] ||
      CATEGORY_FALLBACK_IMAGES[nameKey] ||
      CATEGORY_FALLBACK_IMAGES[idKey] ||
      CATEGORY_FALLBACK_IMAGES.default
    );
  };

  return (
    <div className="w-full space-y-5 my-6">
      {/* 1. ROUND / CIRCULAR CATEGORIES SECTION */}
      <div className="bg-[#FFFFFF] rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-[#E8E2D5] shadow-xs relative overflow-hidden">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-5 gap-2 border-b border-[#E8E2D5]/60 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
              <h2 className="font-display text-base sm:text-lg font-bold text-[#064E3B] tracking-tight">
                {title}
              </h2>
            </div>
            {subtitle && (
              <p className="text-xs text-[#5C635E] mt-0.5 hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
          {normSelectedCategory && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onSelectCategory("");
              }}
              className="text-xs font-semibold text-[#064E3B] hover:text-[#C9A227] transition-colors cursor-pointer self-start sm:self-auto flex items-center gap-1.5 bg-[#FAF8F1] hover:bg-[#F3EFE3] px-3.5 py-1.5 rounded-full border border-[#E8E2D5] shadow-2xs"
            >
              <span>View All Collections</span>
              <span className="text-[10px] text-[#C9A227]">✕</span>
            </button>
          )}
        </div>

        {/* Circular Categories List Container - scrollable horizontally without vertical clipping */}
        <div className="flex items-start gap-4 sm:gap-6 overflow-x-auto py-2.5 px-1 scrollbar-none snap-x touch-pan-x">
          {/* All Items Circle */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onSelectCategory("");
            }}
            className="group flex flex-col items-center shrink-0 w-20 sm:w-24 text-center snap-start transition-all active:scale-95 cursor-pointer focus:outline-none"
            aria-pressed={!normSelectedCategory}
          >
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-300 relative flex items-center justify-center ${
                !normSelectedCategory
                  ? "p-[2.5px] bg-gradient-to-tr from-[#064E3B] via-[#0D5C46] to-[#C9A227] shadow-md scale-105 ring-2 ring-[#C9A227]/40 ring-offset-2 ring-offset-[#FAF8F1]"
                  : "p-[1.5px] bg-[#F3EFE3] border border-[#E8E2D5] hover:border-[#C9A227] hover:shadow-md hover:scale-105"
              }`}
            >
              <div
                className={`w-full h-full rounded-full flex flex-col items-center justify-center font-display font-bold text-xs sm:text-sm transition-colors ${
                  !normSelectedCategory
                    ? "bg-gradient-to-br from-[#064E3B] to-[#0A3D2E] text-[#FAF8F1]"
                    : "bg-[#FFFFFF] text-[#064E3B] group-hover:text-[#C9A227]"
                }`}
              >
                <span className="text-xs sm:text-sm text-[#C9A227]">✦</span>
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold">All</span>
              </div>
              {!normSelectedCategory && (
                <span className="absolute -bottom-0.5 right-0.5 sm:right-1 w-5 h-5 rounded-full bg-[#064E3B] text-[#FAF8F1] text-[10px] font-bold flex items-center justify-center shadow-xs border border-[#C9A227]">
                  ✓
                </span>
              )}
            </div>
            <span
              className={`mt-2 text-xs line-clamp-1 transition-colors ${
                !normSelectedCategory
                  ? "text-[#064E3B] font-bold"
                  : "text-[#2D332F] font-medium group-hover:text-[#064E3B]"
              }`}
            >
              All Items
            </span>
          </button>

          {/* Dynamic Category Circles */}
          {categories.map((cat, idx) => {
            if (!cat || !cat.name) return null;
            const isSelected = isCategoryMatch(cat, normSelectedCategory);
            const targetIdentifier = cat.slug || cat.id || cat.name;
            const resolvedImg = getResolvedCategoryImage(cat);

            return (
              <button
                key={cat.id || cat.slug || cat.name || idx}
                type="button"
                title={cat.name}
                onClick={(e) => {
                  e.preventDefault();
                  onSelectCategory(targetIdentifier);
                }}
                className="group flex flex-col items-center shrink-0 w-20 sm:w-24 text-center snap-start transition-all active:scale-95 cursor-pointer focus:outline-none"
                aria-pressed={isSelected}
              >
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full transition-all duration-300 relative ${
                    isSelected
                      ? "p-[2.5px] bg-gradient-to-tr from-[#064E3B] via-[#0D5C46] to-[#C9A227] shadow-md scale-105 ring-2 ring-[#C9A227]/40 ring-offset-2 ring-offset-[#FAF8F1]"
                      : "p-[1.5px] bg-[#F3EFE3] border border-[#E8E2D5] hover:border-[#C9A227] hover:shadow-md hover:scale-105"
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-[#FAF8F1]">
                    <img
                      src={resolvedImg}
                      alt={cat.name}
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.onerror = null;
                        const cSlug = (cat.slug || "").toLowerCase().trim();
                        const cName = (cat.name || "").toLowerCase().trim();
                        const fallback =
                          CATEGORY_FALLBACK_IMAGES[cSlug] ||
                          CATEGORY_FALLBACK_IMAGES[cName] ||
                          CATEGORY_FALLBACK_IMAGES.default;
                        target.src = fallback;
                      }}
                      className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
                        isSelected ? "brightness-100" : "brightness-95 group-hover:brightness-100"
                      }`}
                      loading="lazy"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#064E3B]/15 pointer-events-none" />
                    )}
                  </div>
                  {isSelected && (
                    <span className="absolute -bottom-0.5 right-0.5 sm:right-1 w-5 h-5 rounded-full bg-[#064E3B] text-[#FAF8F1] text-[10px] font-bold flex items-center justify-center shadow-xs border border-[#C9A227]">
                      ✓
                    </span>
                  )}
                </div>
                <span
                  className={`mt-2 text-xs line-clamp-1 transition-colors px-1 ${
                    isSelected
                      ? "text-[#064E3B] font-bold"
                      : "text-[#2D332F] font-medium group-hover:text-[#064E3B]"
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. SUBCATEGORIES BROWSER ROW */}
        {showSubcategories && activeCategoryObj && activeSubcategories.length > 0 && (
          <div className="mt-5 pt-4 border-t border-[#E8E2D5]">
            <div className="flex items-center justify-between mb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-[2px] bg-[#C9A227]" />
                <h3 className="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-[#064E3B]">
                  {activeCategoryObj.name} Collections
                </h3>
              </div>
              {normSelectedSubcategory && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onSelectSubcategory) onSelectSubcategory("");
                  }}
                  className="text-xs font-semibold text-[#064E3B] hover:text-[#C9A227] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <span>Show All {activeCategoryObj.name}</span>
                  <span className="text-[10px] text-[#C9A227]">✕</span>
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 scrollbar-none snap-x touch-pan-x flex-wrap">
              {/* All Subcategories Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSelectSubcategory) onSelectSubcategory("");
                }}
                className={`group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 border cursor-pointer snap-start focus:outline-none ${
                  !normSelectedSubcategory
                    ? "bg-[#064E3B] text-[#FAF8F1] border-[#064E3B] ring-2 ring-[#C9A227]/40 shadow-xs"
                    : "bg-[#FFFFFF] text-[#171A18] border-[#E8E2D5] hover:border-[#C9A227] hover:bg-[#FAF8F1] hover:text-[#064E3B] shadow-2xs"
                }`}
              >
                <span>✦ All {activeCategoryObj.name}</span>
                {!normSelectedSubcategory && (
                  <span className="w-3.5 h-3.5 rounded-full bg-[#C9A227] text-[#064E3B] text-[9px] font-bold inline-flex items-center justify-center">
                    ✓
                  </span>
                )}
              </button>

              {/* Dynamic Subcategory Pills */}
              {activeSubcategories.map((sub, sIdx) => {
                if (!sub || !sub.name) return null;
                const subName = sub.name.trim();
                const subClean = subName.toLowerCase().replace(/[^a-z0-9]/g, "");
                const selectedSubClean = normSelectedSubcategory.replace(/[^a-z0-9]/g, "");

                const isSubSelected =
                  Boolean(normSelectedSubcategory) &&
                  (subClean === selectedSubClean ||
                    subName.toLowerCase() === normSelectedSubcategory ||
                    (sub.id && sub.id.toLowerCase() === normSelectedSubcategory) ||
                    (subClean.length >= 4 && selectedSubClean.includes(subClean)) ||
                    (selectedSubClean.length >= 4 && subClean.includes(selectedSubClean)));

                // Count products matching this subcategory accurately
                const matchingCount = Array.isArray(products)
                  ? products.filter((p) => {
                      if (!p || p.status === "OUT OF STOCK" || p.status === "DISCONTINUED") return false;
                      if (!isCategoryMatch(activeCategoryObj, p.category || "")) return false;
                      return matchesSubcategory(p.subcategory, subName, p);
                    }).length
                  : 0;

                return (
                  <button
                    key={sub.id || subName || sIdx}
                    type="button"
                    title={subName}
                    onClick={(e) => {
                      e.preventDefault();
                      if (onSelectSubcategory) onSelectSubcategory(subName);
                    }}
                    className={`group inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shrink-0 border cursor-pointer snap-start focus:outline-none ${
                      isSubSelected
                        ? "bg-[#064E3B] text-[#FAF8F1] border-[#064E3B] ring-2 ring-[#C9A227]/40 shadow-xs"
                        : "bg-[#FFFFFF] text-[#171A18] border-[#E8E2D5] hover:border-[#C9A227] hover:bg-[#FAF8F1] hover:text-[#064E3B] shadow-2xs"
                    }`}
                  >
                    <span>{subName}</span>
                    {matchingCount > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          isSubSelected
                            ? "bg-[#C9A227] text-[#064E3B]"
                            : "bg-[#F3EFE3] text-[#5C635E] group-hover:bg-[#E8E2D5]"
                        }`}
                      >
                        {matchingCount}
                      </span>
                    )}
                    {isSubSelected && (
                      <span className="w-3.5 h-3.5 rounded-full bg-[#C9A227] text-[#064E3B] text-[9px] font-bold inline-flex items-center justify-center">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
