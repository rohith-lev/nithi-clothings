import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { adminApi } from "../../services/api";
import type { Product, SizeOption, Category } from "../../types/store";
import { useAdminAuth } from "../../services/auth";
import { useUnsavedChanges } from "./AdminLayout";
import { CATEGORY_HIERARCHY, categories as defaultSeedCategories } from "../../data/products";
import {
  CheckIcon,
  AlertTriangleIcon,
  TrashIcon,
  EyeIcon,
} from "../../components/admin/AdminIcons";

// Lightweight SVG Icons
const ArrowLeftIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const UploadIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const MoveLeftIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);
const MoveRightIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const DEFAULT_CATEGORIES = [
  "Nighty",
  "Night dress",
  "Unstitched salwar material",
  "Cord set",
  "Kurtis(Tops)",
  "Salwar set",
  "Maxi",
];

const STANDARD_SIZES = [
  "Free Size",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
];

type TabId =
  | "basic"
  | "images"
  | "pricing"
  | "inventory"
  | "content"
  | "sizes"
  | "offers"
  | "shipping"
  | "cod"
  | "seo"
  | "preview"
  | "history";

export default function AdminProductEdit() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { user } = useAdminAuth();
  const { setIsDirty } = useUnsavedChanges();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Local files pending upload
  const [rawFiles, setRawFiles] = useState<File[]>([]);
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [customSizeInput, setCustomSizeInput] = useState("");

  // Categories & Subcategories
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loadedCategories, setLoadedCategories] = useState<Category[]>([]);
  const [showAdvancedTabs, setShowAdvancedTabs] = useState(false);

  // Stock Adjustment Modal
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState<"ADD" | "REMOVE" | "SET">("SET");
  const [stockActionQty, setStockActionQty] = useState<number>(50);
  const [stockActionReason, setStockActionReason] = useState("Direct Inventory Calibration");

  // Initial Form State (No color fields per Requirement #1)
  const initialFormState: Product = {
    id: `p${Date.now().toString().slice(-4)}`,
    name: "",
    code: `NC-${Date.now().toString().slice(-4)}`,
    sku: `SKU-${Date.now().toString().slice(-4)}`,
    category: "Nighty",
    subcategory: "Normal Nighty (55 inches) - Zip nighty",
    brand: "Nithi Collection",
    price: 1500,
    mrp: 2000,
    discount: 25,
    discountType: "percentage",
    discountValue: 25,
    finalPrice: 1500,
    sizes: [],
    sizeOptions: [],
    colors: [],
    fabric: "100% Pure Cotton",
    material: "Pure Combed Cotton 60s Count",
    length: "55 Inches",
    pattern: "Jaipuri Floral Print",
    sleeveType: "Half Sleeve",
    neckType: "Round Neck with Front Zip",
    description: "Handcrafted pure cotton nighty tailored with ultra-breathable combed cotton. Features soft skin-friendly texture, reinforced seams, and durable front zipper for everyday comfort.",
    shortDescription: "Ultra-comfortable breathable 100% cotton nighty with front zip opening.",
    care: "Machine wash cold with mild detergent. Do not bleach. Line dry in shade.",
    sizeChart: "Standard Indian Fit (Length: 55 inches, Chest: 42-46 inches)",
    specialFeatures: "Concealed front zipper, Side pocket included, Pre-shrunk pure cotton",
    inStock: true,
    stock: 50,
    status: "ACTIVE",
    rating: 4.9,
    reviews: 18,
    isNew: true,
    newArrival: true,
    isBestSeller: false,
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format",
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop&auto=format"
    ],
    coverImage: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format",
    seo: {
      title: "Pure Cotton Floral Nighty | Nithi Collection",
      metaDescription: "Buy pure cotton nightwear online at Nithi Collection with front zipper and fast all-India delivery.",
      urlSlug: "pure-cotton-floral-nighty",
      focusKeyword: "pure cotton nighty",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [formData, setFormData] = useState<Product>(initialFormState);
  const [productAuditLogs, setProductAuditLogs] = useState<any[]>([]);
  const [pristineSnapshot, setPristineSnapshot] = useState<Product>(initialFormState);

  // Requirement #4: Automatic Discount Calculator
  // Discount % is calculated automatically: MRP 2000, Selling Price 1500 -> 25% OFF
  const calculateAutoDiscount = (mrpVal: number, sellingPriceVal: number) => {
    const m = Number(mrpVal) || 0;
    const p = Number(sellingPriceVal) || 0;
    if (m > 0 && m > p) {
      return Math.round(((m - p) / m) * 100);
    }
    return 0;
  };

  const currentDiscountPercent = calculateAutoDiscount(formData.mrp, formData.price);
  const liveSavings = Math.max(0, (formData.mrp || formData.price) - formData.price);

  // Load existing product
  useEffect(() => {
    if (!isNew && id) {
      setLoading(true);
      adminApi
        .getProduct(id)
        .then((res) => {
          if (res.success && res.data) {
            const p = res.data;

            // Normalize sizeOptions
            let sizeOptions = p.sizeOptions || [];
            if (sizeOptions.length === 0 && p.sizes && p.sizes.length > 0) {
              sizeOptions = p.sizes.map((sz: string) => ({
                size: sz,
                price: p.price,
                mrp: p.mrp || Math.round(p.price * 1.3),
                stock: Math.max(1, Math.floor((p.stock || 10) / p.sizes.length)),
                sku: `${p.sku || 'SKU'}-${sz}`
              }));
            }

            const autoDisc = calculateAutoDiscount(p.mrp || p.price, p.price);

            const loaded: Product = {
              ...p,
              discount: autoDisc,
              discountValue: autoDisc,
              discountType: "percentage",
              mrp: p.mrp || p.price,
              sizes: sizeOptions.length > 0 ? sizeOptions.map(s => s.size) : (Array.isArray(p.sizes) ? p.sizes : []),
              sizeOptions,
              colors: [],
              images: p.images || [],
              coverImage: p.coverImage || (p.images && p.images[0]) || "",
            };
            setFormData(loaded);
            setPristineSnapshot(loaded);

            // Load audit logs
            adminApi.getAuditLogs().then((allLogs) => {
              const filteredLogs = allLogs.filter((log) => log.targetId === p.id || log.targetName?.includes(p.name));
              setProductAuditLogs(filteredLogs);
            });
          } else {
            setToastMessage({ type: "error", text: "Product not found in catalog." });
          }
        })
        .finally(() => setLoading(false));
    } else if (isNew) {
      // Restore draft if available
      try {
        const savedDraft = localStorage.getItem("nithi_product_draft_new");
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          if (parsed && typeof parsed === "object" && parsed.id) {
            setFormData((prev) => ({ ...prev, ...parsed }));
          }
        }
      } catch {
        // ignore
      }
    }
  }, [id, isNew]);

  // Load dynamic categories
  useEffect(() => {
    adminApi.getCategories().then((cats) => {
      if (Array.isArray(cats) && cats.length > 0) {
        setLoadedCategories(cats);
        const names = Array.from(new Set([...DEFAULT_CATEGORIES, ...cats.map((c) => c.name)]));
        setAllCategories(names);
      }
    });
  }, []);

  const handleInputChange = (field: keyof Product, value: any) => {
    setIsDirty(true);
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      // Auto update discount when price or mrp changes (Requirement #4)
      if (field === "price" || field === "mrp") {
        const newMrp = field === "mrp" ? Number(value) : prev.mrp;
        const newPrice = field === "price" ? Number(value) : prev.price;
        const autoDisc = calculateAutoDiscount(newMrp, newPrice);
        updated.discount = autoDisc;
        updated.discountValue = autoDisc;
        updated.finalPrice = newPrice;
      }

      if (field === "name" && (!prev.seo?.urlSlug || prev.seo.urlSlug === "")) {
        const slug = String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        updated.seo = {
          ...prev.seo,
          title: `${value} | Nithi Collection`,
          urlSlug: slug,
          focusKeyword: `${value} online`,
        };
      }
      return updated;
    });

    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Undo / Reset
  const handleUndoAllChanges = () => {
    setFormData(pristineSnapshot);
    setRawFiles([]);
    setLocalPreviews([]);
    setFieldErrors({});
    setIsDirty(false);
    setToastMessage({
      type: "success",
      text: "↩ All changes reverted to saved state.",
    });
  };

  // Requirement: Split total stock equally across all configured sizes
  const handleAutoSplitStock = (targetTotal?: number) => {
    setIsDirty(true);
    const total = targetTotal !== undefined ? targetTotal : Number(formData.stock) || 0;
    const current = formData.sizeOptions || [];
    if (current.length === 0) {
      setToastMessage({ type: "error", text: "Please add at least one size before splitting stock." });
      return;
    }
    const base = Math.floor(total / current.length);
    let remainder = total % current.length;
    const updated = current.map((opt) => {
      const allotted = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      return {
        ...opt,
        stock: allotted,
      };
    });
    setFormData((prev) => ({
      ...prev,
      sizeOptions: updated,
      sizes: updated.map((o) => o.size),
      stock: total,
      inStock: total > 0,
      status: total === 0 ? "OUT OF STOCK" : prev.status === "OUT OF STOCK" ? "ACTIVE" : prev.status,
    }));
    setToastMessage({
      type: "success",
      text: `Split ${total} total units equally across ${current.length} sizes (${base}${remainder > 0 ? `-${base + 1}` : ""} units/size).`,
    });
  };

  // Requirement: Apply size presets with automatic equal stock split
  const handleApplySizePreset = (presetSizes: string[]) => {
    setIsDirty(true);
    const defaultPrice = formData.price || 1500;
    const defaultMrp = formData.mrp || 2000;
    const total = Number(formData.stock) || 50;
    const base = Math.floor(total / presetSizes.length);
    let remainder = total % presetSizes.length;

    const newOptions: SizeOption[] = presetSizes.map((sz) => {
      const allotted = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      return {
        size: sz,
        price: defaultPrice,
        mrp: defaultMrp,
        stock: allotted,
        sku: `${formData.sku || "NC"}-${sz}`,
      };
    });

    setFormData((prev) => ({
      ...prev,
      sizeOptions: newOptions,
      sizes: presetSizes,
      stock: total,
      inStock: total > 0,
    }));
    setToastMessage({
      type: "success",
      text: `Applied preset [${presetSizes.join(", ")}] with ${total} units split equally.`,
    });
  };

  // Requirement: Clear / Remove all sizes
  const handleClearAllSizes = () => {
    setIsDirty(true);
    setFormData((prev) => ({
      ...prev,
      sizeOptions: [],
      sizes: [],
    }));
    setToastMessage({ type: "success", text: "Removed all sizes. You can configure custom sizes now." });
  };

  const toggleSize = (sz: string) => {
    setIsDirty(true);
    const current = formData.sizeOptions || [];
    const exists = current.some((s) => s.size.toLowerCase() === sz.toLowerCase());

    if (exists) {
      const updated = current.filter((s) => s.size.toLowerCase() !== sz.toLowerCase());
      // If sizes remain and we have a total stock, re-split or keep sum
      const newTotal = updated.length > 0 ? formData.stock : 0;
      if (updated.length > 0) {
        const base = Math.floor(newTotal / updated.length);
        let remainder = newTotal % updated.length;
        const rebalanced = updated.map((opt) => {
          const allotted = base + (remainder > 0 ? 1 : 0);
          if (remainder > 0) remainder--;
          return { ...opt, stock: allotted };
        });
        setFormData((prev) => ({
          ...prev,
          sizeOptions: rebalanced,
          sizes: rebalanced.map((s) => s.size),
          stock: newTotal,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          sizeOptions: [],
          sizes: [],
        }));
      }
    } else {
      handleAddSizeOption(sz);
    }
  };

  const handleAddSizeOption = (sizeName: string) => {
    setIsDirty(true);
    const trimmed = sizeName.trim();
    if (!trimmed) return;
    const current = formData.sizeOptions || [];
    if (current.some((s) => s.size.toLowerCase() === trimmed.toLowerCase())) {
      setToastMessage({ type: "error", text: `Size "${trimmed}" already exists.` });
      return;
    }
    const defaultPrice = formData.price || 1500;
    const defaultMrp = formData.mrp || 2000;
    const newOptionsList = [
      ...current,
      {
        size: trimmed,
        price: defaultPrice,
        mrp: defaultMrp,
        stock: 0,
        sku: `${formData.sku || "NC"}-${trimmed}`,
      },
    ];

    // Split total stock equally among all sizes
    const total = Number(formData.stock) || 50;
    const base = Math.floor(total / newOptionsList.length);
    let remainder = total % newOptionsList.length;
    const balanced = newOptionsList.map((opt) => {
      const allotted = base + (remainder > 0 ? 1 : 0);
      if (remainder > 0) remainder--;
      return { ...opt, stock: allotted };
    });

    setFormData((prev) => ({
      ...prev,
      sizeOptions: balanced,
      sizes: balanced.map((o) => o.size),
      stock: total,
    }));
  };

  const handleRemoveSizeOption = (index: number) => {
    setIsDirty(true);
    const current = formData.sizeOptions || [];
    const updated = current.filter((_, i) => i !== index);
    if (updated.length > 0) {
      const total = Number(formData.stock) || 0;
      const base = Math.floor(total / updated.length);
      let remainder = total % updated.length;
      const balanced = updated.map((opt) => {
        const allotted = base + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
        return { ...opt, stock: allotted };
      });
      setFormData((prev) => ({
        ...prev,
        sizeOptions: balanced,
        sizes: balanced.map((o) => o.size),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        sizeOptions: [],
        sizes: [],
      }));
    }
  };

  const handleUpdateSizeOption = (index: number, field: keyof SizeOption, value: any) => {
    setIsDirty(true);
    const current = [...(formData.sizeOptions || [])];
    if (!current[index]) return;
    current[index] = { ...current[index], [field]: value };
    const newTotalStock = current.reduce((s, o) => s + (Number(o.stock) || 0), 0);
    setFormData((prev) => ({
      ...prev,
      sizeOptions: current,
      sizes: current.map((o) => o.size),
      stock: newTotalStock,
      inStock: newTotalStock > 0,
    }));
  };

  // Image Management
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsDirty(true);
    const selected = Array.from(e.target.files);
    setRawFiles((prev) => [...prev, ...selected]);

    const previewUrls = selected.map((file) => URL.createObjectURL(file));
    setLocalPreviews((prev) => [...prev, ...previewUrls]);
    if (!formData.coverImage && previewUrls.length > 0) {
      setFormData((prev) => ({ ...prev, coverImage: previewUrls[0] }));
    }
  };

  const handleAddImageUrl = () => {
    if (!urlInput.trim()) return;
    setIsDirty(true);
    const newImgs = [...formData.images, urlInput.trim()];
    setFormData((prev) => ({
      ...prev,
      images: newImgs,
      coverImage: prev.coverImage || urlInput.trim(),
    }));
    setUrlInput("");
  };

  const handleRemoveImage = (index: number, isLocal: boolean) => {
    setIsDirty(true);
    if (isLocal) {
      const targetUrl = localPreviews[index];
      setRawFiles((prev) => prev.filter((_, i) => i !== index));
      setLocalPreviews((prev) => prev.filter((_, i) => i !== index));
      if (formData.coverImage === targetUrl) {
        setFormData((prev) => ({
          ...prev,
          coverImage: formData.images[0] || localPreviews[0] || "",
        }));
      }
    } else {
      const targetUrl = formData.images[index];
      const updated = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        images: updated,
        coverImage: prev.coverImage === targetUrl ? updated[0] || localPreviews[0] || "" : prev.coverImage,
      }));
    }
  };

  const handleMoveImage = (index: number, direction: "left" | "right") => {
    setIsDirty(true);
    setFormData((prev) => {
      const imgs = [...prev.images];
      const targetIdx = direction === "left" ? index - 1 : index + 1;
      if (targetIdx < 0 || targetIdx >= imgs.length) return prev;
      const temp = imgs[index];
      imgs[index] = imgs[targetIdx];
      imgs[targetIdx] = temp;
      return { ...prev, images: imgs };
    });
  };

  const handleSetCoverImage = (url: string) => {
    setIsDirty(true);
    setFormData((prev) => ({ ...prev, coverImage: url }));
  };

  // Requirement: Fix Exact Stock and split equally across configured sizes
  const handleExecuteStockAdjustment = async () => {
    const qty = Number(stockActionQty);
    if (isNaN(qty) || qty < 0) {
      setToastMessage({ type: "error", text: "Please enter a valid stock quantity (0 or higher)." });
      return;
    }

    if (!isNew && id) {
      const res = await adminApi.adjustStock(
        formData.id,
        stockAction,
        qty,
        stockActionReason,
        user?.name || "Super Admin"
      );

      if (res.success && res.data) {
        const finalStk = res.data.currentStock;
        setFormData((prev) => {
          const opts = prev.sizeOptions || [];
          let updatedOpts = opts;
          if (opts.length > 0) {
            const base = Math.floor(finalStk / opts.length);
            let remainder = finalStk % opts.length;
            updatedOpts = opts.map((opt) => {
              const allotted = base + (remainder > 0 ? 1 : 0);
              if (remainder > 0) remainder--;
              return { ...opt, stock: allotted };
            });
          }
          return {
            ...prev,
            stock: finalStk,
            inStock: finalStk > 0,
            status: finalStk === 0 ? "OUT OF STOCK" : prev.status === "OUT OF STOCK" ? "ACTIVE" : prev.status,
            sizeOptions: updatedOpts,
          };
        });
        setShowStockModal(false);
        setToastMessage({ type: "success", text: `Stock successfully calibrated to exactly ${finalStk} units and split equally.` });
      } else {
        setToastMessage({ type: "error", text: res.error || "Failed to adjust stock" });
      }
    } else {
      // Local state update for new product creation
      let exactFinalStock = formData.stock;
      if (stockAction === "SET") {
        exactFinalStock = qty;
      } else if (stockAction === "ADD") {
        exactFinalStock = formData.stock + qty;
      } else if (stockAction === "REMOVE") {
        exactFinalStock = Math.max(0, formData.stock - qty);
      }

      setFormData((prev) => {
        const opts = prev.sizeOptions || [];
        let updatedOpts = opts;
        if (opts.length > 0) {
          const base = Math.floor(exactFinalStock / opts.length);
          let remainder = exactFinalStock % opts.length;
          updatedOpts = opts.map((opt) => {
            const allotted = base + (remainder > 0 ? 1 : 0);
            if (remainder > 0) remainder--;
            return { ...opt, stock: allotted };
          });
        }
        return {
          ...prev,
          stock: exactFinalStock,
          inStock: exactFinalStock > 0,
          status: exactFinalStock === 0 ? "OUT OF STOCK" : prev.status === "OUT OF STOCK" ? "ACTIVE" : prev.status,
          sizeOptions: updatedOpts,
        };
      });
      setShowStockModal(false);
      setToastMessage({ type: "success", text: `Stock set to exactly ${exactFinalStock} units and split across sizes.` });
    }
  };

  // Validation (Min 2 images + Required fields)
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name?.trim()) errors.name = "Product name is required.";
    if (!formData.category) errors.category = "Category is required.";
    if (!formData.price || formData.price <= 0) errors.price = "Valid selling price is required.";
    if (!formData.mrp || formData.mrp <= 0) errors.mrp = "Valid MRP is required.";

    const totalImgs = formData.images.length + localPreviews.length;
    if (totalImgs < 2) {
      errors.images = "Minimum 2 images required (Front view & Fabric detail).";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Step-by-Step Value Synchronization & Draft Saver
  const handleNextStep = (fromStep: TabId, toStep: TabId) => {
    const updated: Product = { ...formData };
    const draftKey = `nithi_product_draft_${id || "new"}`;

    if (fromStep === "basic") {
      const trimmedName = (updated.name || "").trim();
      if (!trimmedName) {
        setFieldErrors((prev) => ({ ...prev, name: "Product name is required before proceeding." }));
        setToastMessage({ type: "error", text: "Please enter the product name to continue." });
        return;
      }
      if (!updated.category) {
        setFieldErrors((prev) => ({ ...prev, category: "Category is required." }));
        setToastMessage({ type: "error", text: "Please select a product category." });
        return;
      }
      if (!updated.code || !updated.code.trim()) {
        updated.code = `NC-${Date.now().toString().slice(-4)}`;
      }
      if (!updated.sku || !updated.sku.trim()) {
        updated.sku = `SKU-${Date.now().toString().slice(-4)}`;
      }
      if (!updated.seo?.title) {
        const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        updated.seo = {
          title: `${trimmedName} | Nithi Collection`,
          urlSlug: slug,
          focusKeyword: `${trimmedName} online`,
          metaDescription: updated.seo?.metaDescription || `Buy ${trimmedName} pure cotton wear online at Nithi Collection.`,
        };
      }
    } else if (fromStep === "images") {
      const allImgs = [...updated.images, ...localPreviews];
      if (allImgs.length > 0 && !updated.coverImage) {
        updated.coverImage = allImgs[0];
      }
    } else if (fromStep === "pricing") {
      const mrpNum = Number(updated.mrp) || Number(updated.price) || 0;
      const priceNum = Number(updated.price) || 0;
      if (priceNum <= 0) {
        setFieldErrors((prev) => ({ ...prev, price: "Valid selling price is required." }));
        setToastMessage({ type: "error", text: "Please enter a valid selling price greater than 0." });
        return;
      }
      if (mrpNum <= 0) {
        setFieldErrors((prev) => ({ ...prev, mrp: "Valid MRP is required." }));
        setToastMessage({ type: "error", text: "Please enter a valid MRP greater than 0." });
        return;
      }
      const autoDisc = calculateAutoDiscount(mrpNum, priceNum);
      updated.mrp = mrpNum;
      updated.price = priceNum;
      updated.discount = autoDisc;
      updated.discountValue = autoDisc;
      updated.finalPrice = priceNum;

      if (updated.sizeOptions && updated.sizeOptions.length > 0) {
        updated.sizeOptions = updated.sizeOptions.map((opt) => ({
          ...opt,
          mrp: opt.mrp || mrpNum,
          price: opt.price || priceNum,
        }));
      }
    } else if (fromStep === "inventory") {
      const stk = Number(updated.stock) || 0;
      updated.stock = Math.max(0, stk);
      updated.inStock = updated.stock > 0;
      if (updated.stock === 0 && updated.status === "ACTIVE") {
        updated.status = "OUT OF STOCK";
      } else if (updated.stock > 0 && updated.status === "OUT OF STOCK") {
        updated.status = "ACTIVE";
      }

      if (updated.sizeOptions && updated.sizeOptions.length > 0) {
        const sumSizes = updated.sizeOptions.reduce((acc, s) => acc + (Number(s.stock) || 0), 0);
        if (sumSizes > 0 && sumSizes !== updated.stock) {
          updated.stock = sumSizes;
        }
      }
    } else if (fromStep === "content") {
      if (!updated.fabric) updated.fabric = "100% Pure Cotton";
      if (!updated.length) updated.length = "55 Inches";
    }

    setFormData(updated);
    setIsDirty(true);

    try {
      localStorage.setItem(draftKey, JSON.stringify(updated));
    } catch {
      // ignore
    }

    setActiveTab(toStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Save / Publish Action (Requirement #7: Save -> Complete -> Publish on Mobile & Desktop)
  const handleSave = async (publishStatus: Product["status"] = "ACTIVE") => {
    if (!validateForm()) {
      const errKeys = Object.keys(fieldErrors);
      if (errKeys.includes("images")) {
        setActiveTab("images");
        setToastMessage({ type: "error", text: "Minimum 2 product images are required before publishing." });
      } else {
        setActiveTab("basic");
        setToastMessage({ type: "error", text: "Please complete the required fields marked with *." });
      }
      return;
    }

    setSaving(true);
    try {
      let finalImages = [...formData.images];

      // Upload local images if any
      if (rawFiles.length > 0) {
        const uploadRes = await adminApi.uploadImages(rawFiles);
        if (uploadRes.success && uploadRes.urls && uploadRes.urls.length > 0) {
          finalImages = [...finalImages, ...uploadRes.urls];
        }
      }

      // Filter out any blob: or empty strings or placeholders
      const cleanedFinalImages = finalImages
        .filter((img): img is string => typeof img === "string" && img.trim().length > 0)
        .filter((img) => !img.startsWith("blob:") && !img.includes("__LOCAL_") && img !== "null" && img !== "undefined");

      const safeFinalImages = cleanedFinalImages.length > 0
        ? cleanedFinalImages
        : ["https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format"];

      let safeCoverImage = formData.coverImage;
      if (!safeCoverImage || safeCoverImage.startsWith("blob:") || safeCoverImage.includes("__LOCAL_") || !safeCoverImage.trim()) {
        safeCoverImage = safeFinalImages[0];
      }

      const autoDisc = calculateAutoDiscount(formData.mrp, formData.price);

      const payload: Product = {
        ...formData,
        images: safeFinalImages,
        coverImage: safeCoverImage,
        discount: autoDisc,
        discountValue: autoDisc,
        discountType: "percentage",
        finalPrice: formData.price,
        inStock: (formData.stock || 0) > 0,
        status: (formData.stock || 0) === 0 ? "OUT OF STOCK" : publishStatus,
        updatedAt: new Date().toISOString(),
      };

      const res = await adminApi.saveProduct(payload);

      if (res.success) {
        setIsDirty(false);
        try {
          localStorage.removeItem(`nithi_product_draft_${id || "new"}`);
          localStorage.removeItem("nithi_product_draft_new");
        } catch {
          // ignore
        }
        setToastMessage({
          type: "success",
          text: `✓ Product "${formData.name}" successfully ${isNew ? "created & published" : "saved"}!`,
        });
        setTimeout(() => {
          navigate("/admin/products");
        }, 1000);
      } else {
        setToastMessage({ type: "error", text: res.error || "Failed to save product." });
      }
    } catch (e: any) {
      setToastMessage({ type: "error", text: e.message || "An error occurred while saving." });
    } finally {
      setSaving(false);
    }
  };

  // Primary 6-Step Core Flow (Requirement #6: Content placed below Inventory/Stock)
  const CORE_STEPS: { id: TabId; label: string; icon: string; shortDesc: string }[] = [
    { id: "basic", label: "1. Basic Info", icon: "📋", shortDesc: "Title, Category & SKU" },
    { id: "images", label: "2. Images", icon: "🖼️", shortDesc: "Min 2 Photos Required" },
    { id: "pricing", label: "3. Pricing", icon: "₹", shortDesc: "MRP, Price & Auto-Discount" },
    { id: "inventory", label: "4. Inventory", icon: "📦", shortDesc: "Stock Level & Threshold" },
    { id: "content", label: "5. Content & Specs", icon: "📝", shortDesc: "Description & Details" },
    { id: "sizes", label: "6. Sizes & Variants", icon: "👗", shortDesc: "S, M, L, XL, XXL Matrix" },
  ];

  // Optional Advanced Tabs
  const ADVANCED_TABS: { id: TabId; label: string; icon: string }[] = [
    { id: "offers", label: "Offers & Combos", icon: "🎁" },
    { id: "shipping", label: "Shipping Rules", icon: "🚚" },
    { id: "cod", label: "COD Rules", icon: "💵" },
    { id: "seo", label: "SEO Settings", icon: "🔍" },
    { id: "preview", label: "Storefront Preview", icon: "👁️" },
    { id: "history", label: "Audit History", icon: "📜" },
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center font-body">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-2xl bg-gradient-to-tr from-[#C9A227] to-[#064E3B] p-1">
            <div className="h-full w-full rounded-xl bg-white" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
            Loading Garment Studio...
          </p>
        </div>
      </div>
    );
  }

  const allImagesList = [
    ...formData.images.map((url) => ({ url, isLocal: false })),
    ...localPreviews.map((url) => ({ url, isLocal: true })),
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-28 font-body">
      {/* ------------------------------------------------------------- */}
      {/* PERSISTENT RESPONSIVE TOP HEADER (Requirement #7)             */}
      {/* ------------------------------------------------------------- */}
      <div className="sticky top-0 z-30 -mx-4 -mt-6 sm:-mx-8 bg-white/95 backdrop-blur-md border-b border-stone-200 px-4 sm:px-8 py-3.5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Product summary */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              to="/admin/products"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100 transition shrink-0"
              title="Return to products catalog"
            >
              <ArrowLeftIcon />
            </Link>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base font-bold text-stone-900 truncate">
                  {formData.name || "New Garment / Dress"}
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-stone-100 font-mono text-[11px] font-semibold text-stone-600 border border-stone-200">
                  {formData.sku || "NO-SKU"}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    formData.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : formData.status === "OUT OF STOCK"
                      ? "bg-rose-50 text-rose-700 border border-rose-200"
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}
                >
                  {formData.status}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                <span>Selling Price: <strong className="text-stone-800">₹{formData.price}</strong></span>
                <span>•</span>
                <span>MRP: <strong className="text-stone-500 line-through">₹{formData.mrp}</strong></span>
                <span>•</span>
                <span>Stock: <strong className={formData.stock <= 10 ? "text-amber-600 font-bold" : "text-emerald-700 font-bold"}>{formData.stock} units</strong></span>
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleUndoAllChanges}
              title="Revert all unsaved edits"
              className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-50 transition flex items-center gap-1.5"
            >
              <span>↩</span>
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === "preview"
                  ? "bg-[#064E3B] text-[#FAF8F1] border-[#064E3B]"
                  : "bg-white text-stone-700 border-stone-200 hover:bg-stone-50"
              }`}
            >
              <EyeIcon size={14} />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave("DRAFT")}
              disabled={saving}
              className="px-3.5 py-2 rounded-xl border border-stone-300 bg-white text-stone-700 text-xs font-bold hover:bg-stone-100 transition disabled:opacity-50"
            >
              Save Draft
            </button>

            <button
              type="button"
              onClick={() => handleSave("ACTIVE")}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#0B3D2E] text-[#FAF8F1] text-xs font-bold shadow-md hover:brightness-110 transition disabled:opacity-50 uppercase tracking-wider flex items-center gap-1.5"
            >
              {saving ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckIcon size={14} />
                  <span>{isNew ? "Save & Publish" : "Save Changes"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 6-STEP CORE WIZARD STEPPER (Requirement #6: Content below Inventory) */}
        <div className="pt-3 mt-1 border-t border-stone-100 space-y-2">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            {/* 6 Primary Steps */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CORE_STEPS.map((step) => {
                const isActive = activeTab === step.id;
                const isStepComplete =
                  step.id === "basic"
                    ? Boolean(formData.name?.trim() && formData.category)
                    : step.id === "images"
                    ? allImagesList.length >= 2
                    : step.id === "pricing"
                    ? Number(formData.price) > 0 && Number(formData.mrp) > 0
                    : step.id === "inventory"
                    ? Number(formData.stock) >= 0
                    : step.id === "content"
                    ? Boolean(formData.description?.trim())
                    : (formData.sizeOptions?.length || 0) > 0;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => handleNextStep(activeTab, step.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 border ${
                      isActive
                        ? "bg-[#064E3B] text-[#FAF8F1] border-[#064E3B] shadow-sm shadow-[#064E3B]/20"
                        : isStepComplete
                        ? "bg-white text-stone-800 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/40"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900"
                    }`}
                  >
                    <span className="text-sm">{step.icon}</span>
                    <span className="truncate">{step.label}</span>
                    {step.id === "images" && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                          allImagesList.length >= 2
                            ? isActive
                              ? "bg-white/20 text-white"
                              : "bg-emerald-100 text-emerald-800"
                            : isActive
                            ? "bg-amber-400 text-black font-extrabold"
                            : "bg-amber-100 text-amber-800 font-bold"
                        }`}
                      >
                        {allImagesList.length}/2
                      </span>
                    )}
                    {isStepComplete ? (
                      <span
                        className={`text-[11px] font-extrabold ${
                          isActive ? "text-[#C9A227]" : "text-emerald-600"
                        }`}
                        title="Step complete"
                      >
                        ✓
                      </span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-300 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Advanced Settings Toggle */}
            <div className="flex items-center gap-1.5 shrink-0 self-end lg:self-center">
              <button
                type="button"
                onClick={() => setShowAdvancedTabs(!showAdvancedTabs)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                  showAdvancedTabs || ADVANCED_TABS.some((t) => t.id === activeTab)
                    ? "bg-stone-800 text-white border-stone-800"
                    : "bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200"
                }`}
              >
                <span>⚙️</span>
                <span>{showAdvancedTabs ? "Hide Optional" : "Advanced Settings"}</span>
                <span className="text-[10px] opacity-70">({ADVANCED_TABS.length})</span>
                <span className="text-[10px]">{showAdvancedTabs ? "▲" : "▼"}</span>
              </button>
            </div>
          </div>

          {/* Collapsible Advanced Tabs Strip */}
          {(showAdvancedTabs || ADVANCED_TABS.some((t) => t.id === activeTab)) && (
            <div className="flex items-center gap-1 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-dashed border-stone-200 bg-stone-50/80 p-2 rounded-xl">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 px-2 shrink-0">
                Optional:
              </span>
              {ADVANCED_TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as TabId)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition shrink-0 flex items-center gap-1.5 ${
                      isActive
                        ? "bg-[#064E3B] text-[#FAF8F1] font-bold shadow-2xs"
                        : "text-stone-600 hover:bg-white hover:text-stone-900 border border-transparent hover:border-stone-200"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl p-4 shadow-sm border animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            {toastMessage.type === "success" ? <CheckIcon size={16} /> : <AlertTriangleIcon size={16} />}
            <span>{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-stone-600 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: BASIC INFORMATION                                      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "basic" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>📋</span> Basic Product Information
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Configure primary garment title, category structure, SKU code, and publishing status.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Product Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g. Pure Cotton Floral Hand-Block Nighty"
                  className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm sm:text-base transition focus:outline-none focus:ring-2 ${
                    fieldErrors.name
                      ? "border-rose-500 focus:ring-rose-200"
                      : "border-stone-200 focus:border-[#064E3B] focus:ring-[#064E3B]/20"
                  }`}
                />
                {fieldErrors.name && <p className="mt-1 text-xs text-rose-500">{fieldErrors.name}</p>}
              </div>

              {/* SKU & Product Code */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="NC-NGHT-001"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 font-mono text-sm focus:border-[#064E3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Product Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="CODE-01"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 font-mono text-sm focus:border-[#064E3B] focus:outline-none"
                />
              </div>

              {/* Category */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(!isCustomCategory)}
                    className="text-[11px] font-bold text-[#064E3B] hover:underline"
                  >
                    {isCustomCategory ? "Select from list" : "+ Custom Category"}
                  </button>
                </div>

                {isCustomCategory ? (
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    placeholder="Enter new category name..."
                    className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-[#064E3B] focus:outline-none"
                  />
                ) : (
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      handleInputChange("category", newCat);
                      const catObj = loadedCategories.find((c) => c.name === newCat || c.id === newCat);
                      const hierarchy = CATEGORY_HIERARCHY[newCat];
                      if (hierarchy?.groups && hierarchy.groups[0]?.items[0]) {
                        handleInputChange("subcategory", hierarchy.groups[0].items[0]);
                      } else if (hierarchy?.items && hierarchy.items[0]) {
                        handleInputChange("subcategory", hierarchy.items[0]);
                      } else if (catObj?.subcategories && catObj.subcategories[0]?.name) {
                        handleInputChange("subcategory", catObj.subcategories[0].name);
                      } else {
                        handleInputChange("subcategory", "");
                      }
                    }}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 focus:border-[#064E3B] focus:outline-none"
                  >
                    {allCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Subcategory */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                    Subcategory
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomSubcategory(!isCustomSubcategory)}
                    className="text-[11px] font-bold text-[#064E3B] hover:underline"
                  >
                    {isCustomSubcategory ? "Select from list" : "+ Custom Subcategory"}
                  </button>
                </div>

                {isCustomSubcategory ? (
                  <input
                    type="text"
                    value={formData.subcategory || ""}
                    onChange={(e) => handleInputChange("subcategory", e.target.value)}
                    placeholder="Enter custom subcategory..."
                    className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-[#064E3B] focus:outline-none"
                  />
                ) : (
                  <select
                    value={formData.subcategory || ""}
                    onChange={(e) => handleInputChange("subcategory", e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 focus:border-[#064E3B] focus:outline-none"
                  >
                    <option value="">-- None / General Collection --</option>
                    {(() => {
                      const catName = formData.category;
                      const hierarchy = CATEGORY_HIERARCHY[catName];
                      const catObj = loadedCategories.find(
                        (c) => c.name.toLowerCase() === catName.toLowerCase() || c.id.toLowerCase() === catName.toLowerCase()
                      );

                      const renderedSubNames = new Set<string>();
                      const elements: React.ReactNode[] = [];

                      if (hierarchy?.groups) {
                        hierarchy.groups.forEach((grp) => {
                          elements.push(
                            <optgroup key={grp.name} label={grp.name}>
                              {grp.items.map((it) => {
                                renderedSubNames.add(it.toLowerCase());
                                renderedSubNames.add(`${grp.name} - ${it}`.toLowerCase());
                                return (
                                  <option key={`${grp.name} - ${it}`} value={it}>
                                    {it}
                                  </option>
                                );
                              })}
                            </optgroup>
                          );
                        });
                      } else if (hierarchy?.items) {
                        hierarchy.items.forEach((it) => {
                          renderedSubNames.add(it.toLowerCase());
                          elements.push(
                            <option key={it} value={it}>
                              {it}
                            </option>
                          );
                        });
                      }

                      // Additional dynamic subcategories from database Category model
                      if (catObj?.subcategories && catObj.subcategories.length > 0) {
                        const extraSubs = catObj.subcategories.filter(
                          (s) => s.name && !renderedSubNames.has(s.name.toLowerCase())
                        );

                        if (extraSubs.length > 0) {
                          elements.push(
                            <optgroup key="custom-subs" label="Custom / Added Subcategories">
                              {extraSubs.map((s) => {
                                renderedSubNames.add(s.name.toLowerCase());
                                return (
                                  <option key={s.id || s.name} value={s.name}>
                                    {s.name}
                                  </option>
                                );
                              })}
                            </optgroup>
                          );
                        }
                      }

                      // If current subcategory is non-empty and not in rendered list, display it
                      if (
                        formData.subcategory &&
                        !renderedSubNames.has(formData.subcategory.toLowerCase()) &&
                        formData.subcategory !== "-- None / General Collection --"
                      ) {
                        elements.push(
                          <option key={formData.subcategory} value={formData.subcategory}>
                            {formData.subcategory}
                          </option>
                        );
                      }

                      return elements;
                    })()}
                  </select>
                )}
              </div>

              {/* Brand & Catalogue Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-[#064E3B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Publishing Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value as any)}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 focus:border-[#064E3B] focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE (Published on Storefront)</option>
                  <option value="DRAFT">DRAFT (Hidden / Internal)</option>
                  <option value="OUT OF STOCK">OUT OF STOCK (Sold Out)</option>
                  <option value="DISCONTINUED">DISCONTINUED (Archived)</option>
                </select>
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => handleNextStep("basic", "images")}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#064E3B] hover:bg-[#0B3D2E] text-white text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Next: 2. Images</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: IMAGES (MIN 2 REQUIRED)                                */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "images" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>🖼️</span> Product Photos & Gallery (Min 2 Required)
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Upload high-resolution dress photos. First image acts as the primary catalog cover card.
                </p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-full self-start ${
                allImagesList.length >= 2
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-amber-100 text-amber-800 border border-amber-300"
              }`}>
                {allImagesList.length} / 2 Images Attached
              </span>
            </div>

            {/* Minimum 2 Images Banner */}
            <div
              className={`mb-6 p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                allImagesList.length < 2
                  ? "bg-amber-50/90 border-amber-300 text-amber-900"
                  : "bg-emerald-50/90 border-emerald-300 text-emerald-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${
                    allImagesList.length < 2 ? "bg-amber-200 text-amber-900" : "bg-emerald-200 text-emerald-900"
                  }`}
                >
                  {allImagesList.length < 2 ? "⚠️" : "✅"}
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    {allImagesList.length < 2
                      ? "Minimum 2 Images Required"
                      : "Image Requirement Satisfied"}
                  </h4>
                  <p className="text-xs mt-0.5 opacity-90">
                    {allImagesList.length < 2
                      ? "Every product requires at least 2 photos (Front View & Fabric/Detail close-up)."
                      : `Great! ${allImagesList.length} images attached.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-[#064E3B] rounded-3xl p-8 text-center cursor-pointer transition bg-stone-50/50 hover:bg-emerald-50/20 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-600 group-hover:scale-110 group-hover:text-[#064E3B] transition">
                  <UploadIcon />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">
                    Click to browse or drag & drop high-resolution dress photos
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Supports JPG, PNG, WebP.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Image URL input */}
            <div className="mt-6 flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Or paste image URL (https://...)"
                className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-xs focus:border-[#064E3B] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-black text-white text-xs font-bold transition"
              >
                Add URL
              </button>
            </div>

            {/* Image Gallery Grid */}
            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                Gallery Photos & Reordering
              </h3>
              {allImagesList.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-4">
                  No images uploaded yet. Please upload at least 2 photos.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {allImagesList.map((item, idx) => {
                    const isCover = formData.coverImage === item.url || (!formData.coverImage && idx === 0);
                    return (
                      <div
                        key={idx}
                        className={`group relative rounded-2xl border overflow-hidden bg-stone-100 transition shadow-2xs ${
                          isCover ? "border-[#064E3B] ring-2 ring-[#064E3B]/30" : "border-stone-200"
                        }`}
                      >
                        <div className="aspect-3/4 overflow-hidden bg-stone-200">
                          <img
                            src={item.url}
                            alt={`Photo ${idx + 1}`}
                            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>

                        {/* Cover Badge */}
                        {isCover && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#064E3B] text-[#FAF8F1] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <StarIcon filled /> Cover
                          </div>
                        )}

                        {/* Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2.5 text-white">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx, item.isLocal)}
                              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition"
                              title="Delete photo"
                            >
                              <TrashIcon size={13} />
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            {!isCover && (
                              <button
                                type="button"
                                onClick={() => handleSetCoverImage(item.url)}
                                className="w-full py-1 rounded-md bg-[#064E3B] hover:bg-[#0B3D2E] text-white text-[10px] font-bold uppercase transition"
                              >
                                Set as Cover
                              </button>
                            )}

                            {!item.isLocal && (
                              <div className="flex gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => handleMoveImage(idx, "left")}
                                  className="flex-1 py-1 rounded-md bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white text-[10px] font-bold transition flex items-center justify-center"
                                >
                                  <MoveLeftIcon />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === formData.images.length - 1}
                                  onClick={() => handleMoveImage(idx, "right")}
                                  className="flex-1 py-1 rounded-md bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white text-[10px] font-bold transition flex items-center justify-center"
                                >
                                  <MoveRightIcon />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Navigation Footer */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("basic")}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition"
              >
                ← Previous: 1. Basic Info
              </button>

              <button
                type="button"
                onClick={() => handleNextStep("images", "pricing")}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#064E3B] hover:bg-[#0B3D2E] text-white text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Next: 3. Pricing</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: PRICING & AUTOMATIC DISCOUNT (Requirement #4)          */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "pricing" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>₹</span> Pricing & Automatic Discount Calculator
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Enter MRP and Selling Price. The discount percentage is calculated automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* MRP */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  MRP (Maximum Retail Price) <span className="text-rose-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.mrp}
                    onChange={(e) => handleInputChange("mrp", Number(e.target.value))}
                    placeholder="2000"
                    className="w-full rounded-xl border border-stone-200 pl-8 pr-4 py-3 text-sm sm:text-base font-bold text-stone-900 focus:border-[#064E3B] focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Tag price printed on garment</p>
              </div>

              {/* Selling Price */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Selling Price <span className="text-rose-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", Number(e.target.value))}
                    placeholder="1500"
                    className="w-full rounded-xl border border-stone-200 pl-8 pr-4 py-3 text-sm sm:text-base font-bold text-stone-900 focus:border-[#064E3B] focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Price customer pays at checkout</p>
              </div>

              {/* Automatic Discount Display (Requirement #4) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  Discount % (Calculated Automatically)
                </label>
                <div className="mt-1.5 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <span className="text-lg font-extrabold text-[#064E3B]">
                    {currentDiscountPercent > 0 ? `${currentDiscountPercent}% OFF` : "0% (No Discount)"}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
                    Auto-Computed
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1">
                  Example: MRP ₹2,000 → Selling Price ₹1,500 = 25% OFF
                </p>
              </div>
            </div>

            {/* Live Pricing Summary Card */}
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-50 to-stone-50 p-6 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Customer Price Readout
                </span>
                <div className="text-3xl font-bold font-display text-emerald-950 mt-1">
                  ₹{formData.price}
                  {formData.mrp > formData.price && (
                    <span className="text-base font-normal text-stone-400 line-through ml-3">
                      ₹{formData.mrp}
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-800 mt-0.5 font-medium">
                  Customer saves ₹{liveSavings} ({currentDiscountPercent}% OFF)
                </p>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-xl border border-emerald-300 shadow-2xs inline-block">
                  ✓ Automatically Synchronized
                </span>
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("images")}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition"
              >
                ← Previous: 2. Images
              </button>

              <button
                type="button"
                onClick={() => handleNextStep("pricing", "inventory")}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#064E3B] hover:bg-[#0B3D2E] text-white text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Next: 4. Inventory</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: INVENTORY & EXACT STOCK (Requirement #5)               */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>📦</span> Stock & Inventory Radar
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Manage warehouse quantity and calibrate exact stock.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowStockModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#064E3B] hover:bg-[#0B3D2E] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm self-start sm:self-center"
              >
                <span>⚡ Set Exact Stock / Direct Adjustment</span>
              </button>
            </div>

            {/* Inventory Status Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <p className="text-[11px] font-bold text-stone-500 uppercase">Available Stock</p>
                <p className="text-2xl font-bold font-display text-stone-900 mt-1">{formData.stock}</p>
                <span className="text-[10px] text-stone-400">Total units in warehouse</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-[11px] font-bold text-emerald-800 uppercase">Stock Status</p>
                <p className="text-base font-bold font-display text-emerald-950 mt-1">
                  {formData.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
                </p>
                <span className="text-[10px] text-emerald-700">Live on storefront</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="text-[11px] font-bold text-amber-800 uppercase">Low Stock Alert</p>
                <p className="text-2xl font-bold font-display text-amber-950 mt-1">≤ 5</p>
                <span className="text-[10px] text-amber-700">Triggers customer alert</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <p className="text-[11px] font-bold text-blue-800 uppercase">Sold Units</p>
                <p className="text-2xl font-bold font-display text-blue-950 mt-1">
                  {formData.reviews ? formData.reviews * 3 : 18}
                </p>
                <span className="text-[10px] text-blue-700">Fulfilled orders</span>
              </div>
            </div>

            {/* Size-wise Stock Breakdown & Equal Split Sync */}
            {(formData.sizeOptions || []).length > 0 && (
              <div className="mt-4 p-5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                    <span>👗</span> Size-wise Equal Stock Breakdown
                  </h4>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.sizeOptions?.map((opt) => (
                      <span
                        key={opt.size}
                        className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-bold text-stone-700 shadow-2xs"
                      >
                        {opt.size}: <strong className="text-emerald-800">{opt.stock} pcs</strong>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAutoSplitStock()}
                  className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs shrink-0 flex items-center gap-1.5 self-start sm:self-center"
                >
                  <span>⚡ Split {formData.stock} Units Equally</span>
                </button>
              </div>
            )}

            {/* Navigation Footer */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("pricing")}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition"
              >
                ← Previous: 3. Pricing
              </button>

              <button
                type="button"
                onClick={() => handleNextStep("inventory", "content")}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#064E3B] hover:bg-[#0B3D2E] text-white text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Next: 5. Product Content</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: PRODUCT CONTENT & SPECS (Requirement #6: Below Stock)  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "content" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>📝</span> Product Content & Garment Specifications
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Edit full product story, fabric material, length, neckline, sleeve, and wash care details.
              </p>
            </div>

            {/* Description Textarea */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Full Product Description
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Write garment details, styling tips, and fabric highlights..."
                className="w-full rounded-2xl border border-stone-200 p-4 text-xs sm:text-sm font-sans focus:border-[#064E3B] focus:outline-none"
              />
            </div>

            {/* Short Description */}
            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                Short Tagline / Excerpt
              </label>
              <input
                type="text"
                value={formData.shortDescription || ""}
                onChange={(e) => handleInputChange("shortDescription", e.target.value)}
                placeholder="Brief 1-sentence product summary"
                className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-xs sm:text-sm focus:border-[#064E3B] focus:outline-none"
              />
            </div>

            {/* Specifications Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700">Fabric Composition</label>
                <input
                  type="text"
                  value={formData.fabric}
                  onChange={(e) => handleInputChange("fabric", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700">Garment Length</label>
                <input
                  type="text"
                  value={formData.length || "55 Inches"}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700">Pattern</label>
                <input
                  type="text"
                  value={formData.pattern || "Floral Print"}
                  onChange={(e) => handleInputChange("pattern", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700">Sleeve Type</label>
                <input
                  type="text"
                  value={formData.sleeveType || "Half Sleeve"}
                  onChange={(e) => handleInputChange("sleeveType", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700">Neck Style / Opening</label>
                <input
                  type="text"
                  value={formData.neckType || "Round Neck with Front Zip"}
                  onChange={(e) => handleInputChange("neckType", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700">Wash Care</label>
                <input
                  type="text"
                  value={formData.care || "Machine wash cold"}
                  onChange={(e) => handleInputChange("care", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs"
                />
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("inventory")}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition"
              >
                ← Previous: 4. Inventory
              </button>

              <button
                type="button"
                onClick={() => handleNextStep("content", "sizes")}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#064E3B] hover:bg-[#0B3D2E] text-white text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Next: 6. Sizes</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: SIZES & VARIANTS (Requirement #1 & #3)                 */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "sizes" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>👗</span> Product Sizes, Pricing & Stock Matrix
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Enable sizes (S | M | L | XL | XXL | Free Size) and configure size-specific prices and stocks.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 self-start">
                {(formData.sizeOptions || []).length} Sizes Active
              </span>
            </div>

            {/* Quick Size Presets & Clear All (Requirement) */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                  ⚡ Quick Size Presets (Click to Load & Auto-Split Stock):
                </label>
                {(formData.sizeOptions || []).length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearAllSizes}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1 self-start"
                  >
                    <TrashIcon size={13} />
                    <span>Clear / Remove All Sizes</span>
                  </button>
                )}
              </div>

              {/* Preset Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplySizePreset(["Free Size"])}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition shadow-2xs flex items-center gap-1.5"
                >
                  <span>✦ Free Size (1 Size)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplySizePreset(["S", "M", "L", "XL"])}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 transition shadow-2xs flex items-center gap-1.5"
                >
                  <span>⚡ S, M, L, XL (4 Sizes)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplySizePreset(["M", "L", "XL", "XXL"])}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-blue-50 text-blue-900 border border-blue-300 hover:bg-blue-100 transition shadow-2xs flex items-center gap-1.5"
                >
                  <span>⚡ M, L, XL, XXL (4 Sizes)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApplySizePreset(["XS", "S", "M", "L", "XL", "XXL", "XXXL"])}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-stone-100 text-stone-800 border border-stone-300 hover:bg-stone-200 transition shadow-2xs flex items-center gap-1.5"
                >
                  <span>Full Range (XS - 3XL)</span>
                </button>
              </div>

              {/* Standard Sizes Toggle Row */}
              <div className="pt-2">
                <span className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Or Toggle Individual Sizes:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {STANDARD_SIZES.map((sz) => {
                    const isAdded = (formData.sizeOptions || []).some(
                      (s) => s.size.toLowerCase() === sz.toLowerCase()
                    );
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => toggleSize(sz)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 ${
                          isAdded
                            ? "bg-[#064E3B] text-[#FAF8F1] border-[#064E3B] shadow-xs"
                            : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        <span>{sz}</span>
                        <span className="text-[10px]">{isAdded ? "✓" : "+"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Auto Equal Stock Splitting Action Card */}
            {(formData.sizeOptions || []).length > 0 && (
              <div className="rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-800 font-bold text-xs uppercase tracking-wider">
                      ⚖️ Equal Stock Splitting
                    </span>
                    <span className="text-[10px] bg-emerald-200 text-emerald-950 font-extrabold px-2 py-0.5 rounded-full">
                      Total: {formData.stock} Units
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 mt-0.5">
                    Splitting {formData.stock} warehouse units equally across {(formData.sizeOptions || []).length} sizes gives ~{Math.floor(formData.stock / Math.max(1, (formData.sizeOptions || []).length))} units per size.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleAutoSplitStock()}
                  className="px-4 py-2 rounded-xl bg-[#064E3B] hover:bg-[#0B3D2E] text-white text-xs font-bold shadow-xs transition shrink-0 flex items-center gap-1.5"
                >
                  <span>⚡ Split Stock Equally</span>
                </button>
              </div>
            )}

            {/* Custom Size Creator */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex gap-2">
              <input
                type="text"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                placeholder="Enter custom size (e.g. 5XL, Plus Size, Custom Fit)..."
                className="flex-1 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-medium text-stone-900 focus:border-[#064E3B] focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (customSizeInput.trim()) {
                      handleAddSizeOption(customSizeInput.trim());
                      setCustomSizeInput("");
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (customSizeInput.trim()) {
                    handleAddSizeOption(customSizeInput.trim());
                    setCustomSizeInput("");
                  }
                }}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-black text-white text-xs font-bold transition shrink-0"
              >
                + Add Custom Size
              </button>
            </div>

            {/* Configured Size Table or Empty State */}
            {(formData.sizeOptions || []).length === 0 ? (
              <div className="p-8 text-center rounded-2xl border-2 border-dashed border-stone-200 bg-stone-50/50">
                <p className="text-sm font-bold text-stone-700">No sizes configured yet</p>
                <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto">
                  Click one of the Quick Size Presets above (such as "Free Size" or "S, M, L, XL") or add custom sizes. Stock will automatically be split equally.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-stone-200 rounded-2xl overflow-hidden">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Size</th>
                      <th className="p-3">MRP (₹)</th>
                      <th className="p-3">Selling Price (₹)</th>
                      <th className="p-3">Stock Units (Equal Split)</th>
                      <th className="p-3 text-right">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {(formData.sizeOptions || []).map((szOpt, sIdx) => (
                      <tr key={szOpt.size} className="hover:bg-stone-50/50">
                        <td className="p-3 font-bold text-stone-900">
                          <span className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-200 inline-block font-mono">
                            {szOpt.size}
                          </span>
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={szOpt.mrp || formData.mrp}
                            onChange={(e) => handleUpdateSizeOption(sIdx, "mrp", Number(e.target.value))}
                            className="w-24 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs font-bold"
                          />
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={szOpt.price}
                            onChange={(e) => handleUpdateSizeOption(sIdx, "price", Number(e.target.value))}
                            className="w-24 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs font-bold text-[#064E3B]"
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              min="0"
                              value={szOpt.stock}
                              onChange={(e) => handleUpdateSizeOption(sIdx, "stock", Number(e.target.value))}
                              className="w-20 rounded-lg border border-stone-200 px-2.5 py-1.5 text-xs font-bold text-emerald-800"
                            />
                            <span className="text-[10px] text-stone-400">units</span>
                          </div>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveSizeOption(sIdx)}
                            className="text-stone-400 hover:text-rose-600 font-bold p-1 text-sm transition"
                            title={`Remove size ${szOpt.size}`}
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-stone-50 border-t border-stone-200 font-bold text-stone-800">
                    <tr>
                      <td className="p-3">Total (Sum of Sizes)</td>
                      <td className="p-3 text-stone-500">—</td>
                      <td className="p-3 text-stone-500">—</td>
                      <td className="p-3 text-emerald-800 font-extrabold">
                        {(formData.sizeOptions || []).reduce((acc, s) => acc + (Number(s.stock) || 0), 0)} units total
                      </td>
                      <td className="p-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleAutoSplitStock()}
                          className="text-[10px] text-[#064E3B] underline font-bold"
                        >
                          Re-balance
                        </button>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Navigation & Final Publishing Bar */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setActiveTab("content")}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition"
              >
                ← Previous: 5. Content
              </button>

              <button
                type="button"
                onClick={() => handleSave("ACTIVE")}
                disabled={saving}
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#064E3B] to-[#0B3D2E] hover:brightness-110 text-white text-xs font-bold uppercase tracking-wider transition shadow-lg flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Publishing Garment...</span>
                  </>
                ) : (
                  <>
                    <CheckIcon size={16} />
                    <span>✓ Complete & Publish Product</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* OPTIONAL ADVANCED TABS (SEO, PREVIEW, AUDIT)                  */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "seo" && (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-stone-900">SEO & Metadata</h2>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-700">Page Title</label>
            <input
              type="text"
              value={formData.seo?.title || ""}
              onChange={(e) => handleInputChange("seo", { ...formData.seo, title: e.target.value })}
              className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-700">URL Slug</label>
            <input
              type="text"
              value={formData.seo?.urlSlug || ""}
              onChange={(e) => handleInputChange("seo", { ...formData.seo, urlSlug: e.target.value })}
              className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs font-mono text-emerald-800"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase text-stone-700">Meta Description</label>
            <textarea
              rows={3}
              value={formData.seo?.metaDescription || ""}
              onChange={(e) => handleInputChange("seo", { ...formData.seo, metaDescription: e.target.value })}
              className="mt-1 w-full rounded-xl border border-stone-200 p-2.5 text-xs"
            />
          </div>
        </div>
      )}

      {activeTab === "preview" && (
        <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-stone-900">Storefront Product Card Preview</h2>
          <div className="max-w-xs mx-auto border border-[#E8E2D5] rounded-2xl overflow-hidden bg-white shadow-md p-3">
            <div className="aspect-[3/4] bg-stone-100 rounded-xl overflow-hidden mb-3">
              <img
                src={formData.coverImage || formData.images[0] || "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=400&fit=crop"}
                alt={formData.name}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[10px] font-bold text-[#C9A227] uppercase">{formData.category}</p>
            <h4 className="font-bold text-sm text-stone-900 line-clamp-1">{formData.name || "Product Name"}</h4>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-bold text-base text-[#064E3B]">₹{formData.price}</span>
              {formData.mrp > formData.price && (
                <span className="text-xs text-stone-400 line-through">₹{formData.mrp}</span>
              )}
              {currentDiscountPercent > 0 && (
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                  {currentDiscountPercent}% OFF
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DIRECT EXACT STOCK ADJUSTMENT MODAL (Requirement #5)          */}
      {/* ------------------------------------------------------------- */}
      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
                <span>⚡</span> Exact Stock Calibration
              </h3>
              <button
                type="button"
                onClick={() => setShowStockModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Adjustment Action</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setStockAction("SET")}
                    className={`py-2 rounded-xl font-bold transition border ${
                      stockAction === "SET"
                        ? "bg-[#064E3B] text-white border-[#064E3B]"
                        : "bg-stone-50 text-stone-700 border-stone-200"
                    }`}
                  >
                    SET EXACT
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockAction("ADD")}
                    className={`py-2 rounded-xl font-bold transition border ${
                      stockAction === "ADD"
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-stone-50 text-stone-700 border-stone-200"
                    }`}
                  >
                    + ADD
                  </button>
                  <button
                    type="button"
                    onClick={() => setStockAction("REMOVE")}
                    className={`py-2 rounded-xl font-bold transition border ${
                      stockAction === "REMOVE"
                        ? "bg-rose-700 text-white border-rose-700"
                        : "bg-stone-50 text-stone-700 border-stone-200"
                    }`}
                  >
                    - REMOVE
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  {stockAction === "SET" ? "Exact Stock Quantity to Set" : `Quantity to ${stockAction}`}
                </label>
                <input
                  type="number"
                  min="0"
                  value={stockActionQty}
                  onChange={(e) => setStockActionQty(Number(e.target.value))}
                  placeholder="50"
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-base font-bold focus:border-[#064E3B] focus:outline-none"
                />
              </div>

              <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 font-semibold">
                <p>
                  Current: <strong>{formData.stock} units</strong> &nbsp;→&nbsp; Final Stock will become exactly:{" "}
                  <strong className="text-[#064E3B] text-base underline">
                    {stockAction === "SET"
                      ? Number(stockActionQty)
                      : stockAction === "ADD"
                      ? formData.stock + Number(stockActionQty)
                      : Math.max(0, formData.stock - Number(stockActionQty))} units
                  </strong>
                </p>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Audit Reason / Source
                </label>
                <input
                  type="text"
                  value={stockActionReason}
                  onChange={(e) => setStockActionReason(e.target.value)}
                  placeholder="e.g. Physical inventory count verified"
                  className="w-full rounded-xl border border-stone-200 px-4 py-2 text-xs focus:border-[#064E3B] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowStockModal(false)}
                className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteStockAdjustment}
                className="px-5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#0B3D2E] text-white text-xs font-bold shadow-md uppercase tracking-wider"
              >
                Set Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
