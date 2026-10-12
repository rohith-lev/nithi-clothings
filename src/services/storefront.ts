import { useState, useEffect, useCallback } from "react";
import type { Product, Category } from "../types/store";
import { categories as defaultCategories, products as defaultProducts } from "../data/products";

// Centralized reactive client-side category store
let cachedCategories: Category[] = [];
const categoryListeners = new Set<(cats: Category[]) => void>();

// Centralized reactive client-side product store
let cachedProducts: Product[] = [];
const productListeners = new Set<(prods: Product[]) => void>();

function isPriyaItem(item: any): boolean {
  if (!item) return false;
  const str = `${item.id || ""} ${item.name || ""} ${item.code || ""} ${item.sku || ""} ${item.category || ""} ${item.subcategory || ""} ${item.slug || ""}`.toLowerCase();
  return str.includes("priya");
}

export function deleteCategoryFromClientCache(targetIdOrName: string) {
  if (!targetIdOrName) return;
  const cleanTarget = targetIdOrName.toLowerCase().trim();
  const cleanClean = cleanTarget.replace(/[^a-z0-9]/g, "");

  cachedCategories = cachedCategories.filter((c) => {
    if (!c || isPriyaItem(c)) return false;
    const cId = (c.id || "").toLowerCase().trim();
    const cSlug = (c.slug || "").toLowerCase().trim();
    const cName = (c.name || "").toLowerCase().trim();
    const cClean = cName.replace(/[^a-z0-9]/g, "");

    return (
      cId !== cleanTarget &&
      cSlug !== cleanTarget &&
      cName !== cleanTarget &&
      cClean !== cleanClean &&
      c.id !== targetIdOrName &&
      (c as any)._id !== targetIdOrName
    );
  });

  categoryListeners.forEach((listener) => listener([...cachedCategories]));
}

export function deleteProductFromClientCache(targetIdOrName: string) {
  if (!targetIdOrName) return;
  const cleanTarget = targetIdOrName.toLowerCase().trim();

  cachedProducts = cachedProducts.filter((p) => {
    if (!p || isPriyaItem(p)) return false;
    const pId = (p.id || "").toLowerCase().trim();
    const pCode = (p.code || "").toLowerCase().trim();
    const pSku = (p.sku || "").toLowerCase().trim();
    const pName = (p.name || "").toLowerCase().trim();

    return (
      pId !== cleanTarget &&
      pCode !== cleanTarget &&
      pSku !== cleanTarget &&
      pName !== cleanTarget &&
      (p as any)._id !== targetIdOrName
    );
  });

  productListeners.forEach((listener) => listener([...cachedProducts]));
}

export function updateClientCategories(newCategories: Category[]) {
  cachedCategories = (newCategories || []).filter((c) => !isPriyaItem(c));
  categoryListeners.forEach((listener) => listener([...cachedCategories]));
}

async function safeJsonFetch<T = any>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return null;
    }
    const text = await res.text();
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export function useStoreCategories() {
  const [categories, setCategories] = useState<Category[]>(() => {
    const base = cachedCategories.length > 0 ? cachedCategories : defaultCategories || [];
    return base.filter((c) => !isPriyaItem(c));
  });

  const fetchCategories = useCallback(() => {
    safeJsonFetch<{ success?: boolean; data?: Category[] }>("/api/categories?activeOnly=true")
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          // Deduplicate by slug or id and ensure only active categories
          const seen = new Set<string>();
          const uniqueCats: Category[] = [];
          for (const cat of data.data) {
            if (!cat || cat.isActive === false || isPriyaItem(cat)) continue;
            const key = (cat.slug || cat.id || cat.name || "").toLowerCase().trim();
            if (key && !seen.has(key)) {
              seen.add(key);
              uniqueCats.push(cat);
            }
          }
          cachedCategories = uniqueCats;
          categoryListeners.forEach((listener) => listener([...uniqueCats]));
        }
      })
      .catch((err) => console.warn("Categories fetch error:", err));
  }, []);

  useEffect(() => {
    const handleUpdate = (updated: Category[]) => {
      setCategories(updated.filter((c) => !isPriyaItem(c)));
    };
    categoryListeners.add(handleUpdate);

    fetchCategories();

    // Event listeners for cross-component and cross-tab synchronization
    const handleCategoryEvent = (e: any) => {
      if (e?.detail?.deletedId) {
        deleteCategoryFromClientCache(e.detail.deletedId);
      } else {
        fetchCategories();
      }
    };

    window.addEventListener("focus", fetchCategories);
    window.addEventListener("nithi_categories_updated", handleCategoryEvent);
    window.addEventListener("storage", fetchCategories);

    // Periodic sync interval (every 8 seconds)
    const interval = setInterval(fetchCategories, 8000);

    return () => {
      categoryListeners.delete(handleUpdate);
      window.removeEventListener("focus", fetchCategories);
      window.removeEventListener("nithi_categories_updated", handleCategoryEvent);
      window.removeEventListener("storage", fetchCategories);
      clearInterval(interval);
    };
  }, [fetchCategories]);

  return categories;
}

export function useStoreProducts() {
  const [products, setProducts] = useState<Product[]>(() => {
    const base = cachedProducts.length > 0 ? cachedProducts : defaultProducts || [];
    return base.filter((p) => !isPriyaItem(p));
  });

  const fetchProducts = useCallback(() => {
    safeJsonFetch<{ success?: boolean; data?: Product[] }>("/api/products?activeOnly=true")
      .then((data) => {
        if (data && data.success && Array.isArray(data.data)) {
          const clean = data.data.filter((p: Product) => p && !isPriyaItem(p));
          cachedProducts = clean;
          setProducts(clean);
          productListeners.forEach((listener) => listener([...clean]));
        }
      })
      .catch((err) => {
        console.warn("Backend API error:", err);
      });
  }, []);

  useEffect(() => {
    const handleProductListener = (updated: Product[]) => {
      setProducts(updated.filter((p) => !isPriyaItem(p)));
    };
    productListeners.add(handleProductListener);

    fetchProducts();
    const handleProductUpdate = (e: any) => {
      if (e?.detail?.deletedId) {
        deleteProductFromClientCache(e.detail.deletedId);
      } else {
        fetchProducts();
      }
    };

    window.addEventListener("focus", fetchProducts);
    window.addEventListener("nithi_products_updated", handleProductUpdate);
    window.addEventListener("storage", fetchProducts);

    const interval = setInterval(fetchProducts, 8000);

    return () => {
      productListeners.delete(handleProductListener);
      window.removeEventListener("focus", fetchProducts);
      window.removeEventListener("nithi_products_updated", handleProductUpdate);
      window.removeEventListener("storage", fetchProducts);
      clearInterval(interval);
    };
  }, [fetchProducts]);

  return products;
}

export function useStoreProduct(id?: string) {
  const findLocal = (searchId?: string): Product | undefined => {
    if (!searchId) return undefined;
    const clean = searchId.toLowerCase().trim();
    if (clean.includes("priya")) return undefined;
    return defaultProducts.find(
      (p) =>
        !isPriyaItem(p) &&
        ((p.id && p.id.toLowerCase() === clean) ||
          (p.code && p.code.toLowerCase() === clean) ||
          (p.sku && p.sku.toLowerCase() === clean) ||
          ((p as any)._id && String((p as any)._id).toLowerCase() === clean) ||
          (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === clean))
    );
  };

  const [product, setProduct] = useState<Product | undefined>(() => findLocal(id));
  const [loading, setLoading] = useState<boolean>(!findLocal(id));

  const fetchProduct = useCallback(() => {
    if (!id || id.toLowerCase().includes("priya")) {
      setProduct(undefined);
      setLoading(false);
      return;
    }
    const local = findLocal(id);
    if (local) {
      setProduct(local);
    }
    safeJsonFetch<{ success?: boolean; data?: Product }>(`/api/products/${encodeURIComponent(id)}`)
      .then((data) => {
        if (data && data.success && data.data && !isPriyaItem(data.data)) {
          setProduct(data.data);
        } else if (!local) {
          safeJsonFetch<{ success?: boolean; data?: any[] }>("/api/products?activeOnly=true")
            .then((allData) => {
              if (allData && allData.success && Array.isArray(allData.data)) {
                const clean = id.toLowerCase().trim();
                const matched = allData.data.find(
                  (p: any) =>
                    !isPriyaItem(p) &&
                    ((p.id && p.id.toLowerCase() === clean) ||
                      (p.code && p.code.toLowerCase() === clean) ||
                      (p.sku && p.sku.toLowerCase() === clean) ||
                      (p._id && String(p._id).toLowerCase() === clean) ||
                      (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === clean))
                );
                if (matched) setProduct(matched);
                else setProduct(undefined);
              }
            })
            .catch(() => {});
        }
      })
      .catch((err) => {
        console.warn("Backend API error:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, loading };
}
