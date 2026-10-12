import React, { useState, useEffect, useRef } from "react";
import type { ComboOffer } from "../../types/store";
import { adminApi } from "../../services/api";
import { CombosIcon, PlusIcon, CheckIcon, TrashIcon, SparklesIcon } from "../../components/admin/AdminIcons";

export default function AdminCombos() {
  const [combos, setCombos] = useState<ComboOffer[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const defaultForm: ComboOffer = {
    id: "",
    name: "BUY 3 PURE COTTON NIGHTIES SPECIAL",
    description: "Handcrafted pure cotton breathable nighties multi-pack with all-India free delivery",
    productIds: [],
    category: "nighty",
    requiredQuantity: 3,
    discountType: "combo_price",
    discountValue: 398,
    comboPrice: 1499,
    normalTotal: 1897,
    image: "",
    freeShipping: true,
    startDate: new Date().toISOString().slice(0, 16),
    endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    status: "active",
  };

  const [form, setForm] = useState<ComboOffer>(defaultForm);

  const loadCombos = async () => {
    const list = await adminApi.getComboOffers();
    setCombos(list);
  };

  useEffect(() => {
    loadCombos();
  }, []);

  const handleOpenNew = () => {
    setEditingId(null);
    setForm({
      ...defaultForm,
      id: `combo-${Date.now()}`,
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (c: ComboOffer) => {
    setEditingId(c.id);
    setForm({
      ...c,
      startDate: c.startDate ? (c.startDate.length === 10 ? `${c.startDate}T00:00` : c.startDate.slice(0, 16)) : "",
      endDate: c.endDate ? (c.endDate.length === 10 ? `${c.endDate}T23:59` : c.endDate.slice(0, 16)) : "",
    });
    setShowAddModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await adminApi.uploadSingleImage(file);
      if (res.success && res.url) {
        setForm((prev) => ({ ...prev, image: res.url! }));
        setToast("Offer image uploaded successfully!");
      } else {
        setToast("Failed to upload offer image.");
      }
    } catch {
      setToast("Image upload error.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleToggleStatus = async (c: ComboOffer) => {
    const updatedStatus = c.status === "active" ? "inactive" : "active";
    await adminApi.saveComboOffer({ ...c, status: updatedStatus });
    await loadCombos();
    window.dispatchEvent(new CustomEvent("nithi_combo_updated"));
    setToast(
      updatedStatus === "active"
        ? `Offer "${c.name}" is now Published on storefront!`
        : `Offer "${c.name}" is now Unpublished (Hidden).`
    );
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setToast("Please enter an offer name.");
      setTimeout(() => setToast(null), 3000);
      return;
    }

    const calculatedDiscount = Math.max(0, form.normalTotal - form.comboPrice);
    const id = editingId || form.id || `combo-${Date.now()}`;

    await adminApi.saveComboOffer({
      ...form,
      id,
      discountValue: calculatedDiscount,
    });

    await loadCombos();
    window.dispatchEvent(new CustomEvent("nithi_combo_updated"));
    try { localStorage.setItem("nithi_combo_version", Date.now().toString()); } catch (e) {}

    setShowAddModal(false);
    setToast(editingId ? "Combo offer updated successfully." : "Combo offer published successfully.");
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this Combo Offer?")) {
      await adminApi.deleteComboOffer(id);
      await loadCombos();
      window.dispatchEvent(new CustomEvent("nithi_combo_updated"));
      try { localStorage.setItem("nithi_combo_version", Date.now().toString()); } catch (e) {}
      setToast("Combo offer removed.");
      setTimeout(() => setToast(null), 3000);
    }
  };

  return (
    <div className="space-y-6 font-body">
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#041D16] text-white border border-[#C9A227] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckIcon size={14} />
          </div>
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Combo Bundles & Multi-Pack Deals
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F1] border border-[#C9A227]/40 text-[#8A5F38] text-xs font-bold font-mono">
              {combos.filter((c) => c.status === "active").length} Published / {combos.length} Total
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Configure multi-piece countdown popup deals (e.g. Buy 3 Nighties for ₹1,499) with live countdown timers and automated storefront synchronization.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="px-4 py-2.5 bg-[#064E3B] hover:bg-[#0B3D2E] text-white text-xs font-bold rounded-xl shadow-sm transition-all inline-flex items-center gap-2 uppercase tracking-wider cursor-pointer"
        >
          <PlusIcon size={14} />
          <span>New Combo Bundle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {combos.map((c) => (
          <div
            key={c.id}
            className={`bg-white rounded-3xl border ${
              c.status === "active" ? "border-[#C9A227]/60 shadow-sm" : "border-stone-200 opacity-75"
            } p-6 shadow-2xs hover:shadow-md transition-all space-y-4 text-xs`}
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider ${
                      c.status === "active"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-stone-100 text-stone-600 border border-stone-200"
                    }`}
                  >
                    ● {c.status === "active" ? "PUBLISHED (POPUP ACTIVE)" : "DRAFT (HIDDEN)"}
                  </span>
                  <span className="text-[10px] font-bold text-[#C9A227] uppercase tracking-wider bg-[#FAF8F1] px-2 py-0.5 rounded-md border border-[#E8E2D5]">
                    {c.category || "Nighty"}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-stone-900 mt-2">{c.name}</h3>
                {c.description && (
                  <p className="text-stone-500 text-xs mt-0.5 line-clamp-2">{c.description}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(c)}
                  className="px-2.5 py-1.5 rounded-xl font-semibold text-xs border border-stone-300 hover:border-[#064E3B] text-stone-700 hover:text-[#064E3B] cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(c)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors border cursor-pointer ${
                    c.status === "active"
                      ? "bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100"
                      : "bg-[#064E3B] text-white border-[#064E3B] hover:bg-[#0B3D2E]"
                  }`}
                  title={c.status === "active" ? "Click to Unpublish / Hide" : "Click to Publish on Website"}
                >
                  {c.status === "active" ? "Unpublish" : "Publish"}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                  title="Delete Combo"
                >
                  <TrashIcon size={15} />
                </button>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Threshold Garment Count:</span>
                <span className="font-bold text-stone-900">{c.requiredQuantity} Dresses</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Special Combo Price:</span>
                <span className="font-bold text-[#064E3B] text-base font-display">₹{c.comboPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Original Combined Price:</span>
                <span className="line-through text-stone-400">₹{c.normalTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-stone-200">
                <span>Customer Savings:</span>
                <span>Save ₹{(c.discountValue || (c.normalTotal - c.comboPrice)).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100 flex-wrap gap-2">
              <span className="font-semibold text-emerald-800">🚚 Free Shipping: {c.freeShipping ? "Included" : "Excluded"}</span>
              <span className="font-mono text-[10px] text-stone-600">
                {c.endDate ? `Ends: ${new Date(c.endDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}` : "No expiry"}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 sm:p-7 text-stone-800 text-xs space-y-4 my-8 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-lg text-stone-900">
                {editingId ? "Edit Combo Bundle" : "Create New Combo Bundle"}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm p-1 rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Offer Title</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. BUY 3 PURE COTTON NIGHTIES SPECIAL"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Offer Description (Subtitle)</label>
                <input
                  type="text"
                  value={form.description || ""}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Handcrafted pure cotton breathable nighties with free shipping"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Target Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  >
                    <option value="nighty">Nighties</option>
                    <option value="night-dress">Night Dress</option>
                    <option value="unstitched-salwar">Unstitched Salwar</option>
                    <option value="cord-set">Coord Sets</option>
                    <option value="kurtis">Kurtis & Tops</option>
                    <option value="salwar-set">Salwar Sets</option>
                    <option value="maxi">Maxi Gowns</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Required Quantity</label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={form.requiredQuantity}
                    onChange={(e) => setForm({ ...form, requiredQuantity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Original Total (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.normalTotal}
                    onChange={(e) => setForm({ ...form, normalTotal: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl font-medium text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Special Combo Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.comboPrice}
                    onChange={(e) => setForm({ ...form, comboPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold text-[#064E3B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-900 font-bold text-xs">
                <span>Calculated Customer Savings:</span>
                <span className="text-sm">₹{Math.max(0, form.normalTotal - form.comboPrice).toLocaleString("en-IN")}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Offer Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Offer End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Offer Image (Optional custom image)</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={form.image || ""}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://... or upload below"
                    className="flex-1 px-3.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:bg-white focus:outline-none"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded-xl font-semibold cursor-pointer text-xs"
                  >
                    {isUploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.freeShipping}
                    onChange={(e) => setForm({ ...form, freeShipping: e.target.checked })}
                    className="w-4 h-4 accent-[#064E3B] rounded"
                  />
                  <span className="font-semibold text-stone-700">Include Free Shipping</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.status === "active"}
                    onChange={(e) => setForm({ ...form, status: e.target.checked ? "active" : "inactive" })}
                    className="w-4 h-4 accent-[#064E3B] rounded"
                  />
                  <span className="font-semibold text-stone-700">Active / Published on Popup</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#064E3B] hover:bg-[#0B3D2E] text-white rounded-xl font-bold cursor-pointer transition-all shadow-sm"
                >
                  {editingId ? "Update Combo Offer" : "Publish Combo Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
