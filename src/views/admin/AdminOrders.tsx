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
  TrashIcon,
} from "../../components/admin/AdminIcons";

export default function AdminOrders() {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Nithi Collection",
    storeAddress: "Nithi Collection, No. 45, Avinashi Main Road, Kumaran Nagar, Tiruppur, Tamil Nadu - 641603",
    supportPhone: "+91 98765 43210",
  });

  // Tracking form inputs inside order modal
  const [trackingCourier, setTrackingCourier] = useState("");
  const [trackingIdInput, setTrackingIdInput] = useState("");
  const [dispatchDateInput, setDispatchDateInput] = useState("");
  const [orderStatusInput, setOrderStatusInput] = useState<OrderRecord["status"]>("Pending");
  const [savingTracking, setSavingTracking] = useState(false);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("nithi_db_settings_v4");
      if (raw) {
        const parsed = JSON.parse(raw);
        setStoreSettings({
          storeName: parsed.storeName || "Nithi Collection",
          storeAddress: parsed.storeAddress || "Nithi Collection, No. 45, Avinashi Main Road, Kumaran Nagar, Tiruppur, Tamil Nadu - 641603",
          supportPhone: parsed.supportPhone || "+91 98765 43210",
        });
      }
    } catch {}
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) return;
      const text = await res.text();
      const json = JSON.parse(text);
      if (json.success && Array.isArray(json.data)) {
        const mapped = json.data.map((o: any) => ({
          id: o.orderId || o.id,
          orderId: o.orderId || o.id,
          customerName: o.customerName || (o.customer?.name ?? "Customer"),
          customerPhone: o.customerPhone || (o.customer?.phone ?? ""),
          customerEmail: o.customerEmail || (o.customer?.email ?? ""),
          items: (o.items || []).map((it: any) => ({
            productId: it.productId,
            productName: it.productName || it.name,
            size: it.selectedSize || it.size || "Free Size",
            color: it.selectedColor || it.color || "Standard",
            quantity: it.quantity,
            price: it.price || it.finalPrice,
            image: it.image || "",
          })),
          subtotal: o.subtotal || o.total || 0,
          shippingFee: o.shippingFee || 0,
          discount: o.discount || 0,
          total: o.total || 0,
          status: o.orderStatus || o.status || "Pending",
          paymentMethod: o.paymentMethod || "COD",
          shippingState: o.shippingState || "Tamil Nadu",
          shippingAddress: o.shippingAddress || "",
          courierName: o.courierName || "",
          trackingId: o.trackingId || "",
          dispatchDate: o.dispatchDate || "",
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

  useEffect(() => {
    if (selectedOrder) {
      setTrackingCourier(selectedOrder.courierName || "ST Courier");
      setTrackingIdInput(selectedOrder.trackingId || "");
      setDispatchDateInput(selectedOrder.dispatchDate || new Date().toISOString().slice(0, 10));
      setOrderStatusInput(selectedOrder.status);
    }
  }, [selectedOrder]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveTracking = async () => {
    if (!selectedOrder) return;
    setSavingTracking(true);
    try {
      await adminApi.updateOrderTracking(selectedOrder.id, {
        courierName: trackingCourier.trim(),
        trackingId: trackingIdInput.trim(),
        dispatchDate: dispatchDateInput.trim(),
        orderStatus: orderStatusInput,
      });

      const updatedOrder = {
        ...selectedOrder,
        courierName: trackingCourier.trim(),
        trackingId: trackingIdInput.trim(),
        dispatchDate: dispatchDateInput.trim(),
        status: orderStatusInput,
      };

      setSelectedOrder(updatedOrder);
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? updatedOrder : o))
      );
      showToast(`Tracking ID & dispatch details saved for Order #${selectedOrder.id}`);
    } catch (err: any) {
      alert(`Error saving tracking details: ${err.message || "Failed"}`);
    } finally {
      setSavingTracking(false);
    }
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
      setOrderStatusInput(newStatus);
    }
    showToast(`Order #${orderId} status changed to "${newStatus}"`);
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm(`Are you sure you want to delete Order #${orderId}? This cannot be undone.`)) {
      const res = await adminApi.deleteOrder(orderId);
      if (res.success) {
        showToast(`Order #${orderId} deleted successfully.`);
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(null);
        }
        loadOrders();
      } else {
        alert(`Failed to delete order: ${res.error || "Unknown error"}`);
      }
    }
  };

  const handleConfirmDeleteAll = async () => {
    setDeletingAll(true);
    const res = await adminApi.deleteAllOrders();
    setDeletingAll(false);
    setShowDeleteAllModal(false);
    if (res.success) {
      showToast(res.message || "All orders purged successfully.");
      setSelectedOrder(null);
      loadOrders();
    } else {
      showToast(res.error || "Failed to delete all orders.");
    }
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
          <button
            type="button"
            onClick={() => setShowDeleteAllModal(true)}
            className="px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 rounded-xl shadow-2xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
          >
            <TrashIcon size={14} />
            <span>Purge All</span>
          </button>
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
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-[#041D16] hover:text-[#DFC15E] text-stone-700 font-bold text-xs transition-all inline-flex items-center gap-1.5"
                        >
                          <EyeIcon size={14} />
                          <span>Slip</span>
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(o.id)}
                          className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 transition-all cursor-pointer"
                          title="Delete order"
                        >
                          <TrashIcon size={14} />
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

      {/* Order Details, Courier Tracking & Printable Shipping Slip Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-2xl w-full p-6 sm:p-7 text-stone-800 text-xs animate-in zoom-in-95 duration-150 my-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4 no-print">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FAF8F1] border border-[#C9A227]/40 text-[#8A5F38] text-[10px] font-bold uppercase tracking-wider mb-1">
                  Order Management & Shipping Label
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
                className="text-stone-400 hover:text-stone-700 text-sm p-1.5 rounded-lg hover:bg-stone-100 no-print"
              >
                ✕
              </button>
            </div>

            {/* PRIORITY 1: Courier Tracking Admin Entry Workflow */}
            <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl mb-6 space-y-3 no-print">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#064E3B] text-xs flex items-center gap-1.5">
                  <ShippingIcon size={14} />
                  Courier Tracking & Dispatch Management
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-mono">
                  Admin Entry
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Order ID</label>
                  <input
                    type="text"
                    disabled
                    value={selectedOrder.id}
                    className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl font-mono text-stone-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">Customer</label>
                  <input
                    type="text"
                    disabled
                    value={`${selectedOrder.customerName} (${selectedOrder.customerPhone})`}
                    className="w-full px-3 py-2 bg-stone-100 border border-stone-200 rounded-xl text-stone-600 cursor-not-allowed truncate"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Courier Name</label>
                  <input
                    type="text"
                    list="courierOptions"
                    value={trackingCourier}
                    onChange={(e) => setTrackingCourier(e.target.value)}
                    placeholder="e.g. ST Courier, India Post, Delhivery"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] text-stone-800"
                  />
                  <datalist id="courierOptions">
                    <option value="ST Courier" />
                    <option value="India Post (Speed Post)" />
                    <option value="The Professional Couriers" />
                    <option value="Delhivery" />
                    <option value="DTDC" />
                    <option value="Blue Dart" />
                    <option value="Ekart" />
                  </datalist>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Tracking ID / AWB Number *</label>
                  <input
                    type="text"
                    value={trackingIdInput}
                    onChange={(e) => setTrackingIdInput(e.target.value)}
                    placeholder="e.g. ST987654321 / IN89234823"
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] text-stone-800 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Dispatch Date</label>
                  <input
                    type="date"
                    value={dispatchDateInput}
                    onChange={(e) => setDispatchDateInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] text-stone-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">Order Status</label>
                  <select
                    value={orderStatusInput}
                    onChange={(e) => setOrderStatusInput(e.target.value as any)}
                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C9A227] text-stone-800 font-bold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Processing">Processing</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleSaveTracking}
                  disabled={savingTracking}
                  className="px-4 py-2 bg-[#064E3B] text-white rounded-xl font-bold hover:bg-[#0B3D2E] transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-50"
                >
                  {savingTracking ? "Saving Tracking..." : "💾 Save Tracking Details"}
                </button>
              </div>
            </div>

            {/* PRIORITY 3: Working Print Shipping Label / Print Packing Slip Container */}
            <div id="printable-shipping-slip" className="border border-stone-300 rounded-2xl p-5 bg-white space-y-4 shadow-2xs text-stone-900">
              {/* Slip Header */}
              <div className="flex justify-between items-start border-b border-stone-300 pb-3">
                <div>
                  <h2 className="font-display text-xl font-bold text-stone-900 tracking-tight">
                    {storeSettings.storeName}
                  </h2>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[#064E3B]">
                    Shipping Label & Packing Slip
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono font-bold text-sm text-stone-900">Order: {selectedOrder.id}</p>
                  <p className="text-[10px] text-stone-500">
                    Date: {new Date(selectedOrder.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Two Column Addresses: FROM and TO */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-stone-200 rounded-xl p-3.5 bg-stone-50/50">
                {/* FROM — SENDER ADDRESS */}
                <div className="space-y-1 sm:border-r sm:border-stone-200 sm:pr-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    FROM — SENDER ADDRESS
                  </p>
                  <p className="font-bold text-stone-900 text-xs">{storeSettings.storeName}</p>
                  <p className="text-[11px] text-stone-700 leading-relaxed whitespace-pre-line">
                    {storeSettings.storeAddress}
                  </p>
                  <p className="text-[11px] font-semibold text-stone-600 font-mono">
                    Phone: {storeSettings.supportPhone}
                  </p>
                </div>

                {/* TO — CUSTOMER DELIVERY ADDRESS */}
                <div className="space-y-1 sm:pl-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    TO — CUSTOMER DELIVERY ADDRESS
                  </p>
                  <p className="font-bold text-stone-900 text-xs">{selectedOrder.customerName}</p>
                  <p className="text-[11px] text-stone-700 leading-relaxed">
                    {selectedOrder.shippingAddress}
                  </p>
                  <p className="text-[11px] font-bold text-stone-900 font-mono">
                    Phone: {selectedOrder.customerPhone}
                  </p>
                </div>
              </div>

              {/* Courier & Logistics Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-stone-100 rounded-xl text-[11px] font-mono">
                <div>
                  <span className="text-stone-500">Courier: </span>
                  <strong className="text-stone-900">{selectedOrder.courierName || trackingCourier || "Pending"}</strong>
                </div>
                <div>
                  <span className="text-stone-500">Tracking / AWB: </span>
                  <strong className="text-stone-900">{selectedOrder.trackingId || trackingIdInput || "Not assigned"}</strong>
                </div>
                <div>
                  <span className="text-stone-500">Payment: </span>
                  <strong className="text-stone-900">{selectedOrder.paymentMethod} ({selectedOrder.status})</strong>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500 mb-2">
                  Order Items Breakdown ({selectedOrder.items.length})
                </p>
                <table className="w-full text-left text-xs border border-stone-200 rounded-lg overflow-hidden">
                  <thead className="bg-stone-100 text-stone-600 text-[10px] uppercase font-bold">
                    <tr>
                      <th className="p-2 border-b border-stone-200">Product Name</th>
                      <th className="p-2 border-b border-stone-200">Size / Variant</th>
                      <th className="p-2 border-b border-stone-200 text-center">Qty</th>
                      <th className="p-2 border-b border-stone-200 text-right">Unit Price</th>
                      <th className="p-2 border-b border-stone-200 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {selectedOrder.items.map((it, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-semibold text-stone-900">{it.productName}</td>
                        <td className="p-2 text-stone-700">{it.size || "Free Size"}</td>
                        <td className="p-2 text-center font-bold text-stone-900">{it.quantity}</td>
                        <td className="p-2 text-right text-stone-600">₹{it.price.toLocaleString("en-IN")}</td>
                        <td className="p-2 text-right font-bold text-stone-900">₹{(it.price * it.quantity).toLocaleString("en-IN")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals */}
              <div className="pt-2 border-t border-stone-300 space-y-1 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Shipping Fee:</span>
                  <span>₹{selectedOrder.shippingFee}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-stone-900 text-sm pt-1.5 border-t border-stone-300">
                  <span>Grand Total:</span>
                  <span className="text-[#064E3B] font-display text-base">₹{selectedOrder.total.toLocaleString("en-IN")}</span>
                </div>
              </div>

              {/* Slip Footer */}
              <div className="text-[10px] text-stone-400 text-center pt-2 border-t border-stone-200">
                Thank you for shopping with Nithi Collection! For inquiries, contact {storeSettings.supportPhone}.
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-wrap justify-between items-center gap-2 pt-3 border-t border-stone-100 no-print">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-[#064E3B] text-white hover:bg-[#0B3D2E] rounded-xl font-bold shadow-sm inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>🖨️ Print Shipping Label / Packing Slip</span>
                </button>
                <a
                  href={`/account?trackId=${encodeURIComponent(selectedOrder.id)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-2.5 bg-stone-100 hover:bg-stone-200 text-[#064E3B] font-bold rounded-xl inline-flex items-center gap-1.5 transition-colors"
                >
                  <span>🔗 Customer Tracking View</span>
                </a>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteOrder(selectedOrder.id)}
                className="px-3.5 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <TrashIcon size={14} />
                <span>Delete Order</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 bg-stone-200 text-stone-700 rounded-xl font-bold hover:bg-stone-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purge All Orders Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-7 text-stone-800 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-200">
                <TrashIcon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-900 leading-tight">Delete All Orders?</h3>
                <p className="text-xs text-rose-600 font-semibold">Irreversible Action</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently purge <strong>all {orders.length} orders</strong> from MongoDB Atlas?
            </p>

            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 space-y-1">
              <p className="font-bold">⚠️ Warning:</p>
              <p>All order line items, payment proofs, courier tracking records, and dispatch statuses will be permanently deleted.</p>
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
                  <span>Yes, Purge All Orders</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
