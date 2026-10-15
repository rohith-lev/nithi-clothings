import React, { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Category, SubCategory } from "../../types/store";
import { adminApi } from "../../services/api";
import {
  SparklesIcon,
  ExternalLinkIcon,
  ProductsIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
} from "../../components/admin/AdminIcons";

export default function AdminCategories() {
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [quickSubModalCat, setQuickSubModalCat] = useState<Category | null>(null);
  const [quickSubName, setQuickSubName] = useState("");

  // Form State for Add / Edit Category
  const [formCatName, setFormCatName] = useState("");
  const [formCatSlug, setFormCatSlug] = useState("");
  const [formCatImage, setFormCatImage] = useState("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formCatPriority, setFormCatPriority] = useState<number>(1);
  const [formCatShowOnHome, setFormCatShowOnHome] = useState(true);
  const [formCatIsActive, setFormCatIsActive] = useState(true);
  const [formSubInput, setFormSubInput] = useState("");
  const [formSubcategories, setFormSubcategories] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const refreshData = async () => {
    const [cats, prods] = await Promise.all([
      adminApi.getCategories(),
      adminApi.getProducts(),
    ]);
    // Sort by priority
    const sorted = [...cats].sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
    setCategoriesList(sorted);
    setProducts(prods);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setToastMessage({ type: "error", text: "Please upload a valid image file (JPEG, PNG, WebP)." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToastMessage({ type: "error", text: "Image size should be less than 5MB." });
      return;
    }

    setIsUploadingImage(true);
    try {
      const res = await adminApi.uploadSingleImage(file);
      if (res.success && res.url) {
        setFormCatImage(res.url);
        setToastMessage({ type: "success", text: "Category image uploaded successfully!" });
      } else {
        setToastMessage({ type: "error", text: res.error || "Failed to upload image." });
      }
    } catch (err: any) {
      setToastMessage({ type: "error", text: err.message || "Upload error." });
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Helper to calculate total active garments in a category
  const getCategoryProductCount = (catId: string, catName: string, catSlug: string) => {
    const idLower = catId.toLowerCase();
    const nameLower = catName.toLowerCase();
    const slugLower = catSlug.toLowerCase();
    return products.filter((p) => {
      const pCat = (p.category || "").toLowerCase();
      return (
        pCat === idLower ||
        pCat === nameLower ||
        pCat === slugLower ||
        pCat.replace(/\s+/g, "-") === slugLower
      );
    }).length;
  };

  // Helper to get all subcategory names for a category
  const getSubcategories = (cat: Category): string[] => {
    return (cat.subcategories || []).map((s) => s.name);
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormCatName("");
    setFormCatSlug("");
    setFormCatImage("https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format");
    setFormCatPriority(categoriesList.length + 1);
    setFormCatShowOnHome(true);
    setFormCatIsActive(true);
    setFormSubInput("");
    setFormSubcategories([]);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormCatName(cat.name);
    setFormCatSlug(cat.slug);
    setFormCatImage(cat.image);
    setFormCatPriority(cat.priority ?? 0);
    setFormCatShowOnHome(cat.showOnHome !== false);
    setFormCatIsActive(cat.isActive !== false);
    setFormSubInput("");
    setFormSubcategories(getSubcategories(cat));
    setIsAddModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFormCatName(val);
    if (!editingCategory) {
      setFormCatSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  };

  const handleAddSubcategoryTag = () => {
    const trimmed = formSubInput.trim();
    if (!trimmed) return;
    if (!formSubcategories.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setFormSubcategories([...formSubcategories, trimmed]);
    }
    setFormSubInput("");
  };

  const handleRemoveSubcategoryTag = (subToRemove: string) => {
    setFormSubcategories(formSubcategories.filter((s) => s !== subToRemove));
  };

  // Quick toggle for "Show on Home" directly from card
  const handleToggleShowOnHome = async (cat: Category) => {
    const updatedStatus = cat.showOnHome === false ? true : false;
    const res = await adminApi.saveCategory({
      ...cat,
      showOnHome: updatedStatus,
    });

    if (res.success) {
      setToastMessage({
        type: "success",
        text: `"${cat.name}" is now ${updatedStatus ? "VISIBLE" : "HIDDEN"} on the Home Page!`,
      });
      await refreshData();
    } else {
      setToastMessage({
        type: "error",
        text: res.error || "Failed to update category visibility.",
      });
    }
  };

  // Quick toggle for "Active" status
  const handleToggleIsActive = async (cat: Category) => {
    const updatedActive = cat.isActive === false ? true : false;
    const res = await adminApi.saveCategory({
      ...cat,
      isActive: updatedActive,
    });

    if (res.success) {
      setToastMessage({
        type: "success",
        text: `"${cat.name}" status set to ${updatedActive ? "Active" : "Disabled"}.`,
      });
      await refreshData();
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCatName.trim()) {
      setToastMessage({ type: "error", text: "Please enter a category name." });
      return;
    }

    const subObjects: SubCategory[] = formSubcategories.map((subName) => ({
      id: `sub-${subName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name: subName,
    }));

    const catPayload = {
      id: editingCategory?.id,
      name: formCatName.trim(),
      slug: formCatSlug.trim() || formCatName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      image: formCatImage.trim() || "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format",
      priority: Number(formCatPriority) || 0,
      showOnHome: Boolean(formCatShowOnHome),
      isActive: Boolean(formCatIsActive),
      subcategories: subObjects,
    };

    const res = await adminApi.saveCategory(catPayload);
    setIsAddModalOpen(false);

    if (res.success) {
      setToastMessage({
        type: "success",
        text: `Category "${catPayload.name}" saved successfully (Priority: #${catPayload.priority}, Home: ${catPayload.showOnHome ? "ON" : "OFF"})!`,
      });
      await refreshData();
    } else {
      setToastMessage({
        type: "error",
        text: res.error || "Failed to save category.",
      });
    }
  };

  const handleDeleteCategory = async (cat: Category) => {
    if (confirm(`Are you sure you want to delete the category "${cat.name}"? Products assigned to this category will not be deleted.`)) {
      const targetId = cat.id || (cat as any)._id || cat.slug;
      await adminApi.deleteCategory(targetId);
      setToastMessage({ type: "success", text: `Category "${cat.name}" removed from taxonomy.` });
      await refreshData();
    }
  };

  const handleConfirmDeleteAll = async () => {
    setDeletingAll(true);
    const res = await adminApi.deleteAllCategories();
    setDeletingAll(false);
    setShowDeleteAllModal(false);
    if (res.success) {
      setToastMessage({ type: "success", text: res.message || "All categories purged successfully." });
      await refreshData();
    } else {
      setToastMessage({ type: "error", text: res.error || "Failed to purge categories." });
    }
  };

  const handleQuickAddSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickSubModalCat || !quickSubName.trim()) return;

    const trimmed = quickSubName.trim();
    const existingSubs = quickSubModalCat.subcategories || [];
    const newSubs = [
      ...existingSubs,
      { id: `sub-${trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`, name: trimmed },
    ];

    await adminApi.saveCategory({
      ...quickSubModalCat,
      subcategories: newSubs,
    });

    setToastMessage({
      type: "success",
      text: `Sub-category "${trimmed}" added to ${quickSubModalCat.name}!`,
    });
    setQuickSubName("");
    setQuickSubModalCat(null);
    await refreshData();
  };

  const totalCatalogedProducts = products.length;
  const homeEnabledCount = categoriesList.filter((c) => c.showOnHome !== false && c.isActive !== false).length;

  return (
    <div className="space-y-6 font-body">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Taxonomy & Categories
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F1] border border-[#C9A227]/40 text-[#8A5F38] text-xs font-bold font-mono">
              {categoriesList.length} Total ({homeEnabledCount} on Home)
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Manage category priority, Home Page showcase selection, fixed category images, and sub-categories.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowDeleteAllModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 rounded-xl shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <TrashIcon size={14} />
            <span>Purge All</span>
          </button>
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#0B3D2E] text-[#FAF8F1] text-xs font-bold hover:brightness-110 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <PlusIcon size={14} />
            <span>Add Category</span>
          </button>
          <Link
            to="/admin/products"
            className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:border-[#064E3B] hover:text-[#064E3B] transition-all shadow-2xs flex items-center gap-1.5"
          >
            <ProductsIcon size={14} />
            <span>Manage Products ({totalCatalogedProducts})</span>
          </Link>
          <Link
            to="/"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-all shadow-2xs flex items-center gap-1.5"
          >
            <span>View Home Page</span>
            <ExternalLinkIcon size={13} />
          </Link>
        </div>
      </div>

      {/* Quick Showcase Status Banner */}
      <div className="bg-[#FAF8F1] border border-[#C9A227]/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C9A227] animate-ping" />
          <span className="font-bold text-[#064E3B]">Home Page "Select Category" Showcase:</span>
          <span className="text-[#5C635E]">
            Only categories with <span className="font-bold text-emerald-800">"Home: ON"</span> appear in the Home Page Category Selector.
          </span>
        </div>
        <span className="font-semibold text-[#8A5F38] bg-white px-3 py-1 rounded-full border border-[#E8E2D5]">
          {homeEnabledCount} of {categoriesList.length} Active on Home
        </span>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl p-4 shadow-sm border animate-fade-in ${
            toastMessage.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckIcon size={15} />
            <span>{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-stone-400 hover:text-stone-600 text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoriesList.map((cat) => {
          const count = getCategoryProductCount(cat.id, cat.name, cat.slug);
          const subList = getSubcategories(cat);
          const isHomeVisible = cat.showOnHome !== false && cat.isActive !== false;
          const priorityVal = cat.priority ?? 0;

          return (
            <div
              key={cat.id}
              className={`bg-white rounded-3xl border overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group ${
                isHomeVisible ? "border-[#C9A227]/60 ring-1 ring-[#C9A227]/20" : "border-stone-200 opacity-90"
              }`}
            >
              {/* Category Cover Image Header */}
              <div className="relative h-48 bg-stone-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041D16]/95 via-[#041D16]/40 to-transparent flex items-end p-5">
                  <div className="w-full flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-full bg-[#C9A227] text-[#041D16] text-[10px] font-bold">
                          Priority #{priorityVal}
                        </span>
                        {isHomeVisible ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1">
                            <span>✓</span>
                            <span>Home Showcase</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-stone-700/80 text-stone-300 text-[10px] font-medium">
                            Hidden from Home
                          </span>
                        )}
                      </div>
                      <h3 className="font-display font-bold text-xl text-white tracking-tight">{cat.name}</h3>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#DFC15E] text-[11px] font-bold mt-1">
                        <SparklesIcon size={11} />
                        <span>{count} Garments Cataloged</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(cat)}
                        className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/40 text-white text-xs font-semibold backdrop-blur-xs transition cursor-pointer"
                        title="Edit category, image, priority & subcategories"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat)}
                        className="w-7 h-7 rounded-lg bg-rose-500/20 hover:bg-rose-600/80 text-rose-200 hover:text-white flex items-center justify-center backdrop-blur-xs transition cursor-pointer"
                        title="Delete category"
                      >
                        <TrashIcon size={13} />
                      </button>
                      <Link
                        to={`/shop?category=${cat.slug}`}
                        target="_blank"
                        className="w-7 h-7 rounded-lg bg-white/20 hover:bg-white/40 text-white flex items-center justify-center backdrop-blur-xs transition"
                        title="View in storefront"
                      >
                        <ExternalLinkIcon size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Controls & Subcategories */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                {/* Home Showcase Toggle Action */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-100 bg-stone-50 p-2.5 rounded-2xl">
                  <div>
                    <span className="block text-xs font-bold text-stone-800">Home Showcase</span>
                    <span className="text-[10px] text-stone-500">
                      {isHomeVisible ? "Visible on Home Category Browser" : "Hidden from Home Page"}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleShowOnHome(cat)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isHomeVisible ? "bg-[#064E3B]" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isHomeVisible ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                      Subcategories ({subList.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickSubModalCat(cat);
                        setQuickSubName("");
                      }}
                      className="text-[11px] font-bold text-[#8A5F38] hover:text-[#064E3B] flex items-center gap-1 cursor-pointer"
                    >
                      <PlusIcon size={11} />
                      <span>+ Add Sub-category</span>
                    </button>
                  </div>

                  {subList.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                      {subList.map((subName, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 text-xs font-medium hover:bg-[#FAF8F1] hover:border-[#C9A227]/40 transition"
                        >
                          {subName}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-stone-400 text-xs italic">No subcategories defined yet.</p>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-mono text-[11px] text-stone-600">/shop?category={cat.slug}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-stone-400 hover:text-rose-600 transition text-[11px] font-semibold cursor-pointer"
                      title="Delete category"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-display text-lg font-bold text-stone-900">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : "Add New Category"}
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formCatName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. 90s, Nighties, Silk Sarees"
                  className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formCatSlug}
                    onChange={(e) => setFormCatSlug(e.target.value)}
                    placeholder="90s"
                    className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 font-mono text-xs focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                    Display Priority / Order #
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={formCatPriority}
                    onChange={(e) => setFormCatPriority(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-xs font-bold focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
              </div>

              {/* Fixed Primary Category Image Management */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                    Category Image <span className="text-[#C9A227] font-semibold">(Used in Circular Category Card)</span>
                  </label>
                  {formCatImage && (
                    <button
                      type="button"
                      onClick={() => setFormCatImage("")}
                      className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
                    >
                      Remove Image
                    </button>
                  )}
                </div>

                {/* Live Circular & Square Preview */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden relative border-2 border-[#C9A227] shadow-sm bg-white shrink-0">
                    {formCatImage ? (
                      <img
                        src={formCatImage}
                        alt="Category circular preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=400&h=400&fit=crop";
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 text-[10px] font-bold text-center p-1">
                        <span>No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    {/* Hidden file input */}
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/jpeg,image/png,image/webp,image/avif"
                      className="hidden"
                    />

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        disabled={isUploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                        className="px-3.5 py-1.5 rounded-xl bg-[#064E3B] text-[#FAF8F1] text-xs font-bold hover:bg-[#0B3D2E] transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isUploadingImage ? (
                          <>
                            <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Uploading...</span>
                          </>
                        ) : (
                          <>
                            <SparklesIcon size={12} />
                            <span>{formCatImage ? "Replace Image" : "Upload Image"}</span>
                          </>
                        )}
                      </button>
                      <span className="text-[11px] text-stone-500">Max 5MB (PNG, JPG, WebP)</span>
                    </div>

                    <input
                      type="text"
                      value={formCatImage}
                      onChange={(e) => setFormCatImage(e.target.value)}
                      placeholder="Or enter image URL (https://...)"
                      className="w-full rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-700 focus:border-[#C9A227] focus:outline-none bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Home Page Showcase & Active Switches */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-stone-50 rounded-2xl border border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formCatShowOnHome}
                    onChange={(e) => setFormCatShowOnHome(e.target.checked)}
                    className="w-4 h-4 rounded text-[#064E3B] focus:ring-[#C9A227] accent-[#064E3B]"
                  />
                  <span className="text-xs font-bold text-stone-800">Show on Home Page</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formCatIsActive}
                    onChange={(e) => setFormCatIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-[#064E3B] focus:ring-[#C9A227] accent-[#064E3B]"
                  />
                  <span className="text-xs font-bold text-stone-800">Active on Store</span>
                </label>
              </div>

              {/* Sub-Categories Builder */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Sub-Categories & Silhouettes
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="text"
                    value={formSubInput}
                    onChange={(e) => setFormSubInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddSubcategoryTag();
                      }
                    }}
                    placeholder="Type subcategory and press Enter"
                    className="flex-1 rounded-xl border border-stone-200 px-3.5 py-2 text-xs focus:border-[#C9A227] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategoryTag}
                    className="px-3.5 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold hover:bg-[#0B3D2E] transition shrink-0 cursor-pointer"
                  >
                    + Add
                  </button>
                </div>

                {/* Sub-categories chips */}
                <div className="mt-2.5 flex flex-wrap gap-1.5 min-h-[40px] max-h-32 overflow-y-auto p-2 bg-stone-50 rounded-xl border border-stone-200">
                  {formSubcategories.length === 0 ? (
                    <span className="text-xs text-stone-400 italic">No subcategories added yet. Type above and click + Add.</span>
                  ) : (
                    formSubcategories.map((sub) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 text-xs font-medium shadow-2xs"
                      >
                        <span>{sub}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubcategoryTag(sub)}
                          className="text-stone-400 hover:text-rose-600 font-bold ml-1 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                {editingCategory && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      handleDeleteCategory(editingCategory);
                    }}
                    className="mr-auto px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <TrashIcon size={13} />
                    <span>Delete</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#DFC15E] text-[#041D16] text-xs font-bold shadow-md hover:brightness-105 transition uppercase tracking-wider cursor-pointer"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purge All Categories Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-7 text-stone-800 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-200">
                <TrashIcon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-900 leading-tight">Delete All Categories?</h3>
                <p className="text-xs text-rose-600 font-semibold">Irreversible Action</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently purge <strong>all {categoriesList.length} categories</strong> from MongoDB Atlas?
            </p>

            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 space-y-1">
              <p className="font-bold">⚠️ Warning:</p>
              <p>This will wipe all category taxonomies, subcategories, and showcase configurations.</p>
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
                    <span>Purging...</span>
                  </>
                ) : (
                  <span>Yes, Purge All Categories</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Subcategory Modal */}
      {quickSubModalCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-stone-900">Add Sub-Category</h3>
                <p className="text-xs text-stone-500">For {quickSubModalCat.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setQuickSubModalCat(null)}
                className="text-stone-400 hover:text-stone-700 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleQuickAddSubcategory} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                  Sub-Category Name
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={quickSubName}
                  onChange={(e) => setQuickSubName(e.target.value)}
                  placeholder="e.g. 90s Cotton, Zip nighty"
                  className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickSubModalCat(null)}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold hover:bg-[#0B3D2E] transition cursor-pointer"
                >
                  Add Sub-Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
