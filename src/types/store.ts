import {
  type Category,
  type SubCategory,
  type Product,
  type ProductVariant,
  type SizeOption,
  type ColorOption,
  CATEGORY_HIERARCHY,
} from "../data/products";

export type { Category, SubCategory, Product, ProductVariant, SizeOption, ColorOption };
export { CATEGORY_HIERARCHY };

export interface InventoryRecord {
  productId: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  soldQuantity: number;
  lowStockThreshold: number;
}

export interface InventoryTransaction {
  id: string;
  productId: string;
  productName: string;
  date: string;
  action: "ADD" | "REMOVE" | "SET" | "ORDER_RESERVED" | "ORDER_FULFILLED";
  quantity: number;
  previousStock: number;
  newStock: number;
  reason: string;
  changedBy: string;
}

export interface ComboOffer {
  id: string;
  name: string;
  description?: string;
  productIds: string[];
  category?: string;
  requiredQuantity: number;
  discountType: "percentage" | "fixed" | "combo_price";
  discountValue: number;
  comboPrice: number;
  normalTotal: number;
  image?: string;
  freeShipping: boolean;
  startDate: string;
  endDate: string;
  status: "active" | "inactive";
}

export interface ShippingRule {
  id: string;
  state: string;
  category: string;
  minQty: number;
  maxQty: number;
  minOrderValue: number;
  shippingType: "FREE" | "FIXED" | "PER_ITEM";
  charge: number;
  status: "active" | "inactive";
}

export interface CODRule {
  id: string;
  availableStates: string[];
  minQuantity: number;
  shippingCharge: number;
  freeShippingThreshold: number;
  status: "active" | "inactive";
}

export interface CODAdvanceRule {
  id: string;
  category: string;
  quantityRange: string;
  minQty: number;
  maxQty: number;
  advanceAmount: number;
  status: "active" | "inactive";
}

export interface OrderRecord {
  id: string;
  orderId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: {
    productId: string;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: "Pending" | "Confirmed" | "Processing" | "Packed" | "Shipped" | "Delivered" | "Cancelled";
  paymentMethod: "COD" | "Online" | "UPI";
  shippingState: string;
  shippingAddress: string;
  courierName?: string;
  trackingId?: string;
  dispatchDate?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminName: string;
  action: string;
  targetType: "PRODUCT" | "STOCK" | "PRICING" | "COMBO" | "SHIPPING" | "COD" | "ORDER";
  targetId: string;
  targetName: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
}

export interface SiteSettings {
  storeName?: string;
  tagline?: string;
  supportPhone?: string;
  supportEmail?: string;
  defaultLowThreshold?: number;
  marqueeEnabled?: boolean;
  marqueeTexts?: string[];
  circularBadgeEnabled?: boolean;
  circularBadgeText?: string;
  circularBadgeLink?: string;
  freeShippingThreshold?: number;
  storeAddress?: string;
}
