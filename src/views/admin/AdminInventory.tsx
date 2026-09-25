import { useState, useEffect } from "react";
import { Link } from "react-router";
import type { Product, InventoryRecord } from "../../types/store";
import { adminApi } from "../../services/api";
import {
  InventoryIcon,
  SearchIcon,
  AlertTriangleIcon,
  CheckIcon,
  PlusIcon,
  RefreshCwIcon,
} from "../../components/admin/AdminIcons";

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [inventory, setInventory] = useState<InventoryRecord[]>([]);
  const [search, setSearch] = useState("");
  const [onlyLow, setOnlyLow] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Quick Restock State
  const [restockProduct, setRestockProduct] = useState<Product | null>(null);
  const [restockQty, setRestockQty] = useState(25);
  const [restockReason, setRestockReason] = useState("Batch Replenishment - Tiruppur Unit");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const prods = await adminApi.getProducts();
    setProducts(prods);
    const mappedInv: InventoryRecord[] = prods.map((p) => ({
      productId: p.id,
      currentStock: p.stock || 0,
      reservedStock: 0,
      availableStock: p.stock || 0,
      soldQuantity: p.reviews ? p.reviews * 3 : 15,
      lowStockThreshold: 10,
    }));
    setInventory(mappedInv);
  };

  const handleRestock = async () => {
    if (!restockProduct) return;
    const res = await adminApi.adjustStock(
      restockProduct.id,
      "ADD",
      restockQty,
      restockReason,
      "Super Admin"
    );
    if (res.success) {
      setToast(res.message || "Stock added successfully.");
      setRestockProduct(null);
      loadData();
      setTimeout(() => setToast(null), 3000);
    }
  };

  const filtered = products.filter((p) => {
    const inv = inventory.find((i) => i.productId === p.id);
    const thresh = inv?.lowStockThreshold || 10;
    if (onlyLow && p.stock > thresh) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    }
    return true;
  });

  const totalStockCount = products.reduce((sum, p) => sum + p.stock, 0);
  const lowStockCount = products.filter((p) => p.stock <= 10).length;

  return (
    <div className="space-y-6 font-body">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-[#041D16] text-white border border-[#C9A227] px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckIcon size={14} />
          </div>
          <span className="font-semibold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              Inventory & Warehouse Control
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F1] border border-[#C9A227]/40 text-[#8A5F38] text-xs font-bold font-mono">
              {totalStockCount} Total Units
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Monitor real-time warehouse counts, reserved customer stock, and trigger instant restock batches.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="px-3.5 py-2 text-xs font-bold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-50 transition-colors inline-flex items-center gap-2 shadow-2xs"
          >
            <RefreshCwIcon size={14} />
            <span>Sync Warehouse</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory by garment name, SKU, or category..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
          />
          <div className="absolute left-3.5 top-3 text-stone-400">
            <SearchIcon size={16} />
          </div>
        </div>
        <button
          onClick={() => setOnlyLow(!onlyLow)}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all shrink-0 inline-flex items-center gap-2 ${
            onlyLow
              ? "bg-[#041D16] text-[#DFC15E] shadow-2xs"
              : "bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100"
          }`}
        >
          <AlertTriangleIcon size={14} />
          <span>{onlyLow ? "Showing: Low Stock Only" : `Show Low Stock Alert (${lowStockCount})`}</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Garment Item</th>
                <th className="p-4">SKU Code</th>
                <th className="p-4">Warehouse Stock</th>
                <th className="p-4">Reserved in Carts</th>
                <th className="p-4">Available for Store</th>
                <th className="p-4">Stock Health Gauge</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-stone-400">
                    No garments found matching inventory search.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const inv = inventory.find((i) => i.productId === p.id);
                  const thresh = inv?.lowStockThreshold || 10;
                  const isLow = p.stock <= thresh && p.stock > 0;
                  const isOut = p.stock <= 0;
                  const healthPct = Math.min(100, Math.round((p.stock / 50) * 100));

                  return (
                    <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover rounded-xl border border-stone-200 shadow-2xs" />
                          <div>
                            <span className="font-bold text-stone-900 block">{p.name}</span>
                            <span className="text-[10px] text-stone-400 capitalize">{p.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-stone-600">{p.sku}</td>
                      <td className="p-4 font-bold text-stone-900 text-sm">{p.stock} units</td>
                      <td className="p-4 text-amber-700 font-semibold">{inv?.reservedStock || 0}</td>
                      <td className="p-4 text-emerald-800 font-bold text-sm">{Math.max(0, p.stock - (inv?.reservedStock || 0))}</td>
                      <td className="p-4">
                        <div className="w-32 space-y-1">
                          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden p-0.5">
                            <div
                              style={{ width: `${healthPct}%` }}
                              className={`h-full rounded-full transition-all duration-500 ${
                                isOut ? "bg-rose-600" : isLow ? "bg-amber-500" : "bg-emerald-600"
                              }`}
                            />
                          </div>
                          <div>
                            {isOut ? (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                                OUT OF STOCK
                              </span>
                            ) : isLow ? (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                ⚠️ LOW ({p.stock} left)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                OPTIMAL LEVEL
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setRestockProduct(p)}
                          className="px-3.5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#0B3D2E] text-white font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5"
                        >
                          <PlusIcon size={14} />
                          <span>Restock</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Restock Modal */}
      {restockProduct && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 max-w-md w-full p-6 sm:p-7 text-stone-800 text-xs space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-display font-bold text-lg text-stone-900">
                  Warehouse Inward Stock
                </h3>
                <p className="text-stone-500 text-xs mt-0.5">
                  {restockProduct.name} ({restockProduct.sku})
                </p>
              </div>
              <button
                onClick={() => setRestockProduct(null)}
                className="text-stone-400 hover:text-stone-700 text-sm p-1 rounded-lg hover:bg-stone-100"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between">
              <span className="text-emerald-900 font-semibold">Current Available:</span>
              <span className="text-emerald-900 font-bold text-base">{restockProduct.stock} units</span>
            </div>

            {/* Quick Stepper Presets */}
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">Preset Batches</label>
              <div className="flex gap-2">
                {[10, 25, 50, 100].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setRestockQty(qty)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      restockQty === qty
                        ? "bg-[#041D16] text-[#DFC15E] border-[#041D16]"
                        : "bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100"
                    }`}
                  >
                    +{qty}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1.5">Custom Quantity to Add</label>
              <input
                type="number"
                min={1}
                value={restockQty}
                onChange={(e) => setRestockQty(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-base font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1.5">Source / Inward Batch Note</label>
              <input
                type="text"
                value={restockReason}
                onChange={(e) => setRestockReason(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-stone-100">
              <button
                onClick={() => setRestockProduct(null)}
                className="px-4 py-2.5 border border-stone-300 rounded-xl text-stone-700 font-semibold hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRestock}
                className="px-5 py-2.5 bg-[#064E3B] hover:bg-[#0B3D2E] text-white rounded-xl font-bold shadow-sm"
              >
                Confirm Inward +{restockQty} Units
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
