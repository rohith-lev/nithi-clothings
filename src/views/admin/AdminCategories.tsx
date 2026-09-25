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
  const [formSubInput, setFormSubInput] = useState("");
  const [formSubcategories, setFormSubcategories] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const refreshData = async () => {
    const [cats, prods] = await Promise.all([
      adminApi.getCategories(),
      adminApi.getProducts(),
    ]);
    setCategoriesList(cats);
    setProducts(prods);
  };

  useEffect(() => {
    refreshData();
  }, []);

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

  // Helper to get all subcategory/silhouette names for a category
  const getSubcategories = (cat: Category): string[] => {
    return (cat.subcategories || []).map((s) => s.name);
  };

  const handleOpenAddModal = () => {
    setEditingCategory(null);
    setFormCatName("");
    setFormCatSlug("");
    setFormCatImage("https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format");
    setFormSubInput("");
    setFormSubcategories([]);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (cat: Category) => {
    setEditingCategory(cat);
    setFormCatName(cat.name);
    setFormCatSlug(cat.slug);
    setFormCatImage(cat.image);
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
      subcategories: subObjects,
    };

    const res = await adminApi.saveCategory(catPayload);
    setIsAddModalOpen(false);

    if (res.success) {
      setToastMessage({
        type: "success",
        text: `Category "${catPayload.name}" saved with ${subObjects.length} sub-categories!`,
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
      await adminApi.deleteCategory(cat.id);
      setToastMessage({ type: "success", text: `Category "${cat.name}" removed from taxonomy.` });
      await refreshData();
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
              {categoriesList.length} Collections
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Organize ethnic wear classifications, occasion tags, sub-categories, and storefront navigation hierarchies.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#064E3B] to-[#0B3D2E] text-[#FAF8F1] text-xs font-bold hover:brightness-110 transition-all shadow-sm flex items-center gap-1.5"
          >
            <PlusIcon size={14} />
            <span>Add Manual Category</span>
          </button>
          <Link
            to="/admin/products"
            className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-bold text-stone-700 hover:border-[#064E3B] hover:text-[#064E3B] transition-all shadow-2xs flex items-center gap-1.5"
          >
            <ProductsIcon size={14} />
            <span>Manage All Products ({totalCatalogedProducts})</span>
          </Link>
          <Link
            to="/shop"
            target="_blank"
            className="px-3.5 py-2 rounded-xl bg-stone-100 border border-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-200 transition-all shadow-2xs flex items-center gap-1.5"
          >
            <span>Live Storefront</span>
            <ExternalLinkIcon size={13} />
          </Link>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl p-4 shadow-sm border ${
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
            className="text-stone-400 hover:text-stone-600 text-xs"
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

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#C9A227]/50 transition-all flex flex-col group"
            >
              <div className="relative h-48 bg-stone-100 overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041D16]/95 via-[#041D16]/40 to-transparent flex items-end p-5">
                  <div className="w-full flex items-end justify-between">
                    <div>
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
                        className="px-2.5 py-1 rounded-lg bg-white/20 hover:bg-white/40 text-white text-xs font-semibold backdrop-blur-xs transition"
                        title="Edit category & subcategories"
                      >
                        Edit
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

              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-stone-400 uppercase tracking-wider text-[10px]">
                      Subcategories & Silhouettes
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setQuickSubModalCat(cat);
                        setQuickSubName("");
                      }}
                      className="text-[11px] font-bold text-[#8A5F38] hover:text-[#064E3B] flex items-center gap-1"
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
                      className="text-stone-400 hover:text-rose-600 transition text-[11px] font-semibold"
                      title="Delete category"
                    >
                      Delete
                    </button>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Live
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add / Edit Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-display text-lg font-bold text-stone-900">
                {editingCategory ? "Edit Category & Subcategories" : "Add Manual Category"}
              </h2>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 flex items-center justify-center font-bold"
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
                  placeholder="e.g. Silk Sarees, Designer Kurtis, Bridal Wear"
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
                    placeholder="silk-sarees"
                    className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 font-mono text-xs focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={formCatImage}
                    onChange={(e) => setFormCatImage(e.target.value)}
                    placeholder="https://..."
                    className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-2 text-xs focus:border-[#C9A227] focus:outline-none"
                  />
                </div>
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
                    placeholder="Type subcategory (e.g. Zip nighty, Anarkali cut) and press Enter"
                    className="flex-1 rounded-xl border border-stone-200 px-3.5 py-2 text-xs focus:border-[#C9A227] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubcategoryTag}
                    className="px-3.5 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold hover:bg-[#0B3D2E] transition shrink-0"
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
                          className="text-stone-400 hover:text-rose-600 font-bold ml-1 text-xs"
                        >
                          ✕
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#DFC15E] text-[#041D16] text-xs font-bold shadow-md hover:brightness-105 transition uppercase tracking-wider"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Add Subcategory Modal */}
      {quickSubModalCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-base text-stone-900">Add Sub-Category</h3>
                <p className="text-xs text-stone-500">For {quickSubModalCat.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setQuickSubModalCat(null)}
                className="text-stone-400 hover:text-stone-700 font-bold"
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
                  placeholder="e.g. Front Zip 55 inch, Ready to wear"
                  className="mt-1 w-full rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-semibold focus:border-[#C9A227] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setQuickSubModalCat(null)}
                  className="px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold hover:bg-[#0B3D2E] transition"
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
