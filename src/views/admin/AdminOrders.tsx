import { useState, useEffect } from "react";
import type { OrderRecord } from "../../types/store";
import { adminApi } from "../../services/api";
import {
  OrdersIcon,
  SearchIcon,
  FilterIcon,
  CheckIcon,
  EyeIcon,
  ShippingIcon,
} from "../../components/admin/AdminIcons";

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        const mapped = json.data.map((o: any) => ({
          id: o.orderId || o.id,
          customerName: o.customerName || (o.customer?.name ?? "Customer"),
          customerPhone: o.customerPhone || (o.customer?.phone ?? ""),
          customerEmail: o.customerEmail || (o.customer?.email ?? ""),
          items: o.items || [],
          subtotal: o.subtotal || o.total || 0,
          shippingFee: o.shippingFee || 0,
          discount: o.discount || 0,
          total: o.total || 0,
          status: o.orderStatus || o.status || "Pending",
          paymentMethod: o.paymentMethod || "COD",
          shippingState: o.shippingState || "Tamil Nadu",
          shippingAddress: o.shippingAddress || "",
          createdAt: o.createdAt || new Date().toISOString(),
        }));
        setOrders(mapped);
        return;
      }
    } catch (e) {
      console.warn("API orders fetch error:", e);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderRecord["status"]) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus);
    } catch (e) {
      console.warn("Update status error:", e);
    }

    await loadOrders();
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
    showToast(`Order #${orderId} status changed to "${newStatus}"`);
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.includes(q) ||
        o.shippingState.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const statusBadgeClasses: Record<string, string> = {
    Pending: "bg-amber-50 text-amber-900 border-amber-200/80",
    Confirmed: "bg-blue-50 text-blue-900 border-blue-200/80",
    Processing: "bg-indigo-50 text-indigo-900 border-indigo-200/80",
    Packed: "bg-purple-50 text-purple-900 border-purple-200/80",
    Shipped: "bg-teal-50 text-teal-900 border-teal-200/80",
    Delivered: "bg-emerald-50 text-emerald-900 border-emerald-200/80",
    Cancelled: "bg-rose-50 text-rose-900 border-rose-200/80",
  };

  return (
    <div className="space-y-6 font-body">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#041D16] text-white border border-[#C9A227] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckIcon size={14} />
          </div>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Order Fulfillment Hub
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F1] border border-[#C9A227]/40 text-[#8A5F38] text-xs font-bold font-mono">
              {orders.length} Total
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Track customer orders, advance booking deposits, packing queues, and live shipment logistics.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
          <a
            href="/api/admin/export/excel"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-[#041D16] text-[#DFC15E] border border-[#C9A227]/40 hover:bg-black font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>📥 Export Orders (.xlsx)</span>
          </a>
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 shadow-2xs">
            <ShippingIcon size={15} className="text-[#064E3B]" />
            <span>Courier Dispatch: <strong>ST Courier & India Post</strong></span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 flex flex-col sm:flex-row items-center gap-3 text-xs shadow-2xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID, customer name, phone number, state..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 focus:border-[#C9A227]"
          />
          <div className="absolute left-3.5 top-3 text-stone-400">
            <SearchIcon size={16} />
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {(["all", "Pending", "Confirmed", "Processing", "Packed", "Shipped", "Delivered", "Cancelled"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                statusFilter === st
                  ? "bg-[#041D16] text-[#DFC15E] shadow-2xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {st === "all" ? `All (${orders.length})` : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Items & Dresses</th>
                <th className="p-4">Amount Due</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Fulfillment Stage</th>
                <th className="p-4 text-right">Invoice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-stone-400">
                    No orders matched this filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4 font-bold text-stone-900 font-mono">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="text-[#064E3B] hover:text-[#C9A227] hover:underline transition-colors font-bold"
                      >
                        {o.id}
                      </button>
                      <div className="text-[10px] text-stone-400 font-normal font-sans mt-0.5">
                        {new Date(o.createdAt).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-stone-900">{o.customerName}</div>
                      <div className="text-[11px] text-stone-500">{o.customerPhone} • <span className="font-semibold text-stone-700">{o.shippingState}</span></div>
                    </td>
                    <td className="p-4 text-stone-700">
                      <span className="font-semibold">{o.items.length} item(s)</span>
                      <div className="text-[10px] text-stone-400 truncate max-w-[180px]">
                        {o.items.map((i) => i.productName).join(", ")}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-stone-900 text-sm">
                        ₹{o.total.toLocaleString("en-IN")}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Fee: ₹{o.shippingFee}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        o.paymentMethod === "COD"
                          ? "bg-amber-50 text-amber-900 border-amber-200"
                          : "bg-emerald-50 text-emerald-900 border-emerald-200"
                      }`}>
                        {o.paymentMethod}
                      </span>
                    </td>
                    <td className="p-4">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateStatus(o.id, e.target.value as any)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer transition-all ${statusBadgeClasses[o.status] || "bg-stone-50 border-stone-200"}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Processing">Processing</option>
                        <option value="Packed">Packed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(o)}
                        className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#041D16] hover:text-[#DFC15E] text-stone-700 font-bold text-xs transition-all inline-flex items-center gap-1.5"
                      >
                        <EyeIcon size={14} />
                        <span>Slip</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Invoice Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-lg w-full p-6 sm:p-7 text-stone-800 text-xs animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F1] border border-[#C9A227]/40 text-[#8A5F38] text-[10px] font-bold uppercase tracking-wider mb-1">
                  Tax Invoice & Packing Slip
                </div>
                <h3 className="font-display font-bold text-lg text-stone-900">
                  Order #{selectedOrder.id}
                </h3>
                <span className="text-[11px] text-stone-400">
                  Booked on {new Date(selectedOrder.createdAt).toLocaleString("en-IN")}
                </span>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-stone-400 hover:text-stone-700 text-sm p-1 rounded-lg hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Customer Box */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-stone-900 text-sm">{selectedOrder.customerName}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusBadgeClasses[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-stone-600 leading-relaxed">{selectedOrder.shippingAddress}</p>
                <div className="pt-1 flex items-center gap-4 text-stone-500 font-mono text-[11px]">
                  <span>📞 {selectedOrder.customerPhone}</span>
                  <span>📍 {selectedOrder.shippingState}</span>
                </div>
              </div>

              {/* Items List */}
              <div>
                <span className="font-bold uppercase tracking-wider text-stone-500 text-[10px] block mb-2">
                  Garments Packed ({selectedOrder.items.length})
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                      <div className="flex items-center gap-3">
                        <img src={it.image} alt={it.productName} className="w-10 h-12 object-cover rounded-lg border border-stone-200" />
                        <div>
                          <p className="font-bold text-stone-900">{it.productName}</p>
                          <p className="text-[10px] text-stone-500 mt-0.5">
                            Size: <span className="font-bold text-stone-800">{it.size}</span> | Color: {it.color} | Qty: {it.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-stone-900 text-xs">₹{(it.price * it.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cost Summary */}
              <div className="pt-3 border-t border-stone-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal Amount:</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping & Handling:</span>
                  <span>₹{selectedOrder.shippingFee}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Coupon / Discount:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-stone-900 text-base pt-2 border-t border-stone-200">
                  <span>Total Amount Paid / Due:</span>
                  <span className="text-[#064E3B] font-display">₹{selectedOrder.total.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-stone-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-2 border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-50 font-bold"
                >
                  🖨️ Print Slip
                </button>
                <a
                  href={`/account?trackId=${encodeURIComponent(selectedOrder.id)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-[#064E3B] font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>🔗 Customer Tracking View</span>
                </a>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#041D16] text-[#DFC15E] rounded-xl font-bold hover:brightness-110"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
