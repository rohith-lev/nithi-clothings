import { useState } from "react";
import { SparklesIcon, CheckIcon } from "../../components/admin/AdminIcons";

export default function AdminPayments() {
  const [filter, setFilter] = useState("all");

  const transactions = [
    { id: "TXN-90211", orderId: "NC-10025", customer: "Priya S.", method: "UPI / GPay", amount: 1499, status: "SUCCESS", date: "11 Sep 2026, 02:45 PM" },
    { id: "TXN-90212", orderId: "NC-10026", customer: "Ananya R.", method: "COD Advance (₹100)", amount: 100, status: "SUCCESS", date: "11 Sep 2026, 01:15 PM" },
    { id: "TXN-90213", orderId: "NC-10027", customer: "Kavitha M.", method: "Net Banking", amount: 2350, status: "SUCCESS", date: "10 Sep 2026, 06:30 PM" },
    { id: "TXN-90214", orderId: "NC-10028", customer: "Divya N.", method: "COD Cash on Delivery", amount: 1797, status: "PENDING_DELIVERY", date: "10 Sep 2026, 04:10 PM" },
    { id: "TXN-90215", orderId: "NC-10029", customer: "Shalini K.", method: "UPI / PhonePe", amount: 899, status: "SUCCESS", date: "09 Sep 2026, 11:20 AM" },
  ];

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.method.toLowerCase().includes(filter));

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 font-display">
            Payments & Financial Settlement
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time ledger for UPI, Card, Net Banking, COD Collections, and Advance payments.
          </p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            ● Gateway Active (Razorpay / PhonePe)
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Total Sales Today</p>
          <p className="text-2xl font-bold font-display text-stone-900 mt-1">₹18,450</p>
          <span className="text-[11px] text-emerald-700 font-medium">100% Settled</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">COD Advances Collected</p>
          <p className="text-2xl font-bold font-display text-blue-900 mt-1">₹1,800</p>
          <span className="text-[11px] text-blue-700 font-medium">18 Orders Verified</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Pending COD Balance</p>
          <p className="text-2xl font-bold font-display text-amber-900 mt-1">₹6,420</p>
          <span className="text-[11px] text-amber-700 font-medium">Due upon courier delivery</span>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wider">Recent Transactions</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${filter === "all" ? "bg-[#041D16] text-[#DFC15E]" : "bg-stone-100 text-stone-600"}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("upi")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${filter === "upi" ? "bg-[#041D16] text-[#DFC15E]" : "bg-stone-100 text-stone-600"}`}
            >
              UPI / Online
            </button>
            <button
              onClick={() => setFilter("cod")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${filter === "cod" ? "bg-[#041D16] text-[#DFC15E]" : "bg-stone-100 text-stone-600"}`}
            >
              COD
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 font-bold text-stone-600 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Payment Method</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-stone-50/50">
                  <td className="px-4 py-3 font-mono font-bold text-stone-800">{t.id}</td>
                  <td className="px-4 py-3 font-mono text-stone-600">{t.orderId}</td>
                  <td className="px-4 py-3 font-semibold text-stone-900">{t.customer}</td>
                  <td className="px-4 py-3 text-stone-700">{t.method}</td>
                  <td className="px-4 py-3 font-bold text-stone-900">₹{t.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.status === "SUCCESS"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-500 text-[11px]">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
