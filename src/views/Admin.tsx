import { useState } from "react";
import { products, categories } from "../data/products";

type AdminTab = "dashboard" | "products" | "orders" | "customers" | "shipping" | "settings";

const mockOrders = [
  { id: "NC12345678", customer: "Priya Rajendran", items: 3, total: 1847, status: "Shipped", date: "2026-09-10", method: "Online", state: "Tamil Nadu" },
  { id: "NC12345679", customer: "Meena Krishnan", items: 1, total: 649, status: "Processing", date: "2026-09-10", method: "COD", state: "Kerala" },
  { id: "NC12345680", customer: "Saranya Devi", items: 5, total: 3295, status: "Delivered", date: "2026-09-09", method: "Online", state: "Tamil Nadu" },
  { id: "NC12345681", customer: "Kavitha Murugan", items: 2, total: 1198, status: "Pending", date: "2026-09-09", method: "COD", state: "Tamil Nadu" },
  { id: "NC12345682", customer: "Anitha Suresh", items: 1, total: 899, status: "Confirmed", date: "2026-09-08", method: "Online", state: "Karnataka" },
  { id: "NC12345683", customer: "Rekha Shankar", items: 4, total: 2396, status: "Packed", date: "2026-09-08", method: "Online", state: "Tamil Nadu" },
];

const statusColors: Record<string, string> = {
  Pending: "bg-yellow-100 text-yellow-800",
  Confirmed: "bg-blue-100 text-blue-800",
  Processing: "bg-indigo-100 text-indigo-800",
  Packed: "bg-purple-100 text-purple-800",
  Shipped: "bg-teal-100 text-teal-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const stats = [
  { label: "Today's Orders", value: "24", change: "+12%", icon: "📦", color: "#7D1E3B" },
  { label: "Today's Revenue", value: "₹18,450", change: "+8%", icon: "💰", color: "#C4956A" },
  { label: "Pending Orders", value: "7", change: "-3", icon: "⏳", color: "#5A3A28" },
  { label: "Total Customers", value: "1,284", change: "+34", icon: "👥", color: "#1A1008" },
];

const weeklyRevenue = [
  { day: "Mon", amount: 12400 },
  { day: "Tue", amount: 18650 },
  { day: "Wed", amount: 9800 },
  { day: "Thu", amount: 22100 },
  { day: "Fri", amount: 31200 },
  { day: "Sat", amount: 28700 },
  { day: "Sun", amount: 15900 },
];
const maxRevenue = Math.max(...weeklyRevenue.map((d) => d.amount));

export default function Admin() {
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  if (!loggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-4 font-body">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="font-display text-2xl font-bold text-[#7D1E3B]">Nithi Collection</div>
            <div className="text-xs text-[#C4956A] tracking-[0.2em] uppercase mt-0.5">Admin Panel</div>
          </div>
          <div className="bg-white border border-[#DDD5C8] rounded-sm p-8 shadow-sm">
            <h1 className="font-display text-xl font-bold text-[#1A1008] mb-6">Admin Login</h1>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wide mb-1.5">Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="admin@nithicollection.in"
                  className="w-full border border-[#DDD5C8] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#7D1E3B]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wide mb-1.5">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full border border-[#DDD5C8] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#7D1E3B]"
                />
              </div>
              <button
                onClick={() => setLoggedIn(true)}
                className="w-full bg-[#7D1E3B] text-white py-3 text-sm font-bold uppercase tracking-widest hover:bg-[#6a1832] transition-colors"
              >
                Sign In
              </button>
              <p className="text-[11px] text-center text-[#8A7060]">Demo: any credentials work</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "products", label: "Products", icon: "👗" },
    { id: "orders", label: "Orders", icon: "📦" },
    { id: "customers", label: "Customers", icon: "👥" },
    { id: "shipping", label: "Shipping Rules", icon: "🚚" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="flex min-h-screen bg-[#FAF8F5] font-body">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#1A1008] text-white">
        <div className="p-5 border-b border-[#2A1A0A]">
          <div className="font-display text-base font-bold text-white">Nithi Collection</div>
          <div className="text-[10px] text-[#C4956A] tracking-[0.15em] uppercase mt-0.5">Admin Panel</div>
        </div>
        <nav className="flex-1 p-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors mb-0.5 text-left ${
                activeTab === tab.id
                  ? "bg-[#7D1E3B] text-white"
                  : "text-[#8A7060] hover:bg-[#2A1A0A] hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#2A1A0A]">
          <button
            onClick={() => setLoggedIn(false)}
            className="w-full text-xs text-[#8A7060] hover:text-white transition-colors text-left"
          >
            ← Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#DDD5C8] px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-display text-lg font-bold text-[#1A1008]">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-[#8A7060]">September 11, 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-semibold">● Live</span>
            <div className="w-8 h-8 bg-[#7D1E3B] rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        </header>

        <div className="p-6 overflow-y-auto h-[calc(100vh-60px)]">
          {/* Mobile Tab Bar */}
          <div className="flex gap-2 overflow-x-auto pb-3 mb-4 lg:hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeTab === tab.id ? "bg-[#7D1E3B] text-white" : "bg-white border border-[#DDD5C8] text-[#5A3A28]"
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Dashboard */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-white border border-[#DDD5C8] rounded-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl">{stat.icon}</span>
                      <span className={`text-xs font-semibold ${stat.change.startsWith("+") ? "text-green-600" : "text-red-500"}`}>{stat.change}</span>
                    </div>
                    <p className="font-display text-2xl font-bold text-[#1A1008]">{stat.value}</p>
                    <p className="text-xs text-[#8A7060] mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Revenue Chart */}
              <div className="bg-white border border-[#DDD5C8] rounded-sm p-5">
                <h3 className="font-display text-base font-bold text-[#1A1008] mb-4">This Week's Revenue</h3>
                <div className="flex items-end gap-3 h-40">
                  {weeklyRevenue.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-[#8A7060]">₹{(d.amount / 1000).toFixed(0)}k</span>
                      <div
                        className="w-full rounded-t-sm bg-[#7D1E3B] transition-all hover:bg-[#C4956A]"
                        style={{ height: `${(d.amount / maxRevenue) * 100}%` }}
                      />
                      <span className="text-[10px] text-[#8A7060]">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white border border-[#DDD5C8] rounded-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-base font-bold text-[#1A1008]">Recent Orders</h3>
                  <button onClick={() => setActiveTab("orders")} className="text-xs text-[#7D1E3B] font-semibold hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#DDD5C8] text-xs text-[#8A7060] uppercase tracking-wide">
                        <th className="text-left pb-2">Order ID</th>
                        <th className="text-left pb-2">Customer</th>
                        <th className="text-right pb-2">Total</th>
                        <th className="text-center pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE8E1]">
                      {mockOrders.slice(0, 4).map((order) => (
                        <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="py-2.5 text-[#7D1E3B] font-semibold text-xs">#{order.id}</td>
                          <td className="py-2.5 text-[#1A1008]">{order.customer}</td>
                          <td className="py-2.5 text-right font-semibold">₹{order.total.toLocaleString("en-IN")}</td>
                          <td className="py-2.5 text-center">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category Performance */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white border border-[#DDD5C8] rounded-sm p-5">
                  <h3 className="font-display text-base font-bold text-[#1A1008] mb-4">Sales by Category</h3>
                  <div className="space-y-3">
                    {[
                      { cat: "Nighty", pct: 38, revenue: "₹42,300" },
                      { cat: "Salwar Set", pct: 26, revenue: "₹28,900" },
                      { cat: "Kurtis", pct: 18, revenue: "₹20,100" },
                      { cat: "Cord Set", pct: 12, revenue: "₹13,400" },
                      { cat: "Maxi", pct: 6, revenue: "₹6,700" },
                    ].map((item) => (
                      <div key={item.cat}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#5A3A28]">{item.cat}</span>
                          <span className="text-[#8A7060]">{item.revenue} ({item.pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-[#EDE8E1] rounded-full overflow-hidden">
                          <div className="h-full bg-[#7D1E3B] rounded-full" style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border border-[#DDD5C8] rounded-sm p-5">
                  <h3 className="font-display text-base font-bold text-[#1A1008] mb-4">Payment Methods</h3>
                  <div className="space-y-4">
                    {[
                      { method: "Online Payment", count: 68, pct: 68 },
                      { method: "Cash on Delivery", count: 32, pct: 32 },
                    ].map((item) => (
                      <div key={item.method}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-[#5A3A28]">{item.method}</span>
                          <span className="font-bold text-[#1A1008]">{item.pct}%</span>
                        </div>
                        <div className="h-2 bg-[#EDE8E1] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${item.method === "Online Payment" ? "bg-[#7D1E3B]" : "bg-[#C4956A]"}`} style={{ width: `${item.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          {activeTab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#8A7060]">{products.length} products</p>
                <button className="bg-[#7D1E3B] text-white px-4 py-2 text-sm font-semibold hover:bg-[#6a1832] transition-colors rounded-sm">
                  + Add Product
                </button>
              </div>
              <div className="bg-white border border-[#DDD5C8] rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#FAF8F5] border-b border-[#DDD5C8]">
                      <tr className="text-xs text-[#8A7060] uppercase tracking-wide">
                        <th className="text-left px-4 py-3">Product</th>
                        <th className="text-left px-4 py-3 hidden md:table-cell">Category</th>
                        <th className="text-right px-4 py-3">Price</th>
                        <th className="text-center px-4 py-3 hidden lg:table-cell">Stock</th>
                        <th className="text-center px-4 py-3">Status</th>
                        <th className="text-center px-4 py-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE8E1]">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-12 bg-[#F3EDE6] rounded overflow-hidden shrink-0">
                                <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-medium text-[#1A1008] text-xs">{p.name}</p>
                                <p className="text-[10px] text-[#8A7060]">{p.code}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell text-xs text-[#5A3A28] capitalize">{p.category.replace(/-/g, " ")}</td>
                          <td className="px-4 py-3 text-right">
                            <p className="text-xs font-bold text-[#1A1008]">₹{p.price}</p>
                            <p className="text-[10px] text-[#8A7060] line-through">₹{p.mrp}</p>
                          </td>
                          <td className="px-4 py-3 text-center hidden lg:table-cell">
                            <span className={`text-xs font-semibold ${p.stock < 20 ? "text-red-600" : "text-[#1A1008]"}`}>{p.stock}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.inStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                              {p.inStock ? "In Stock" : "Out"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button className="text-[#7D1E3B] text-xs hover:underline">Edit</button>
                              <button className="text-red-500 text-xs hover:underline">Del</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Orders */}
          {activeTab === "orders" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#8A7060]">{mockOrders.length} orders today</p>
                <select className="text-sm border border-[#DDD5C8] px-3 py-2 rounded bg-white focus:outline-none focus:border-[#7D1E3B]">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Processing</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                </select>
              </div>
              <div className="bg-white border border-[#DDD5C8] rounded-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#FAF8F5] border-b border-[#DDD5C8]">
                      <tr className="text-xs text-[#8A7060] uppercase tracking-wide">
                        <th className="text-left px-4 py-3">Order</th>
                        <th className="text-left px-4 py-3">Customer</th>
                        <th className="text-left px-4 py-3 hidden md:table-cell">Date</th>
                        <th className="text-left px-4 py-3 hidden lg:table-cell">State</th>
                        <th className="text-center px-4 py-3 hidden md:table-cell">Payment</th>
                        <th className="text-right px-4 py-3">Total</th>
                        <th className="text-center px-4 py-3">Status</th>
                        <th className="text-center px-4 py-3">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EDE8E1]">
                      {mockOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#FAF8F5] transition-colors">
                          <td className="px-4 py-3 text-[#7D1E3B] font-semibold text-xs">#{order.id}</td>
                          <td className="px-4 py-3 text-[#1A1008]">{order.customer}</td>
                          <td className="px-4 py-3 text-[#8A7060] hidden md:table-cell">{order.date}</td>
                          <td className="px-4 py-3 text-[#5A3A28] hidden lg:table-cell">{order.state}</td>
                          <td className="px-4 py-3 text-center hidden md:table-cell">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${order.method === "COD" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}`}>
                              {order.method}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-bold">₹{order.total.toLocaleString("en-IN")}</td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${statusColors[order.status]}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button className="text-[#7D1E3B] text-xs hover:underline">View</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Rules */}
          {activeTab === "shipping" && (
            <div className="space-y-5">
              <div className="bg-white border border-[#DDD5C8] rounded-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-base font-bold text-[#1A1008]">Shipping Rules (Online Payment)</h3>
                  <button className="bg-[#7D1E3B] text-white px-3 py-1.5 text-xs font-semibold rounded hover:bg-[#6a1832]">+ Add Rule</button>
                </div>
                <div className="space-y-3">
                  {[
                    { condition: "Tamil Nadu + Nighty × ≥3", action: "Free Shipping", priority: 1 },
                    { condition: "Tamil Nadu + Nighty × ≥5", action: "Free Shipping + ₹15 discount/nighty", priority: 2 },
                    { condition: "Tamil Nadu + Salwar Set × ≥1", action: "Free Shipping", priority: 3 },
                    { condition: "TN + Nighty × ≥1 + Salwar × ≥1", action: "Free Shipping (Combo)", priority: 4 },
                    { condition: "AP/TG/KL/KA + Salwar × 1", action: "₹50 Shipping", priority: 5 },
                    { condition: "AP/TG/KL/KA + Salwar × ≥2", action: "Free Shipping", priority: 6 },
                    { condition: "Other States + Salwar × 1", action: "₹70 Shipping", priority: 7 },
                    { condition: "Other States + Salwar each additional", action: "+₹40 per set", priority: 8 },
                  ].map((rule) => (
                    <div key={rule.priority} className="flex items-center gap-4 p-3 bg-[#FAF8F5] rounded border border-[#DDD5C8] text-sm">
                      <span className="w-6 h-6 bg-[#7D1E3B]/10 text-[#7D1E3B] text-xs font-bold rounded flex items-center justify-center shrink-0">{rule.priority}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#5A3A28]"><span className="font-semibold text-[#1A1008]">IF</span> {rule.condition}</p>
                        <p className="text-xs text-green-700 mt-0.5"><span className="font-semibold">THEN</span> {rule.action}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="text-xs text-[#7D1E3B] hover:underline">Edit</button>
                        <button className="text-xs text-red-500 hover:underline">Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-[#DDD5C8] rounded-sm p-5">
                <h3 className="font-display text-base font-bold text-[#1A1008] mb-4">COD Advance Rules</h3>
                <div className="space-y-3">
                  {[
                    { condition: "Unstitched Salwar × 2", advance: "₹100" },
                    { condition: "Unstitched Salwar up to × 5", advance: "₹160" },
                    { condition: "Nighty × 3", advance: "₹100" },
                    { condition: "Nighty × 4–6", advance: "₹130" },
                  ].map((rule) => (
                    <div key={rule.condition} className="flex items-center justify-between p-3 bg-[#FAF8F5] rounded border border-[#DDD5C8] text-sm">
                      <p className="text-xs text-[#5A3A28]">{rule.condition}</p>
                      <p className="text-xs font-bold text-amber-600">{rule.advance} advance</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Customers */}
          {activeTab === "customers" && (
            <div className="bg-white border border-[#DDD5C8] rounded-sm p-5">
              <h3 className="font-display text-base font-bold text-[#1A1008] mb-4">Customer Overview</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Total Customers", value: "1,284" },
                  { label: "New This Month", value: "87" },
                  { label: "Repeat Buyers", value: "43%" },
                  { label: "Avg Order Value", value: "₹1,240" },
                ].map((s) => (
                  <div key={s.label} className="border border-[#DDD5C8] rounded-sm p-4 text-center">
                    <p className="font-display text-xl font-bold text-[#7D1E3B]">{s.value}</p>
                    <p className="text-xs text-[#8A7060] mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-[#8A7060] text-center py-4">Customer list table would be shown here with search and filter capabilities.</p>
            </div>
          )}

          {/* Settings */}
          {activeTab === "settings" && (
            <div className="space-y-5">
              <div className="bg-white border border-[#DDD5C8] rounded-sm p-5">
                <h3 className="font-display text-base font-bold text-[#1A1008] mb-4">Store Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Store Name", value: "Nithi Collection" },
                    { label: "GST Number", value: "33AABCN1234A1Z5" },
                    { label: "Contact Email", value: "hello@nithicollection.in" },
                    { label: "WhatsApp Number", value: "+91 98765 43210" },
                    { label: "Support Phone", value: "+91 98765 43210" },
                    { label: "Business Address", value: "Tamil Nadu, India" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs font-semibold text-[#5A3A28] uppercase tracking-wide mb-1.5">{field.label}</label>
                      <input
                        type="text"
                        defaultValue={field.value}
                        className="w-full border border-[#DDD5C8] rounded px-3 py-2.5 text-sm focus:outline-none focus:border-[#7D1E3B]"
                      />
                    </div>
                  ))}
                </div>
                <button className="mt-4 bg-[#7D1E3B] text-white px-5 py-2.5 text-sm font-semibold hover:bg-[#6a1832] transition-colors rounded-sm">
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
