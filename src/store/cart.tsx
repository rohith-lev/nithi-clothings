import React, { createContext, useContext, useReducer, useEffect } from "react";
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
  | { type: "REMOVE_FROM_CART"; payload: string | { productId: string; selectedColor?: string; selectedSize?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id?: string; key?: string; quantity: number } }
  | { type: "TOGGLE_WISHLIST"; payload: string }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_SAVED"; payload: CartState };

export function getCartItemKey(productId: string, color: string = "Standard", size: string = "Free Size"): string {
  return `${productId}__${color.trim().toLowerCase()}__${size.trim().toLowerCase()}`;
}

const STORAGE_KEY = "nithi_shopping_cart_v2";

const initialCartState: CartState = {
  items: [],
  wishlist: []
};

function getInitialState(): CartState {
  if (typeof window === "undefined") return initialCartState;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        items: Array.isArray(parsed.items) ? parsed.items : [],
        wishlist: Array.isArray(parsed.wishlist) ? parsed.wishlist : []
      };
    }
  } catch (e) {
    console.warn("Could not load cart from localStorage", e);
  }
  return initialCartState;
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "LOAD_SAVED":
      return action.payload;

    case "ADD_TO_CART": {
      const p = action.payload;
      const color = p.selectedColor || (p.product.colors && p.product.colors[0]) || p.product.color || "Standard";
      const size = p.selectedSize || (p.product.sizes && p.product.sizes[0]) || "Free Size";
      const itemKey = p.key || getCartItemKey(p.product.id, color, size);

      // Determine size-specific price
      let unitPrice = p.unitPrice;
      let mrp = p.mrp || p.product.mrp || p.product.price;
      let stock = p.stock;

      if (p.product.sizeOptions && p.product.sizeOptions.length > 0) {
        const szOpt = p.product.sizeOptions.find(
          s => s.size && s.size.toLowerCase() === size.toLowerCase()
        );
        if (szOpt) {
          if (!unitPrice) {
            const disc = p.product.discount || 0;
            unitPrice = p.product.discountType === "fixed"
              ? Math.max(0, szOpt.price - disc)
              : disc > 0
              ? Math.max(0, Math.round(szOpt.price * (1 - disc / 100)))
              : szOpt.price;
          }
          if (!mrp) mrp = szOpt.mrp || szOpt.price;
          if (stock === undefined) stock = szOpt.stock;
        }
      }

      if (unitPrice === undefined) {
        unitPrice = p.product.finalPrice || (p.product.discount > 0 ? Math.round(p.product.price * (1 - p.product.discount / 100)) : p.product.price);
      }
      if (stock === undefined) {
        stock = p.product.stock !== undefined ? p.product.stock : 10;
      }

      // Determine mapped color image
      const colorImage =
        p.colorImage ||
        (p.product.colorImages && p.product.colorImages[color]) ||
        (p.product.colorOptions && p.product.colorOptions.find(c => c.name.toLowerCase() === color.toLowerCase())?.image) ||
        p.product.coverImage ||
        p.product.images[0] ||
        "";

      const existingIndex = state.items.findIndex((i) => {
        const k = i.key || getCartItemKey(i.product.id, i.selectedColor, i.selectedSize);
        return k === itemKey;
      });

      let updatedItems: CartItem[];

      if (existingIndex >= 0) {
        const existing = state.items[existingIndex];
        const newQty = Math.min(stock > 0 ? stock : 99, existing.quantity + p.quantity);
        updatedItems = state.items.map((it, idx) =>
          idx === existingIndex
            ? {
                ...it,
                quantity: newQty,
                unitPrice,
                mrp,
                colorImage,
                stock,
              }
            : it
        );
      } else {
        const newItem: CartItem = {
          ...p,
          key: itemKey,
          selectedColor: color,
          selectedSize: size,
          unitPrice,
          mrp,
          colorImage,
          stock,
          quantity: Math.min(stock > 0 ? stock : 99, Math.max(1, p.quantity)),
        };
        updatedItems = [...state.items, newItem];
      }

      const nextState = { ...state, items: updatedItems };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState)); } catch {}
      return nextState;
    }

    case "REMOVE_FROM_CART": {
      let updatedItems: CartItem[];
      if (typeof action.payload === "string") {
        const target = action.payload;
        // Check if target is a composite key or just productId
        if (target.includes("__")) {
          updatedItems = state.items.filter((i) => {
            const k = i.key || getCartItemKey(i.product.id, i.selectedColor, i.selectedSize);
            return k !== target;
          });
        } else {
          // If plain id, remove by key match or id fallback
          updatedItems = state.items.filter((i) => {
            const k = i.key || getCartItemKey(i.product.id, i.selectedColor, i.selectedSize);
            return k !== target && i.product.id !== target;
          });
        }
      } else {
        const { productId, selectedColor, selectedSize } = action.payload;
        const targetKey = getCartItemKey(productId, selectedColor || "Standard", selectedSize || "Free Size");
        updatedItems = state.items.filter((i) => {
          const k = i.key || getCartItemKey(i.product.id, i.selectedColor, i.selectedSize);
          return k !== targetKey;
        });
      }

      const nextState = { ...state, items: updatedItems };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState)); } catch {}
      return nextState;
    }

    case "UPDATE_QUANTITY": {
      const targetIdentifier = action.payload.key || action.payload.id;
      const targetQty = action.payload.quantity;

      const updatedItems = state.items
        .map((i) => {
          const k = i.key || getCartItemKey(i.product.id, i.selectedColor, i.selectedSize);
          if (k === targetIdentifier || i.product.id === targetIdentifier) {
            const maxAllowed = (i.stock !== undefined && i.stock > 0) ? i.stock : 99;
            const validQty = Math.max(1, Math.min(maxAllowed, targetQty));
            return { ...i, quantity: validQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0);

      const nextState = { ...state, items: updatedItems };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState)); } catch {}
      return nextState;
    }

    case "TOGGLE_WISHLIST": {
      const id = action.payload;
      const isWish = state.wishlist.includes(id);
      const wishlist = isWish ? state.wishlist.filter((x) => x !== id) : [...state.wishlist, id];
      const nextState = { ...state, wishlist };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState)); } catch {}
      return nextState;
    }

    case "CLEAR_CART": {
      const nextState = { ...state, items: [] };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState)); } catch {}
      return nextState;
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
  const [state, dispatch] = useReducer(cartReducer, initialCartState, getInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to persist cart state:", e);
    }
  }, [state]);

  const cartTotal = state.items.reduce((sum, item) => {
    const unitP = item.unitPrice !== undefined ? item.unitPrice : (item.product.finalPrice || item.product.price);
    return sum + unitP * item.quantity;
  }, 0);

  const cartMrpTotal = state.items.reduce((sum, item) => {
    const mrpP = item.mrp || item.product.mrp || item.product.price;
    return sum + mrpP * item.quantity;
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
