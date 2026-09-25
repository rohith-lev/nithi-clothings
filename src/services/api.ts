import type {
  Product,
  ProductVariant,
  InventoryTransaction,
  ShippingRule,
  CODRule,
  CODAdvanceRule,
  OrderRecord,
  Category,
  AuditLog,
} from "../types/store";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string>;
  message?: string;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  subcategory?: string;
  stockStatus?: "all" | "in_stock" | "low_stock" | "out_of_stock";
  status?: "all" | "ACTIVE" | "DRAFT" | "OUT OF STOCK" | "DISCONTINUED";
  isDiscounted?: boolean;
  isBestSeller?: boolean;
}

export type ProductSort =
  | "newest"
  | "oldest"
  | "stock-desc"
  | "stock-asc"
  | "price-desc"
  | "price-asc"
  | "bestseller";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const authDataStr = localStorage.getItem("nithi_admin_session_auth_v1");
    if (authDataStr) {
      const authData = JSON.parse(authDataStr);
      if (authData.token) {
        return { Authorization: `Bearer ${authData.token}` };
      }
    }
  } catch (e) {
    // ignore
  }
  return {};
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  try {
    const headers = {
      ...getAuthHeader(),
      ...options.headers,
    };
    const res = await fetch(url, { ...options, credentials: "same-origin", headers });
    const data = await res.json();
    return data;
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Network error occurred",
    };
  }
}

export const adminApi = {
  // 1. DASHBOARD METRICS
  async getDashboardMetrics() {
    const res = await apiFetch<any>("/api/admin/dashboard");
    if (res.success && res.data) {
      return res.data;
    }
    // Fallback default structure
    return {
      totalProducts: 0,
      totalStock: 0,
      lowStockCount: 0,
      outOfStockCount: 0,
      todayOrdersCount: 0,
      pendingOrdersCount: 0,
      todaySales: 0,
      codOrdersCount: 0,
      onlineOrdersCount: 0,
      lowStockItems: [],
      recentOrders: [],
      topSelling: [],
    };
  },

  // 2. GET PRODUCTS with Filter, Search & Sort
  async getProducts(filters?: ProductFilters, sort: ProductSort = "newest"): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.search) params.set("search", filters.search);
    if (filters?.category && filters.category !== "all") params.set("category", filters.category);
    if (filters?.subcategory && filters.subcategory !== "all") params.set("subcategory", filters.subcategory);
    if (filters?.status && filters.status !== "all") params.set("status", filters.status);

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await apiFetch<Product[]>(`/api/products${query}`);
    let list: Product[] = res.success && Array.isArray(res.data) ? res.data : [];

    // Client-side filtering for sub-filters (stockStatus, isDiscounted, isBestSeller)
    if (filters?.stockStatus && filters.stockStatus !== "all") {
      if (filters.stockStatus === "in_stock") {
        list = list.filter((p) => p.stock > 10);
      } else if (filters.stockStatus === "low_stock") {
        list = list.filter((p) => p.stock <= 10 && p.stock > 0);
      } else if (filters.stockStatus === "out_of_stock") {
        list = list.filter((p) => p.stock <= 0);
      }
    }
    if (filters?.isDiscounted) {
      list = list.filter((p) => p.discount > 0);
    }
    if (filters?.isBestSeller) {
      list = list.filter((p) => p.isBestSeller);
    }

    // Client-side sorting
    switch (sort) {
      case "newest":
        list.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case "oldest":
        list.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
        break;
      case "stock-desc":
        list.sort((a, b) => (b.stock || 0) - (a.stock || 0));
        break;
      case "stock-asc":
        list.sort((a, b) => (a.stock || 0) - (b.stock || 0));
        break;
      case "price-desc":
        list.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "price-asc":
        list.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "bestseller":
        list.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
        break;
    }

    return list;
  },

  // 3. GET SINGLE PRODUCT
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    const res = await apiFetch<Product>(`/api/products/${id}`);
    return res;
  },

  // 4. SAVE / UPDATE PRODUCT with Backend Validation
  async saveProduct(
    productData: Partial<Product> & { id: string },
    adminName: string = "Super Admin",
    rawFiles: File[] = []
  ): Promise<ApiResponse<Product>> {
    const fieldErrors: Record<string, string> = {};

    if (!productData.name?.trim()) {
      fieldErrors.name = "Product name is required.";
    }
    if (!productData.category) {
      fieldErrors.category = "Category must be selected.";
    }
    if (productData.price === undefined || Number(productData.price) < 0) {
      fieldErrors.price = "Price must be a non-negative number.";
    }
    if (productData.discount !== undefined && (Number(productData.discount) < 0 || Number(productData.discount) > 100)) {
      fieldErrors.discount = "Discount must be between 0 and 100%.";
    }
    if (productData.stock === undefined || Number(productData.stock) < 0) {
      fieldErrors.stock = "Stock quantity cannot be negative.";
    }

    if (Object.keys(fieldErrors).length > 0) {
      return {
        success: false,
        error: "Validation failed. Please review the highlighted fields.",
        fieldErrors,
      };
    }

    const basePrice = Number(productData.price) || 0;
    const discount = Number(productData.discount) || 0;
    const mrp = Number(productData.mrp) || basePrice;
    const finalPrice = discount > 0 
      ? Math.max(0, Math.round(basePrice - (basePrice * discount / 100))) 
      : basePrice;

    const stock = Number(productData.stock) || 0;
    const status = stock === 0 && productData.status === "ACTIVE" ? "OUT OF STOCK" : productData.status || "ACTIVE";
    const code = productData.code?.trim() || `NC-${Date.now().toString().slice(-4)}`;
    const sku = productData.sku?.trim() || `SKU-${Date.now().toString().slice(-4)}`;

    const existingImages = productData.images && productData.images.length > 0 ? productData.images : [];
    const coverImage = productData.coverImage || (existingImages.length > 0 ? existingImages[0] : "");

    const fullProduct: Partial<Product> & { id: string } = {
      ...productData,
      id: productData.id,
      name: productData.name!.trim(),
      code,
      sku,
      category: productData.category!,
      subcategory: productData.subcategory || "",
      brand: productData.brand || "Nithi Collection",
      price: basePrice,
      mrp,
      discount,
      finalPrice,
      discountType: productData.discountType || "percentage",
      discountValue: discount,
      images: existingImages.length > 0 ? existingImages : [
        "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format"
      ],
      coverImage: coverImage || "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format",
      color: productData.color || (productData.colors && productData.colors[0]) || "Green",
      colors: productData.colors && productData.colors.length > 0 ? productData.colors : [productData.color || "Green"],
      sizes: productData.sizes && productData.sizes.length > 0 ? productData.sizes : ["Free Size"],
      fabric: productData.fabric || "100% Pure Cotton",
      material: productData.material || "Pure Cotton",
      length: productData.length || "55 Inches",
      pattern: productData.pattern || "Printed",
      sleeveType: productData.sleeveType || "Half Sleeve",
      neckType: productData.neckType || "Round Neck",
      description: productData.description || "",
      shortDescription: productData.shortDescription || "",
      care: productData.care || "Gentle machine wash with mild detergent.",
      sizeChart: productData.sizeChart || "Standard Free Size / Regular Indian Sizing",
      specialFeatures: productData.specialFeatures || "",
      inStock: stock > 0 && status !== "OUT OF STOCK" && status !== "DISCONTINUED",
      stock,
      status,
      updatedAt: new Date().toISOString(),
    };

    if (rawFiles && rawFiles.length > 0) {
      const formData = new FormData();
      formData.append("productData", JSON.stringify(fullProduct));
      rawFiles.forEach((file) => formData.append("images", file));

      return apiFetch<Product>("/api/products", {
        method: "POST",
        body: formData,
      });
    }

    return apiFetch<Product>("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fullProduct),
    });
  },

  // 4b. UPLOAD PRODUCT IMAGES
  async uploadImages(files: File[]): Promise<{ success: boolean; urls?: string[]; error?: string }> {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("images", file));

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return { success: false, error: err.message || "Failed to upload image files" };
    }
  },

  // 5. ATOMIC STOCK ADJUSTMENT
  async adjustStock(
    productId: string,
    action: "ADD" | "REMOVE" | "SET",
    quantity: number,
    reason: string,
    adminName: string = "Super Admin"
  ): Promise<ApiResponse<{ currentStock: number; availableStock: number }>> {
    const pRes = await this.getProduct(productId);
    if (!pRes.success || !pRes.data) {
      return { success: false, error: "Product not found." };
    }
    const product = pRes.data;
    const prevStock = product.stock || 0;
    let newStock = prevStock;

    if (action === "ADD") {
      if (quantity <= 0) return { success: false, error: "Quantity to add must be greater than 0." };
      newStock = prevStock + quantity;
    } else if (action === "REMOVE") {
      if (quantity <= 0) return { success: false, error: "Quantity to remove must be greater than 0." };
      if (prevStock - quantity < 0) {
        return {
          success: false,
          error: `Cannot remove ${quantity} items. Available stock is only ${prevStock}. Negative stock is prohibited.`,
        };
      }
      newStock = prevStock - quantity;
    } else if (action === "SET") {
      if (quantity < 0) return { success: false, error: "Stock cannot be negative." };
      newStock = quantity;
    }

    const updated = await this.quickEdit(productId, { stock: newStock }, adminName);
    if (!updated.success) {
      return { success: false, error: updated.error || "Failed to adjust stock." };
    }

    return {
      success: true,
      data: { currentStock: newStock, availableStock: newStock },
      message: `Stock successfully updated from ${prevStock} to ${newStock}.`,
    };
  },

  // 6. QUICK EDIT
  async quickEdit(
    productId: string,
    updates: {
      price?: number;
      discount?: number;
      stock?: number;
      sizes?: string[];
      color?: string;
      status?: Product["status"];
      newArrival?: boolean;
    },
    adminName: string = "Super Admin"
  ): Promise<ApiResponse<Product>> {
    const pRes = await this.getProduct(productId);
    if (!pRes.success || !pRes.data) {
      return { success: false, error: "Product not found" };
    }
    const product = pRes.data;

    if (updates.stock !== undefined && updates.stock < 0) {
      return { success: false, error: "Stock cannot be negative" };
    }
    if (updates.price !== undefined && updates.price <= 0) {
      return { success: false, error: "Price must be positive" };
    }
    if (updates.discount !== undefined && (updates.discount < 0 || updates.discount > 100)) {
      return { success: false, error: "Discount must be between 0 and 100%" };
    }

    if (updates.price !== undefined) {
      product.price = Number(updates.price);
      product.mrp = Number(updates.price);
    }
    if (updates.discount !== undefined) {
      product.discount = Number(updates.discount);
    }

    const disc = product.discount || 0;
    product.finalPrice = disc > 0
      ? Math.max(0, Math.round(product.price - (product.price * disc) / 100))
      : product.price;

    if (updates.stock !== undefined) {
      product.stock = Number(updates.stock);
      product.inStock = product.stock > 0;
      if (product.stock === 0 && product.status === "ACTIVE") product.status = "OUT OF STOCK";
      if (product.stock > 0 && product.status === "OUT OF STOCK") product.status = "ACTIVE";
    }
    if (updates.sizes !== undefined && Array.isArray(updates.sizes)) {
      product.sizes = updates.sizes;
    }
    if (updates.color !== undefined) {
      product.color = updates.color;
      product.colors = [updates.color];
    }
    if (updates.status !== undefined) {
      product.status = updates.status;
    }
    if (updates.newArrival !== undefined) {
      product.newArrival = updates.newArrival;
      product.isNew = updates.newArrival;
    }
    product.updatedAt = new Date().toISOString();

    return apiFetch<Product>("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });
  },

  // 7. DUPLICATE PRODUCT
  async duplicateProduct(productId: string, adminName: string = "Super Admin"): Promise<ApiResponse<Product>> {
    const pRes = await this.getProduct(productId);
    if (!pRes.success || !pRes.data) {
      return { success: false, error: "Source product not found" };
    }
    const original = pRes.data;

    const newId = `p${Date.now().toString().slice(-4)}`;
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const newCode = `${original.code}-COPY-${randomSuffix}`;
    const newSku = `${original.sku}-COPY-${randomSuffix}`;

    const duplicated: Product = {
      ...original,
      id: newId,
      name: `${original.name} (Copy)`,
      code: newCode,
      sku: newSku,
      stock: 0,
      inStock: false,
      status: "DRAFT",
      reviews: 0,
      rating: 5.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      seo: {
        ...original.seo,
        title: `${original.name} (Copy) | Nithi Collection`,
        urlSlug: `${original.seo?.urlSlug || original.id}-copy-${randomSuffix}`,
      },
    };

    return apiFetch<Product>("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(duplicated),
    });
  },

  // 8. DELETE / ARCHIVE PRODUCT
  async deleteProduct(productId: string, adminName: string = "Super Admin"): Promise<ApiResponse<{ archived: boolean }>> {
    const res = await apiFetch<any>(`/api/products/${productId}`, {
      method: "DELETE",
    });
    return {
      success: res.success,
      data: { archived: false },
      message: res.message || (res.success ? "Product deleted successfully." : res.error),
      error: res.error,
    };
  },

  // 8b. DELETE ALL PRODUCTS
  async deleteAllProducts(adminName: string = "Super Admin"): Promise<ApiResponse<{ count: number }>> {
    const res = await apiFetch<any>("/api/products", {
      method: "DELETE",
    });
    return {
      success: res.success,
      data: { count: res.data?.deletedCount || 0 },
      message: res.message || "Products deleted successfully.",
      error: res.error,
    };
  },

  // 9. BULK ACTIONS
  async bulkUpdate(
    productIds: string[],
    action: "activate" | "deactivate" | "delete" | "discount" | "category",
    payload?: any,
    adminName: string = "Super Admin"
  ): Promise<ApiResponse<{ affected: number }>> {
    let affected = 0;
    for (const id of productIds) {
      if (action === "delete") {
        const delRes = await this.deleteProduct(id, adminName);
        if (delRes.success) affected++;
      } else {
        const updates: any = {};
        if (action === "activate") updates.status = "ACTIVE";
        else if (action === "deactivate") updates.status = "DRAFT";
        else if (action === "discount" && typeof payload?.discount === "number") updates.discount = payload.discount;
        else if (action === "category" && typeof payload?.category === "string") updates.category = payload.category;

        const editRes = await this.quickEdit(id, updates, adminName);
        if (editRes.success) affected++;
      }
    }

    return {
      success: true,
      data: { affected },
      message: `Bulk operation applied to ${affected} products.`,
    };
  },

  // 10. SHIPPING & COD RULES
  async getShippingRules(): Promise<ShippingRule[]> {
    const res = await apiFetch<ShippingRule[]>("/api/shipping-rules");
    return res.success && Array.isArray(res.data) ? res.data : [];
  },
  async saveShippingRule(rule: ShippingRule, adminName: string = "Super Admin"): Promise<ApiResponse<ShippingRule>> {
    return apiFetch<ShippingRule>("/api/shipping-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rule),
    });
  },
  async deleteShippingRule(id: string): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/api/shipping-rules?id=${id}`, {
      method: "DELETE",
    });
  },

  async getCODRules(): Promise<CODRule[]> {
    const res = await apiFetch<{ codRules: CODRule[]; advanceRules: CODAdvanceRule[] }>("/api/cod-rules");
    return res.success && res.data?.codRules ? res.data.codRules : [];
  },
  async saveCODRule(rule: CODRule, adminName: string = "Super Admin"): Promise<ApiResponse<CODRule>> {
    return apiFetch<CODRule>("/api/cod-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rule, type: "general" }),
    });
  },

  async getCODAdvanceRules(): Promise<CODAdvanceRule[]> {
    const res = await apiFetch<{ codRules: CODRule[]; advanceRules: CODAdvanceRule[] }>("/api/cod-rules");
    return res.success && res.data?.advanceRules ? res.data.advanceRules : [];
  },
  async saveCODAdvanceRule(rule: CODAdvanceRule, adminName: string = "Super Admin"): Promise<ApiResponse<CODAdvanceRule>> {
    return apiFetch<CODAdvanceRule>("/api/cod-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...rule, type: "advance" }),
    });
  },
  async deleteCODAdvanceRule(id: string): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/api/cod-rules?id=${id}&type=advance`, {
      method: "DELETE",
    });
  },

  // 11. AUDIT LOGS
  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await apiFetch<AuditLog[]>("/api/audit-logs");
    return res.success && Array.isArray(res.data) ? res.data : [];
  },

  // 12. VARIANTS
  async getVariants(productId: string): Promise<ProductVariant[]> {
    const p = await this.getProduct(productId);
    return (p.success && p.data?.variants) || [];
  },
  async saveVariants(productId: string, variants: ProductVariant[]): Promise<ApiResponse<ProductVariant[]>> {
    const pRes = await this.getProduct(productId);
    if (!pRes.success || !pRes.data) return { success: false, error: "Product not found" };
    const product = pRes.data;
    product.variants = variants;
    const saveRes = await this.saveProduct(product);
    return {
      success: saveRes.success,
      data: variants,
      message: "Variants updated",
      error: saveRes.error,
    };
  },

  // 13. COMBOS
  async getComboOffers(): Promise<any[]> {
    const res = await apiFetch<any[]>("/api/combo-offers");
    return res.success && Array.isArray(res.data) ? res.data : [];
  },
  async saveComboOffer(combo: any, adminName: string = "Super Admin"): Promise<ApiResponse<any>> {
    return apiFetch<any>("/api/combo-offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(combo),
    });
  },
  async deleteComboOffer(id: string): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/api/combo-offers?id=${id}`, {
      method: "DELETE",
    });
  },

  // 14. ORDERS
  async getOrders(status?: string, search?: string): Promise<OrderRecord[]> {
    const params = new URLSearchParams();
    if (status && status !== "All") params.set("status", status);
    if (search) params.set("search", search);
    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await apiFetch<OrderRecord[]>(`/api/orders${query}`);
    return res.success && Array.isArray(res.data) ? res.data : [];
  },
  async updateOrderStatus(orderId: string, orderStatus: string, notes?: string): Promise<ApiResponse<any>> {
    return apiFetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderStatus, notes }),
    });
  },

  // 15. CATEGORIES
  async getCategories(): Promise<Category[]> {
    const res = await apiFetch<Category[]>("/api/categories");
    return res.success && Array.isArray(res.data) ? res.data : [];
  },
  async saveCategory(category: Partial<Category>): Promise<ApiResponse<Category>> {
    return apiFetch<Category>("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    });
  },
  async deleteCategory(id: string): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/api/categories/${id}`, {
      method: "DELETE",
    });
  },

  // 16. CUSTOMERS
  async getCustomers(search?: string): Promise<any[]> {
    const query = search ? `?search=${encodeURIComponent(search)}` : "";
    const res = await apiFetch<any[]>(`/api/customers${query}`);
    return res.success && Array.isArray(res.data) ? res.data : [];
  },

  // 17. INVENTORY TRANSACTIONS
  async getInventoryTransactions(): Promise<InventoryTransaction[]> {
    const res = await apiFetch<InventoryTransaction[]>("/api/inventory");
    return res.success && Array.isArray(res.data) ? res.data : [];
  },

  // 18. BOOKINGS
  async getBookings(): Promise<any[]> {
    const res = await apiFetch<any[]>("/api/bookings");
    return res.success && Array.isArray(res.data) ? res.data : [];
  },
};
