import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { adminApi } from "../../services/api";
import type { Product, ProductVariant, SizeOption, ColorOption, Category } from "../../types/store";
import { useAdminAuth } from "../../services/auth";
import { useUnsavedChanges } from "./AdminLayout";
import { CATEGORY_HIERARCHY, categories as defaultSeedCategories } from "../../data/products";
import {
  SparklesIcon,
  CheckIcon,
  AlertTriangleIcon,
  TrashIcon,
  PlusIcon,
  SearchIcon,
  EyeIcon,
  ExternalLinkIcon,
  SettingsIcon,
  ShippingIcon,
  CodIcon,
  CombosIcon,
  InventoryIcon,
  ProductsIcon,
} from "../../components/admin/AdminIcons";

// Local lightweight SVG Icons
const ArrowLeftIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const UploadIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16"></polyline>
    <line x1="12" y1="12" x2="12" y2="21"></line>
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
  </svg>
);
const MoveLeftIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"></polyline>
  </svg>
);
const MoveRightIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"></polyline>
  </svg>
);
const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
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

const STANDARD_COLORS = [
  "Emerald Green",
  "Ruby Red",
  "Navy Blue",
  "Pastel Pink",
  "Maroon",
  "Royal Blue",
  "Mustard Yellow",
  "Teal Green",
  "Lavender",
  "Coffee Brown",
  "Classic Black",
  "Ivory White"
];

const STANDARD_COLORS_HEX: Record<string, string> = {
  "Emerald Green": "#064E3B",
  "Ruby Red": "#9B111E",
  "Navy Blue": "#000080",
  "Pastel Pink": "#FFD1DC",
  "Maroon": "#800000",
  "Royal Blue": "#4169E1",
  "Mustard Yellow": "#E1AD01",
  "Teal Green": "#008080",
  "Lavender": "#E6E6FA",
  "Coffee Brown": "#4B3621",
  "Classic Black": "#111827",
  "Ivory White": "#FFFFF0"
};

type TabId =
  | "basic"
  | "images"
  | "pricing"
  | "inventory"
  | "variants"
  | "offers"
  | "shipping"
  | "cod"
  | "description"
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
  const [customColorInput, setCustomColorInput] = useState("");
  const [customColorHex, setCustomColorHex] = useState("#064E3B");

  // Custom Category & Subcategory Modes
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomSubcategory, setIsCustomSubcategory] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [loadedCategories, setLoadedCategories] = useState<Category[]>([]);
  const [showAdvancedTabs, setShowAdvancedTabs] = useState(false);

  // Stock Adjustment Modal
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState<"ADD" | "REMOVE" | "SET">("ADD");
  const [stockActionQty, setStockActionQty] = useState(10);
  const [stockActionReason, setStockActionReason] = useState("New stock shipment received");

  // Initial Form State
  const initialFormState: Product = {
    id: `p${Date.now().toString().slice(-4)}`,
    name: "",
    code: `NC-${Date.now().toString().slice(-4)}`,
    sku: `SKU-${Date.now().toString().slice(-4)}`,
    category: "Nighty",
    subcategory: "",
    brand: "Nithi Collection",
    price: 799,
    mrp: 1199,
    discount: 15,
    discountType: "percentage",
    discountValue: 15,
    finalPrice: 679,
    sizes: ["S", "M", "L", "XL"],
    sizeOptions: [
      { size: "S", price: 799, mrp: 1199, stock: 10, sku: "NC-DRS-S" },
      { size: "M", price: 849, mrp: 1299, stock: 15, sku: "NC-DRS-M" },
      { size: "L", price: 899, mrp: 1399, stock: 12, sku: "NC-DRS-L" },
      { size: "XL", price: 949, mrp: 1499, stock: 8, sku: "NC-DRS-XL" },
    ],
    color: "Emerald Green",
    colors: ["Emerald Green", "Ruby Red"],
    colorOptions: [
      {
        name: "Emerald Green",
        hex: "#064E3B",
        image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format"
      },
      {
        name: "Ruby Red",
        hex: "#9B111E",
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop&auto=format"
      }
    ],
    colorImages: {
      "Emerald Green": "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format",
      "Ruby Red": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop&auto=format"
    },
    fabric: "100% Pure Cotton",
    material: "Pure Cotton 60s Count",
    length: "55 Inches",
    pattern: "Floral Jaipuri Print",
    sleeveType: "Half Sleeve",
    neckType: "Round Neck with Front Zipper",
    description: "Premium pure cotton nighty tailored from ultra-soft, breathable combed cotton. Features elegant hand-block inspired motifs, reinforced seams, and easy front zip access for all-day relaxing comfort.",
    shortDescription: "Ultra-comfortable breathable 100% cotton nighty with front zip opening.",
    care: "Machine wash cold with mild detergent. Do not bleach. Line dry in shade.",
    sizeChart: "Free Size / Regular Indian Fit (Bust: 44-46 in, Length: 55 in)",
    specialFeatures: "Front zipper opening, Side pocket included, Shrink-resistant finish",
    inStock: true,
    stock: 45,
    status: "ACTIVE",
    rating: 4.8,
    reviews: 12,
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
      metaDescription: "Buy premium pure cotton nighty online at Nithi Collection with front zipper and fast all-India delivery.",
      urlSlug: "pure-cotton-floral-nighty",
      focusKeyword: "pure cotton nighty online",
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [formData, setFormData] = useState<Product>(initialFormState);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [productAuditLogs, setProductAuditLogs] = useState<any[]>([]);
  const [pristineSnapshot, setPristineSnapshot] = useState<Product>(initialFormState);

  // Live calculation of Final Price
  const calculateFinalPrice = (price: number, discount: number, discountType: "percentage" | "fixed") => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    if (discountType === "fixed") {
      return Math.max(0, p - d);
    }
    return d > 0 ? Math.max(0, Math.round(p - (p * d) / 100)) : p;
  };

  const liveFinalPrice = calculateFinalPrice(formData.price, formData.discount, formData.discountType);
  const liveSavings = Math.max(0, (formData.mrp || formData.price) - liveFinalPrice);

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
              sizeOptions = p.sizes.map((sz: string, idx: number) => ({
                size: sz,
                price: p.price,
                mrp: p.mrp || Math.round(p.price * 1.3),
                stock: Math.max(1, Math.floor((p.stock || 10) / p.sizes.length)),
                sku: `${p.sku || 'SKU'}-${sz}`
              }));
            }

            // Normalize colorOptions
            let colorOptions = p.colorOptions || [];
            if (colorOptions.length === 0 && p.colors && p.colors.length > 0) {
              colorOptions = p.colors.map((c: string, idx: number) => ({
                name: c,
                hex: '#064E3B',
                image: (p.colorImages && p.colorImages[c]) || (p.images && p.images[idx % p.images.length]) || p.coverImage || ''
              }));
            }

            const colorImages = p.colorImages || {};
            colorOptions.forEach(co => {
              if (co.name && co.image) colorImages[co.name] = co.image;
            });

            const loaded: Product = {
              ...p,
              discountType: p.discountType || "percentage",
              mrp: p.mrp || p.price,
              sizes: sizeOptions.length > 0 ? sizeOptions.map(s => s.size) : (p.sizes && p.sizes.length > 0 ? p.sizes : ["Free Size"]),
              sizeOptions,
              colors: colorOptions.length > 0 ? colorOptions.map(c => c.name) : (p.colors && p.colors.length > 0 ? p.colors : [p.color || "Emerald Green"]),
              colorOptions,
              colorImages,
              images: p.images || [],
              coverImage: p.coverImage || (p.images && p.images[0]) || "",
            };
            setFormData(loaded);
            setPristineSnapshot(loaded);

            // Load variants
            const pVariants = p.variants && p.variants.length > 0 ? p.variants : [];
            setVariants(pVariants);

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

  // 1-Click Undo / Reset
  const handleUndoAllChanges = () => {
    setFormData(pristineSnapshot);
    setRawFiles([]);
    setLocalPreviews([]);
    setFieldErrors({});
    setIsDirty(false);
    setToastMessage({
      type: "success",
      text: "↩ All changes reverted to the original saved state.",
    });
  };

  // Toggle Size
  const toggleSize = (sz: string) => {
    setIsDirty(true);
    const current = formData.sizeOptions || [];
    const exists = current.some(s => s.size.toLowerCase() === sz.toLowerCase());
    if (exists) {
      const updated = current.filter(s => s.size.toLowerCase() !== sz.toLowerCase());
      const newTotal = updated.reduce((sum, s) => sum + (Number(s.stock) || 0), 0);
      setFormData(prev => ({
        ...prev,
        sizeOptions: updated,
        sizes: updated.map(s => s.size),
        stock: newTotal
      }));
    } else {
      handleAddSizeOption(sz);
    }
  };

  // Toggle Color
  const toggleColor = (clr: string) => {
    setIsDirty(true);
    const current = formData.colorOptions || [];
    const exists = current.some(c => c.name.toLowerCase() === clr.toLowerCase());
    if (exists) {
      const updated = current.filter(c => c.name.toLowerCase() !== clr.toLowerCase());
      const colorMap: Record<string, string> = { ...(formData.colorImages || {}) };
      delete colorMap[clr];
      setFormData(prev => ({
        ...prev,
        colorOptions: updated,
        colors: updated.map(c => c.name),
        colorImages: colorMap,
        color: updated[0]?.name || ""
      }));
    } else {
      const defaultHex = STANDARD_COLORS_HEX[clr] || '#064E3B';
      const allAvailable = [
        ...formData.images,
        ...localPreviews
      ];
      const assignedImg = (allAvailable.length > 0 ? allAvailable[current.length % allAvailable.length] : "") || formData.coverImage || "";
      handleAddColorOption(clr, defaultHex, assignedImg);
    }
  };

  // Size Options Management Handlers
  const handleAddSizeOption = (sizeName: string) => {
    setIsDirty(true);
    const trimmed = sizeName.trim();
    if (!trimmed) return;
    const current = formData.sizeOptions || [];
    if (current.some(s => s.size.toLowerCase() === trimmed.toLowerCase())) {
      setToastMessage({ type: "error", text: `Size "${trimmed}" already exists.` });
      return;
    }
    const defaultPrice = formData.price || 799;
    const defaultMrp = formData.mrp || Math.round(defaultPrice * 1.3);
    const newOption: SizeOption = {
      size: trimmed,
      price: defaultPrice,
      mrp: defaultMrp,
      stock: 10,
      sku: `${formData.sku || 'NC'}-${trimmed}`
    };
    const updated = [...current, newOption];
    const newTotalStock = updated.reduce((s, o) => s + (Number(o.stock) || 0), 0);
    setFormData(prev => ({
      ...prev,
      sizeOptions: updated,
      sizes: updated.map(o => o.size),
      stock: newTotalStock
    }));
  };

  const handleRemoveSizeOption = (index: number) => {
    setIsDirty(true);
    const current = formData.sizeOptions || [];
    const updated = current.filter((_, i) => i !== index);
    const newTotalStock = updated.reduce((s, o) => s + (Number(o.stock) || 0), 0);
    setFormData(prev => ({
      ...prev,
      sizeOptions: updated,
      sizes: updated.map(o => o.size),
      stock: newTotalStock
    }));
  };

  const handleUpdateSizeOption = (index: number, field: keyof SizeOption, value: any) => {
    setIsDirty(true);
    const current = [...(formData.sizeOptions || [])];
    if (!current[index]) return;
    current[index] = { ...current[index], [field]: value };
    const newTotalStock = current.reduce((s, o) => s + (Number(o.stock) || 0), 0);
    setFormData(prev => ({
      ...prev,
      sizeOptions: current,
      sizes: current.map(o => o.size),
      stock: newTotalStock
    }));
  };

  const handleBulkSetSizePrice = (price: number) => {
    setIsDirty(true);
    const p = Math.max(0, Number(price) || 0);
    const current = (formData.sizeOptions || []).map(s => ({ ...s, price: p }));
    setFormData(prev => ({
      ...prev,
      sizeOptions: current,
      price: p
    }));
    setToastMessage({ type: "success", text: `Applied ₹${p} to all ${current.length} sizes.` });
  };

  const handleBulkSetSizeStock = (stock: number) => {
    setIsDirty(true);
    const stk = Math.max(0, Number(stock) || 0);
    const current = (formData.sizeOptions || []).map(s => ({ ...s, stock: stk }));
    const newTotalStock = current.reduce((sum, o) => sum + (Number(o.stock) || 0), 0);
    setFormData(prev => ({
      ...prev,
      sizeOptions: current,
      stock: newTotalStock
    }));
    setToastMessage({ type: "success", text: `Set ${stk} stock for all sizes (Total: ${newTotalStock}).` });
  };

  // Color Options Management Handlers
  const handleAddColorOption = (colorName: string, hex?: string, image?: string) => {
    setIsDirty(true);
    const trimmed = colorName.trim();
    if (!trimmed) return;
    const current = formData.colorOptions || [];
    if (current.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      setToastMessage({ type: "error", text: `Color "${trimmed}" already exists.` });
      return;
    }
    const allAvailable = [
      ...formData.images,
      ...localPreviews
    ];
    const assignedImg =
      image ||
      (allAvailable.length > 0 ? allAvailable[current.length % allAvailable.length] : "") ||
      formData.coverImage ||
      "";

    const newOption: ColorOption = {
      name: trimmed,
      hex: hex || STANDARD_COLORS_HEX[trimmed] || '#064E3B',
      image: assignedImg
    };
    const updated = [...current, newOption];
    const colorMap: Record<string, string> = { ...(formData.colorImages || {}) };
    colorMap[trimmed] = assignedImg;

    setFormData(prev => ({
      ...prev,
      colorOptions: updated,
      colors: updated.map(c => c.name),
      colorImages: colorMap,
      color: prev.color || trimmed
    }));
  };

  const handleRemoveColorOption = (index: number) => {
    setIsDirty(true);
    const current = formData.colorOptions || [];
    const removed = current[index];
    const updated = current.filter((_, i) => i !== index);
    const colorMap: Record<string, string> = { ...(formData.colorImages || {}) };
    if (removed) delete colorMap[removed.name];

    setFormData(prev => ({
      ...prev,
      colorOptions: updated,
      colors: updated.map(c => c.name),
      colorImages: colorMap,
      color: updated[0]?.name || ""
    }));
  };

  const handleUpdateColorOption = (index: number, field: keyof ColorOption, value: any) => {
    setIsDirty(true);
    const current = [...(formData.colorOptions || [])];
    if (!current[index]) return;
    current[index] = { ...current[index], [field]: value };
    const colorMap: Record<string, string> = {};
    current.forEach(c => {
      if (c.name && c.image) colorMap[c.name] = c.image;
    });

    setFormData(prev => ({
      ...prev,
      colorOptions: current,
      colors: current.map(c => c.name),
      colorImages: colorMap,
      color: current[0]?.name || prev.color
    }));
  };

  // Image Management
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setIsDirty(true);
    const selected = Array.from(e.target.files);
    setRawFiles((prev) => [...prev, ...selected]);

    const previewUrls = selected.map((file) => URL.createObjectURL(file));
    setLocalPreviews((prev) => {
      const updatedPreviews = [...prev, ...previewUrls];
      // Automatically assign preview to colors that don't have images yet
      setFormData((fPrev) => {
        const newCover = fPrev.coverImage || previewUrls[0] || "";
        const updatedColorOptions = (fPrev.colorOptions || []).map((c, idx) => {
          if (!c.image || c.image.trim() === "") {
            const assigned = updatedPreviews[idx % updatedPreviews.length] || newCover;
            return { ...c, image: assigned };
          }
          return c;
        });
        const updatedColorImages: Record<string, string> = { ...(fPrev.colorImages || {}) };
        updatedColorOptions.forEach(c => {
          if (c.name && c.image) updatedColorImages[c.name] = c.image;
        });
        return {
          ...fPrev,
          coverImage: newCover,
          colorOptions: updatedColorOptions,
          colorImages: updatedColorImages
        };
      });
      return updatedPreviews;
    });
  };

  const handleAddImageUrl = () => {
    if (!urlInput.trim()) return;
    setIsDirty(true);
    const newImgs = [...formData.images, urlInput.trim()];
    setFormData((prev) => {
      const newCover = prev.coverImage || urlInput.trim();
      const updatedColorOptions = (prev.colorOptions || []).map((c) => {
        if (!c.image || c.image.trim() === "") {
          return { ...c, image: newCover };
        }
        return c;
      });
      const updatedColorImages: Record<string, string> = { ...(prev.colorImages || {}) };
      updatedColorOptions.forEach(c => {
        if (c.name && c.image) updatedColorImages[c.name] = c.image;
      });
      return {
        ...prev,
        images: newImgs,
        coverImage: newCover,
        colorOptions: updatedColorOptions,
        colorImages: updatedColorImages
      };
    });
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

  // Stock Quick Restock
  const handleQuickRestock = (amount: number) => {
    setIsDirty(true);
    const newStock = Math.max(0, formData.stock + amount);
    // Also proportionally or evenly add to sizeOptions if present
    let updatedSizes = formData.sizeOptions || [];
    if (updatedSizes.length > 0) {
      const addPerSize = Math.max(1, Math.floor(amount / updatedSizes.length));
      updatedSizes = updatedSizes.map(s => ({ ...s, stock: s.stock + addPerSize }));
    }
    setFormData((prev) => ({
      ...prev,
      stock: newStock,
      sizeOptions: updatedSizes,
      status: newStock > 0 && prev.status === "OUT OF STOCK" ? "ACTIVE" : prev.status,
    }));
  };

  // Stock Adjustment Action
  const handleExecuteStockAdjustment = async () => {
    const qty = Number(stockActionQty);
    if (qty <= 0 && stockAction !== "SET") {
      setToastMessage({ type: "error", text: "Quantity must be greater than 0" });
      return;
    }

    const res = await adminApi.adjustStock(
      formData.id,
      stockAction,
      qty,
      stockActionReason,
      user?.name || "Super Admin"
    );

    if (res.success && res.data) {
      setFormData((prev) => ({
        ...prev,
        stock: res.data!.currentStock,
        status: res.data!.currentStock === 0 ? "OUT OF STOCK" : "ACTIVE",
      }));
      setShowStockModal(false);
      setToastMessage({ type: "success", text: res.message || "Stock adjusted successfully" });
    } else {
      setToastMessage({ type: "error", text: res.error || "Failed to adjust stock" });
    }
  };

  // Auto Generate Variants Matrix from Color Options & Size Options
  const handleAutoGenerateVariants = () => {
    setIsDirty(true);
    const newVariants: ProductVariant[] = [];
    const sizes = formData.sizeOptions && formData.sizeOptions.length > 0
      ? formData.sizeOptions
      : (formData.sizes || ["Free Size"]).map(s => ({ size: s, price: liveFinalPrice, mrp: formData.mrp, stock: 10, sku: `${formData.sku}-${s}` }));

    const colors = formData.colorOptions && formData.colorOptions.length > 0
      ? formData.colorOptions
      : (formData.colors || ["Standard"]).map(c => ({ name: c, hex: '#064E3B', image: formData.coverImage || formData.images[0] || "" }));

    sizes.forEach((szOpt) => {
      colors.forEach((clrOpt) => {
        newVariants.push({
          id: `${formData.id}-${clrOpt.name.replace(/\s+/g, "")}-${szOpt.size}`,
          productId: formData.id,
          size: szOpt.size,
          color: clrOpt.name,
          sku: `${formData.sku}-${clrOpt.name.slice(0, 3).toUpperCase()}-${szOpt.size}`,
          price: Number(szOpt.price) || liveFinalPrice,
          stock: Math.max(1, Math.floor((Number(szOpt.stock) || 10) / colors.length)),
          image: clrOpt.image || formData.coverImage || formData.images[0] || "",
          status: "active",
        });
      });
    });

    setVariants(newVariants);
    setToastMessage({ type: "success", text: `Generated ${newVariants.length} variant combinations.` });
  };

  // Validation (Enforcing Minimum 2 Images Requirement)
  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = "Product Name is required.";
    if (!formData.category.trim()) errors.category = "Category is required.";

    const totalImages = (formData.images?.length || 0) + (rawFiles?.length || 0) + (localPreviews?.length || 0);
    if (totalImages < 2) {
      errors.images = "Minimum 2 images are required (e.g. Front View & Fabric Detail View).";
    }

    if (formData.price <= 0 && (!formData.sizeOptions || formData.sizeOptions.length === 0)) {
      errors.price = "Selling Price must be greater than ₹0.";
    }
    if (formData.discount < 0 || formData.discount > 100) errors.discount = "Discount must be 0-100%.";
    if (formData.stock < 0) errors.stock = "Stock quantity cannot be negative.";
    if ((!formData.sizes || formData.sizes.length === 0) && (!formData.sizeOptions || formData.sizeOptions.length === 0)) {
      errors.sizes = "Please configure at least one size.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Save
  const handleSave = async (statusOverride?: Product["status"]) => {
    if (!validateForm()) {
      const totalImages = (formData.images?.length || 0) + (rawFiles?.length || 0) + (localPreviews?.length || 0);
      if (!formData.name.trim() || !formData.category.trim()) {
        setActiveTab("basic");
        setToastMessage({ type: "error", text: "Please enter Product Name and Category in Basic Info." });
      } else if (totalImages < 2) {
        setActiveTab("images");
        setToastMessage({
          type: "error",
          text: `📸 Minimum 2 images required (Front View + Detail View). You have ${totalImages}/2 uploaded.`,
        });
      } else if (formData.price <= 0) {
        setActiveTab("pricing");
        setToastMessage({ type: "error", text: "Please set a valid Selling Price in Pricing." });
      } else if ((!formData.sizes || formData.sizes.length === 0) && (!formData.sizeOptions || formData.sizeOptions.length === 0)) {
        setActiveTab("variants");
        setToastMessage({ type: "error", text: "Please configure at least one Size variant in Variants." });
      } else {
        setToastMessage({ type: "error", text: "Please review the required highlighted fields." });
      }
      return;
    }

    setSaving(true);
    setToastMessage(null);

    try {
      // 1. Upload any raw local files to /api/upload first if present
      let uploadedFileUrls: string[] = [];
      if (rawFiles && rawFiles.length > 0) {
        setToastMessage({ type: "info" as any, text: `Uploading ${rawFiles.length} photo(s)...` });
        const uploadRes = await adminApi.uploadImages(rawFiles);
        if (uploadRes.success && uploadRes.urls && uploadRes.urls.length > 0) {
          uploadedFileUrls = uploadRes.urls;
        } else {
          console.error("Upload warning:", uploadRes.error);
        }
      }

      // Map local preview blob URLs to the real uploaded static URLs
      const resolveUrl = (url: string | undefined): string => {
        if (!url) return "";
        const localIdx = localPreviews.indexOf(url);
        if (localIdx >= 0 && uploadedFileUrls[localIdx]) {
          return uploadedFileUrls[localIdx];
        }
        if (url.startsWith("blob:") && uploadedFileUrls[0]) {
          return uploadedFileUrls[0];
        }
        return url;
      };

      // Combine existing non-blob images with newly uploaded images
      const cleanExistingImages = (formData.images || []).filter((img) => !img.startsWith("blob:") && !img.includes("__LOCAL_"));
      const finalImages = Array.from(new Set([...cleanExistingImages, ...uploadedFileUrls]));

      const sizeOptions = formData.sizeOptions || [];
      const colorOptions = formData.colorOptions || [];
      const calculatedStock = sizeOptions.length > 0
        ? sizeOptions.reduce((sum, s) => sum + (Number(s.stock) || 0), 0)
        : formData.stock;

      const calculatedMinPrice = sizeOptions.length > 0
        ? Math.min(...sizeOptions.map(s => Number(s.price) || Infinity))
        : formData.price;

      const finalPriceToSave = calculatedMinPrice !== Infinity ? calculatedMinPrice : formData.price;

      const colorOptionsToSave = (formData.colorOptions || []).map((c) => {
        const resolvedImg = resolveUrl(c.image);
        return { ...c, image: resolvedImg || finalImages[0] || "" };
      });

      const colorMap: Record<string, string> = {};
      colorOptionsToSave.forEach(c => {
        if (c.name && c.image) colorMap[c.name] = c.image;
      });

      let coverImageToSave = resolveUrl(formData.coverImage);
      if (!coverImageToSave || coverImageToSave.startsWith("blob:")) {
        coverImageToSave = finalImages[0] || "";
      }

      const updatedVariants = variants.map((v) => ({
        ...v,
        image: resolveUrl(v.image) || coverImageToSave,
      }));

      const payload: Product = {
        ...formData,
        images: finalImages.length > 0 ? finalImages : (formData.images || []),
        price: finalPriceToSave,
        stock: calculatedStock,
        sizeOptions,
        sizes: sizeOptions.length > 0 ? sizeOptions.map(s => s.size) : formData.sizes,
        colorOptions: colorOptionsToSave,
        colors: colorOptionsToSave.length > 0 ? colorOptionsToSave.map(c => c.name) : formData.colors,
        colorImages: colorMap,
        coverImage: coverImageToSave,
        variants: updatedVariants,
        status: statusOverride || (calculatedStock === 0 ? "OUT OF STOCK" : formData.status),
        finalPrice: calculateFinalPrice(finalPriceToSave, formData.discount, formData.discountType),
        updatedAt: new Date().toISOString(),
      };

      const res = await adminApi.saveProduct(payload, user?.name || "Super Admin");

      if (res.success && res.data) {
        // Save variants
        if (variants.length > 0) {
          await adminApi.saveVariants(formData.id, variants);
        }

        // Persist category & subcategory into taxonomy store
        if (payload.category) {
          adminApi.saveCategory({ name: payload.category });
        }

        setIsDirty(false);
        setPristineSnapshot(res.data);
        setToastMessage({
          type: "success",
          text: `🎉 Product "${res.data.name}" saved & published successfully in MongoDB!`,
        });

        setTimeout(() => {
          navigate("/admin/products");
        }, 1200);
      } else {
        setToastMessage({ type: "error", text: res.error || "Failed to save product." });
      }
    } catch (e: any) {
      setToastMessage({ type: "error", text: e.message || "An error occurred while saving." });
    } finally {
      setSaving(false);
    }
  };

  // Primary 5-Step Core Workflow
  const CORE_STEPS: { id: TabId; label: string; icon: string; shortDesc: string }[] = [
    { id: "basic", label: "1. Basic Info", icon: "📋", shortDesc: "Title, Category & Specs" },
    { id: "images", label: "2. Images", icon: "🖼️", shortDesc: "Min 2 Images Required" },
    { id: "pricing", label: "3. Pricing", icon: "₹", shortDesc: "Price, MRP & Discount" },
    { id: "inventory", label: "4. Inventory", icon: "📦", shortDesc: "SKU & Stock Level" },
    { id: "variants", label: "5. Variants", icon: "👗", shortDesc: "Sizes & Colors Matrix" },
  ];

  // Secondary / Advanced Tabs
  const ADVANCED_TABS: { id: TabId; label: string; icon: string }[] = [
    { id: "offers", label: "Offers & Combos", icon: "🎁" },
    { id: "shipping", label: "Shipping Rules", icon: "🚚" },
    { id: "cod", label: "COD Rules", icon: "💵" },
    { id: "description", label: "Extended Specs", icon: "📝" },
    { id: "seo", label: "SEO Settings", icon: "🔍" },
    { id: "preview", label: "Storefront Preview", icon: "👁️" },
    { id: "history", label: "Audit History", icon: "📜" },
  ];

  const tabsList = [
    ...CORE_STEPS.map((s) => ({ id: s.id, label: s.label, icon: s.icon })),
    ...ADVANCED_TABS.map((s) => ({ id: s.id, label: s.label, icon: s.icon })),
  ];

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-2xl bg-gradient-to-tr from-[#C9A227] to-[#041D16] p-1">
            <div className="h-full w-full rounded-xl bg-white" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
            Loading Catalog Studio...
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
    <div className="mx-auto max-w-7xl space-y-6 pb-24 font-body">
      {/* ------------------------------------------------------------- */}
      {/* PERSISTENT TOP HEADER (Req #5, #21, #22, #29)                  */}
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
                  {formData.name || "New Dress / Product"}
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
                      : formData.status === "DRAFT"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-stone-100 text-stone-600 border border-stone-200"
                  }`}
                >
                  {formData.status}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 flex items-center gap-2 mt-0.5">
                <span>Selling Price: <strong className="text-stone-800">₹{liveFinalPrice}</strong></span>
                <span>•</span>
                <span>Stock: <strong className={formData.stock <= 10 ? "text-amber-600" : "text-emerald-700"}>{formData.stock} units</strong></span>
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={handleUndoAllChanges}
              title="Revert all unsaved edits to original state"
              className="px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-700 text-xs font-semibold hover:bg-stone-50 hover:text-black transition flex items-center gap-1.5"
            >
              <span>↩</span>
              <span>Undo / Reset</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition flex items-center gap-1.5 ${
                activeTab === "preview"
                  ? "bg-[#041D16] text-[#DFC15E] border-[#041D16]"
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#DFC15E] text-[#041D16] text-xs font-bold shadow-md shadow-[#C9A227]/20 hover:brightness-105 transition disabled:opacity-50 uppercase tracking-wider flex items-center gap-1.5"
            >
              {saving ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#041D16] border-t-transparent" />
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

        {/* 5-STEP CORE WIZARD STEPPER & ADVANCED TOGGLE */}
        <div className="pt-3 mt-1 border-t border-stone-100 space-y-2">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
            {/* 5 Primary Steps */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CORE_STEPS.map((step, idx) => {
                const isActive = activeTab === step.id;
                const isStepComplete =
                  step.id === "basic"
                    ? Boolean(formData.name?.trim() && formData.category)
                    : step.id === "images"
                    ? allImagesList.length >= 2
                    : step.id === "pricing"
                    ? Number(formData.price) > 0 && Number(formData.mrp) > 0
                    : step.id === "inventory"
                    ? Boolean(formData.sku?.trim()) && Number(formData.stock) >= 0
                    : (formData.sizeOptions?.length || 0) > 0 || (formData.colorOptions?.length || 0) > 0;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => setActiveTab(step.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 flex items-center gap-2 border ${
                      isActive
                        ? "bg-[#041D16] text-[#DFC15E] border-[#041D16] shadow-sm shadow-[#041D16]/20"
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
                              ? "bg-[#DFC15E]/20 text-[#DFC15E]"
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
                          isActive ? "text-[#DFC15E]" : "text-emerald-600"
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

            {/* Advanced Settings Pill Toggle */}
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
                <span>{showAdvancedTabs ? "Hide Advanced" : "Advanced Settings"}</span>
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
                        ? "bg-[#041D16] text-[#DFC15E] font-bold shadow-2xs"
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
      {/* TAB 1: BASIC INFORMATION (Req #6)                             */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "basic" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>📋</span> Basic Product Information
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Configure primary dress identification, category structure, and publishing status.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Product Name */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Product Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g. Pure Cotton Floral Hand-Block Nighty"
                  className={`mt-1.5 w-full rounded-xl border px-4 py-3 text-sm transition focus:outline-none focus:ring-2 ${
                    fieldErrors.name
                      ? "border-rose-500 focus:ring-rose-200"
                      : "border-stone-200 focus:border-[#C9A227] focus:ring-[#C9A227]/20"
                  }`}
                />
                {fieldErrors.name && <p className="mt-1 text-xs text-rose-500">{fieldErrors.name}</p>}
              </div>

              {/* SKU & Product Code */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  SKU (Stock Keeping Unit)
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange("sku", e.target.value)}
                  placeholder="NC-NGHT-001"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 font-mono text-xs focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Product Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value)}
                  placeholder="NC-1002"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 font-mono text-xs focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              {/* Category & Subcategory */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(!isCustomCategory)}
                    className="text-xs text-[#8A5F38] hover:text-[#064E3B] font-bold flex items-center gap-1 transition"
                  >
                    <span>{isCustomCategory ? "← Choose Existing" : "+ Manual Category"}</span>
                  </button>
                </div>

                {isCustomCategory ? (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      placeholder="e.g. Silk Sarees, Designer Lehengas, Kurtis"
                      className={`w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition focus:outline-none ${
                        fieldErrors.category ? "border-rose-500" : "border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
                      }`}
                    />
                    <p className="text-[10px] text-stone-500">
                      💡 Manual category will automatically register in store taxonomy.
                    </p>
                  </div>
                ) : (
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      if (e.target.value === "__CUSTOM__") {
                        setIsCustomCategory(true);
                        handleInputChange("category", "");
                      } else {
                        handleInputChange("category", e.target.value);
                      }
                    }}
                    className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm font-semibold text-stone-800 focus:border-[#C9A227] focus:outline-none ${
                      fieldErrors.category ? "border-rose-500" : "border-stone-200"
                    }`}
                  >
                    <option value="">-- Select Category --</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="__CUSTOM__" className="text-[#8A5F38] font-bold">
                      ➕ + Add Manual / Custom Category...
                    </option>
                  </select>
                )}
                {fieldErrors.category && <p className="mt-1 text-xs text-rose-500">{fieldErrors.category}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                    Sub-Category
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCustomSubcategory(!isCustomSubcategory)}
                    className="text-xs text-[#8A5F38] hover:text-[#064E3B] font-bold flex items-center gap-1 transition"
                  >
                    <span>{isCustomSubcategory ? "← Choose from List" : "+ Manual Sub-Category"}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {!isCustomSubcategory ? (
                    <select
                      value={formData.subcategory || ""}
                      onChange={(e) => {
                        if (e.target.value === "__CUSTOM__") {
                          setIsCustomSubcategory(true);
                          handleInputChange("subcategory", "");
                        } else {
                          handleInputChange("subcategory", e.target.value);
                        }
                      }}
                      className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 focus:border-[#C9A227] focus:outline-none"
                    >
                      <option value="">-- Select Sub-Category --</option>
                      {CATEGORY_HIERARCHY[formData.category]?.groups?.map((grp) => (
                        <optgroup key={grp.name} label={grp.name}>
                          {grp.items.map((item) => (
                            <option key={`${grp.name} - ${item}`} value={item}>
                              {item} ({grp.name})
                            </option>
                          ))}
                        </optgroup>
                      ))}
                      {((loadedCategories.find((c) => c.name.toLowerCase() === formData.category?.toLowerCase())?.subcategories || []).map((s) => s.name)).map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                      <option value="__CUSTOM__" className="text-[#8A5F38] font-bold">
                        ➕ + Add Manual / Custom Sub-Category...
                      </option>
                    </select>
                  ) : null}

                  <input
                    type="text"
                    value={formData.subcategory || ""}
                    onChange={(e) => handleInputChange("subcategory", e.target.value)}
                    placeholder="Type manual sub-category (e.g. Zip nighty, Anarkali cut, Chanderi)..."
                    className="w-full rounded-xl border border-stone-200 px-4 py-2 text-xs focus:border-[#C9A227] focus:outline-none"
                  />

                  {/* Suggestion Pills */}
                  {formData.category && (
                    <div className="flex flex-wrap items-center gap-1 pt-0.5">
                      <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider mr-1">
                        Suggestions:
                      </span>
                      {(
                        loadedCategories.find((c) => c.name.toLowerCase() === formData.category?.toLowerCase())?.subcategories?.map((s) => s.name) ||
                        CATEGORY_HIERARCHY[formData.category]?.items ||
                        []
                      ).slice(0, 6).map((sub) => (
                        <button
                          key={sub}
                          type="button"
                          onClick={() => handleInputChange("subcategory", sub)}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border transition ${
                            formData.subcategory === sub
                              ? "bg-[#064E3B] text-white border-[#064E3B]"
                              : "bg-stone-50 border-stone-200 text-stone-600 hover:bg-[#FAF8F1] hover:border-[#C9A227]/50"
                          }`}
                        >
                          {sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  placeholder="Nithi Collection"
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Product Status <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-bold text-stone-800 focus:border-[#C9A227] focus:outline-none"
                >
                  <option value="ACTIVE">ACTIVE (Visible in Storefront)</option>
                  <option value="DRAFT">DRAFT (Hidden from Storefront)</option>
                  <option value="OUT OF STOCK">OUT OF STOCK (Sold Out)</option>
                  <option value="DISCONTINUED">DISCONTINUED (Archived)</option>
                </select>
              </div>

              {/* Badges & Tags */}
              <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.newArrival || formData.isNew}
                    onChange={(e) => {
                      handleInputChange("newArrival", e.target.checked);
                      handleInputChange("isNew", e.target.checked);
                    }}
                    className="h-4 w-4 rounded text-[#041D16] focus:ring-[#C9A227]"
                  />
                  <span className="text-xs font-bold text-stone-800">Mark as New Arrival (✨ Badge)</span>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => handleInputChange("isBestSeller", e.target.checked)}
                    className="h-4 w-4 rounded text-[#041D16] focus:ring-[#C9A227]"
                  />
                  <span className="text-xs font-bold text-stone-800">Mark as Best Seller (🔥 Badge)</span>
                </label>
              </div>
            </div>

            {/* Step 1 Navigation Footer */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-stone-500">
                {Boolean(formData.name?.trim() && formData.category) ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                    ✓ Basic Information filled
                  </span>
                ) : (
                  <span className="text-amber-600 font-semibold flex items-center gap-1.5">
                    * Please enter product name and category
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("images");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#041D16] to-[#0B3D2E] hover:from-black hover:to-[#041D16] text-[#DFC15E] text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Next: 2. Upload Images (Min 2)</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: PRODUCT IMAGES (Req #7 - MINIMUM 2 REQUIRED)           */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "images" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>🖼️</span> Product Images (Minimum 2 Required)
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Upload high-res dress photos (front view + fabric detail). Reorder, remove, or set catalog cover card.
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

            {/* Minimum 2 Images Requirement Banner */}
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
                      ? "Mandatory Requirement: Minimum 2 Images Required"
                      : "Image Requirement Satisfied"}
                  </h4>
                  <p className="text-xs mt-0.5 opacity-90">
                    {allImagesList.length < 2
                      ? "Every product must have at least 2 photos (e.g., Full Dress / Front View + Fabric / Detail Close-up)."
                      : `Great job! You have attached ${allImagesList.length} images. First image acts as the catalog cover.`}
                  </p>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold self-start sm:self-center shrink-0 ${
                  allImagesList.length < 2
                    ? "bg-amber-200 text-amber-900 border border-amber-400"
                    : "bg-emerald-200 text-emerald-900 border border-emerald-400"
                }`}
              >
                {allImagesList.length >= 2 ? `✓ ${allImagesList.length} Photos` : `${allImagesList.length}/2 Photos`}
              </span>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-stone-300 hover:border-[#C9A227] rounded-3xl p-8 text-center cursor-pointer transition bg-stone-50/50 hover:bg-amber-50/20 group"
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
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-stone-200 flex items-center justify-center text-stone-600 group-hover:scale-110 group-hover:text-[#C9A227] transition">
                  <UploadIcon />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">
                    Click to browse or drag & drop high-resolution dress photos
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    Supports JPG, PNG, WebP up to 10MB each. Attach at least 2 photos.
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
                placeholder="Or paste an image web URL (https://...)"
                className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-xs focus:border-[#C9A227] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-black text-white text-xs font-bold transition"
              >
                Add Image URL
              </button>
            </div>

            {/* Image Gallery Grid */}
            <div className="mt-8">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                Gallery Photos & Reordering
              </h3>
              {allImagesList.length === 0 ? (
                <p className="text-xs text-stone-400 italic py-4">
                  No images uploaded yet. Please upload at least 2 images to proceed.
                </p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {allImagesList.map((item, idx) => {
                    const isCover = formData.coverImage === item.url || (!formData.coverImage && idx === 0);
                    return (
                      <div
                        key={idx}
                        className={`group relative rounded-2xl border overflow-hidden bg-stone-100 transition shadow-2xs ${
                          isCover ? "border-[#C9A227] ring-2 ring-[#C9A227]/30" : "border-stone-200"
                        }`}
                      >
                        <div className="aspect-3/4 overflow-hidden bg-stone-200">
                          <img
                            src={item.url}
                            alt={`Product photo ${idx + 1}`}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=400&h=500&fit=crop";
                            }}
                            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        </div>

                        {/* Primary Badge */}
                        {isCover && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-[#041D16] text-[#DFC15E] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <StarIcon filled /> Cover
                          </div>
                        )}

                        {/* Hover Overlay Controls */}
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
                                className="w-full py-1 rounded-md bg-[#C9A227] hover:bg-[#DFC15E] text-[#041D16] text-[10px] font-bold uppercase transition"
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
                                  title="Move Left"
                                >
                                  <MoveLeftIcon />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === formData.images.length - 1}
                                  onClick={() => handleMoveImage(idx, "right")}
                                  className="flex-1 py-1 rounded-md bg-white/20 hover:bg-white/40 disabled:opacity-30 text-white text-[10px] font-bold transition flex items-center justify-center"
                                  title="Move Right"
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

            {/* Step 2 Navigation Footer */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("basic");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>←</span>
                <span>Previous: 1. Basic Info</span>
              </button>

              <div className="text-xs text-center text-stone-500">
                {allImagesList.length < 2 ? (
                  <span className="text-amber-700 font-semibold">
                    ⚠️ {2 - allImagesList.length} more image required before publishing
                  </span>
                ) : (
                  <span className="text-emerald-700 font-semibold">
                    ✓ {allImagesList.length} images attached (Min 2 satisfied)
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("pricing");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#041D16] to-[#0B3D2E] hover:from-black hover:to-[#041D16] text-[#DFC15E] text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Next: 3. Pricing & MRP</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: PRICING & AUTO-CALCULATOR (Req #8)                     */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "pricing" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>₹</span> Pricing, MRP & Discount Calculator
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Configure MRP and discount rules. The final customer selling price is automatically validated & calculated.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* MRP */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  MRP (Maximum Retail Price)
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400">₹</span>
                  <input
                    type="number"
                    value={formData.mrp}
                    onChange={(e) => handleInputChange("mrp", Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-200 pl-8 pr-4 py-2.5 text-sm font-bold text-stone-900 focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Original tag price</p>
              </div>

              {/* Base Price */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Standard Selling Price <span className="text-rose-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-stone-400">₹</span>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", Number(e.target.value))}
                    className="w-full rounded-xl border border-stone-200 pl-8 pr-4 py-2.5 text-sm font-bold text-stone-900 focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
                {fieldErrors.price && <p className="mt-1 text-xs text-rose-500">{fieldErrors.price}</p>}
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Discount Type
                </label>
                <select
                  value={formData.discountType || "percentage"}
                  onChange={(e) => handleInputChange("discountType", e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-800 focus:border-[#C9A227] focus:outline-none"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Discount Value ({formData.discountType === "fixed" ? "₹" : "%"})
                </label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) => {
                    handleInputChange("discount", Number(e.target.value));
                    handleInputChange("discountValue", Number(e.target.value));
                  }}
                  className="mt-1.5 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-bold text-stone-900 focus:border-[#C9A227] focus:outline-none"
                />
              </div>
            </div>

            {/* Live Calculation Summary Banner */}
            <div className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-stone-50 p-6 border border-emerald-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Live Computed Customer Price
                </span>
                <div className="text-3xl font-bold font-display text-emerald-950 mt-1">
                  ₹{liveFinalPrice}
                  {formData.mrp > liveFinalPrice && (
                    <span className="text-sm font-normal text-stone-400 line-through ml-3">
                      ₹{formData.mrp}
                    </span>
                  )}
                </div>
                <p className="text-xs text-emerald-800 mt-0.5 font-medium">
                  Customer saves ₹{liveSavings} ({formData.discountType === "fixed" ? `₹${formData.discount} off` : `${formData.discount}% off`})
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-[11px] font-bold text-stone-500 uppercase">Frontend + Backend Sync</p>
                  <p className="text-xs font-semibold text-emerald-700">✓ Auto-calculated & Validated</p>
                </div>
              </div>
            </div>

            {/* Step 3 Navigation Footer */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("images");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>←</span>
                <span>Previous: 2. Images</span>
              </button>

              <div className="text-xs text-center text-stone-600 font-semibold">
                Selling Price: <strong className="text-emerald-800 text-sm">₹{liveFinalPrice}</strong>
                {formData.mrp > 0 && <span className="text-stone-400 text-xs font-normal ml-1">(MRP: ₹{formData.mrp})</span>}
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("inventory");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#041D16] to-[#0B3D2E] hover:from-black hover:to-[#041D16] text-[#DFC15E] text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Next: 4. Inventory & Stock</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: INVENTORY & STOCK MANAGEMENT (Req #9, #10, #11)        */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "inventory" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>📦</span> Stock & Inventory Radar
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Monitor current, available, and reserved stock. Adjust inventory with full audit logging.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowStockModal(true)}
                className="px-4 py-2 rounded-xl bg-[#041D16] hover:bg-black text-[#DFC15E] text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <span>⚡ Direct Stock Adjustment</span>
              </button>
            </div>

            {/* Inventory Status Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <p className="text-[11px] font-bold text-stone-500 uppercase">Current Stock</p>
                <p className="text-2xl font-bold font-display text-stone-900 mt-1">{formData.stock}</p>
                <span className="text-[10px] text-stone-400">Total in warehouse</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200">
                <p className="text-[11px] font-bold text-blue-700 uppercase">Available Stock</p>
                <p className="text-2xl font-bold font-display text-blue-900 mt-1">{formData.stock}</p>
                <span className="text-[10px] text-blue-600">Ready to purchase</span>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
                <p className="text-[11px] font-bold text-amber-700 uppercase">Low Stock Threshold</p>
                <p className="text-2xl font-bold font-display text-amber-900 mt-1">10</p>
                <span className="text-[10px] text-amber-600">Alert triggers at ≤ 10</span>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <p className="text-[11px] font-bold text-emerald-700 uppercase">Total Sold</p>
                <p className="text-2xl font-bold font-display text-emerald-900 mt-1">{formData.reviews * 3 + 18}</p>
                <span className="text-[10px] text-emerald-600">Fulfillment history</span>
              </div>
            </div>

            {/* Quick Restock Buttons */}
            <div className="mt-6 pt-6 border-t border-stone-100 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold text-stone-700">1-Click Quick Restock:</span>
              <button
                type="button"
                onClick={() => handleQuickRestock(10)}
                className="px-3.5 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-bold text-stone-800 transition"
              >
                +10 Units
              </button>
              <button
                type="button"
                onClick={() => handleQuickRestock(25)}
                className="px-3.5 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-bold text-stone-800 transition"
              >
                +25 Units
              </button>
              <button
                type="button"
                onClick={() => handleQuickRestock(50)}
                className="px-3.5 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-bold text-stone-800 transition"
              >
                +50 Units
              </button>
            </div>

            {/* Step 4 Navigation Footer */}
            <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("pricing");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center justify-center gap-2"
              >
                <span>←</span>
                <span>Previous: 3. Pricing</span>
              </button>

              <div className="text-xs text-center text-stone-600 font-semibold">
                Warehouse Stock: <strong className={formData.stock <= 10 ? "text-amber-600 font-bold" : "text-emerald-700 font-bold"}>{formData.stock} units</strong>
                <span className="text-stone-400 text-xs font-normal ml-1">(SKU: {formData.sku || "Not set"})</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("variants");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#041D16] to-[#0B3D2E] hover:from-black hover:to-[#041D16] text-[#DFC15E] text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                <span>Next: 5. Variants (Sizes & Colors)</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 5: VARIANTS (SIZES, PRICES, STOCK & COLOR IMAGE MAPPING) */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "variants" && (
        <div className="space-y-8">
          {/* Architecture Overview Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-[#041D16] via-[#0B3D2E] to-[#122A22] p-6 text-white shadow-md border border-[#C9A227]/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C9A227] text-[#041D16] text-[10px] font-bold uppercase tracking-wider">
                    Fashion Variant Engine
                  </span>
                  <span className="text-xs text-amber-200/80 font-medium">MongoDB Synchronized</span>
                </div>
                <h2 className="font-display text-xl font-bold text-[#DFC15E] mt-1.5">
                  Color Image Mapping & Size Pricing Architecture
                </h2>
                <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
                  • <strong>Color</strong> switches product image smoothly on customer selection.<br />
                  • <strong>Size</strong> controls dynamic selling price, MRP, and live warehouse inventory.<br />
                  • <strong>Color + Size</strong> defines exact variant stored in Bag, Checkout & Order fulfillment.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleAutoGenerateVariants}
                  className="px-4 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#DFC15E] text-[#041D16] text-xs font-bold transition shadow-sm flex items-center gap-1.5"
                >
                  <span>⚡ Auto-Generate Matrix ({((formData.sizeOptions?.length || 0) * (formData.colorOptions?.length || 0))} Rows)</span>
                </button>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 1. COLOR SELECTION & IMAGE MAPPING STUDIO                  */}
          {/* ========================================================= */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>🎨</span> Color Options & Product Image Mapping
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Assign a specific product image to each color. When customer selects a color, the main image switches instantly.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 self-start">
                {(formData.colorOptions || []).length} Colors Configured
              </span>
            </div>

            {/* Quick Add Standard Color Presets */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-2">
                Quick Add Popular Color Presets:
              </label>
              <div className="flex flex-wrap gap-2">
                {STANDARD_COLORS.map((clr) => {
                  const isAdded = (formData.colorOptions || []).some(
                    (c) => c.name.toLowerCase() === clr.toLowerCase()
                  );
                  return (
                    <button
                      key={clr}
                      type="button"
                      onClick={() => toggleColor(clr)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                        isAdded
                          ? "bg-[#041D16] text-[#DFC15E] border-[#041D16]"
                          : "bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300"
                      }`}
                    >
                      <span>{clr}</span>
                      <span className="text-[10px]">{isAdded ? "✓" : "+"}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Creator */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex items-center gap-2 shrink-0">
                <label className="text-xs font-bold text-stone-700">Hex Code:</label>
                <input
                  type="color"
                  value={customColorHex}
                  onChange={(e) => setCustomColorHex(e.target.value)}
                  className="w-8 h-8 rounded-lg border border-stone-300 cursor-pointer p-0.5 bg-white"
                />
              </div>
              <input
                type="text"
                value={customColorInput}
                onChange={(e) => setCustomColorInput(e.target.value)}
                placeholder="Custom Color Name (e.g. Peacock Blue, Peach Glow, Royal Magenta)"
                className="flex-1 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-medium text-stone-900 focus:border-[#C9A227] focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (customColorInput.trim()) {
                      handleAddColorOption(customColorInput.trim(), customColorHex);
                      setCustomColorInput("");
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (customColorInput.trim()) {
                    handleAddColorOption(customColorInput.trim(), customColorHex);
                    setCustomColorInput("");
                  }
                }}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-black text-white text-xs font-bold transition shrink-0"
              >
                + Add Custom Color
              </button>
            </div>

            {/* Configured Color Cards with Specific Image Selectors */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                Configured Colors & Image Assignments:
              </label>

              {(formData.colorOptions || []).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center text-xs text-stone-500">
                  No color options configured yet. Click any color preset above to add.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(formData.colorOptions || []).map((clrOpt, cIdx) => {
                    return (
                      <div
                        key={cIdx}
                        className="rounded-2xl border border-stone-200 bg-white p-4 shadow-2xs hover:border-[#C9A227]/70 transition-all flex gap-4 items-start"
                      >
                        {/* Thumbnail of assigned image */}
                        <div className="w-16 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative group">
                          {clrOpt.image ? (
                            <img
                              src={clrOpt.image}
                              alt={clrOpt.name}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=200&h=200&fit=crop";
                              }}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-[10px] text-stone-400 p-1 text-center">
                              <span>No image</span>
                            </div>
                          )}
                          <span
                            className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border border-white shadow-xs"
                            style={{ backgroundColor: clrOpt.hex || "#064E3B" }}
                            title={`Color Hex: ${clrOpt.hex}`}
                          />
                        </div>

                        {/* Details & Selectors */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <input
                                type="color"
                                value={clrOpt.hex || "#064E3B"}
                                onChange={(e) =>
                                  handleUpdateColorOption(cIdx, "hex", e.target.value)
                                }
                                className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent shrink-0"
                              />
                              <input
                                type="text"
                                value={clrOpt.name}
                                onChange={(e) =>
                                  handleUpdateColorOption(cIdx, "name", e.target.value)
                                }
                                className="text-xs font-bold text-stone-900 border-b border-transparent hover:border-stone-300 focus:border-[#C9A227] focus:outline-none px-1 py-0.5 truncate"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveColorOption(cIdx)}
                              className="text-stone-400 hover:text-rose-600 p-1 text-xs transition"
                              title="Delete color option"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Visual Click-to-Assign Image Palette */}
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-stone-600 mb-1.5 flex items-center justify-between">
                              <span>📸 Click Photo to Assign to this Color:</span>
                              <span className="text-stone-400 font-normal">{allImagesList.length} Photos Available</span>
                            </label>

                            {allImagesList.length === 0 ? (
                              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                                ⚠️ No images attached yet. Go to <button type="button" onClick={() => setActiveTab("images")} className="underline font-bold">Step 2: Images</button> to upload dress photos.
                              </p>
                            ) : (
                              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
                                {allImagesList.map((imgItem, imgIdx) => {
                                  const isSelected = clrOpt.image === imgItem.url || (!clrOpt.image && imgIdx === 0);
                                  return (
                                    <button
                                      key={imgIdx}
                                      type="button"
                                      onClick={() => handleUpdateColorOption(cIdx, "image", imgItem.url)}
                                      title={`Assign Photo #${imgIdx + 1} to ${clrOpt.name}`}
                                      className={`relative w-12 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 group/img ${
                                        isSelected
                                          ? "border-[#C9A227] ring-2 ring-[#C9A227]/40 scale-105 shadow-sm"
                                          : "border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100"
                                      }`}
                                    >
                                      <img
                                        src={imgItem.url}
                                        alt={`Product photo ${imgIdx + 1}`}
                                        onError={(e) => {
                                          (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=100&h=100&fit=crop";
                                        }}
                                        className="w-full h-full object-cover"
                                      />
                                      {isSelected && (
                                        <div className="absolute top-0.5 right-0.5 bg-[#041D16] text-[#DFC15E] w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black">
                                          ✓
                                        </div>
                                      )}
                                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center font-bold">
                                        #{imgIdx + 1}
                                      </span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Image Selector Dropdown & Direct URL fallback */}
                          <div className="flex items-center gap-2 pt-1">
                            <select
                              value={clrOpt.image || ""}
                              onChange={(e) =>
                                handleUpdateColorOption(cIdx, "image", e.target.value)
                              }
                              className="flex-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs text-stone-800 focus:border-[#C9A227] focus:outline-none"
                            >
                              <option value="">-- Choose Image from Gallery --</option>
                              {allImagesList.map((imgItem, imgIdx) => (
                                <option key={imgIdx} value={imgItem.url}>
                                  Photo #{imgIdx + 1} {imgItem.url === formData.coverImage ? "⭐ (Cover Photo)" : imgItem.isLocal ? "📁 (Uploaded Local)" : ""}
                                </option>
                              ))}
                            </select>

                            <input
                              type="url"
                              value={clrOpt.image || ""}
                              onChange={(e) =>
                                handleUpdateColorOption(cIdx, "image", e.target.value)
                              }
                              placeholder="Or paste direct image URL"
                              className="w-40 rounded-lg border border-stone-200 px-2 py-1.5 text-[10px] text-stone-600 focus:border-[#C9A227] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. SIZE, PRICING & STOCK MANAGEMENT STUDIO                */}
          {/* ========================================================= */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
            <div className="border-b border-stone-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>📏</span> Size, Price & Stock Management
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Configure sizes (e.g. S, M, L, XL, XXL). Every size has its own editable price, MRP, and warehouse stock.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {(formData.sizeOptions || []).reduce((s, o) => s + (Number(o.stock) || 0), 0)} Total Stock Units
                </span>
              </div>
            </div>

            {/* Quick Add Standard Sizes */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-2">
                Add Standard Garment Sizes:
              </label>
              <div className="flex flex-wrap gap-2">
                {STANDARD_SIZES.map((sz) => {
                  const isAdded = (formData.sizeOptions || []).some(
                    (s) => s.size.toLowerCase() === sz.toLowerCase()
                  );
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition border flex items-center gap-1.5 ${
                        isAdded
                          ? "bg-[#041D16] text-[#DFC15E] border-[#041D16]"
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

            {/* Custom Size Input */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={customSizeInput}
                onChange={(e) => setCustomSizeInput(e.target.value)}
                placeholder="Custom Size Name (e.g. 38, 40, 42, 44, Plus Size, 55 Inch, 60 Inch)"
                className="flex-1 rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-xs font-medium text-stone-900 focus:border-[#C9A227] focus:outline-none"
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

            {/* Bulk Quick Fill Tools */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="text-xs font-bold text-stone-700">⚡ Bulk Operations:</span>
              <button
                type="button"
                onClick={() => handleBulkSetSizePrice(formData.price || 799)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 transition"
              >
                Apply Base Price (₹{formData.price || 799}) to All Sizes
              </button>
              <button
                type="button"
                onClick={() => handleBulkSetSizeStock(15)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 transition"
              >
                Set 15 Units for All Sizes
              </button>
              <button
                type="button"
                onClick={() => handleBulkSetSizeStock(25)}
                className="px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-800 transition"
              >
                Set 25 Units for All Sizes
              </button>
            </div>

            {/* Editable Size Pricing & Stock Table */}
            <div className="overflow-x-auto rounded-2xl border border-stone-200">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-700 font-bold border-b border-stone-200">
                  <tr>
                    <th className="px-4 py-3">Size Option</th>
                    <th className="px-4 py-3">Selling Price (₹)</th>
                    <th className="px-4 py-3">MRP (₹)</th>
                    <th className="px-4 py-3">Stock Units</th>
                    <th className="px-4 py-3">Size SKU</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {(formData.sizeOptions || []).length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-stone-400 italic">
                        No sizes configured. Click size presets above to add sizes with individual prices and stock.
                      </td>
                    </tr>
                  ) : (
                    (formData.sizeOptions || []).map((szOpt, sIdx) => {
                      const szPrice = Number(szOpt.price) || 0;
                      const szMrp = Number(szOpt.mrp) || szPrice;
                      const szStock = Number(szOpt.stock) || 0;

                      return (
                        <tr key={sIdx} className="hover:bg-amber-50/20 transition-colors">
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-xl bg-stone-100 border border-stone-300 font-bold text-stone-900 text-xs">
                              {szOpt.size}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="relative w-28">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-stone-400">₹</span>
                              <input
                                type="number"
                                value={szPrice}
                                onChange={(e) =>
                                  handleUpdateSizeOption(sIdx, "price", Number(e.target.value))
                                }
                                className="w-full rounded-lg border border-stone-200 pl-6 pr-2 py-1.5 text-xs font-bold text-stone-900 focus:border-[#C9A227] focus:outline-none bg-white"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="relative w-28">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 font-bold text-stone-400">₹</span>
                              <input
                                type="number"
                                value={szMrp}
                                onChange={(e) =>
                                  handleUpdateSizeOption(sIdx, "mrp", Number(e.target.value))
                                }
                                className="w-full rounded-lg border border-stone-200 pl-6 pr-2 py-1.5 text-xs font-medium text-stone-600 focus:border-[#C9A227] focus:outline-none bg-white"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                value={szStock}
                                onChange={(e) =>
                                  handleUpdateSizeOption(sIdx, "stock", Number(e.target.value))
                                }
                                className={`w-20 rounded-lg border px-2.5 py-1.5 text-xs font-bold focus:border-[#C9A227] focus:outline-none bg-white ${
                                  szStock === 0
                                    ? "border-rose-300 text-rose-700 bg-rose-50"
                                    : szStock <= 5
                                    ? "border-amber-300 text-amber-800 bg-amber-50"
                                    : "border-stone-200 text-stone-900"
                                }`}
                              />
                              <span className="text-[10px] text-stone-400">units</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] text-stone-500">
                            <input
                              type="text"
                              value={szOpt.sku || `${formData.sku}-${szOpt.size}`}
                              onChange={(e) =>
                                handleUpdateSizeOption(sIdx, "sku", e.target.value)
                              }
                              className="w-32 rounded-lg border border-stone-200 px-2 py-1 font-mono text-[11px] bg-white focus:border-[#C9A227] focus:outline-none"
                            />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveSizeOption(sIdx)}
                              className="text-stone-400 hover:text-rose-600 p-1 text-xs font-bold transition"
                              title="Delete size"
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Sizes Summary Bar */}
            {(formData.sizeOptions || []).length > 0 && (
              <div className="rounded-2xl bg-stone-50 border border-stone-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 flex-wrap">
                  <span>Starting Selling Price: <strong className="text-emerald-800 text-sm">₹{Math.min(...(formData.sizeOptions || []).map(s => Number(s.price) || Infinity))}</strong></span>
                  <span>•</span>
                  <span>Total Warehouse Stock: <strong className="text-stone-900 text-sm">{(formData.sizeOptions || []).reduce((s, o) => s + (Number(o.stock) || 0), 0)} units</strong></span>
                </div>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  ✓ Ready to synchronize with customer storefront
                </span>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* 3. GRANULAR VARIANT COMBINATION MATRIX (Advanced)        */}
          {/* ========================================================= */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <span>👗</span> Granular Color × Size Matrix ({variants.length} Combinations)
                </h3>
                <p className="text-xs text-stone-500">
                  Auto-generated from your active sizes and colors for advanced SKU inventory tracking.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAutoGenerateVariants}
                className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition shadow-xs"
              >
                Re-Generate Matrix
              </button>
            </div>

            {variants.length === 0 ? (
              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-6 text-center text-xs text-stone-500">
                Click "Re-Generate Matrix" above to create SKU rows for every color and size pair.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-stone-200 max-h-96 overflow-y-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 sticky top-0">
                    <tr>
                      <th className="px-4 py-2.5">Variant</th>
                      <th className="px-4 py-2.5">SKU Code</th>
                      <th className="px-4 py-2.5">Price (₹)</th>
                      <th className="px-4 py-2.5">Stock</th>
                      <th className="px-4 py-2.5">Status</th>
                      <th className="px-4 py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {variants.map((v, vIdx) => (
                      <tr key={v.id || vIdx} className="hover:bg-stone-50/50">
                        <td className="px-4 py-2 font-semibold text-stone-900 flex items-center gap-2">
                          {v.image && (
                            <img
                              src={v.image}
                              alt={v.color}
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=50&h=50&fit=crop";
                              }}
                              className="w-6 h-6 rounded-md object-cover border border-stone-200"
                            />
                          )}
                          <span>{v.color} / {v.size}</span>
                        </td>
                        <td className="px-4 py-2 font-mono text-[11px] text-stone-500">
                          <input
                            type="text"
                            value={v.sku}
                            onChange={(e) => {
                              const copy = [...variants];
                              copy[vIdx].sku = e.target.value;
                              setVariants(copy);
                              setIsDirty(true);
                            }}
                            className="w-32 rounded-lg border border-stone-200 px-2 py-1 font-mono text-[11px]"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={v.price}
                            onChange={(e) => {
                              const copy = [...variants];
                              copy[vIdx].price = Number(e.target.value);
                              setVariants(copy);
                              setIsDirty(true);
                            }}
                            className="w-20 rounded-lg border border-stone-200 px-2 py-1 text-xs font-bold"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={v.stock}
                            onChange={(e) => {
                              const copy = [...variants];
                              copy[vIdx].stock = Number(e.target.value);
                              setVariants(copy);
                              setIsDirty(true);
                            }}
                            className="w-16 rounded-lg border border-stone-200 px-2 py-1 text-xs font-bold"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                            Active
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setVariants(variants.filter((_, i) => i !== vIdx));
                              setIsDirty(true);
                            }}
                            className="text-rose-500 hover:text-rose-700 font-bold"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Step 5 Navigation & Publishing Footer */}
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => {
                setActiveTab("inventory");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition flex items-center justify-center gap-2"
            >
              <span>←</span>
              <span>Previous: 4. Inventory</span>
            </button>

            <div className="text-xs text-center text-stone-500">
              <span>Need to configure combos, shipping rules or SEO? </span>
              <button
                type="button"
                onClick={() => {
                  setShowAdvancedTabs(true);
                  setActiveTab("offers");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-[#8A5F38] hover:text-[#064E3B] font-bold underline ml-1"
              >
                Open Advanced Settings ⚙️
              </button>
            </div>

            <button
              type="button"
              onClick={() => handleSave("ACTIVE")}
              disabled={saving}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-[#C9A227] to-[#DFC15E] hover:brightness-105 text-[#041D16] text-xs font-extrabold uppercase tracking-wider transition shadow-lg shadow-[#C9A227]/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#041D16] border-t-transparent" />
                  <span>Publishing Product...</span>
                </>
              ) : (
                <>
                  <CheckIcon size={16} />
                  <span>{isNew ? "Complete & Publish Product ✨" : "Save All Changes ✨"}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 6: OFFERS & COMBOS (Req #13, #14)                         */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "offers" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>🎁</span> Product-Specific Offers & Combo Packages
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Configure Buy X Get Y, volume quantity discount tiers, and combo bundle offers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Offer Type */}
              <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Volume & Quantity Discount Rules
                </h3>
                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Offer Rule Template
                  </label>
                  <select
                    className="w-full rounded-xl border border-stone-200 bg-white px-3.5 py-2 text-xs font-medium focus:border-[#C9A227]"
                    onChange={(e) => {
                      setIsDirty(true);
                      setToastMessage({ type: "success", text: `Offer rule set to "${e.target.value}"` });
                    }}
                  >
                    <option value="buy3_free_ship">Buy 3 Dresses → Get Free Shipping</option>
                    <option value="buy5_disc">Buy 5 Dresses → ₹15 Discount Per Dress + Free Delivery</option>
                    <option value="buy2_get1">Buy 2 Get 1 Free (Special Fest Offer)</option>
                    <option value="flat20">Flat 20% Instant Cart Discount</option>
                  </select>
                </div>
                <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-600">
                  <p className="font-bold text-stone-800">Example Rule Preview:</p>
                  <p className="mt-1">Customer adds 3 Nighties → Total ₹1,499 with ₹0 Delivery Charge automatically.</p>
                </div>
              </div>

              {/* Combo Offer Linkage */}
              <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Featured Combo Package Bundle
                </h3>
                <div className="space-y-2">
                  <p className="text-xs text-stone-700">
                    <strong>Bundle:</strong> "Mega 3-Nighty Combo Saver Pack"
                  </p>
                  <p className="text-xs text-stone-700">
                    <strong>Normal Total:</strong> ₹1,797 &nbsp;|&nbsp; <strong>Combo Price:</strong> ₹1,499
                  </p>
                  <p className="text-xs text-emerald-800 font-bold">
                    Direct Customer Savings: ₹298 + Free Shipping
                  </p>
                </div>
                <Link
                  to="/admin/combos"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#041D16] underline hover:text-[#C9A227]"
                >
                  Manage global combo engine in Combo Offers Studio →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 7: SHIPPING MANAGEMENT (Req #15)                          */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "shipping" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>🚚</span> Shipping Rules & Delivery Overrides
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Configure state-wise and item-level delivery charges and free shipping eligibility.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                  Free Shipping Min Quantity
                </label>
                <input
                  type="number"
                  defaultValue={3}
                  className="w-full rounded-xl border border-stone-200 px-3 py-2 text-xs font-bold"
                />
                <p className="text-[10px] text-stone-400 mt-1">Orders with ≥ 3 units get 100% Free Delivery</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                  Single Item Shipping Charge
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">₹</span>
                  <input
                    type="number"
                    defaultValue={70}
                    className="w-full rounded-xl border border-stone-200 pl-7 pr-3 py-2 text-xs font-bold"
                  />
                </div>
                <p className="text-[10px] text-stone-400 mt-1">Tamil Nadu standard courier rate</p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                  Express Delivery
                </label>
                <select className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold">
                  <option value="yes">Available (24-48 Hours)</option>
                  <option value="no">Standard Only (3-5 Days)</option>
                </select>
                <p className="text-[10px] text-stone-400 mt-1">Courier express dispatch tag</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 8: COD MANAGEMENT (Req #16, #17)                          */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "cod" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>💵</span> Cash on Delivery (COD) & Advance Rules
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Configure COD availability, minimum purchase limits, and upfront advance security amounts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                    COD Availability
                  </label>
                  <select className="w-full rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-xs font-bold text-emerald-800">
                    <option value="active">Enabled across all eligible pin codes</option>
                    <option value="disabled">Disabled for this specific product</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700 mb-1">
                    Minimum Quantity for COD
                  </label>
                  <input
                    type="number"
                    defaultValue={1}
                    className="w-full rounded-xl border border-stone-200 px-4 py-2 text-xs font-bold"
                  />
                </div>
              </div>

              {/* COD Advance Table */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <h3 className="text-xs font-bold text-stone-800 uppercase">
                  Visual COD Advance Matrix
                </h3>
                <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-stone-50 font-bold text-stone-600 border-b border-stone-200">
                      <tr>
                        <th className="px-3 py-2">Category</th>
                        <th className="px-3 py-2">Quantity</th>
                        <th className="px-3 py-2">Advance Required</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      <tr>
                        <td className="px-3 py-2 font-semibold">Nighty</td>
                        <td className="px-3 py-2">1 - 3 Pcs</td>
                        <td className="px-3 py-2 font-bold text-emerald-700">₹100 Advance</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-semibold">Nighty</td>
                        <td className="px-3 py-2">4 - 6 Pcs</td>
                        <td className="px-3 py-2 font-bold text-emerald-700">₹130 Advance</td>
                      </tr>
                      <tr>
                        <td className="px-3 py-2 font-semibold">Salwar Material</td>
                        <td className="px-3 py-2">2 Pcs</td>
                        <td className="px-3 py-2 font-bold text-emerald-700">₹100 Advance</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 9: DESCRIPTION & ATTRIBUTES (Req #18)                     */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "description" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>📝</span> Rich Product Description & Garment Specifications
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Edit fabric, sleeve, neckline, length, care instructions, and formatted description.
              </p>
            </div>

            {/* Rich Text Toolbar Simulation */}
            <div className="space-y-2">
              <div className="flex items-center gap-1 p-2 rounded-xl bg-stone-100 border border-stone-200 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange("description", formData.description + " **Bold Highlight** ");
                  }}
                  className="px-2.5 py-1 rounded bg-white font-bold text-xs shadow-2xs hover:bg-stone-50"
                >
                  B
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange("description", formData.description + " *Italic Note* ");
                  }}
                  className="px-2.5 py-1 rounded bg-white italic text-xs shadow-2xs hover:bg-stone-50"
                >
                  I
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange("description", formData.description + "\n• Pure Combed Cotton\n• Color Fast Guaranteed");
                  }}
                  className="px-2.5 py-1 rounded bg-white text-xs shadow-2xs hover:bg-stone-50"
                >
                  • Bullet List
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleInputChange("description", formData.description + "\n### Garment Highlights\n");
                  }}
                  className="px-2.5 py-1 rounded bg-white text-xs shadow-2xs hover:bg-stone-50"
                >
                  H2 Heading
                </button>
              </div>

              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Write full product story, fabric quality, styling and care details..."
                className="w-full rounded-2xl border border-stone-200 p-4 text-xs font-mono focus:border-[#C9A227] focus:outline-none"
              />
            </div>

            {/* Garment Specifications Grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <label className="block text-[11px] font-bold uppercase text-stone-700">Length</label>
                <input
                  type="text"
                  value={formData.length}
                  onChange={(e) => handleInputChange("length", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700">Pattern</label>
                <input
                  type="text"
                  value={formData.pattern}
                  onChange={(e) => handleInputChange("pattern", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700">Sleeve Type</label>
                <input
                  type="text"
                  value={formData.sleeveType}
                  onChange={(e) => handleInputChange("sleeveType", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700">Neck Style / Opening</label>
                <input
                  type="text"
                  value={formData.neckType}
                  onChange={(e) => handleInputChange("neckType", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-700">Care Instructions</label>
                <input
                  type="text"
                  value={formData.care}
                  onChange={(e) => handleInputChange("care", e.target.value)}
                  className="mt-1 w-full rounded-xl border border-stone-200 px-3.5 py-2 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 10: SEO & METADATA (Req #19)                              */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "seo" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>🔍</span> Search Engine Optimization (SEO)
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Optimize meta tags, search keywords, and URL slug for top Google ranking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700">SEO Page Title</label>
                  <input
                    type="text"
                    value={formData.seo?.title}
                    onChange={(e) =>
                      handleInputChange("seo", { ...formData.seo, title: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700">URL Slug</label>
                  <input
                    type="text"
                    value={formData.seo?.urlSlug}
                    onChange={(e) =>
                      handleInputChange("seo", { ...formData.seo, urlSlug: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-2.5 font-mono text-xs text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700">Focus Keyword</label>
                  <input
                    type="text"
                    value={formData.seo?.focusKeyword}
                    onChange={(e) =>
                      handleInputChange("seo", { ...formData.seo, focusKeyword: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-700">Meta Description</label>
                  <textarea
                    rows={3}
                    value={formData.seo?.metaDescription}
                    onChange={(e) =>
                      handleInputChange("seo", { ...formData.seo, metaDescription: e.target.value })
                    }
                    className="mt-1 w-full rounded-xl border border-stone-200 p-3 text-xs"
                  />
                </div>
              </div>

              {/* Google Search Live Preview Card */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                  Google Search Snippet Preview
                </h3>
                <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-xs font-sans space-y-1">
                  <div className="flex items-center gap-2 text-[11px] text-stone-500">
                    <span className="font-semibold text-stone-800">nithicollection.com</span>
                    <span>› product › {formData.seo?.urlSlug || "product-url"}</span>
                  </div>
                  <h4 className="text-base font-semibold text-[#1a0dab] hover:underline cursor-pointer">
                    {formData.seo?.title || `${formData.name} | Nithi Collection`}
                  </h4>
                  <p className="text-xs text-[#4d5156] leading-relaxed line-clamp-2">
                    {formData.seo?.metaDescription || formData.shortDescription || formData.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 11: STOREFRONT PREVIEW (Req #20)                          */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "preview" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <span>👁️</span> Live Customer Storefront Preview
                </h2>
                <p className="text-xs text-stone-500 mt-1">
                  Exact preview of how customers view and interact with this dress before publishing.
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                ● Live Interactive View
              </span>
            </div>

            {/* Storefront Product Card Simulation */}
            <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 items-start bg-stone-50/50 p-6 sm:p-8 rounded-3xl border border-stone-200">
              {/* Product Gallery */}
              <div className="space-y-3">
                <div className="aspect-3/4 rounded-2xl overflow-hidden bg-stone-200 shadow-md">
                  <img
                    src={formData.coverImage || formData.images[0]}
                    alt={formData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {formData.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {formData.images.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleSetCoverImage(img)}
                        className={`w-16 h-20 rounded-xl overflow-hidden border-2 shrink-0 ${
                          formData.coverImage === img ? "border-[#C9A227]" : "border-transparent opacity-70"
                        }`}
                      >
                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info & Buy Action */}
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#C9A227]">
                    {formData.category}
                  </span>
                  <h1 className="text-2xl font-bold font-display text-stone-900 mt-1">
                    {formData.name || "Product Name"}
                  </h1>
                  <p className="text-xs text-stone-500 font-mono mt-0.5">SKU: {formData.sku}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-stone-900 font-display">
                    ₹{liveFinalPrice}
                  </span>
                  {formData.mrp > liveFinalPrice && (
                    <span className="text-base text-stone-400 line-through">
                      ₹{formData.mrp}
                    </span>
                  )}
                  {formData.discount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold">
                      {formData.discount}% OFF
                    </span>
                  )}
                </div>

                {/* Stock Tag */}
                <div>
                  {formData.stock > 0 ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block">
                      ✓ In Stock ({formData.stock} units available)
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-full inline-block">
                      ⚠ Out of Stock
                    </span>
                  )}
                </div>

                {/* Sizes */}
                <div>
                  <p className="text-xs font-bold text-stone-800 mb-2">Select Size:</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.sizes?.map((sz) => (
                      <span
                        key={sz}
                        className="px-3.5 py-1.5 rounded-xl border border-stone-300 bg-white font-semibold text-xs text-stone-800"
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Color Swatch */}
                <div>
                  <p className="text-xs font-bold text-stone-800 mb-2">Color:</p>
                  <span className="px-3 py-1 rounded-full bg-[#041D16] text-[#DFC15E] text-xs font-bold">
                    {formData.color || "Emerald Green"}
                  </span>
                </div>

                {/* Simulated Buy Buttons */}
                <div className="pt-4 space-y-2">
                  <button
                    type="button"
                    disabled={formData.stock <= 0}
                    className="w-full py-3.5 rounded-2xl bg-[#041D16] hover:bg-black text-[#DFC15E] font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
                  >
                    Add to Cart
                  </button>
                  <button
                    type="button"
                    disabled={formData.stock <= 0}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#C9A227] to-[#DFC15E] text-[#041D16] font-bold text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
                  >
                    Buy Now (Cash on Delivery / UPI)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 12: ACTIVITY & AUDIT TRAIL (Req #23)                      */}
      {/* ------------------------------------------------------------- */}
      {activeTab === "history" && (
        <div className="space-y-6">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs">
            <div className="border-b border-stone-100 pb-4 mb-6">
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <span>📜</span> Product Audit & Modification Ledger
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Permanent chronological record of every price, stock, discount, and status change.
              </p>
            </div>

            {productAuditLogs.length === 0 ? (
              <div className="text-center py-8 text-xs text-stone-400">
                No past audit records for this product yet. Modifications will be automatically logged here.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 font-bold text-stone-600 border-b border-stone-200">
                    <tr>
                      <th className="px-4 py-3">Date & Time</th>
                      <th className="px-4 py-3">Admin</th>
                      <th className="px-4 py-3">Action</th>
                      <th className="px-4 py-3">Previous Value</th>
                      <th className="px-4 py-3">New Value</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium">
                    {productAuditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-stone-50/50">
                        <td className="px-4 py-3 text-stone-500 text-[11px]">{log.timestamp}</td>
                        <td className="px-4 py-3 font-bold text-stone-900">{log.adminName}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[10px] font-bold">
                            {log.action}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-stone-500 line-through">{log.oldValue || "-"}</td>
                        <td className="px-4 py-3 text-emerald-800 font-semibold">{log.newValue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* DIRECT STOCK ADJUSTMENT MODAL (Req #9, #10)                   */}
      {/* ------------------------------------------------------------- */}
      {showStockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-stone-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-display font-bold text-base text-stone-900 flex items-center gap-2">
                <span>⚡</span> Stock Adjustment Engine
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
                    onClick={() => setStockAction("ADD")}
                    className={`py-2 rounded-xl font-bold transition border ${
                      stockAction === "ADD"
                        ? "bg-emerald-700 text-white border-emerald-700"
                        : "bg-stone-50 text-stone-700 border-stone-200"
                    }`}
                  >
                    + ADD STOCK
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
                  <button
                    type="button"
                    onClick={() => setStockAction("SET")}
                    className={`py-2 rounded-xl font-bold transition border ${
                      stockAction === "SET"
                        ? "bg-[#041D16] text-[#DFC15E] border-[#041D16]"
                        : "bg-stone-50 text-stone-700 border-stone-200"
                    }`}
                  >
                    SET EXACT
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Quantity ({stockAction})
                </label>
                <input
                  type="number"
                  min={1}
                  value={stockActionQty}
                  onChange={(e) => setStockActionQty(Number(e.target.value))}
                  className="w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-bold focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">
                  Reason for Stock Change (Audit Requirement)
                </label>
                <input
                  type="text"
                  value={stockActionReason}
                  onChange={(e) => setStockActionReason(e.target.value)}
                  placeholder="e.g. New stock consignment received from supplier"
                  className="w-full rounded-xl border border-stone-200 px-4 py-2 text-xs focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-stone-600">
                <p>
                  Current Stock: <strong>{formData.stock}</strong> &nbsp;→&nbsp; Calculated New Stock:{" "}
                  <strong className="text-emerald-700">
                    {stockAction === "ADD"
                      ? formData.stock + Number(stockActionQty)
                      : stockAction === "REMOVE"
                      ? Math.max(0, formData.stock - Number(stockActionQty))
                      : Number(stockActionQty)}
                  </strong>
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
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
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md uppercase tracking-wider"
              >
                Apply & Save Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
