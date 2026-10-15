import React, { createContext, useContext, useReducer, useEffect, useState } from "react";
import type { Product } from "../data/products";

export interface CartItem {
  key?: string; // Unique composite key `${product.id}__${selectedColor}__${selectedSize}`
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  unitPrice?: number;
  mrp?: number;
  colorImage?: string;
  stock?: number;
}

interface CartState {
  items: CartItem[];
  wishlist: string[];
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | {
      type: "REMOVE_FROM_CART";
      payload:
        | string
        | { key?: string; productId?: string; selectedColor?: string; selectedSize?: string; index?: number };
    }
  | { type: "UPDATE_QUANTITY"; payload: { id?: string; key?: string; quantity: number } }
  | { type: "TOGGLE_WISHLIST"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_SAVED"; payload: CartState };

/**
 * Normalizes any cart key by stripping trailing index numbers (e.g. "p123__red__m-0" -> "p123__red__m")
 */
export function normalizeKey(key: string): string {
  if (!key) return "";
  return key
    .trim()
    .toLowerCase()
    .replace(/-+\d+$/, "")
    .replace(/__+\d+$/, "");
}

export function getCartItemKey(
  productId: string,
  color: string = "Standard",
  size: string = "Free Size"
): string {
  const safeId = String(productId || "").trim();
  const safeColor = String(color || "Standard").trim().toLowerCase();
  const safeSize = String(size || "Free Size").trim().toLowerCase();
  return `${safeId}__${safeColor}__${safeSize}`;
}

const STORAGE_KEY = "nithi_shopping_cart_v2";

const initialCartState: CartState = {
  items: [],
  wishlist: [],
};

/**
 * Validates and consolidates raw cart state from localStorage
 */
function sanitizeCartState(raw: any): CartState {
  if (!raw || typeof raw !== "object") return initialCartState;
  const rawItems: CartItem[] = Array.isArray(raw.items) ? raw.items : [];
  const consolidated: CartItem[] = [];

  for (const it of rawItems) {
    if (!it || !it.product || !it.product.id) continue;
    const color = it.selectedColor || (it.product.colors && it.product.colors[0]) || it.product.color || "Standard";
    const size = it.selectedSize || (it.product.sizes && it.product.sizes[0]) || "Free Size";
    const itemKey = normalizeKey(it.key || getCartItemKey(it.product.id, color, size));

    const existing = consolidated.find(
      (c) => normalizeKey(c.key || getCartItemKey(c.product.id, c.selectedColor, c.selectedSize)) === itemKey
    );

    if (existing) {
      existing.quantity += Math.max(1, Number(it.quantity) || 1);
    } else {
      consolidated.push({
        ...it,
        key: itemKey,
        selectedColor: color,
        selectedSize: size,
        quantity: Math.max(1, Number(it.quantity) || 1),
      });
    }
  }

  return {
    items: consolidated,
    wishlist: Array.isArray(raw.wishlist) ? raw.wishlist.filter(Boolean) : [],
  };
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_SAVED":
      return sanitizeCartState(action.payload);

    case "ADD_TO_CART": {
      const p = action.payload;
      if (!p || !p.product || !p.product.id) return state;

      const color = p.selectedColor || (p.product.colors && p.product.colors[0]) || p.product.color || "Standard";
      const size = p.selectedSize || (p.product.sizes && p.product.sizes[0]) || "Free Size";
      const itemKey = normalizeKey(p.key || getCartItemKey(p.product.id, color, size));

      // Determine size-specific price
      let unitPrice = p.unitPrice;
      let mrp = p.mrp || p.product.mrp || p.product.price;
      let stock = p.stock;

      if (p.product.sizeOptions && Array.isArray(p.product.sizeOptions) && p.product.sizeOptions.length > 0) {
        const szOpt = p.product.sizeOptions.find(
          (s) => s.size && s.size.toLowerCase() === size.toLowerCase()
        );
        if (szOpt) {
          if (!unitPrice) {
            const disc = p.product.discount || 0;
            unitPrice =
              p.product.discountType === "fixed"
                ? Math.max(0, szOpt.price - disc)
                : disc > 0
                ? Math.max(0, Math.round(szOpt.price * (1 - disc / 100)))
                : szOpt.price;
          }
          if (!mrp) mrp = szOpt.mrp || szOpt.price;
          if (stock === undefined) stock = szOpt.stock;
        }
      }

      if (unitPrice === undefined || isNaN(unitPrice)) {
        unitPrice =
          p.product.finalPrice ||
          (p.product.discount > 0
            ? Math.round(p.product.price * (1 - p.product.discount / 100))
            : p.product.price);
      }
      if (stock === undefined || isNaN(stock)) {
        stock = p.product.stock !== undefined ? p.product.stock : 50;
      }

      // Determine mapped color image
      const primaryPhoto =
        (Array.isArray(p.product.images) && p.product.images[0]) ||
        p.product.coverImage ||
        "";

      const colorImage =
        p.colorImage ||
        (p.product.colorImages && p.product.colorImages[color]) ||
        (p.product.colorOptions &&
          p.product.colorOptions.find((c) => c.name.toLowerCase() === color.toLowerCase())?.image) ||
        p.product.coverImage ||
        primaryPhoto ||
        "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=400";

      const existingIndex = state.items.findIndex((i) => {
        const k = normalizeKey(i.key || getCartItemKey(i.product.id, i.selectedColor, i.selectedSize));
        return k === itemKey;
      });

      let updatedItems: CartItem[];

      if (existingIndex >= 0) {
        const existing = state.items[existingIndex];
        const maxLimit = stock > 0 ? stock : 99;
        const newQty = Math.min(maxLimit, existing.quantity + (p.quantity || 1));
        updatedItems = state.items.map((it, idx) =>
          idx === existingIndex
            ? {
                ...it,
                quantity: newQty,
                unitPrice: Number(unitPrice) || it.unitPrice || 0,
                mrp: Number(mrp) || it.mrp || 0,
                colorImage,
                stock,
              }
            : it
        );
      } else {
        const maxLimit = stock > 0 ? stock : 99;
        const newItem: CartItem = {
          ...p,
          key: itemKey,
          selectedColor: color,
          selectedSize: size,
          unitPrice: Number(unitPrice) || p.product.price || 0,
          mrp: Number(mrp) || p.product.mrp || p.product.price || 0,
          colorImage,
          stock,
          quantity: Math.min(maxLimit, Math.max(1, p.quantity || 1)),
        };
        updatedItems = [...state.items, newItem];
      }

      return { ...state, items: updatedItems };
    }

    case "REMOVE_FROM_CART": {
      let updatedItems: CartItem[];

      if (typeof action.payload === "string") {
        const targetStr = action.payload.trim();
        const normalizedTarget = normalizeKey(targetStr);

        updatedItems = state.items.filter((i) => {
          const itemK = normalizeKey(i.key || getCartItemKey(i.product.id, i.selectedColor, i.selectedSize));
          // Check normalized key match, exact key match, or productId match
          if (itemK === normalizedTarget || i.key === targetStr) return false;
          if (i.product.id === targetStr) return false;
          return true;
        });
      } else if (action.payload && typeof action.payload === "object") {
        const payloadObj = action.payload;

        if (typeof payloadObj.index === "number") {
          updatedItems = state.items.filter((_, idx) => idx !== payloadObj.index);
        } else if (payloadObj.key) {
          const normalizedTarget = normalizeKey(payloadObj.key);
          updatedItems = state.items.filter((i) => {
            const itemK = normalizeKey(i.key || getCartItemKey(i.product.id, i.selectedColor, i.selectedSize));
            return itemK !== normalizedTarget && i.key !== payloadObj.key;
          });
        } else if (payloadObj.productId) {
          const targetKey = getCartItemKey(
            payloadObj.productId,
            payloadObj.selectedColor || "Standard",
            payloadObj.selectedSize || "Free Size"
          );
          const normalizedTarget = normalizeKey(targetKey);
          updatedItems = state.items.filter((i) => {
            const itemK = normalizeKey(i.key || getCartItemKey(i.product.id, i.selectedColor, i.selectedSize));
            return itemK !== normalizedTarget && i.product.id !== payloadObj.productId;
          });
        } else {
          updatedItems = state.items;
        }
      } else {
        updatedItems = state.items;
      }

      return { ...state, items: updatedItems };
    }

    case "UPDATE_QUANTITY": {
      const rawTarget = action.payload.key || action.payload.id || "";
      const normalizedTarget = normalizeKey(rawTarget);
      const targetQty = Number(action.payload.quantity);

      // If quantity is reduced to 0 or less, remove the item
      if (targetQty <= 0) {
        const filtered = state.items.filter((i) => {
          const itemK = normalizeKey(i.key || getCartItemKey(i.product.id, i.selectedColor, i.selectedSize));
          return itemK !== normalizedTarget && i.key !== rawTarget && i.product.id !== rawTarget;
        });
        return { ...state, items: filtered };
      }

      const updatedItems = state.items.map((i) => {
        const itemK = normalizeKey(i.key || getCartItemKey(i.product.id, i.selectedColor, i.selectedSize));
        if (itemK === normalizedTarget || i.key === rawTarget || i.product.id === rawTarget) {
          const maxAllowed = i.stock !== undefined && i.stock > 0 ? i.stock : 99;
          const validQty = Math.max(1, Math.min(maxAllowed, targetQty));
          return { ...i, quantity: validQty };
        }
        return i;
      });

      return { ...state, items: updatedItems };
    }

    case "TOGGLE_WISHLIST": {
      const id = String(action.payload || "").trim();
      if (!id) return state;
      const isWish = state.wishlist.includes(id);
      const wishlist = isWish ? state.wishlist.filter((x) => x !== id) : [...state.wishlist, id];
      return { ...state, wishlist };
    }

    case "CLEAR_CART": {
      return { ...state, items: [] };
    }

    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
  cartTotal: number;
  cartCount: number;
  cartMrpTotal: number;
} | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialCartState);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Client mount: hydrate safely from localStorage without SSR mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && (Array.isArray(parsed.items) || Array.isArray(parsed.wishlist))) {
          dispatch({ type: "LOAD_SAVED", payload: parsed });
        }
      }
    } catch (e) {
      console.warn("Could not load cart from localStorage:", e);
    }
    setIsHydrated(true);
  }, []);

  // 2. Persist state to localStorage only AFTER hydration has occurred
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new Event("nithi_cart_updated"));
    } catch (e) {
      console.warn("Failed to persist cart state:", e);
    }
  }, [state, isHydrated]);

  // 3. Cross-tab synchronization
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          dispatch({ type: "LOAD_SAVED", payload: parsed });
        } catch {}
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const cartTotal = state.items.reduce((sum, item) => {
    const unitP =
      item.unitPrice !== undefined ? item.unitPrice : (item.product.finalPrice || item.product.price);
    return sum + Number(unitP || 0) * item.quantity;
  }, 0);

  const cartMrpTotal = state.items.reduce((sum, item) => {
    const mrpP = item.mrp || item.product.mrp || item.product.price;
    return sum + Number(mrpP || 0) * item.quantity;
  }, 0);

  const cartCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ state, dispatch, cartTotal, cartCount, cartMrpTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
