import { useState, useEffect } from "react";
import { adminApi } from "../../services/api";
import type { Product } from "../../types/store";

export default function AdminReports() {
  const [period, setPeriod] = useState("this_month");
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    adminApi.getProducts().then((list) => setProducts(list));
  }, []);

  const totalStockVal = products.reduce((acc, p) => acc + (p.price * (p.stock || 0)), 0);

  const handleExport = (type: string) => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Product,SKU,Category,Price,Discount,Stock,Status\n" +
      products.map(p => `"${p.name}","${p.sku}","${p.category}",${p.price},${p.discount}%,${p.stock},"${p.status}"`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `nithi_collection_report_${period}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-body">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 font-display">
            Business Intelligence & Reports
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Export monthly sales summaries, inventory valuation, and category sales breakdowns.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleExport("csv")}
            className="px-4 py-2 rounded-xl bg-[#041D16] hover:bg-black text-[#DFC15E] text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <span>📥 Export CSV Report</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Inventory Valuation</p>
          <p className="text-2xl font-bold font-display text-stone-900 mt-1">₹{totalStockVal.toLocaleString('en-IN')}</p>
          <span className="text-[11px] text-emerald-700 font-medium">Wholesale Stock Asset</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Top Performing Category</p>
          <p className="text-2xl font-bold font-display text-stone-900 mt-1">Nighties (68%)</p>
          <span className="text-[11px] text-stone-500 font-medium">Pure Cotton Series</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs">
          <p className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Avg. Order Value (AOV)</p>
          <p className="text-2xl font-bold font-display text-stone-900 mt-1">₹1,450</p>
          <span className="text-[11px] text-stone-500 font-medium">3 Dresses per customer basket</span>
        </div>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wider">
          Category Sales & Margin Breakdown
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-stone-200">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 font-bold text-stone-600 border-b border-stone-200">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Total SKUs</th>
                <th className="px-4 py-3">Units in Stock</th>
                <th className="px-4 py-3">Avg Selling Price</th>
                <th className="px-4 py-3">Stock Valuation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {["Nighty", "Night dress", "Unstitched salwar material", "Cord set", "Kurtis(Tops)", "Salwar set"].map((cat) => {
                const catProducts = products.filter(p => p.category === cat);
                const count = catProducts.length;
                const stock = catProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
                const avgPrice = count > 0 ? Math.round(catProducts.reduce((sum, p) => sum + p.price, 0) / count) : 0;
                const valuation = catProducts.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);

                return (
                  <tr key={cat} className="hover:bg-stone-50/50">
                    <td className="px-4 py-3 font-semibold text-stone-900">{cat}</td>
                    <td className="px-4 py-3">{count} items</td>
                    <td className="px-4 py-3 font-bold">{stock} units</td>
                    <td className="px-4 py-3 font-bold">₹{avgPrice}</td>
                    <td className="px-4 py-3 font-bold text-emerald-800">₹{valuation.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
