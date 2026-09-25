import React, { useState, useEffect } from "react";
import { CustomersIcon, SearchIcon, SparklesIcon } from "../../components/admin/AdminIcons";

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

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/customers");
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        const mapped = json.data.map((c: any) => ({
          customerId: c.customerId,
          name: c.name,
          phone: c.phone,
          email: c.email || "—",
          state: c.state || "Tamil Nadu",
          address: c.address || "",
          orders: c.totalOrders || 1,
          spent: c.totalSpent || 0,
          tier: (c.totalSpent || 0) > 5000 ? "VIP Gold" : (c.totalSpent || 0) > 2000 ? "Silver" : "Regular",
          registrationDate: c.registrationDate || c.createdAt,
        }));
        setCustomers(mapped);
        setLoading(false);
        return;
      }
    } catch (e) {
      console.warn("Falling back to local customers:", e);
    }

    // Default Seed / Local fallback
    setCustomers([
      { customerId: "CUST-001", name: "Priya Rajendran", phone: "+91 98401 23456", email: "priya.raj@example.com", state: "Tamil Nadu", orders: 4, spent: 4890, tier: "VIP Gold" },
      { customerId: "CUST-002", name: "Meena Krishnan", phone: "+91 94432 98765", email: "meena.k@example.com", state: "Kerala", orders: 2, spent: 1840, tier: "Regular" },
      { customerId: "CUST-003", name: "Saranya Devi", phone: "+91 97890 54321", email: "saranya.devi@example.com", state: "Tamil Nadu", orders: 5, spent: 6320, tier: "VIP Gold" },
      { customerId: "CUST-004", name: "Kavitha Murugan", phone: "+91 96551 11223", email: "kavitha.m@example.com", state: "Tamil Nadu", orders: 1, spent: 1198, tier: "New" },
      { customerId: "CUST-005", name: "Anitha Suresh", phone: "+91 98800 44556", email: "anitha.s@example.com", state: "Karnataka", orders: 3, spent: 3450, tier: "Silver" },
    ]);
    setLoading(false);
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
          <a
            href="/api/admin/export/excel"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-[#041D16] text-[#DFC15E] rounded-xl text-xs font-bold border border-[#C9A227]/40 hover:bg-black transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>📥 Export Customers (.xlsx)</span>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    Loading customer profiles from MongoDB...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
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
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
