import React, { useState, useEffect } from "react";
import { CheckIcon, SearchIcon, FilterIcon, TrashIcon } from "../../components/admin/AdminIcons";
import { adminApi } from "../../services/api";

interface BookingRecord {
  bookingId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceOrProduct: string;
  date: string;
  time: string;
  quantity: number;
  price: number;
  paymentStatus: "Pending" | "Paid" | "Advance_Paid" | "Refunded";
  bookingStatus: "Confirmed" | "Pending" | "Completed" | "Cancelled";
  createdAt?: string;
}

export default function AdminBookings() {
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
  const [deletingAll, setDeletingAll] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bookings");
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const text = await res.text();
        const json = JSON.parse(text);
        if (json.success && Array.isArray(json.data)) {
          setBookings(json.data);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn("API bookings fetch error:", e);
    }

    setBookings([]);
    setLoading(false);
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (confirm(`Are you sure you want to delete Booking #${bookingId}?`)) {
      const res = await adminApi.deleteBooking(bookingId);
      if (res.success) {
        showToast(`Booking #${bookingId} deleted.`);
        loadBookings();
      } else {
        alert(`Failed to delete booking: ${res.error || "Unknown error"}`);
      }
    }
  };

  const handleConfirmDeleteAll = async () => {
    setDeletingAll(true);
    const res = await adminApi.deleteAllBookings();
    setDeletingAll(false);
    setShowDeleteAllModal(false);
    if (res.success) {
      showToast(res.message || "All bookings purged successfully.");
      loadBookings();
    } else {
      showToast(res.error || "Failed to purge bookings.");
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleUpdateStatus = async (bookingId: string, bookingStatus: BookingRecord["bookingStatus"]) => {
    try {
      await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingStatus }),
      });
    } catch (e) {}

    setBookings((prev) =>
      prev.map((b) => (b.bookingId === bookingId ? { ...b, bookingStatus } : b))
    );
    showToast(`Booking #${bookingId} status updated to ${bookingStatus}`);
  };

  const filtered = bookings.filter((b) => {
    if (statusFilter !== "all" && b.bookingStatus !== statusFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        b.bookingId.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        b.serviceOrProduct.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-body">
      {/* Toast */}
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
              Customer Bookings & Consultations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F1] border border-[#C9A227]/40 text-[#8A5F38] text-xs font-bold font-mono">
              {bookings.length} Permanent Records
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Permanent business records for bespoke tailoring appointments, bulk reservations, and design consultations.
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
            href="/api/admin/export/excel"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 bg-[#041D16] text-[#DFC15E] rounded-xl text-xs font-bold border border-[#C9A227]/40 hover:bg-black transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>📥 Export Bookings (.xlsx)</span>
          </a>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search booking by ID, customer name, phone, service..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
          />
          <div className="absolute left-3.5 top-3 text-stone-400">
            <SearchIcon size={16} />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["all", "Confirmed", "Pending", "Completed", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all text-xs ${
                statusFilter === st
                  ? "bg-[#041D16] text-[#DFC15E] shadow-2xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {st === "all" ? `All (${bookings.length})` : st}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Booking ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Service / Requirement</th>
                <th className="p-4">Appointment Date & Time</th>
                <th className="p-4">Price & Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    Loading permanent booking records...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No bookings found matching filters.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => (
                  <tr key={b.bookingId} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-stone-900">{b.bookingId}</td>
                    <td className="p-4">
                      <div className="font-bold text-stone-900">{b.customerName}</div>
                      <div className="text-[11px] text-stone-500 font-mono mt-0.5">{b.customerPhone}</div>
                      {b.customerEmail && <div className="text-[10px] text-stone-400">{b.customerEmail}</div>}
                    </td>
                    <td className="p-4 text-stone-700">
                      <span className="font-semibold block">{b.serviceOrProduct}</span>
                      <span className="text-[10px] text-stone-400">Qty: {b.quantity}</span>
                    </td>
                    <td className="p-4 font-medium text-stone-800">
                      <div className="font-bold">{b.date}</div>
                      <div className="text-[11px] text-stone-500">{b.time || "Full Day"}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-black text-[#064E3B] text-sm">₹{b.price.toLocaleString("en-IN")}</div>
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold mt-1 ${
                        b.paymentStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-800"
                          : b.paymentStatus === "Advance_Paid"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        b.bookingStatus === "Confirmed"
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : b.bookingStatus === "Completed"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : b.bookingStatus === "Cancelled"
                          ? "bg-rose-50 text-rose-800 border-rose-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {b.bookingStatus !== "Confirmed" && (
                          <button
                            onClick={() => handleUpdateStatus(b.bookingId, "Confirmed")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200 transition-colors"
                          >
                            Confirm
                          </button>
                        )}
                        {b.bookingStatus !== "Completed" && (
                          <button
                            onClick={() => handleUpdateStatus(b.bookingId, "Completed")}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[10px] border border-blue-200 transition-colors"
                          >
                            Done
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteBooking(b.bookingId)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/60 transition-colors cursor-pointer"
                          title="Delete booking"
                        >
                          <TrashIcon size={13} />
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

      {/* Purge All Bookings Confirmation Modal */}
      {showDeleteAllModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-7 text-stone-800 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 flex items-center justify-center border border-rose-200">
                <TrashIcon size={22} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-stone-900 leading-tight">Delete All Bookings?</h3>
                <p className="text-xs text-rose-600 font-semibold">Irreversible Action</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to permanently purge <strong>all {bookings.length} bookings</strong> from MongoDB Atlas?
            </p>

            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-200 text-xs text-rose-900 space-y-1">
              <p className="font-bold">⚠️ Warning:</p>
              <p>All bespoke tailoring appointments, bulk orders, and consultation records will be deleted.</p>
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
                  <span>Yes, Purge All Bookings</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
