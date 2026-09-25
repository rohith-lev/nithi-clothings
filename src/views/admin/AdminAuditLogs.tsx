import { useState, useEffect } from "react";
import type { AuditLog } from "../../types/store";
import { adminApi } from "../../services/api";
import { AuditIcon, SearchIcon, SparklesIcon } from "../../components/admin/AdminIcons";

export default function AdminAuditLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [search, setSearch] = useState("");
  const [targetType, setTargetType] = useState("all");

  useEffect(() => {
    adminApi.getAuditLogs().then((res) => setLogs(res));
  }, []);

  const filtered = logs.filter((l) => {
    if (targetType !== "all" && l.targetType !== targetType) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.targetName.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.adminName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 font-body">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Security & System Audit Logs
          </h1>
          <span className="px-2.5 py-0.5 rounded-full bg-[#FAF8F1] border border-[#C9A227]/40 text-[#8A5F38] text-xs font-bold font-mono">
            {logs.length} Logged Events
          </span>
        </div>
        <p className="text-xs text-stone-500 mt-1">
          Immutable, chronological timeline of catalog mutations, batch restocks, price changes, and rule revisions.
        </p>
      </div>

      <div className="bg-white p-5 rounded-3xl border border-stone-200 flex flex-col sm:flex-row items-center gap-3 text-xs shadow-2xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search activity by dress name, admin user, or action..."
            className="w-full pl-10 pr-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50"
          />
          <div className="absolute left-3.5 top-3 text-stone-400">
            <SearchIcon size={16} />
          </div>
        </div>
        <select
          value={targetType}
          onChange={(e) => setTargetType(e.target.value)}
          className="w-full sm:w-48 py-2.5 px-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700"
        >
          <option value="all">All Mutation Types</option>
          <option value="PRODUCT">Product Modifications</option>
          <option value="STOCK">Warehouse Stock Updates</option>
          <option value="PRICING">Pricing & Discount Adjustments</option>
          <option value="SHIPPING">Shipping Rule Changes</option>
          <option value="COD">COD Rules Revisions</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Administrator</th>
                <th className="p-4">Action Event</th>
                <th className="p-4">Target Resource</th>
                <th className="p-4">Previous State</th>
                <th className="p-4">Applied State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-stone-400">
                    No activity logs recorded matching query.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50/80 transition-colors">
                    <td className="p-4 font-mono text-stone-500 text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="p-4 font-bold text-stone-900">
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {log.adminName}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#FAF8F1] border border-[#C9A227]/40 text-[#8A5F38] font-bold text-[10px]">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 font-semibold text-stone-800">{log.targetName}</td>
                    <td className="p-4 font-mono text-stone-400 text-[11px] max-w-xs truncate">
                      {log.oldValue}
                    </td>
                    <td className="p-4 font-mono text-emerald-800 text-[11px] max-w-xs truncate font-bold">
                      {log.newValue}
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
