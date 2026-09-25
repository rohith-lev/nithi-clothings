import { createBrowserRouter } from "react-router";
import Root from "./layouts/Root";
import Home from "./views/Home";
import Shop from "./views/Shop";
import ProductDetail from "./views/ProductDetail";
import Cart from "./views/Cart";
import Checkout from "./views/Checkout";
import OrderSuccess from "./views/OrderSuccess";

import About from "./views/About";
import Contact from "./views/Contact";

// Admin Architecture
import AdminLogin from "./views/admin/AdminLogin";
import AdminLayout from "./views/admin/AdminLayout";
import AdminDashboardHome from "./views/admin/AdminDashboardHome";
import AdminProductsList from "./views/admin/AdminProductsList";
import AdminProductEdit from "./views/admin/AdminProductEdit";
import AdminOrders from "./views/admin/AdminOrders";
import AdminInventory from "./views/admin/AdminInventory";
import AdminCombos from "./views/admin/AdminCombos";
import AdminShippingCod from "./views/admin/AdminShippingCod";
import AdminAuditLogs from "./views/admin/AdminAuditLogs";
import AdminCategories from "./views/admin/AdminCategories";
import AdminCustomers from "./views/admin/AdminCustomers";
import AdminPayments from "./views/admin/AdminPayments";
import AdminReturns from "./views/admin/AdminReturns";
import AdminReports from "./views/admin/AdminReports";
import AdminSettings from "./views/admin/AdminSettings";
import AdminBookings from "./views/admin/AdminBookings";

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center font-body text-center px-4">
      <div>
        <p className="font-display text-5xl font-bold text-[#DDD5C8] mb-4">404</p>
        <p className="font-display text-2xl font-bold text-[#1A1008] mb-2">Page not found</p>
        <a href="/" className="text-sm text-[#064E3B] font-semibold underline">
          Go back home
        </a>
      </div>
    </div>
  );
}

import Account from "./views/Account";

import Wishlist from "./views/Wishlist";

export const router = createBrowserRouter([
  // Customer Storefront
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "shop", Component: Shop },
      { path: "product/:id", Component: ProductDetail },
      { path: "cart", Component: Cart },
      { path: "checkout", Component: Checkout },
      { path: "order-success", Component: OrderSuccess },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      { path: "account", Component: Account },
      { path: "signin", Component: Account },
      { path: "track", Component: Account },
      { path: "wishlist", Component: Wishlist },
      { path: "*", Component: NotFound },
    ],
  },

  // Dedicated Admin Login Route
  {
    path: "/admin/login",
    Component: AdminLogin,
  },

  // Dedicated Secure Admin Dashboard Management System
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { index: true, Component: AdminDashboardHome },
      { path: "products", Component: AdminProductsList },
      { path: "products/new", Component: AdminProductEdit },
      { path: "products/edit/:id", Component: AdminProductEdit },
      { path: "categories", Component: AdminCategories },
      { path: "inventory", Component: AdminInventory },
      { path: "orders", Component: AdminOrders },
      { path: "customers", Component: AdminCustomers },
      { path: "bookings", Component: AdminBookings },
      { path: "combos", Component: AdminCombos },
      { path: "shipping", Component: AdminShippingCod },
      { path: "cod", Component: AdminShippingCod },
      { path: "payments", Component: AdminPayments },
      { path: "returns", Component: AdminReturns },
      { path: "reports", Component: AdminReports },
      { path: "audit", Component: AdminAuditLogs },
      { path: "settings", Component: AdminSettings },
    ],
  },
]);
