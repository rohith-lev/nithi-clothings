import { useState } from "react";

export default function AdminReturns() {
  const [returnRequests, setReturnRequests] = useState([
    { id: "RET-101", orderId: "NC-10012", customer: "Meenakshi V.", product: "Jaipuri Cotton Nighty", reason: "Size issue - requested XL replacement", status: "PENDING_APPROVAL", date: "10 Sep 2026" },
    { id: "RET-102", orderId: "NC-10008", customer: "Sangeetha P.", product: "Unstitched Salwar Suit", reason: "Defective fabric print", status: "PICKUP_SCHEDULED", date: "09 Sep 2026" },
    { id: "RET-103", orderId: "NC-10001", customer: "Radha K.", product: "Feeding Zip Cotton Nighty", reason: "Wrong color delivered", status: "REFUND_COMPLETED", date: "08 Sep 2026" },
  ]);

  const handleApprove = (id: string) => {
    setReturnRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "APPROVED_PICKUP_SCHEDULED" } : r))
    );
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 font-display">
            Returns, Exchanges & Refund Desk
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage customer return requests, replacement dispatches, and reverse logistics.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wider">
          Active Return & Replacement Claims ({returnRequests.length})
        </h2>

        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 font-bold text-stone-600 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3">Return ID</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {returnRequests.map((r) => (
                <tr key={r.id} className="hover:bg-stone-50/50">
                  <td className="px-4 py-3 font-mono font-bold text-stone-800">{r.id}</td>
                  <td className="px-4 py-3 font-mono text-stone-600">{r.orderId}</td>
                  <td className="px-4 py-3 font-semibold text-stone-900">{r.customer}</td>
                  <td className="px-4 py-3 text-stone-800">{r.product}</td>
                  <td className="px-4 py-3 text-stone-600 text-[11px]">{r.reason}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === "PENDING_APPROVAL" ? (
                      <button
                        onClick={() => handleApprove(r.id)}
                        className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px]"
                      >
                        Approve
                      </button>
                    ) : (
                      <span className="text-[11px] text-stone-400">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
