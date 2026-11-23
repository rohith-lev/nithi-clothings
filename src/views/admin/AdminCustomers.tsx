import React, { useState, useEffect } from "react";
import { CustomersIcon, SearchIcon, SparklesIcon, TrashIcon } from "../../components/admin/AdminIcons";
import { adminApi } from "../../services/api";

interface CustomerData {
  customerId?: string;
  name: string;
  phone: string;
  email: string;
  state: string;
  address?: string;
  orders: number;
  spent: number;
  creditPoints?: number;
  spendMilestoneTarget?: number;
  assignedGifts?: Array<{
    id: string;
    title: string;
    description?: string;
    couponCode?: string;
    value?: number;
    status: string;
    assignedAt: string;
    assignedBy?: string;
    notes?: string;
  }>;
  tier: string;
  registrationDate?: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  // Manual Gift Assignment Modal State
  const [giftCustomer, setGiftCustomer] = useState<CustomerData | null>(null);
  const [giftTitle, setGiftTitle] = useState("");
  const [giftDescription, setGiftDescription] = useState("");
  const [giftCoupon, setGiftCoupon] = useState("");
  const [giftValue, setGiftValue] = useState<number>(500);
  const [giftPoints, setGiftPoints] = useState<number>(50);
  const [giftNotes, setGiftNotes] = useState("");
  const [savingGift, setSavingGift] = useState(false);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customers");
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const text = await res.text();
        const json = JSON.parse(text);
        if (json.success && Array.isArray(json.data)) {
          const mapped = json.data.map((c: any) => ({
            customerId: c.customerId,
            name: c.name,
            phone: c.phone,
            email: c.email || "—",
            state: c.state || "Tamil Nadu",
            address: c.address || "",
            orders: c.totalOrders || 0,
            spent: c.totalSpent || 0,
            creditPoints: c.creditPoints || 0,
            spendMilestoneTarget: c.spendMilestoneTarget || 25000,
            assignedGifts: Array.isArray(c.assignedGifts) ? c.assignedGifts : [],
            tier: (c.totalSpent || 0) >= 25000 ? "Milestone VIP (₹25k+)" : (c.totalSpent || 0) > 5000 ? "Gold" : (c.totalSpent || 0) > 2000 ? "Silver" : "Regular",
            registrationDate: c.registrationDate || c.createdAt,
          }));
          setCustomers(mapped);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("API customers fetch error:", e);
    }

    setCustomers([]);
    setLoading(false);
  };

  const handleOpenGiftModal = (customer: CustomerData) => {
    setGiftCustomer(customer);
    setGiftTitle("Milestone Privilege Gift");
    setGiftDescription("Awarded for valued patronage with Nithi Collections.");
    setGiftCoupon("VIP" + Math.floor(1000 + Math.random() * 9000));
    setGiftValue(500);
    setGiftPoints(100);
    setGiftNotes("Manually assigned from Admin Customer Directory");
  };

  const handlePresetSelect = (presetType: string) => {
    if (presetType === "voucher500") {
      setGiftTitle("₹500 Exclusive Shopper Voucher");
      setGiftDescription("₹500 instant store credit on your next ensemble order.");
      setGiftCoupon("NITHI500");
      setGiftValue(500);
      setGiftPoints(50);
    } else if (presetType === "dupatta") {
      setGiftTitle("Complimentary Handcrafted Silk Dupatta Gift");
      setGiftDescription("Free artisan silk dupatta packed with your next delivery.");
      setGiftCoupon("SILKGIFT");
      setGiftValue(750);
      setGiftPoints(100);
    } else if (presetType === "milestone25k") {
      setGiftTitle("₹25,000 Milestone Celebration Gift Box");
      setGiftDescription("Exclusive milestone hamper & VIP privilege card for lifetime patronage.");
      setGiftCoupon("GOLDEN25K");
      setGiftValue(1500);
      setGiftPoints(250);
    } else if (presetType === "kurti") {
      setGiftTitle("Complimentary Pure Cotton Kurti");
      setGiftDescription("Free stitched cotton top included with any upcoming order.");
      setGiftCoupon("FREEKURTI");
      setGiftValue(450);
      setGiftPoints(50);
    }
  };

  const handleSaveGiftAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!giftCustomer || !giftCustomer.customerId) return;
    if (!giftTitle.trim()) {
      alert("Please provide a Gift Title.");
      return;
    }

    setSavingGift(true);
    try {
      const res = await adminApi.assignCustomerGift({
        customerId: giftCustomer.customerId,
        title: giftTitle.trim(),
        description: giftDescription.trim(),
        couponCode: giftCoupon.trim(),
        value: Number(giftValue) || 0,
        notes: giftNotes.trim(),
        creditPointsToAdd: Number(giftPoints) || 0,
      });

      if (res.success) {
        alert(res.message || "Gift successfully assigned!");
        setGiftCustomer(null);
        loadCustomers();
      } else {
        alert(res.error || "Failed to assign gift.");
      }
    } catch (err: any) {
      alert(`Error assigning gift: ${err.message || "Unknown"}`);
    } finally {
      setSavingGift(false);
    }
  };

  const handleRevokeGift = async (customerId: string, giftId: string) => {
    if (!confirm("Are you sure you want to revoke this assigned gift?")) return;
    try {
      const res = await adminApi.removeCustomerGift(customerId, giftId);
      if (res.success) {
        alert("Gift revoked.");
        loadCustomers();
        if (giftCustomer) {
          setGiftCustomer((prev) => prev ? {
            ...prev,
            assignedGifts: (prev.assignedGifts || []).filter((g) => g.id !== giftId),
          } : null);
        }
      } else {
        alert(res.error || "Failed to revoke gift.");
      }
    } catch (err: any) {
      alert(`Error: ${err.message || "Unknown"}`);
    }
  };

  const handleDeleteCustomer = async (customerId?: string, name?: string) => {
    if (!customerId) return;
    if (confirm(`Are you sure you want to delete customer "${name || customerId}"?`)) {
      const res = await adminApi.deleteCustomer(customerId);
      if (res.success) {
        loadCustomers();
      } else {
        alert(`Failed to delete customer: ${res.error || "Unknown error"}`);
      }
    }
  };

  const handleConfirmDeleteAll = async () => {
    setDeletingAll(true);
    const res = await adminApi.deleteAllCustomers();
    setDeletingAll(false);
    setShowDeleteAllModal(false);
    if (res.success) {
      loadCustomers();
    } else {
      alert(`Failed to purge customers: ${res.error || "Unknown error"}`);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search) ||
    c.state.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-2xl sm:text-3xl text-stone-900 tracking-tight">
              Customer Directory
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F1] border border-[#C9A227]/40 text-[#8A5F38] text-xs font-bold font-mono">
              {customers.length} Shoppers (Permanent Records)
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Permanent customer business profiles, lifetime purchase history, geographic clusters, and VIP tiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDeleteAllModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 rounded-xl shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <TrashIcon size={14} />
            <span>Purge All</span>
          </button>
          <a
            href="/api/admin/export/customers"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-[#041D16] text-[#DFC15E] rounded-xl text-xs font-bold border border-[#C9A227]/40 hover:bg-black transition-all shadow-xs flex items-center gap-1.5"
            title="Download Customer Contact & Order History Details as Excel"
          >
            <span>📥 Export Customer Details (.xlsx)</span>
          </a>
        </div>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer by name, email, phone, state..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
          />
          <div className="absolute left-3.5 top-3 text-stone-400">
            <SearchIcon size={16} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Contact Info</th>
                <th className="p-4">Delivery Region</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Cumulative Spend & ₹25k Milestone</th>
                <th className="p-4">Rewards / Points</th>
                <th className="p-4">Assigned Gifts</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    Loading customer profiles from MongoDB...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400">
                    No customers found matching "{search}".
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => {
                  const milestoneProgress = Math.min(100, Math.round((c.spent / 25000) * 100));
                  const isMilestoneReached = c.spent >= 25000;
                  return (
                    <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#064E3B] to-[#C9A227] text-white flex items-center justify-center font-bold text-xs">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-bold text-stone-900 text-xs block">{c.name}</span>
                            {c.customerId && <span className="text-[10px] font-mono text-stone-400">{c.customerId}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-stone-600">
                        <div>{c.email}</div>
                        <div className="text-[11px] text-stone-400 font-mono mt-0.5">{c.phone}</div>
                      </td>
                      <td className="p-4 text-stone-700 font-medium">{c.state}</td>
                      <td className="p-4 font-bold text-stone-900">{c.orders} orders</td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[#064E3B] text-sm">₹{c.spent.toLocaleString("en-IN")}</span>
                            <span className="text-[10px] font-semibold text-stone-500">{milestoneProgress}%</span>
                          </div>
                          <div className="w-32 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-[#064E3B] to-[#C9A227] h-full rounded-full transition-all duration-300"
                              style={{ width: `${milestoneProgress}%` }}
                            />
                          </div>
                          <div className="flex items-center gap-1.5 pt-0.5">
                            {isMilestoneReached ? (
                              <span className="px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[9px] font-bold border border-amber-300">
                                🌟 ₹25k Milestone Achieved
                              </span>
                            ) : (
                              <span className="text-[10px] text-stone-400">Target: ₹25,000 Milestone</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FAF8F1] border border-[#C9A227]/40 text-[#8A5F38]">
                          🪙 {c.creditPoints || 0} Points
                        </span>
                      </td>
                      <td className="p-4">
                        {c.assignedGifts && c.assignedGifts.length > 0 ? (
                          <div className="flex flex-col gap-1">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 w-fit">
                              🎁 {c.assignedGifts.length} Gift(s)
                            </span>
                            <span className="text-[10px] text-stone-500 truncate max-w-[140px]" title={c.assignedGifts[0].title}>
                              {c.assignedGifts[0].title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-stone-400 italic">None yet</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenGiftModal(c)}
                            className="px-2.5 py-1.5 rounded-xl bg-[#FAF8F1] hover:bg-[#F3EFE3] text-[#064E3B] border border-[#C9A227]/40 font-bold text-[11px] transition-all inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                            title="Explicitly Assign Gift / Offer"
                          >
                            <span>🎁 Assign Gift</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomer(c.customerId, c.name)}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 transition-all cursor-pointer"
                            title="Delete customer"
                          >
                            <TrashIcon size={14} />
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

      {/* Purge All Customers Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-7 text-stone-800 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-200">
                <TrashIcon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-900 leading-tight">Delete All Customers?</h3>
                <p className="text-xs text-rose-600 font-semibold">Irreversible Action</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently purge <strong>all {customers.length} customer records</strong> from MongoDB Atlas?
            </p>

            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 space-y-1">
              <p className="font-bold">⚠️ Warning:</p>
              <p>Customer contact directories, lifetime gross calculations, and VIP profiles will be cleared.</p>
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
                  <span>Yes, Purge All Customers</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Gift & Offer Assignment Modal (Admin Explicit Selection) */}
      {giftCustomer && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 sm:p-7 text-stone-800 animate-in zoom-in-95 duration-150 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#FAF8F1] border border-[#C9A227]/40 flex items-center justify-center text-lg">
                  🎁
                </div>
                <div>
                  <h3 className="font-bold text-base text-stone-900 leading-tight">
                    Assign Gift / Privilege Offer
                  </h3>
                  <p className="text-xs text-stone-500">
                    For <strong>{giftCustomer.name}</strong> ({giftCustomer.phone})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setGiftCustomer(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Spend & Milestone Banner */}
            <div className="p-3.5 bg-[#FAF8F1] rounded-2xl border border-[#C9A227]/30 text-xs text-stone-700 space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-stone-600">Lifetime Spend:</span>
                <span className="font-bold text-[#064E3B] text-sm">₹{giftCustomer.spent.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between items-center text-[11px] text-stone-500">
                <span>Progress to ₹25,000 Milestone:</span>
                <span className="font-mono font-bold text-stone-700">
                  {Math.min(100, Math.round((giftCustomer.spent / 25000) * 100))}%
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#064E3B] to-[#C9A227] h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.round((giftCustomer.spent / 25000) * 100))}%` }}
                />
              </div>
            </div>

            {/* Gift Presets */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                Quick Gift & Offer Presets:
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handlePresetSelect("voucher500")}
                  className="p-2 text-left rounded-xl border border-stone-200 hover:border-[#C9A227] hover:bg-amber-50/50 transition-all font-medium"
                >
                  💳 ₹500 Shopper Voucher
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("dupatta")}
                  className="p-2 text-left rounded-xl border border-stone-200 hover:border-[#C9A227] hover:bg-amber-50/50 transition-all font-medium"
                >
                  🧣 Silk Dupatta Gift
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("milestone25k")}
                  className="p-2 text-left rounded-xl border border-[#C9A227] bg-[#FAF8F1] hover:bg-amber-50 transition-all font-bold text-[#8A5F38]"
                >
                  🌟 ₹25k Milestone Box
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect("kurti")}
                  className="p-2 text-left rounded-xl border border-stone-200 hover:border-[#C9A227] hover:bg-amber-50/50 transition-all font-medium"
                >
                  👗 Complimentary Kurti
                </button>
              </div>
            </div>

            <form onSubmit={handleSaveGiftAssignment} className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Gift / Offer Title *
                </label>
                <input
                  type="text"
                  required
                  value={giftTitle}
                  onChange={(e) => setGiftTitle(e.target.value)}
                  placeholder="e.g. ₹500 Exclusive Shopper Voucher"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Description / Customer Note
                </label>
                <textarea
                  rows={2}
                  value={giftDescription}
                  onChange={(e) => setGiftDescription(e.target.value)}
                  placeholder="Details visible to customer in their account"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Coupon / Code
                  </label>
                  <input
                    type="text"
                    value={giftCoupon}
                    onChange={(e) => setGiftCoupon(e.target.value)}
                    placeholder="e.g. NITHI500"
                    className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Reward Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={giftValue}
                    onChange={(e) => setGiftValue(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Add Credit Points
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={giftPoints}
                    onChange={(e) => setGiftPoints(Number(e.target.value))}
                    className="w-full px-2.5 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Internal Admin Notes
                </label>
                <input
                  type="text"
                  value={giftNotes}
                  onChange={(e) => setGiftNotes(e.target.value)}
                  placeholder="e.g. Awarded for crossing ₹25,000 threshold or phone enquiry"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>

              {/* Existing Assigned Gifts on Customer */}
              {giftCustomer.assignedGifts && giftCustomer.assignedGifts.length > 0 && (
                <div className="pt-2 border-t border-stone-200">
                  <p className="text-xs font-bold text-stone-700 mb-1.5">
                    Currently Assigned Gifts ({giftCustomer.assignedGifts.length}):
                  </p>
                  <div className="space-y-1.5 max-h-32 overflow-y-auto">
                    {giftCustomer.assignedGifts.map((g) => (
                      <div
                        key={g.id}
                        className="p-2 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-stone-800">{g.title}</span>
                          {g.couponCode && (
                            <span className="ml-2 font-mono text-[10px] bg-stone-200 px-1.5 py-0.5 rounded">
                              {g.couponCode}
                            </span>
                          )}
                          <span className="ml-2 text-emerald-700 font-semibold">₹{g.value || 0}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRevokeGift(giftCustomer.customerId!, g.id)}
                          className="text-rose-600 hover:text-rose-800 font-bold text-[11px] px-2 py-0.5 rounded hover:bg-rose-50"
                        >
                          Revoke
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setGiftCustomer(null)}
                  className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingGift}
                  className="px-5 py-2 bg-[#064E3B] text-white rounded-xl text-xs font-bold hover:bg-[#0B3D2E] shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {savingGift ? "Assigning Gift..." : `🎁 Assign Gift to ${giftCustomer.name.split(" ")[0]}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
