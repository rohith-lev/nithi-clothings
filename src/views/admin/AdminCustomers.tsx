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
  tier: string;
  registrationDate?: string;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<CustomerData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

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
            tier: (c.totalSpent || 0) > 5000 ? "VIP Gold" : (c.totalSpent || 0) > 2000 ? "Silver" : "Regular",
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
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
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
                <th className="p-4">Order Frequency</th>
                <th className="p-4">Lifetime Gross</th>
                <th className="p-4">Loyalty Tier</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    Loading customer profiles from MongoDB...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No customers found matching "{search}".
                  </td>
                </tr>
              ) : (
                filtered.map((c, idx) => (
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
                    <td className="p-4 font-bold text-stone-900">{c.orders} orders placed</td>
                    <td className="p-4 font-bold text-[#064E3B] text-sm">₹{c.spent.toLocaleString("en-IN")}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        c.tier === "VIP Gold"
                          ? "bg-amber-50 text-amber-900 border-amber-300"
                          : c.tier === "Silver"
                          ? "bg-stone-100 text-stone-800 border-stone-300"
                          : "bg-emerald-50 text-emerald-800 border-emerald-200"
                      }`}>
                        {c.tier === "VIP Gold" ? "★ " : ""}{c.tier}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteCustomer(c.customerId, c.name)}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 transition-all cursor-pointer"
                        title="Delete customer"
                      >
                        <TrashIcon size={14} />
                      </button>
                    </td>
                  </tr>
                ))
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
    </div>
  );
}
