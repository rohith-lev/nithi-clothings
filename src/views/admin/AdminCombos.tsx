import { useState, useEffect } from "react";
import type { ComboOffer } from "../../types/store";
import { adminApi } from "../../services/api";
import { CombosIcon, PlusIcon, CheckIcon, TrashIcon, SparklesIcon } from "../../components/admin/AdminIcons";

export default function AdminCombos() {
  const [combos, setCombos] = useState<ComboOffer[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState<ComboOffer>({
    id: "",
    name: "BUY 4 NIGHTIES COMBO SPECIAL",
    productIds: [],
    category: "nighty",
    requiredQuantity: 4,
    discountType: "combo_price",
    discountValue: 397,
    comboPrice: 1999,
    normalTotal: 2396,
    freeShipping: true,
    startDate: "2026-09-01",
    endDate: "2026-11-30",
    status: "active",
  });

  const loadCombos = async () => {
    const list = await adminApi.getComboOffers();
    setCombos(list);
  };

  useEffect(() => {
    loadCombos();
  }, []);

  const handleSave = async () => {
    const id = form.id || `combo-${Date.now()}`;
    await adminApi.saveComboOffer({ ...form, id });
    await loadCombos();
    setShowAddModal(false);
    setToast("Combo offer created successfully.");
    setTimeout(() => setToast(null), 3000);
  };

  const handleDelete = async (id: string) => {
    await adminApi.deleteComboOffer(id);
    await loadCombos();
    setToast("Combo offer removed.");
    setTimeout(() => setToast(null), 3000);
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
              {combos.length} Active Deals
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Configure multi-piece discount tiers (e.g. Buy 4 Nighties for ₹1,999) with automated checkout deductions and free shipping triggers.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-[#064E3B] hover:bg-[#0B3D2E] text-white text-xs font-bold rounded-xl shadow-sm transition-all inline-flex items-center gap-2 uppercase tracking-wider"
        >
          <PlusIcon size={14} />
          <span>New Combo Bundle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {combos.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs hover:shadow-md transition-all admin-hover-lift space-y-4 text-xs"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-[10px] uppercase tracking-wider">
                  ● {c.status}
                </span>
                <h3 className="font-display font-bold text-lg text-stone-900 mt-2">{c.name}</h3>
              </div>
              <button
                onClick={() => handleDelete(c.id)}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                title="Delete Combo"
              >
                <TrashIcon size={15} />
              </button>
            </div>

            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-2">
              <div className="flex justify-between text-stone-600">
                <span>Threshold Garment Count:</span>
                <span className="font-bold text-stone-900">{c.requiredQuantity} Dresses</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Special Bundle Price:</span>
                <span className="font-bold text-[#064E3B] text-base font-display">₹{c.comboPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Standard Individual Value:</span>
                <span className="line-through text-stone-400">₹{c.normalTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-stone-200">
                <span>Customer Instant Benefit:</span>
                <span>Save ₹{c.discountValue}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-stone-500 pt-2 border-t border-stone-100">
              <span className="font-semibold text-emerald-800">🚚 Free Shipping: {c.freeShipping ? "Included" : "Excluded"}</span>
              <span className="font-mono">Valid until: {c.endDate}</span>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-7 text-stone-800 text-xs space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-lg text-stone-900">
                Create Multi-Pack Deal
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1.5">Offer Marketing Title</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Required Quantity</label>
                <input
                  type="number"
                  value={form.requiredQuantity}
                  onChange={(e) => setForm({ ...form, requiredQuantity: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">Combo Price (₹)</label>
                <input
                  type="number"
                  value={form.comboPrice}
                  onChange={(e) => setForm({ ...form, comboPrice: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl font-bold text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2.5 border border-stone-300 rounded-xl text-stone-700 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2.5 bg-[#064E3B] text-white rounded-xl font-bold hover:bg-[#0B3D2E]"
              >
                Publish Combo Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
