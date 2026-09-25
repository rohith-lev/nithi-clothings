import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { adminApi, type ProductFilters, type ProductSort } from "../../services/api";
import type { Product, Category } from "../../types/store";
import {
  SearchIcon,
  FilterIcon,
  TableViewIcon,
  GridViewIcon,
  PlusIcon,
  EditIcon,
  TrashIcon,
  CopyIcon,
  EyeIcon,
  CheckIcon,
  AlertTriangleIcon,
} from "../../components/admin/AdminIcons";

const AVAILABLE_SIZES = [
  "Free Size",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
];

const PRESET_COLORS = [
  { name: "Emerald Green", hex: "#044B36" },
  { name: "Deep Navy", hex: "#0E2442" },
  { name: "Ruby Red", hex: "#8E1616" },
  { name: "Royal Purple", hex: "#4A154B" },
  { name: "Rose Gold", hex: "#B76E79" },
  { name: "Mustard Gold", hex: "#C9A227" },
  { name: "Pastel Pink", hex: "#E8B4B8" },
  { name: "Classic Black", hex: "#1A1A1A" },
];

export default function AdminProductsList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedSkuId, setCopiedSkuId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Search & Filter States
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [stockStatusFilter, setStockStatusFilter] = useState<any>(searchParams.get("stock") || "all");
  const [statusFilter, setStatusFilter] = useState<any>("all");
  const [sortOption, setSortOption] = useState<ProductSort>("newest");
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [onlyBestSeller, setOnlyBestSeller] = useState(false);

  // Quick Edit Modal State
  const [quickEditProduct, setQuickEditProduct] = useState<Product | null>(null);
  const [quickForm, setQuickForm] = useState<{
    price: number;
    discount: number;
    stock: number;
    sizes: string[];
    color: string;
    status: Product["status"];
    newArrival: boolean;
    isBestSeller: boolean;
  }>({
    price: 0,
    discount: 0,
    stock: 0,
    sizes: [],
    color: "",
    status: "ACTIVE",
    newArrival: false,
    isBestSeller: false,
  });
  const [originalQuickSnapshot, setOriginalQuickSnapshot] = useState<Product | null>(null);

  // Quick Restock Modal State
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState(10);

  // Undo History State
  const [undoHistory, setUndoHistory] = useState<{
    id: string;
    name: string;
    actionDescription: string;
    previousData: {
      price: number;
      discount: number;
      stock: number;
      sizes: string[];
      color: string;
      status: Product["status"];
      newArrival: boolean;
      isBestSeller?: boolean;
    };
  } | null>(null);

  // Delete Confirmation Modal State
  const [deleteCandidate, setDeleteCandidate] = useState<Product | null>(null);

  // Bulk Discount Modal State
  const [showBulkDiscountModal, setShowBulkDiscountModal] = useState(false);
  const [bulkDiscountVal, setBulkDiscountVal] = useState(15);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopySku = (sku: string, id: string) => {
    navigator.clipboard.writeText(sku);
    setCopiedSkuId(id);
    setTimeout(() => setCopiedSkuId(null), 2000);
  };

  const loadProducts = async () => {
    setLoading(true);
    const filters: ProductFilters = {
      search: searchQuery,
      category: selectedCategory,
      stockStatus: stockStatusFilter,
      status: statusFilter,
      isDiscounted: onlyDiscounted ? true : undefined,
      isBestSeller: onlyBestSeller ? true : undefined,
    };
    const list = await adminApi.getProducts(filters, sortOption);
    setProducts(list);
    setLoading(false);
  };

  useEffect(() => {
    loadProducts();
  }, [searchQuery, selectedCategory, stockStatusFilter, statusFilter, sortOption, onlyDiscounted, onlyBestSeller]);

  useEffect(() => {
    adminApi.getCategories().then((cats) => {
      setCategories(cats);
    });
  }, []);

  // Executive Metric Calculations
  const stats = useMemo(() => {
    const total = products.length;
    let active = 0;
    let inStock = 0;
    let lowStock = 0;
    let outStock = 0;
    let totalValuation = 0;

    products.forEach((p) => {
      if (p.status === "ACTIVE") active++;
      const s = p.stock ?? 0;
      if (s <= 0) {
        outStock++;
      } else if (s <= 10) {
        lowStock++;
        inStock++;
      } else {
        inStock++;
      }
      const price = p.finalPrice || (p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price);
      totalValuation += price * s;
    });

    return { total, active, inStock, lowStock, outStock, totalValuation };
  }, [products]);

  // Handle Quick Edit Open
  const handleOpenQuickEdit = (p: Product) => {
    setQuickEditProduct(p);
    setOriginalQuickSnapshot(p);
    setQuickForm({
      price: p.price,
      discount: p.discount || 0,
      stock: p.stock ?? 0,
      sizes: p.sizes && p.sizes.length > 0 ? [...p.sizes] : ["Free Size"],
      color: p.color || (p.colors && p.colors[0]) || "Green",
      status: p.status || "ACTIVE",
      newArrival: p.newArrival ?? p.isNew ?? false,
      isBestSeller: p.isBestSeller ?? false,
    });
  };

  // Toggle size in quick edit
  const toggleQuickSize = (sz: string) => {
    setQuickForm((prev) => {
      const exists = prev.sizes.includes(sz);
      const updated = exists ? prev.sizes.filter((s) => s !== sz) : [...prev.sizes, sz];
      return { ...prev, sizes: updated };
    });
  };

  // Save Quick Edit with Undo capture
  const handleSaveQuickEdit = async () => {
    if (!quickEditProduct) return;

    setUndoHistory({
      id: quickEditProduct.id,
      name: quickEditProduct.name,
      actionDescription: "Quick Edit",
      previousData: {
        price: quickEditProduct.price,
        discount: quickEditProduct.discount || 0,
        stock: quickEditProduct.stock ?? 0,
        sizes: [...(quickEditProduct.sizes || [])],
        color: quickEditProduct.color || (quickEditProduct.colors && quickEditProduct.colors[0]) || "Green",
        status: quickEditProduct.status || "ACTIVE",
        newArrival: quickEditProduct.newArrival ?? quickEditProduct.isNew ?? false,
        isBestSeller: quickEditProduct.isBestSeller ?? false,
      },
    });

    const res = await adminApi.quickEdit(quickEditProduct.id, quickForm);
    if (res.success) {
      showToast(`Updated "${quickEditProduct.name}" successfully.`);
      setQuickEditProduct(null);
      loadProducts();
    } else {
      alert(res.error);
    }
  };

  // Handle 1-click Fast Restock with Undo Capture
  const handleFastRestock = async (p: Product, addAmount: number) => {
    const newStock = Math.max(0, (p.stock || 0) + addAmount);
    setUndoHistory({
      id: p.id,
      name: p.name,
      actionDescription: `Restock (+${addAmount})`,
      previousData: {
        price: p.price,
        discount: p.discount || 0,
        stock: p.stock ?? 0,
        sizes: [...(p.sizes || [])],
        color: p.color || (p.colors && p.colors[0]) || "Green",
        status: p.status || "ACTIVE",
        newArrival: p.newArrival ?? p.isNew ?? false,
        isBestSeller: p.isBestSeller ?? false,
      },
    });

    const res = await adminApi.quickEdit(p.id, {
      stock: newStock,
      status: newStock > 0 && p.status === "OUT OF STOCK" ? "ACTIVE" : p.status,
    });

    if (res.success) {
      showToast(`Restocked "${p.name}" (+${addAmount} units). Stock is now ${newStock}.`);
      setRestockProduct(null);
      loadProducts();
    }
  };

  // Handle Undo Last Action
  const handleUndo = async () => {
    if (!undoHistory) return;
    const { id, name, previousData, actionDescription } = undoHistory;

    const res = await adminApi.quickEdit(id, previousData);
    if (res.success) {
      showToast(`↩ Undid ${actionDescription} for "${name}". Previous state restored.`);
      setUndoHistory(null);
      loadProducts();
    } else {
      alert(`Failed to undo: ${res.error}`);
    }
  };

  // Handle Duplicate
  const handleDuplicate = async (p: Product) => {
    const res = await adminApi.duplicateProduct(p.id);
    if (res.success) {
      showToast(res.message || "Product duplicated as draft.");
      loadProducts();
    }
  };

  // Handle Delete / Archive
  const confirmDelete = async () => {
    if (!deleteCandidate) return;
    const res = await adminApi.deleteProduct(deleteCandidate.id);
    if (res.success) {
      showToast(res.message || "Product removed.");
      setDeleteCandidate(null);
      loadProducts();
    }
  };

  // Handle Delete All Products
  const handleConfirmDeleteAll = async () => {
    setDeletingAll(true);
    const res = await adminApi.deleteAllProducts();
    setDeletingAll(false);
    setShowDeleteAllModal(false);
    if (res.success) {
      showToast(res.message || "All products have been deleted successfully.");
      loadProducts();
    } else {
      showToast(res.error || "Failed to delete all products.");
    }
  };

  // Toggle Enable / Disable Status with Undo
  const handleToggleStatus = async (p: Product) => {
    const newStatus = p.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    setUndoHistory({
      id: p.id,
      name: p.name,
      actionDescription: `Status change to ${newStatus}`,
      previousData: {
        price: p.price,
        discount: p.discount || 0,
        stock: p.stock ?? 0,
        sizes: [...(p.sizes || [])],
        color: p.color || (p.colors && p.colors[0]) || "Green",
        status: p.status || "ACTIVE",
        newArrival: p.newArrival ?? p.isNew ?? false,
        isBestSeller: p.isBestSeller ?? false,
      },
    });

    await adminApi.quickEdit(p.id, { status: newStatus });
    showToast(`Status changed to ${newStatus}`);
    loadProducts();
  };

  // Bulk Operations
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(products.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action: "activate" | "deactivate" | "delete") => {
    if (selectedIds.length === 0) return;
    if (action === "delete" && !confirm(`Are you sure you want to delete ${selectedIds.length} items?`)) {
      return;
    }
    const res = await adminApi.bulkUpdate(selectedIds, action);
    if (res.success) {
      showToast(res.message || "Bulk action executed.");
      setSelectedIds([]);
      loadProducts();
    }
  };

  const handleBulkDiscountApply = async () => {
    if (selectedIds.length === 0) return;
    const res = await adminApi.bulkUpdate(selectedIds, "discount", { discount: bulkDiscountVal });
    if (res.success) {
      showToast(`Applied ${bulkDiscountVal}% discount to ${selectedIds.length} products.`);
      setShowBulkDiscountModal(false);
      setSelectedIds([]);
      loadProducts();
    }
  };

  const calculatedFinalPrice = Math.max(
    0,
    Math.round(quickForm.price - (quickForm.price * (quickForm.discount || 0)) / 100)
  );

  return (
    <div className="space-y-7 pb-24 max-w-[1600px] mx-auto">
      {/* Undo Toast & Notification Banner */}
      {(toastMessage || undoHistory) && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-3.5 rounded-2xl bg-stone-900/95 backdrop-blur-md px-5 py-3.5 text-white shadow-2xl border border-stone-700/60 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[11px]">
              ✓
            </span>
            <span>{toastMessage || `Last change: ${undoHistory?.name}`}</span>
          </div>
          {undoHistory && (
            <button
              onClick={handleUndo}
              className="ml-2 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-3.5 py-1.5 text-xs font-bold text-stone-950 shadow-md transition hover:brightness-110 active:scale-95"
            >
              <span>↩</span>
              <span>Undo</span>
            </button>
          )}
        </div>
      )}

      {/* Page Header with Luxury Accents */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 border-b border-stone-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase bg-[#041D16] text-[#DFC15E] border border-[#C9A227]/30">
              CATALOGUE OPS
            </span>
            <span className="text-xs font-semibold text-stone-400">Live Inventory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 mt-1 font-display">
            Product Management
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
            Control catalogue pricing, stock levels, variants, promotional discounts, and storefront availability in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="bg-stone-100/90 p-1.5 rounded-2xl flex items-center gap-1 border border-stone-200 shadow-inner">
            <button
              onClick={() => setViewMode("table")}
              title="Data Table View"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "table"
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200/60"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <TableViewIcon size={15} />
              <span className="hidden sm:inline">Table</span>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              title="Visual Gallery View"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-white text-stone-900 shadow-sm border border-stone-200/60"
                  : "text-stone-500 hover:text-stone-900"
              }`}
            >
              <GridViewIcon size={15} />
              <span className="hidden sm:inline">Gallery</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setShowDeleteAllModal(true)}
            className="px-4 py-2.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 rounded-2xl shadow-sm transition-all inline-flex items-center gap-2 hover:border-rose-300"
          >
            <TrashIcon size={14} />
            <span>Purge All</span>
          </button>

          <Link
            to="/admin/products/new"
            className="px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 hover:from-black hover:to-stone-800 rounded-2xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 border border-stone-700 active:scale-95"
          >
            <PlusIcon size={15} className="text-[#DFC15E]" />
            <span className="tracking-wide">Add New Garment</span>
          </Link>
        </div>
      </div>

      {/* KPI Overview Metric Ribbon (Interactive) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Total Products */}
        <div
          onClick={() => {
            setStockStatusFilter("all");
            setStatusFilter("all");
          }}
          className="group relative bg-white hover:bg-stone-50/80 p-4 rounded-3xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-stone-400">Total Garments</span>
            <span className="w-2 h-2 rounded-full bg-stone-400 group-hover:scale-125 transition-transform" />
          </div>
          <div className="text-2xl font-black text-stone-900 mt-2">{stats.total}</div>
          <div className="text-[11px] font-medium text-stone-500 mt-1 flex items-center gap-1">
            <span className="text-emerald-600 font-bold">{stats.active}</span> published on store
          </div>
        </div>

        {/* Healthy In Stock */}
        <div
          onClick={() => setStockStatusFilter("in_stock")}
          className={`group relative bg-white p-4 rounded-3xl border transition-all cursor-pointer overflow-hidden ${
            stockStatusFilter === "in_stock"
              ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20"
              : "border-stone-200/80 hover:border-emerald-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-800">In Stock</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-emerald-900 mt-2">{stats.inStock}</div>
          <div className="text-[11px] font-medium text-emerald-700 mt-1">Ready for dispatch</div>
        </div>

        {/* Low Stock Alert */}
        <div
          onClick={() => setStockStatusFilter("low_stock")}
          className={`group relative bg-white p-4 rounded-3xl border transition-all cursor-pointer overflow-hidden ${
            stockStatusFilter === "low_stock"
              ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20"
              : "border-stone-200/80 hover:border-amber-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-800">Low Stock (&le;10)</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-900 mt-2">{stats.lowStock}</div>
          <div className="text-[11px] font-medium text-amber-700 mt-1">Needs restock soon</div>
        </div>

        {/* Out of Stock */}
        <div
          onClick={() => setStockStatusFilter("out_of_stock")}
          className={`group relative bg-white p-4 rounded-3xl border transition-all cursor-pointer overflow-hidden ${
            stockStatusFilter === "out_of_stock"
              ? "border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20"
              : "border-stone-200/80 hover:border-rose-300 hover:shadow-md"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold tracking-wider uppercase text-rose-800">Out of Stock</span>
            <span className="w-2 h-2 rounded-full bg-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-900 mt-2">{stats.outStock}</div>
          <div className="text-[11px] font-medium text-rose-700 mt-1">Currently unavailable</div>
        </div>

        {/* Inventory Valuation */}
        <div className="col-span-2 sm:col-span-1 bg-gradient-to-br from-[#041D16] to-[#0A3327] p-4 rounded-3xl border border-[#C9A227]/30 shadow-md text-white">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#DFC15E]">Asset Valuation</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#C9A227]/20 text-[#DFC15E] font-mono font-bold">LIVE</span>
          </div>
          <div className="text-xl sm:text-2xl font-black text-white mt-2">
            ₹{stats.totalValuation.toLocaleString("en-IN")}
          </div>
          <div className="text-[11px] text-emerald-200/80 mt-1 font-medium">Estimated stock worth</div>
        </div>
      </div>

      {/* Modern Filter & Search Command Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200/80 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Search Box with Modern Styling */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by dress name, SKU code, category, color..."
              className="w-full pl-11 pr-10 py-3 bg-stone-50/80 hover:bg-stone-50 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-900 font-medium placeholder:text-stone-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all shadow-inner"
            />
            <div className="absolute left-4 top-3.5 text-stone-400">
              <SearchIcon size={17} />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3 w-5 h-5 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 flex items-center justify-center text-[10px] transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Dropdown */}
          <div className="w-full lg:w-56 shrink-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-3 px-4 bg-stone-50/80 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-800 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all cursor-pointer"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Selector */}
          <div className="w-full lg:w-56 shrink-0">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as ProductSort)}
              className="w-full py-3 px-4 bg-stone-50/80 border border-stone-200 rounded-2xl text-xs sm:text-sm text-stone-800 font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900 transition-all cursor-pointer"
            >
              <option value="newest">Sort: Recently Added</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="stock-desc">Highest Stock Quantity</option>
              <option value="stock-asc">Lowest Stock First</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="price-asc">Price: Low to High</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Badges Ribbon */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-stone-100">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mr-1 flex items-center gap-1.5">
            <FilterIcon size={13} /> View:
          </span>

          <button
            onClick={() => setStockStatusFilter("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              stockStatusFilter === "all"
                ? "bg-stone-900 text-white shadow-sm"
                : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/80"
            }`}
          >
            All Stock
          </button>
          <button
            onClick={() => setStockStatusFilter("in_stock")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              stockStatusFilter === "in_stock"
                ? "bg-emerald-800 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
            }`}
          >
            In Stock
          </button>
          <button
            onClick={() => setStockStatusFilter("low_stock")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              stockStatusFilter === "low_stock"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            <AlertTriangleIcon size={12} />
            <span>Low Stock</span>
          </button>
          <button
            onClick={() => setStockStatusFilter("out_of_stock")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              stockStatusFilter === "out_of_stock"
                ? "bg-rose-700 text-white shadow-sm"
                : "bg-rose-50 text-rose-800 hover:bg-rose-100"
            }`}
          >
            Out of Stock
          </button>

          <span className="text-stone-300 mx-1">|</span>

          <button
            onClick={() => setStatusFilter(statusFilter === "ACTIVE" ? "all" : "ACTIVE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "ACTIVE"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/80"
            }`}
          >
            Active Catalogue
          </button>
          <button
            onClick={() => setStatusFilter(statusFilter === "DRAFT" ? "all" : "DRAFT")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              statusFilter === "DRAFT"
                ? "bg-stone-800 text-white shadow-sm"
                : "bg-stone-100/80 text-stone-600 hover:bg-stone-200/80"
            }`}
          >
            Drafts
          </button>
          <button
            onClick={() => setOnlyDiscounted(!onlyDiscounted)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              onlyDiscounted
                ? "bg-rose-600 text-white shadow-sm"
                : "bg-rose-50 text-rose-700 hover:bg-rose-100"
            }`}
          >
            🔥 On Discount
          </button>
          <button
            onClick={() => setOnlyBestSeller(!onlyBestSeller)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              onlyBestSeller
                ? "bg-amber-500 text-stone-950 shadow-sm"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100"
            }`}
          >
            ⭐ Bestsellers
          </button>
        </div>
      </div>

      {/* Floating Bottom Bulk Action Dock */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-40 bg-stone-900/95 backdrop-blur-md text-white p-3 sm:px-6 rounded-3xl shadow-2xl border border-[#C9A227]/40 flex flex-wrap items-center gap-4 text-xs animate-in slide-in-from-bottom-8 duration-200">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#C9A227] text-stone-950 font-black flex items-center justify-center text-xs">
              {selectedIds.length}
            </span>
            <span className="font-bold text-[#DFC15E]">garments selected</span>
          </div>

          <div className="h-5 w-[1px] bg-stone-700 mx-1 hidden sm:block" />

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => handleBulkAction("activate")}
              className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-bold transition-colors shadow-sm"
            >
              Set Active
            </button>
            <button
              onClick={() => handleBulkAction("deactivate")}
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 font-semibold transition-colors border border-stone-700"
            >
              Set Draft
            </button>
            <button
              onClick={() => setShowBulkDiscountModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold hover:brightness-110 transition-all shadow-sm"
            >
              Apply Discount %
            </button>
            <button
              onClick={() => handleBulkAction("delete")}
              className="px-3.5 py-2 rounded-xl bg-rose-700 hover:bg-rose-600 font-bold transition-colors shadow-sm"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-stone-400 hover:text-white px-2.5 font-semibold transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area: Table View vs Gallery Card View */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden transition-all">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#FAF8F5] border-b border-stone-200/90 text-stone-600 uppercase tracking-wider text-[10px] font-bold sticky top-0 z-10">
                <tr>
                  <th className="py-3.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedIds.length === products.length && products.length > 0}
                      className="rounded border-stone-300 w-3.5 h-3.5 text-[#064E3B] focus:ring-[#064E3B] cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-3 min-w-[180px]">Garment Details</th>
                  <th className="py-3.5 px-2.5 whitespace-nowrap">SKU Code</th>
                  <th className="py-3.5 px-2.5">Category</th>
                  <th className="py-3.5 px-2.5 whitespace-nowrap">Price & MRP</th>
                  <th className="py-3.5 px-2.5 whitespace-nowrap">Sizes</th>
                  <th className="py-3.5 px-2.5 whitespace-nowrap">Stock & Restock</th>
                  <th className="py-3.5 px-2.5 whitespace-nowrap">Status</th>
                  <th className="py-3.5 px-3 text-right whitespace-nowrap">Quick Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center text-stone-400">
                      <div className="inline-flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-3 border-stone-300 border-t-[#064E3B] rounded-full animate-spin" />
                        <span className="text-xs font-semibold text-stone-500">Loading catalogue items...</span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-20 text-center text-stone-400">
                      <div className="max-w-md mx-auto space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400 text-lg">
                          🔍
                        </div>
                        <h3 className="font-bold text-stone-700 text-sm">No products found</h3>
                        <p className="text-xs text-stone-500">
                          Try adjusting your search criteria or filter tags, or add your first garment to the catalogue.
                        </p>
                        <Link
                          to="/admin/products/new"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-[#064E3B] text-white rounded-xl text-xs font-bold hover:bg-[#0B3D2E] transition-colors"
                        >
                          <PlusIcon size={14} />
                          <span>Add New Product</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((p) => {
                    const isSelected = selectedIds.includes(p.id);
                    const isLow = (p.stock || 0) <= 10 && (p.stock || 0) > 0;
                    const isOut = (p.stock || 0) <= 0;
                    const finalPr = p.finalPrice || (p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price);
                    const coverImg = p.coverImage || p.images?.[0] || "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=200&h=200&fit=crop";

                    return (
                      <tr
                        key={p.id}
                        className={`hover:bg-stone-50/80 transition-colors group ${
                          isSelected ? "bg-amber-50/40" : ""
                        }`}
                      >
                        {/* Checkbox */}
                        <td className="py-3 px-3 text-center align-middle w-10">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleToggleSelect(p.id)}
                            className="rounded border-stone-300 w-3.5 h-3.5 text-[#064E3B] focus:ring-[#064E3B] cursor-pointer"
                          />
                        </td>

                        {/* Garment Details & Image */}
                        <td className="py-3 px-3 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="relative w-11 h-14 rounded-xl overflow-hidden bg-stone-100 border border-stone-200/90 shrink-0 shadow-2xs group-hover:shadow-sm transition-all">
                              <img
                                src={coverImg}
                                alt={p.name}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=200&h=200&fit=crop";
                                }}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              {(p.newArrival || p.isNew) && (
                                <span className="absolute top-1 left-1 bg-gradient-to-r from-emerald-700 to-teal-700 text-[#FAF8F1] text-[8px] font-black px-1 py-0.2 rounded shadow-xs tracking-wider">
                                  NEW
                                </span>
                              )}
                              {p.images && p.images.length > 1 && (
                                <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[8px] font-mono px-1 rounded backdrop-blur-xs font-semibold">
                                  +{p.images.length - 1}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 space-y-0.5">
                              <Link
                                to={`/admin/products/edit/${p.id}`}
                                className="font-display font-bold text-stone-900 hover:text-[#064E3B] transition-colors block text-xs sm:text-sm truncate max-w-[200px] leading-snug"
                                title={p.name}
                              >
                                {p.name}
                              </Link>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-stone-100/90 border border-stone-200/70 px-1.5 py-0.5 text-[9px] font-medium text-stone-700">
                                  <span
                                    className="w-2 h-2 rounded-full inline-block border border-black/10 shrink-0"
                                    style={{
                                      backgroundColor:
                                        PRESET_COLORS.find(
                                          (c) => c.name.toLowerCase() === (p.color || "").toLowerCase()
                                        )?.hex || "#666",
                                      }}
                                  />
                                  <span>{p.color || (p.colors && p.colors[0]) || "Standard"}</span>
                                </span>
                                {p.isBestSeller && (
                                  <span className="inline-flex items-center gap-1 bg-[#FAF8F1] text-[#8A5F38] font-bold px-1.5 py-0.5 rounded text-[8px] border border-[#C9A227]/40 shadow-2xs">
                                    ⭐ BESTSELLER
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* SKU Code with 1-click Copy */}
                        <td className="py-3 px-2.5 align-middle whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleCopySku(p.sku || p.code || "N/A", p.id)}
                            className="group/sku font-mono text-stone-700 text-[11px] px-2 py-1 rounded-lg bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-stone-300 inline-flex items-center gap-1 transition-all shadow-2xs cursor-pointer active:scale-95"
                            title="Click to copy SKU"
                          >
                            <span className="font-semibold">{p.sku || p.code || "N/A"}</span>
                            <span className="text-stone-400 group-hover/sku:text-stone-700 text-[10px]">
                              {copiedSkuId === p.id ? "✓" : "📋"}
                            </span>
                          </button>
                        </td>

                        {/* Category & Subcategory */}
                        <td className="py-3 px-2.5 align-middle">
                          <span className="font-bold text-stone-900 text-xs capitalize block">
                            {p.category}
                          </span>
                          {p.subcategory ? (
                            <span className="inline-block text-[9px] text-[#8A5F38] font-semibold bg-[#FAF8F1] px-1.5 py-0.5 rounded border border-[#C9A227]/30 mt-0.5 capitalize">
                              {p.subcategory}
                            </span>
                          ) : (
                            <span className="text-[9px] text-stone-400 italic block mt-0.5">
                              Standard
                            </span>
                          )}
                        </td>

                        {/* Price & MRP */}
                        <td className="py-3 px-2.5 align-middle whitespace-nowrap">
                          <div className="font-mono font-bold text-stone-900 text-xs tracking-tight">
                            ₹{finalPr.toLocaleString("en-IN")}
                          </div>
                          {p.discount > 0 ? (
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="font-mono text-[10px] text-stone-400 line-through">
                                ₹{p.price.toLocaleString("en-IN")}
                              </span>
                              <span className="inline-block px-1 py-0.2 rounded bg-rose-50 border border-rose-200 text-rose-700 font-bold text-[8px] tracking-tight">
                                {p.discount}% OFF
                              </span>
                            </div>
                          ) : (
                            <span className="text-[9px] text-stone-400 font-medium block mt-0.5">
                              MRP
                            </span>
                          )}
                        </td>

                        {/* Sizes Available */}
                        <td className="py-3 px-2.5 align-middle">
                          <div className="flex flex-wrap gap-1 max-w-[100px]">
                            {p.sizes && p.sizes.length > 0 ? (
                              p.sizes.map((s) => (
                                <span
                                  key={s}
                                  className="rounded border border-stone-200 bg-stone-50 px-1 py-0.2 text-[8px] font-bold text-stone-700 tracking-tight"
                                >
                                  {s}
                                </span>
                              ))
                            ) : (
                              <span className="text-[9px] text-stone-400 italic">Free Size</span>
                            )}
                          </div>
                        </td>

                        {/* Stock Level & Restock */}
                        <td className="py-3 px-2.5 align-middle whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-stone-900 text-xs">
                              {p.stock ?? 0} <span className="font-normal text-stone-400 text-[10px]">pcs</span>
                            </span>
                            {isOut ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
                                OUT
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                                LOW
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[8px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                                IN STOCK
                              </span>
                            )}
                          </div>
                          {/* Fast Restock Buttons */}
                          <div className="flex items-center gap-1 mt-1">
                            <button
                              onClick={() => handleFastRestock(p, 10)}
                              title="Instantly add 10 units"
                              className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-all active:scale-95 shadow-2xs"
                            >
                              +10
                            </button>
                            <button
                              onClick={() => setRestockProduct(p)}
                              title="Custom restock units"
                              className="rounded bg-stone-100 px-1.5 py-0.5 text-[9px] font-bold text-stone-600 hover:bg-stone-200 transition-all shadow-2xs"
                            >
                              +Custom
                            </button>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-2.5 align-middle whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(p)}
                            title="Click to toggle status"
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold border transition-all cursor-pointer shadow-2xs active:scale-95 ${
                              p.status === "ACTIVE"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                : p.status === "DRAFT"
                                ? "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                                : "bg-rose-50 text-rose-800 border-rose-200 hover:bg-rose-100"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                p.status === "ACTIVE"
                                  ? "bg-emerald-600"
                                  : p.status === "DRAFT"
                                  ? "bg-amber-600"
                                  : "bg-rose-600"
                              }`}
                            />
                            <span>{p.status}</span>
                          </button>
                        </td>

                        {/* Quick Actions */}
                        <td className="py-3 px-3 text-right align-middle whitespace-nowrap">
                          <div className="inline-flex items-center gap-1 bg-stone-50 p-1 rounded-xl border border-stone-200 shadow-2xs">
                            {/* Quick Edit (Modal) */}
                            <button
                              onClick={() => handleOpenQuickEdit(p)}
                              title="Quick Edit (Price, Stock, Sizes)"
                              className="p-1 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-all font-bold"
                            >
                              ⚡
                            </button>

                            {/* Full Edit (Page) */}
                            <Link
                              to={`/admin/products/edit/${p.id}`}
                              title="Full Product Editor"
                              className="p-1 text-stone-600 hover:text-[#064E3B] hover:bg-white rounded-lg transition-all"
                            >
                              <EditIcon size={13} />
                            </Link>

                            {/* View in Storefront */}
                            <a
                              href={`/product/${p.id}`}
                              target="_blank"
                              rel="noreferrer"
                              title="View on Live Store"
                              className="p-1 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-all"
                            >
                              <EyeIcon size={13} />
                            </a>

                            {/* Duplicate */}
                            <button
                              onClick={() => handleDuplicate(p)}
                              title="Duplicate Product"
                              className="p-1 text-stone-500 hover:text-stone-900 hover:bg-white rounded-lg transition-all"
                            >
                              <CopyIcon size={13} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => setDeleteCandidate(p)}
                              title="Delete Product"
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                            >
                              <TrashIcon size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Visual Grid Card View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => {
            const finalPr = p.finalPrice || (p.discount > 0 ? Math.round(p.price * (1 - p.discount / 100)) : p.price);
            const isLow = (p.stock || 0) <= 10 && (p.stock || 0) > 0;
            const isOut = (p.stock || 0) <= 0;
            const coverImg = p.coverImage || p.images?.[0] || "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=400&h=500&fit=crop";

            return (
              <div
                key={p.id}
                className="group bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
                  <img
                    src={coverImg}
                    alt={p.name}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=400&h=500&fit=crop";
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5">
                    <div className="flex justify-between items-start">
                      <span className="bg-black/75 text-white text-[9px] font-mono px-2 py-0.5 rounded-md backdrop-blur-xs">
                        {p.sku || p.code}
                      </span>
                      <button
                        onClick={() => handleOpenQuickEdit(p)}
                        className="bg-white text-stone-900 font-bold p-1.5 rounded-xl shadow-lg hover:bg-rose-600 hover:text-white transition-all text-xs"
                        title="Quick Edit"
                      >
                        ⚡
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <Link
                        to={`/admin/products/edit/${p.id}`}
                        className="bg-white/90 backdrop-blur-sm text-stone-900 font-bold px-3 py-1.5 rounded-xl text-xs hover:bg-white shadow transition-all"
                      >
                        Full Editor
                      </Link>
                      <a
                        href={`/product/${p.id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white/90 backdrop-blur-sm text-stone-900 font-bold p-1.5 rounded-xl text-xs hover:bg-white shadow transition-all"
                      >
                        <EyeIcon size={14} />
                      </a>
                    </div>
                  </div>

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                    {(p.newArrival || p.isNew) && (
                      <span className="bg-rose-600 text-white text-[8px] font-black px-2 py-0.5 rounded-md shadow-sm">
                        NEW ARRIVAL
                      </span>
                    )}
                    {p.isBestSeller && (
                      <span className="bg-amber-500 text-stone-950 text-[8px] font-black px-2 py-0.5 rounded-md shadow-sm">
                        ⭐ BESTSELLER
                      </span>
                    )}
                  </div>

                  {/* Stock Badge */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    {isOut ? (
                      <span className="bg-rose-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow">
                        OUT OF STOCK
                      </span>
                    ) : isLow ? (
                      <span className="bg-amber-500 text-stone-950 text-[9px] font-bold px-2 py-0.5 rounded-md shadow animate-pulse">
                        LOW ({p.stock})
                      </span>
                    ) : (
                      <span className="bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow">
                        {p.stock} in stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                      {p.category}
                    </div>
                    <h3 className="font-bold text-stone-900 text-sm truncate mt-0.5 group-hover:text-rose-600 transition-colors">
                      {p.name}
                    </h3>
                  </div>

                  {/* Price & Savings */}
                  <div className="flex items-baseline justify-between pt-1 border-t border-stone-100">
                    <div>
                      <span className="text-lg font-black text-stone-900">
                        ₹{finalPr.toLocaleString("en-IN")}
                      </span>
                      {p.discount > 0 && (
                        <span className="text-[10px] text-stone-400 line-through ml-1.5">
                          ₹{p.price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    {p.discount > 0 && (
                      <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                        {p.discount}% OFF
                      </span>
                    )}
                  </div>

                  {/* Sizes */}
                  <div className="flex flex-wrap gap-1">
                    {(p.sizes || ["Free Size"]).slice(0, 5).map((s) => (
                      <span key={s} className="rounded-md bg-stone-100 px-1.5 py-0.5 text-[9px] font-bold text-stone-600">
                        {s}
                      </span>
                    ))}
                    {p.sizes && p.sizes.length > 5 && (
                      <span className="text-[9px] font-bold text-stone-400 self-center">
                        +{p.sizes.length - 5}
                      </span>
                    )}
                  </div>

                  {/* Quick Restock Action Bar */}
                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleFastRestock(p, 10)}
                      className="flex-1 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-[11px] font-bold transition-all"
                    >
                      +10 Restock
                    </button>
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className={`px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all ${
                        p.status === "ACTIVE"
                          ? "bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-200"
                          : "bg-emerald-600 text-white border-emerald-700"
                      }`}
                      title="Toggle Active / Draft"
                    >
                      {p.status === "ACTIVE" ? "Pause" : "Live"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QUICK EDIT MODAL (Price, Discount, Sizes, Color, Stock, Undo Reset) */}
      {quickEditProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 sm:p-7 text-stone-800 animate-in zoom-in-95 duration-150 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 font-black flex items-center justify-center text-lg border border-rose-100">
                  ⚡
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-900 leading-tight">
                    Quick Product Editor
                  </h3>
                  <p className="text-xs text-stone-500 truncate max-w-xs">{quickEditProduct.name}</p>
                </div>
              </div>
              <button
                onClick={() => setQuickEditProduct(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Price & Discount */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">Original MRP Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={quickForm.price}
                    onChange={(e) => setQuickForm({ ...quickForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10 focus:border-stone-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={quickForm.discount}
                    onChange={(e) => setQuickForm({ ...quickForm, discount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-rose-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Calculated Final Price Card */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider">
                    Calculated Selling Price
                  </span>
                  <p className="text-[10px] text-emerald-700 font-medium">Customer pays on checkout</p>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-emerald-800">₹{calculatedFinalPrice}</span>
                  {quickForm.discount > 0 && (
                    <span className="text-[10px] text-stone-400 line-through block">₹{quickForm.price}</span>
                  )}
                </div>
              </div>

              {/* Color & Stock */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">Color / Shade</label>
                  <input
                    type="text"
                    value={quickForm.color}
                    onChange={(e) => setQuickForm({ ...quickForm, color: e.target.value })}
                    placeholder="e.g. Emerald Green"
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">Stock Quantity (Units)</label>
                  <input
                    type="number"
                    min="0"
                    value={quickForm.stock}
                    onChange={(e) => setQuickForm({ ...quickForm, stock: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-black text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-stone-900/10"
                  />
                </div>
              </div>

              {/* Available Sizes selection */}
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Available Sizes</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_SIZES.map((sz) => {
                    const isSel = quickForm.sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleQuickSize(sz)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                          isSel
                            ? "border-stone-900 bg-stone-900 text-white shadow-sm"
                            : "border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300"
                        }`}
                      >
                        {isSel && "✓ "}
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status & Badges */}
              <div className="grid grid-cols-2 gap-3.5 pt-1">
                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">Catalogue Status</label>
                  <select
                    value={quickForm.status}
                    onChange={(e) => setQuickForm({ ...quickForm, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:bg-white focus:outline-none"
                  >
                    <option value="ACTIVE">ACTIVE (Published)</option>
                    <option value="DRAFT">DRAFT (Hidden)</option>
                    <option value="OUT OF STOCK">OUT OF STOCK</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="font-bold text-stone-700">New Arrival Tag</span>
                  <input
                    type="checkbox"
                    checked={quickForm.newArrival}
                    onChange={(e) => setQuickForm({ ...quickForm, newArrival: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Modal Bottom Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  if (originalQuickSnapshot) {
                    setQuickForm({
                      price: originalQuickSnapshot.price,
                      discount: originalQuickSnapshot.discount || 0,
                      stock: originalQuickSnapshot.stock ?? 0,
                      sizes: [...(originalQuickSnapshot.sizes || [])],
                      color: originalQuickSnapshot.color || "Green",
                      status: originalQuickSnapshot.status || "ACTIVE",
                      newArrival: originalQuickSnapshot.newArrival ?? false,
                      isBestSeller: originalQuickSnapshot.isBestSeller ?? false,
                    });
                  }
                }}
                className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors"
              >
                <span>↩</span>
                <span>Reset Values</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setQuickEditProduct(null)}
                  className="px-4 py-2.5 border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveQuickEdit}
                  className="px-5 py-2.5 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors shadow-md active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RESTOCK MODAL */}
      {restockProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-sm w-full p-6 text-stone-800 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg border border-emerald-100">
                📦
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-900">Restock Inventory</h3>
                <p className="text-xs text-stone-500 truncate max-w-[200px]">{restockProduct.name}</p>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-2xl border border-stone-200 text-xs flex justify-between items-center">
              <span className="text-stone-500 font-medium">Current Stock Level:</span>
              <span className="font-black text-stone-900 text-sm">{restockProduct.stock ?? 0} units</span>
            </div>

            <div className="space-y-3 text-xs">
              <label className="block font-bold text-stone-700">Quick Add Preset:</label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleFastRestock(restockProduct, amt)}
                    className="py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold hover:bg-emerald-100 transition-all text-center"
                  >
                    +{amt}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block font-bold text-stone-700 mb-1">Custom Add Quantity:</label>
                <input
                  type="number"
                  min="1"
                  value={restockQty}
                  onChange={(e) => setRestockQty(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 text-xs pt-2">
              <button
                onClick={() => setRestockProduct(null)}
                className="px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleFastRestock(restockProduct, restockQty)}
                className="px-5 py-2.5 bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-800 transition-colors shadow-sm"
              >
                Add {restockQty} Units
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CANDIDATE CONFIRMATION MODAL */}
      {deleteCandidate && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-7 text-stone-800 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
              <TrashIcon size={22} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-stone-900">Remove Garment from Catalogue</h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Are you sure you want to permanently remove <strong>"{deleteCandidate.name}"</strong>?
              </p>
            </div>
            <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-600">
              ℹ️ Historical order records associated with this garment remain preserved.
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2.5 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BULK DISCOUNT MODAL */}
      {showBulkDiscountModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-sm w-full p-6 text-stone-800 animate-in zoom-in-95 duration-150 space-y-4">
            <h3 className="font-bold text-lg text-stone-900">
              Apply Bulk Discount
            </h3>
            <p className="text-xs text-stone-600">
              Enter the discount percentage to apply to all <strong>{selectedIds.length}</strong> selected garments:
            </p>
            <div>
              <input
                type="number"
                min={0}
                max={90}
                value={bulkDiscountVal}
                onChange={(e) => setBulkDiscountVal(Number(e.target.value))}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-lg font-black text-rose-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-center"
              />
            </div>
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowBulkDiscountModal(false)}
                className="px-4 py-2.5 border border-stone-200 rounded-xl text-stone-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkDiscountApply}
                className="px-5 py-2.5 bg-stone-900 text-white rounded-xl font-bold hover:bg-black"
              >
                Apply to {selectedIds.length} Items
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE ALL PRODUCTS MODAL */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-7 text-stone-800 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-200">
                <TrashIcon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-900 leading-tight">Delete All Garments?</h3>
                <p className="text-xs text-rose-600 font-semibold">Irreversible Action</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently purge <strong>all {products.length} garments</strong> from the database and storefront catalogue?
            </p>

            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 space-y-1">
              <p className="font-bold">⚠️ Warning:</p>
              <p>All product images, variants, size inventories, and descriptions will be cleared.</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deletingAll}
                onClick={() => setShowDeleteAllModal(false)}
                className="px-4 py-2.5 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingAll}
                onClick={handleConfirmDeleteAll}
                className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shadow-md transition disabled:opacity-50 flex items-center gap-2"
              >
                {deletingAll ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Purging Catalogue...</span>
                  </>
                ) : (
                  <span>Yes, Purge All Garments</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
