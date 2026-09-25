import { useState, useEffect } from "react";
import type { Product } from "../types/store";

const RECENTLY_VIEWED_KEY = "nithi_recently_viewed_ids";
const MAX_ITEMS = 10;

export function addRecentlyViewed(productId: string) {
  if (typeof window === "undefined" || !productId) return;
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    const filtered = ids.filter((id) => id !== productId);
    const updated = [productId, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("recently_viewed_updated"));
  } catch (err) {
    console.warn("Could not save recently viewed:", err);
  }
}

export function getRecentlyViewedIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useRecentlyViewed(allProducts: Product[], currentProductId?: string) {
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);

  useEffect(() => {
    const sync = () => {
      const ids = getRecentlyViewedIds().filter((id) => id !== currentProductId);
      const matched = ids
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is Product => !!p && (p.status === "ACTIVE" || !p.status));
      setRecentProducts(matched);
    };

    sync();
    window.addEventListener("recently_viewed_updated", sync);
    return () => window.removeEventListener("recently_viewed_updated", sync);
  }, [allProducts, currentProductId]);

  return recentProducts;
}
