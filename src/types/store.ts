import { type Category, type SubCategory, CATEGORY_HIERARCHY } from "../data/products";
export type { Category, SubCategory };
export { CATEGORY_HIERARCHY };

export interface SizeOption {
  size: string;
  price: number;
  mrp?: number;
  stock: number;
  sku?: string;
}

export interface ColorOption {
  name: string;
  hex?: string;
  image: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  sku: string;
  category: string;
  subcategory?: string;
  brand: string;
  price: number;
  mrp: number;
  discount: number;
  finalPrice?: number;
  discountType: "percentage" | "fixed";
  discountValue: number;
  images: string[];
  coverImage?: string;
  color?: string;
  colors: string[];
  colorOptions?: ColorOption[];
  sizes: string[];
  sizeOptions?: SizeOption[];
  colorImages?: Record<string, string>;
  variants?: ProductVariant[];
  fabric: string;
  material?: string;
  length?: string;
  pattern?: string;
  sleeveType?: string;
  neckType?: string;
  description: string;
  shortDescription?: string;
  care: string;
  sizeChart?: string;
  specialFeatures?: string;
  inStock: boolean;
  stock: number;
  status: "ACTIVE" | "DRAFT" | "OUT OF STOCK" | "DISCONTINUED";
  rating: number;
  reviews: number;
  isNew?: boolean;
  newArrival?: boolean;
  isBestSeller?: boolean;
  seo: {
    title: string;
    metaDescription: string;
    urlSlug: string;
    focusKeyword: string;
    socialImage?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId?: string;
  size: string;
  color: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  status: "active" | "inactive";
}

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
  productIds: string[];
  category?: string;
  requiredQuantity: number;
  discountType: "percentage" | "fixed" | "combo_price";
  discountValue: number;
  comboPrice: number;
  normalTotal: number;
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
}
