import { useState, useEffect } from "react";
import type { ShippingRule, CODRule, CODAdvanceRule } from "../../types/store";
import { adminApi } from "../../services/api";
import { ShippingIcon, CodIcon, PlusIcon, CheckIcon, TrashIcon } from "../../components/admin/AdminIcons";

export default function AdminShippingCod() {
  const [activeSubTab, setActiveSubTab] = useState<"shipping" | "cod" | "advance">("shipping");

  const [shippingRules, setShippingRules] = useState<ShippingRule[]>([]);
  const [codRules, setCODRules] = useState<CODRule[]>([]);
  const [advanceRules, setAdvanceRules] = useState<CODAdvanceRule[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Shipping Rule Modal
  const [showShipModal, setShowShipModal] = useState(false);
  const [newShipRule, setNewShipRule] = useState<ShippingRule>({
    id: "",
    state: "Tamil Nadu",
    category: "Nighty",
    minQty: 3,
    maxQty: 999,
    minOrderValue: 999,
    shippingType: "FREE",
    charge: 0,
    status: "active",
  });

  // New Advance Rule Modal
  const [showAdvModal, setShowAdvModal] = useState(false);
  const [newAdvRule, setNewAdvRule] = useState<CODAdvanceRule>({
    id: "",
    category: "Nighty",
    quantityRange: "3 Pcs",
    minQty: 3,
    maxQty: 3,
    advanceAmount: 100,
    status: "active",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    const [ship, cod, adv] = await Promise.all([
      adminApi.getShippingRules(),
      adminApi.getCODRules(),
      adminApi.getCODAdvanceRules(),
    ]);
    setShippingRules(ship);
    setCODRules(cod);
    setAdvanceRules(adv);
  };

  // Shipping rule actions
  const handleSaveShippingRule = async () => {
    const id = newShipRule.id || `ship-${Date.now()}`;
    await adminApi.saveShippingRule({ ...newShipRule, id });
    showToast("Shipping rule saved successfully.");
    setShowShipModal(false);
    loadAll();
  };

  const handleDeleteShippingRule = async (id: string) => {
    await adminApi.deleteShippingRule(id);
    showToast("Shipping rule removed.");
    loadAll();
  };

  // COD advance rule actions
  const handleSaveAdvanceRule = async () => {
    const id = newAdvRule.id || `coda-${Date.now()}`;
    await adminApi.saveCODAdvanceRule({ ...newAdvRule, id });
    showToast("COD Advance rule saved.");
    setShowAdvModal(false);
    loadAll();
  };

  const handleDeleteAdvanceRule = async (id: string) => {
    await adminApi.deleteCODAdvanceRule(id);
    showToast("Advance rule removed.");
    loadAll();
  };

  // COD general settings
  const handleUpdateGeneralCOD = async (field: keyof CODRule, val: any) => {
    if (codRules.length === 0) return;
    const updated = { ...codRules[0], [field]: val };
    await adminApi.saveCODRule(updated);
    loadAll();
    showToast("COD configuration updated.");
  };

  return (
    <div className="space-y-6 font-body">
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#041D16] text-white border border-[#C9A227] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckIcon size={14} />
          </div>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Shipping & COD Delivery Rules
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F1] border border-[#C9A227]/40 text-[#8A5F38] text-xs font-bold font-mono">
            State-Wise Matrix
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Configure state-level delivery thresholds, free shipping incentives, and advance booking risk mitigation.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-stone-100 p-1 rounded-2xl w-fit border border-stone-200 text-xs font-bold text-stone-600">
        <button
          onClick={() => setActiveSubTab("shipping")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeSubTab === "shipping"
              ? "bg-[#041D16] text-[#DFC15E] shadow-2xs"
              : "hover:text-stone-900"
          }`}
        >
          🚚 Shipping Thresholds ({shippingRules.length})
        </button>
        <button
          onClick={() => setActiveSubTab("cod")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeSubTab === "cod"
              ? "bg-[#041D16] text-[#DFC15E] shadow-2xs"
              : "hover:text-stone-900"
          }`}
        >
          💵 Cash on Delivery (COD) Settings
        </button>
        <button
          onClick={() => setActiveSubTab("advance")}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeSubTab === "advance"
              ? "bg-[#041D16] text-[#DFC15E] shadow-2xs"
              : "hover:text-stone-900"
          }`}
        >
          📊 Advance Booking Matrix ({advanceRules.length})
        </button>
      </div>

      {/* 1. SHIPPING RULES TAB */}
      {activeSubTab === "shipping" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-stone-500">
              State-level rules for free shipping and parcel delivery rates.
            </p>
            <button
              onClick={() => {
                setNewShipRule({
                  id: "",
                  state: "Tamil Nadu",
                  category: "Nighty",
                  minQty: 3,
                  maxQty: 999,
                  minOrderValue: 999,
                  shippingType: "FREE",
                  charge: 0,
                  status: "active",
                });
                setShowShipModal(true);
              }}
              className="px-4 py-2 bg-[#064E3B] text-white rounded-xl text-xs font-bold hover:bg-[#0B3D2E] inline-flex items-center gap-2 uppercase tracking-wider"
            >
              <PlusIcon size={14} />
              <span>Add Shipping Rule</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-4">Destination State</th>
                  <th className="p-4">Apparel Category</th>
                  <th className="p-4">Min Pieces</th>
                  <th className="p-4">Min Cart Value</th>
                  <th className="p-4">Shipping Mode</th>
                  <th className="p-4">Parcel Fee</th>
                  <th className="p-4">Rule Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {shippingRules.map((rule) => (
                  <tr key={rule.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4 font-bold text-stone-900">{rule.state}</td>
                    <td className="p-4 text-stone-700">{rule.category}</td>
                    <td className="p-4 font-semibold">{rule.minQty} Pcs</td>
                    <td className="p-4">₹{rule.minOrderValue}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        rule.shippingType === "FREE" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-blue-50 text-blue-800"
                      }`}>
                        {rule.shippingType}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-stone-900">₹{rule.charge}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        {rule.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteShippingRule(rule.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. GENERAL COD SETTINGS */}
      {activeSubTab === "cod" && codRules[0] && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-2xs space-y-5 text-xs max-w-2xl">
          <h3 className="font-display font-bold text-lg text-stone-900">
            Cash on Delivery Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                Standard COD Handling Charge (₹)
              </label>
              <input
                type="number"
                value={codRules[0].shippingCharge}
                onChange={(e) => handleUpdateGeneralCOD("shippingCharge", Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                Free Shipping Cart Threshold (₹)
              </label>
              <input
                type="number"
                value={codRules[0].freeShippingThreshold}
                onChange={(e) => handleUpdateGeneralCOD("freeShippingThreshold", Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-2">
              COD Supported Territory & States
            </label>
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap gap-2">
              {codRules[0].availableStates.map((st) => (
                <span key={st} className="px-3 py-1.5 rounded-xl bg-white border border-stone-200 font-bold text-stone-800 text-xs shadow-2xs">
                  📍 {st}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. COD ADVANCE RULES TABLE */}
      {activeSubTab === "advance" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-stone-500">
              Advance token deposit collected via UPI to protect parcel returns and customer confirmation.
            </p>
            <button
              onClick={() => {
                setNewAdvRule({
                  id: "",
                  category: "Nighty",
                  quantityRange: "3 Pcs",
                  minQty: 3,
                  maxQty: 3,
                  advanceAmount: 100,
                  status: "active",
                });
                setShowAdvModal(true);
              }}
              className="px-4 py-2 bg-[#064E3B] text-white rounded-xl text-xs font-bold hover:bg-[#0B3D2E] inline-flex items-center gap-2 uppercase tracking-wider"
            >
              <PlusIcon size={14} />
              <span>Add Advance Tier</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="p-4">Apparel Category</th>
                  <th className="p-4">Quantity Tier</th>
                  <th className="p-4">Mandatory Advance Token (₹)</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {advanceRules.map((r) => (
                  <tr key={r.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4 font-bold text-stone-900">{r.category}</td>
                    <td className="p-4 text-stone-700 font-semibold">{r.quantityRange}</td>
                    <td className="p-4 font-display font-bold text-[#064E3B] text-base">
                      ₹{r.advanceAmount}
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteAdvanceRule(r.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* NEW SHIPPING RULE MODAL */}
      {showShipModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-7 text-stone-800 text-xs space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-lg text-stone-900">Add Destination Rule</h3>
              <button onClick={() => setShowShipModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">State</label>
                <input
                  type="text"
                  value={newShipRule.state}
                  onChange={(e) => setNewShipRule({ ...newShipRule, state: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Category</label>
                <input
                  type="text"
                  value={newShipRule.category}
                  onChange={(e) => setNewShipRule({ ...newShipRule, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-stone-50 border rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold mb-1">Min Quantity</label>
                <input
                  type="number"
                  value={newShipRule.minQty}
                  onChange={(e) => setNewShipRule({ ...newShipRule, minQty: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 bg-stone-50 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Rule Action</label>
                <select
                  value={newShipRule.shippingType}
                  onChange={(e) => setNewShipRule({ ...newShipRule, shippingType: e.target.value as any })}
                  className="w-full px-4 py-2.5 bg-stone-50 border rounded-xl font-bold"
                >
                  <option value="FREE">FREE SHIPPING</option>
                  <option value="FIXED">FIXED CHARGE</option>
                  <option value="PER_ITEM">PER ITEM CHARGE</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowShipModal(false)} className="px-4 py-2 border rounded-xl font-semibold">
                Cancel
              </button>
              <button onClick={handleSaveShippingRule} className="px-5 py-2 bg-[#064E3B] text-white rounded-xl font-bold">
                Save Shipping Rule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW ADVANCE RULE MODAL */}
      {showAdvModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-7 text-stone-800 text-xs space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-display font-bold text-lg text-stone-900">Add COD Advance Tier</h3>
              <button onClick={() => setShowAdvModal(false)} className="text-stone-400 hover:text-stone-700">✕</button>
            </div>

            <div>
              <label className="block font-bold mb-1">Category</label>
              <input
                type="text"
                value={newAdvRule.category}
                onChange={(e) => setNewAdvRule({ ...newAdvRule, category: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border rounded-xl"
                placeholder="e.g. Nighty or Salwar"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Quantity Label</label>
              <input
                type="text"
                value={newAdvRule.quantityRange}
                onChange={(e) => setNewAdvRule({ ...newAdvRule, quantityRange: e.target.value })}
                className="w-full px-4 py-2.5 bg-stone-50 border rounded-xl"
                placeholder="e.g. 3 Pcs or Up to 5"
              />
            </div>

            <div>
              <label className="block font-bold mb-1">Advance Amount (₹)</label>
              <input
                type="number"
                value={newAdvRule.advanceAmount}
                onChange={(e) => setNewAdvRule({ ...newAdvRule, advanceAmount: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-stone-50 border rounded-xl font-bold text-base"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t">
              <button onClick={() => setShowAdvModal(false)} className="px-4 py-2 border rounded-xl font-semibold">
                Cancel
              </button>
              <button onClick={handleSaveAdvanceRule} className="px-5 py-2 bg-[#064E3B] text-white rounded-xl font-bold">
                Save Advance Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
