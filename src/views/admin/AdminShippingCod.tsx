import { useState, useEffect } from "react";
import { useLocation } from "react-router";
import type { ShippingRule, CODRule, CODAdvanceRule } from "../../types/store";
import { adminApi } from "../../services/api";
import {
  ShippingIcon,
  CodIcon,
  PlusIcon,
  CheckIcon,
  TrashIcon,
  EditIcon,
} from "../../components/admin/AdminIcons";

const DEFAULT_CATEGORIES = [
  "All Categories",
  "Nighty",
  "Kurtis",
  "Sarees",
  "Kids Wear",
  "Unstitched salwar material",
  "Salwar set",
  "Kurtis(Tops)",
];

const POPULAR_STATES = [
  "Tamil Nadu",
  "South 4 (AP/TG/KL/KA)",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
  "Maharashtra",
  "Rest of India",
  "All India",
];

const DEFAULT_COD_GENERAL: CODRule = {
  id: "cod-general-default",
  availableStates: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"],
  minQuantity: 1,
  shippingCharge: 70,
  freeShippingThreshold: 2000,
  status: "active",
};

export default function AdminShippingCod() {
  const location = useLocation();
  const initialTab = location.pathname.includes("/cod") ? "cod" : "shipping";
  const [activeSubTab, setActiveSubTab] = useState<"shipping" | "cod" | "advance">(initialTab);

  const [shippingRules, setShippingRules] = useState<ShippingRule[]>([]);
  const [codRules, setCODRules] = useState<CODRule[]>([DEFAULT_COD_GENERAL]);
  const [advanceRules, setAdvanceRules] = useState<CODAdvanceRule[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Shipping Rule Modal State
  const [showShipModal, setShowShipModal] = useState(false);
  const [editingShipRule, setEditingShipRule] = useState<ShippingRule | null>(null);
  const [newShipRule, setNewShipRule] = useState<ShippingRule>({
    id: "",
    state: "Tamil Nadu",
    category: "All Categories",
    minQty: 1,
    maxQty: 999,
    minOrderValue: 0,
    shippingType: "FREE",
    charge: 0,
    status: "active",
  });

  // Advance Rule Modal State
  const [showAdvModal, setShowAdvModal] = useState(false);
  const [editingAdvRule, setEditingAdvRule] = useState<CODAdvanceRule | null>(null);
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
    if (location.pathname.includes("/cod") && activeSubTab === "shipping") {
      setActiveSubTab("cod");
    }
  }, [location.pathname]);

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [ship, cod, adv] = await Promise.all([
        adminApi.getShippingRules(),
        adminApi.getCODRules(),
        adminApi.getCODAdvanceRules(),
      ]);
      setShippingRules(ship || []);
      setCODRules(cod && cod.length > 0 ? cod : [DEFAULT_COD_GENERAL]);
      setAdvanceRules(adv || []);
    } catch (err) {
      console.error("Error loading rules:", err);
      showToast("Could not load rules from server.");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // SHIPPING RULES HANDLERS
  // ----------------------------------------------------
  const handleOpenAddShippingRule = () => {
    setEditingShipRule(null);
    setNewShipRule({
      id: "",
      state: "Tamil Nadu",
      category: "All Categories",
      minQty: 1,
      maxQty: 999,
      minOrderValue: 0,
      shippingType: "FREE",
      charge: 0,
      status: "active",
    });
    setShowShipModal(true);
  };

  const handleOpenEditShippingRule = (rule: ShippingRule) => {
    setEditingShipRule(rule);
    setNewShipRule({
      ...rule,
      charge: rule.charge !== undefined ? rule.charge : 0,
      minQty: rule.minQty !== undefined ? rule.minQty : 1,
      maxQty: rule.maxQty !== undefined ? rule.maxQty : 999,
      minOrderValue: rule.minOrderValue !== undefined ? rule.minOrderValue : 0,
      status: rule.status || "active",
    });
    setShowShipModal(true);
  };

  const handleSaveShippingRule = async () => {
    const id = newShipRule.id || `ship-${Date.now()}`;
    const cleanCharge = newShipRule.shippingType === "FREE" ? 0 : Number(newShipRule.charge) || 0;
    const payload: ShippingRule = {
      ...newShipRule,
      id,
      charge: cleanCharge,
      minQty: Number(newShipRule.minQty) || 1,
      maxQty: Number(newShipRule.maxQty) || 999,
      minOrderValue: Number(newShipRule.minOrderValue) || 0,
    };

    const isEdit = Boolean(editingShipRule);
    await adminApi.saveShippingRule(payload);
    showToast(isEdit ? "Shipping rule updated successfully." : "New shipping rule created.");
    setShowShipModal(false);
    setEditingShipRule(null);
    loadAll();
  };

  const handleDeleteShippingRule = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this shipping rule?")) return;
    await adminApi.deleteShippingRule(id);
    showToast("Shipping rule removed.");
    loadAll();
  };

  const handleToggleShippingRuleStatus = async (rule: ShippingRule) => {
    const nextStatus = rule.status === "active" ? "inactive" : "active";
    await adminApi.saveShippingRule({ ...rule, status: nextStatus });
    showToast(`Rule for "${rule.state}" marked as ${nextStatus}.`);
    loadAll();
  };

  // ----------------------------------------------------
  // COD ADVANCE RULES HANDLERS
  // ----------------------------------------------------
  const handleOpenAddAdvanceRule = () => {
    setEditingAdvRule(null);
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
  };

  const handleOpenEditAdvanceRule = (rule: CODAdvanceRule) => {
    setEditingAdvRule(rule);
    setNewAdvRule({
      ...rule,
      advanceAmount: rule.advanceAmount !== undefined ? rule.advanceAmount : 100,
      minQty: rule.minQty !== undefined ? rule.minQty : 1,
      maxQty: rule.maxQty !== undefined ? rule.maxQty : 999,
      status: rule.status || "active",
    });
    setShowAdvModal(true);
  };

  const handleSaveAdvanceRule = async () => {
    const id = newAdvRule.id || `coda-${Date.now()}`;
    const payload: CODAdvanceRule = {
      ...newAdvRule,
      id,
      advanceAmount: Number(newAdvRule.advanceAmount) || 0,
      minQty: Number(newAdvRule.minQty) || 1,
      maxQty: Number(newAdvRule.maxQty) || 999,
    };

    const isEdit = Boolean(editingAdvRule);
    await adminApi.saveCODAdvanceRule(payload);
    showToast(isEdit ? "COD advance rule updated." : "New advance rule added.");
    setShowAdvModal(false);
    setEditingAdvRule(null);
    loadAll();
  };

  const handleDeleteAdvanceRule = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this advance rule?")) return;
    await adminApi.deleteCODAdvanceRule(id);
    showToast("Advance rule removed.");
    loadAll();
  };

  const handleToggleAdvanceRuleStatus = async (rule: CODAdvanceRule) => {
    const nextStatus = rule.status === "active" ? "inactive" : "active";
    await adminApi.saveCODAdvanceRule({ ...rule, status: nextStatus });
    showToast(`Advance tier for "${rule.category}" marked as ${nextStatus}.`);
    loadAll();
  };

  // ----------------------------------------------------
  // GENERAL COD CONFIG HANDLERS
  // ----------------------------------------------------
  const currentCODRule = codRules[0] || DEFAULT_COD_GENERAL;

  const handleUpdateGeneralCOD = async (field: keyof CODRule, val: any) => {
    const updated = { ...currentCODRule, [field]: val };
    setCODRules([updated]);
    await adminApi.saveCODRule(updated);
    showToast("COD configuration updated.");
  };

  const handleToggleStateForCOD = async (stateName: string) => {
    const currentList = currentCODRule.availableStates || [];
    let updatedList: string[];
    if (currentList.includes(stateName)) {
      updatedList = currentList.filter((s) => s !== stateName);
    } else {
      updatedList = [...currentList, stateName];
    }
    await handleUpdateGeneralCOD("availableStates", updatedList);
  };

  return (
    <div className="space-y-6 font-body max-w-6xl">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#041D16] text-white border border-[#C9A227] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckIcon size={14} />
          </div>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Page Title & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200/80">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <span className="p-2 bg-emerald-950/10 text-[#064E3B] rounded-xl">
              <ShippingIcon size={20} />
            </span>
            <h1 className="font-display font-bold text-2xl text-stone-900 tracking-tight">
              Shipping & COD Delivery Rules
            </h1>
          </div>
          <p className="text-xs text-stone-500 max-w-2xl">
            Configure destination-based delivery fees, free parcel incentives, COD partial advance deposits, and risk mitigation rules.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 p-1.5 bg-stone-100 rounded-2xl border border-stone-200 text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveSubTab("shipping")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === "shipping"
                ? "bg-[#064E3B] text-white shadow-sm font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <ShippingIcon size={14} />
            <span>Shipping Rules ({shippingRules.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab("cod")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === "cod"
                ? "bg-[#064E3B] text-white shadow-sm font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <CodIcon size={14} />
            <span>General COD</span>
          </button>
          <button
            onClick={() => setActiveSubTab("advance")}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 ${
              activeSubTab === "advance"
                ? "bg-[#064E3B] text-white shadow-sm font-bold"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <span>🛡️ Advance Tiers ({advanceRules.length})</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. SHIPPING RULES TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === "shipping" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/60 p-4 rounded-2xl border border-stone-200/60">
            <div>
              <p className="font-bold text-xs text-stone-800">Destination Delivery & Parcel Fee Rules</p>
              <p className="text-[11px] text-stone-500">
                Click <strong>Edit (✏️)</strong> to modify parcel fee, free shipping piece thresholds, or order values. Click status to activate/deactivate.
              </p>
            </div>
            <button
              onClick={handleOpenAddShippingRule}
              className="px-4 py-2.5 bg-[#064E3B] text-white rounded-xl text-xs font-bold hover:bg-[#0B3D2E] inline-flex items-center gap-2 shadow-xs transition-all uppercase tracking-wider shrink-0"
            >
              <PlusIcon size={14} />
              <span>Add Shipping Rule</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[10px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Destination State</th>
                    <th className="p-4">Apparel Category</th>
                    <th className="p-4">Min Pieces</th>
                    <th className="p-4">Min Order Value</th>
                    <th className="p-4">Shipping Mode</th>
                    <th className="p-4">Parcel Fee</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-stone-400">
                        Loading shipping rules...
                      </td>
                    </tr>
                  ) : shippingRules.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-stone-500">
                        No shipping rules found. Click "Add Shipping Rule" to create one.
                      </td>
                    </tr>
                  ) : (
                    shippingRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4 font-bold text-stone-900">{rule.state}</td>
                        <td className="p-4 text-stone-700">{rule.category || "All Categories"}</td>
                        <td className="p-4 font-semibold text-stone-800">{rule.minQty || 1} Pcs</td>
                        <td className="p-4 font-medium text-stone-600">
                          {rule.minOrderValue && rule.minOrderValue > 0 ? `₹${rule.minOrderValue}` : "Any"}
                        </td>
                        <td className="p-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              rule.shippingType === "FREE"
                                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                : rule.shippingType === "FIXED"
                                ? "bg-blue-50 text-blue-800 border border-blue-200"
                                : "bg-purple-50 text-purple-800 border border-purple-200"
                            }`}
                          >
                            {rule.shippingType === "FREE"
                              ? "FREE SHIPPING"
                              : rule.shippingType === "FIXED"
                              ? "FIXED RATE"
                              : "PER ITEM"}
                          </span>
                        </td>
                        <td className="p-4 font-bold text-stone-900 font-mono text-sm">
                          {rule.shippingType === "FREE" ? "₹0 (Free)" : `₹${rule.charge || 0}`}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleShippingRuleStatus(rule)}
                            title="Click to toggle status"
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                              rule.status === "active"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                : "bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200"
                            }`}
                          >
                            {rule.status === "active" ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditShippingRule(rule)}
                              title="Edit shipping rule"
                              className="p-2 text-stone-600 hover:text-[#064E3B] hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                            >
                              <EditIcon size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteShippingRule(rule.id)}
                              title="Delete shipping rule"
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                            >
                              <TrashIcon size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. GENERAL COD SETTINGS TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === "cod" && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-7 shadow-2xs space-y-6 text-xs max-w-3xl">
          <div className="border-b border-stone-100 pb-4">
            <h3 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
              <CodIcon size={18} className="text-[#064E3B]" />
              General Cash on Delivery (COD) Rules
            </h3>
            <p className="text-stone-500 text-xs mt-1">
              Configure baseline handling charges, order thresholds for free shipping on COD, and allowed states.
            </p>
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-xl border border-stone-200/70">
            <div>
              <p className="font-bold text-stone-900 text-sm">Accept Cash on Delivery</p>
              <p className="text-stone-500 text-xs">When enabled, customers can choose Cash on Delivery at checkout.</p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleUpdateGeneralCOD(
                  "status",
                  currentCODRule.status === "active" ? "inactive" : "active"
                )
              }
              className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                currentCODRule.status === "active"
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                  : "bg-stone-200 text-stone-600 border-stone-300"
              }`}
            >
              {currentCODRule.status === "active" ? "ENABLED" : "DISABLED"}
            </button>
          </div>

          {/* Numerical Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold mb-1.5 text-stone-800">
                Base COD Shipping / Parcel Fee (₹)
              </label>
              <input
                type="number"
                value={currentCODRule.shippingCharge ?? 70}
                onChange={(e) => handleUpdateGeneralCOD("shippingCharge", Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-[#064E3B]"
              />
              <span className="text-[10px] text-stone-400 block mt-1">Default is ₹70</span>
            </div>

            <div>
              <label className="block font-bold mb-1.5 text-stone-800">
                Free Shipping Cart Threshold (₹)
              </label>
              <input
                type="number"
                value={currentCODRule.freeShippingThreshold ?? 2000}
                onChange={(e) => handleUpdateGeneralCOD("freeShippingThreshold", Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-[#064E3B]"
              />
              <span className="text-[10px] text-stone-400 block mt-1">e.g. Orders above ₹2,000 get Free COD delivery</span>
            </div>

            <div>
              <label className="block font-bold mb-1.5 text-stone-800">
                Min Item Quantity for COD
              </label>
              <input
                type="number"
                value={currentCODRule.minQuantity ?? 1}
                onChange={(e) => handleUpdateGeneralCOD("minQuantity", Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-sm text-stone-900 focus:bg-white focus:outline-none focus:border-[#064E3B]"
              />
              <span className="text-[10px] text-stone-400 block mt-1">Minimum pieces in cart</span>
            </div>
          </div>

          {/* Allowed States for COD */}
          <div className="space-y-2">
            <label className="block font-bold text-stone-800">
              States Eligible for Cash on Delivery:
            </label>
            <p className="text-[11px] text-stone-500 mb-2">
              Select all states where your logistics partner allows Cash on Delivery with return verification.
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "Tamil Nadu",
                "Kerala",
                "Karnataka",
                "Andhra Pradesh",
                "Telangana",
                "Maharashtra",
                "Puducherry",
                "Goa",
                "All India",
              ].map((st) => {
                const isSelected = (currentCODRule.availableStates || []).includes(st);
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => handleToggleStateForCOD(st)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-[#064E3B] text-white border-[#064E3B] shadow-xs"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {isSelected ? `✓ ${st}` : `+ ${st}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. COD ADVANCE RULES TAB */}
      {/* ---------------------------------------------------- */}
      {activeSubTab === "advance" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/60 p-4 rounded-2xl border border-stone-200/60">
            <div>
              <p className="font-bold text-xs text-stone-800">Mandatory COD Advance Booking Deposit Tiers</p>
              <p className="text-[11px] text-stone-500">
                Advance deposit collected via UPI/Online to eliminate bogus orders and fake RTO delivery returns.
              </p>
            </div>
            <button
              onClick={handleOpenAddAdvanceRule}
              className="px-4 py-2.5 bg-[#064E3B] text-white rounded-xl text-xs font-bold hover:bg-[#0B3D2E] inline-flex items-center gap-2 shadow-xs transition-all uppercase tracking-wider shrink-0"
            >
              <PlusIcon size={14} />
              <span>Add Advance Tier</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 text-[10px] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-4">Apparel Category</th>
                    <th className="p-4">Quantity Tier Label</th>
                    <th className="p-4">Min Pieces</th>
                    <th className="p-4">Max Pieces</th>
                    <th className="p-4">Advance Token Deposit (₹)</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-stone-400">
                        Loading advance rules...
                      </td>
                    </tr>
                  ) : advanceRules.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-stone-500">
                        No advance deposit tiers found. Click "Add Advance Tier" to create one.
                      </td>
                    </tr>
                  ) : (
                    advanceRules.map((r) => (
                      <tr key={r.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-4 font-bold text-stone-900">{r.category}</td>
                        <td className="p-4 text-stone-700 font-semibold">{r.quantityRange || `${r.minQty} - ${r.maxQty} Pcs`}</td>
                        <td className="p-4 font-mono text-stone-600">{r.minQty || 1} Pcs</td>
                        <td className="p-4 font-mono text-stone-600">{r.maxQty || 999} Pcs</td>
                        <td className="p-4 font-display font-bold text-[#064E3B] text-sm">
                          ₹{r.advanceAmount}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleAdvanceRuleStatus(r)}
                            title="Click to toggle status"
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                              r.status === "active"
                                ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                                : "bg-stone-100 text-stone-500 border-stone-200 hover:bg-stone-200"
                            }`}
                          >
                            {r.status === "active" ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditAdvanceRule(r)}
                              title="Edit advance tier"
                              className="p-2 text-stone-600 hover:text-[#064E3B] hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                            >
                              <EditIcon size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteAdvanceRule(r.id)}
                              title="Delete advance tier"
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                            >
                              <TrashIcon size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD / EDIT SHIPPING RULE */}
      {/* ---------------------------------------------------- */}
      {showShipModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 sm:p-7 text-stone-800 text-xs space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-display font-bold text-lg text-stone-900">
                  {editingShipRule ? "Edit Shipping Rule" : "Add Destination Shipping Rule"}
                </h3>
                <p className="text-[11px] text-stone-400">
                  {editingShipRule ? `Rule ID: ${editingShipRule.id}` : "Configure new delivery rate or free shipping trigger"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowShipModal(false);
                  setEditingShipRule(null);
                }}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Destination State */}
              <div>
                <label className="block font-bold mb-1 text-stone-700">Destination State *</label>
                <select
                  value={newShipRule.state}
                  onChange={(e) => setNewShipRule({ ...newShipRule, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-[#064E3B]"
                >
                  {POPULAR_STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              {/* Apparel Category */}
              <div>
                <label className="block font-bold mb-1 text-stone-700">Apparel Category *</label>
                <select
                  value={newShipRule.category}
                  onChange={(e) => setNewShipRule({ ...newShipRule, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-[#064E3B]"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* Min Quantity */}
              <div>
                <label className="block font-bold mb-1 text-stone-700">Min Pieces *</label>
                <input
                  type="number"
                  min="1"
                  value={newShipRule.minQty}
                  onChange={(e) => setNewShipRule({ ...newShipRule, minQty: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#064E3B]"
                />
              </div>

              {/* Max Quantity */}
              <div>
                <label className="block font-bold mb-1 text-stone-700">Max Pieces</label>
                <input
                  type="number"
                  min="1"
                  value={newShipRule.maxQty ?? 999}
                  onChange={(e) => setNewShipRule({ ...newShipRule, maxQty: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#064E3B]"
                />
              </div>

              {/* Min Order Value */}
              <div>
                <label className="block font-bold mb-1 text-stone-700">Min Cart Value (₹)</label>
                <input
                  type="number"
                  min="0"
                  value={newShipRule.minOrderValue ?? 0}
                  onChange={(e) => setNewShipRule({ ...newShipRule, minOrderValue: Math.max(0, Number(e.target.value)) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#064E3B]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Shipping Mode */}
              <div>
                <label className="block font-bold mb-1 text-stone-700">Shipping Mode *</label>
                <select
                  value={newShipRule.shippingType}
                  onChange={(e) =>
                    setNewShipRule({
                      ...newShipRule,
                      shippingType: e.target.value as any,
                      charge: e.target.value === "FREE" ? 0 : newShipRule.charge || 70,
                    })
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold focus:bg-white focus:outline-none focus:border-[#064E3B]"
                >
                  <option value="FREE">FREE SHIPPING (₹0)</option>
                  <option value="FIXED">FIXED PARCEL CHARGE</option>
                  <option value="PER_ITEM">PER-ITEM CHARGE</option>
                </select>
              </div>

              {/* Parcel Fee (Editable for FIXED and PER_ITEM) */}
              <div>
                <label className="block font-bold mb-1 text-stone-700">
                  Parcel Delivery Fee (₹) {newShipRule.shippingType === "FREE" && "(Waived)"}
                </label>
                <input
                  type="number"
                  disabled={newShipRule.shippingType === "FREE"}
                  min="0"
                  value={newShipRule.shippingType === "FREE" ? 0 : newShipRule.charge ?? 0}
                  onChange={(e) => setNewShipRule({ ...newShipRule, charge: Math.max(0, Number(e.target.value)) })}
                  className={`w-full px-3.5 py-2.5 border rounded-xl font-bold text-sm ${
                    newShipRule.shippingType === "FREE"
                      ? "bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed"
                      : "bg-stone-50 border-stone-200 text-stone-900 focus:bg-white focus:outline-none focus:border-[#064E3B]"
                  }`}
                  placeholder={newShipRule.shippingType === "FREE" ? "₹0 (Free)" : "e.g. 70"}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block font-bold mb-1 text-stone-700">Rule Status</label>
              <select
                value={newShipRule.status}
                onChange={(e) => setNewShipRule({ ...newShipRule, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#064E3B]"
              >
                <option value="active">Active (Enforced on Checkout)</option>
                <option value="inactive">Inactive (Disabled)</option>
              </select>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  setShowShipModal(false);
                  setEditingShipRule(null);
                }}
                className="px-4 py-2.5 border border-stone-200 text-stone-600 rounded-xl font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveShippingRule}
                className="px-6 py-2.5 bg-[#064E3B] text-white rounded-xl font-bold hover:bg-[#0B3D2E] shadow-sm transition-all flex items-center gap-1.5"
              >
                <CheckIcon size={14} />
                <span>{editingShipRule ? "Update Shipping Rule" : "Save Shipping Rule"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* MODAL: ADD / EDIT COD ADVANCE RULE */}
      {/* ---------------------------------------------------- */}
      {showAdvModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-7 text-stone-800 text-xs space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-display font-bold text-lg text-stone-900">
                  {editingAdvRule ? "Edit COD Advance Tier" : "Add COD Advance Tier"}
                </h3>
                <p className="text-[11px] text-stone-400">
                  {editingAdvRule ? `Tier ID: ${editingAdvRule.id}` : "Configure partial booking advance token"}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowAdvModal(false);
                  setEditingAdvRule(null);
                }}
                className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 hover:text-stone-900 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold mb-1 text-stone-700">Apparel Category *</label>
              <select
                value={newAdvRule.category}
                onChange={(e) => setNewAdvRule({ ...newAdvRule, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-[#064E3B]"
              >
                {DEFAULT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity Range Label */}
            <div>
              <label className="block font-bold mb-1 text-stone-700">Quantity Range Label *</label>
              <input
                type="text"
                value={newAdvRule.quantityRange}
                onChange={(e) => setNewAdvRule({ ...newAdvRule, quantityRange: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-medium focus:bg-white focus:outline-none focus:border-[#064E3B]"
                placeholder="e.g. 3 Pcs, 4 to 6 Pcs, 2 Sets"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Min Qty */}
              <div>
                <label className="block font-bold mb-1 text-stone-700">Min Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={newAdvRule.minQty ?? 1}
                  onChange={(e) => setNewAdvRule({ ...newAdvRule, minQty: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#064E3B]"
                />
              </div>

              {/* Max Qty */}
              <div>
                <label className="block font-bold mb-1 text-stone-700">Max Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={newAdvRule.maxQty ?? 999}
                  onChange={(e) => setNewAdvRule({ ...newAdvRule, maxQty: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#064E3B]"
                />
              </div>
            </div>

            {/* Advance Amount */}
            <div>
              <label className="block font-bold mb-1 text-stone-700">Mandatory Advance Token (₹) *</label>
              <input
                type="number"
                min="0"
                value={newAdvRule.advanceAmount}
                onChange={(e) => setNewAdvRule({ ...newAdvRule, advanceAmount: Math.max(0, Number(e.target.value)) })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold text-base text-[#064E3B] focus:bg-white focus:outline-none focus:border-[#064E3B]"
                placeholder="e.g. 100"
              />
              <span className="text-[10px] text-stone-400 block mt-1">
                Amount collected online/UPI before dispatch.
              </span>
            </div>

            {/* Status */}
            <div>
              <label className="block font-bold mb-1 text-stone-700">Tier Status</label>
              <select
                value={newAdvRule.status}
                onChange={(e) => setNewAdvRule({ ...newAdvRule, status: e.target.value as any })}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold focus:bg-white focus:outline-none focus:border-[#064E3B]"
              >
                <option value="active">Active (Enforced)</option>
                <option value="inactive">Inactive (Disabled)</option>
              </select>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => {
                  setShowAdvModal(false);
                  setEditingAdvRule(null);
                }}
                className="px-4 py-2.5 border border-stone-200 text-stone-600 rounded-xl font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveAdvanceRule}
                className="px-6 py-2.5 bg-[#064E3B] text-white rounded-xl font-bold hover:bg-[#0B3D2E] shadow-sm transition-all flex items-center gap-1.5"
              >
                <CheckIcon size={14} />
                <span>{editingAdvRule ? "Update Advance Tier" : "Save Advance Tier"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
