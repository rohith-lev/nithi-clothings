import { useState, useEffect, useCallback } from "react";
import type { Product, Category } from "../types/store";
import { categories as defaultCategories } from "../data/products";

export function useStoreCategories() {
  const [categories, setCategories] = useState<Category[]>(defaultCategories || []);

  const fetchCategories = useCallback(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          // Deduplicate by slug or id
          const seen = new Set<string>();
          const uniqueCats: Category[] = [];
          for (const cat of data.data) {
            const key = (cat.slug || cat.id || cat.name || "").toLowerCase().trim();
            if (key && !seen.has(key)) {
              seen.add(key);
              uniqueCats.push(cat);
            }
          }
          setCategories(uniqueCats);
        }
      })
      .catch((err) => console.warn("Categories fetch error:", err));
  }, []);

  useEffect(() => {
    fetchCategories();
    window.addEventListener("focus", fetchCategories);
    return () => {
      window.removeEventListener("focus", fetchCategories);
    };
  }, [fetchCategories]);

  return categories;
}

export function useStoreProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = useCallback(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        }
      })
      .catch((err) => {
        console.warn("Backend API error:", err);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
    window.addEventListener("focus", fetchProducts);
    return () => {
      window.removeEventListener("focus", fetchProducts);
    };
  }, [fetchProducts]);

  return products;
}

export function useStoreProduct(id?: string) {
  const [product, setProduct] = useState<Product | undefined>(undefined);

  const fetchProduct = useCallback(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setProduct(data.data);
        }
      })
      .catch((err) => {
        console.warn("Backend API error:", err);
      });
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return product;
}
