import { Link, useLocation } from "react-router";
import { useCart } from "../store/cart";
import { useCustomerAuth } from "../services/customerAuth";

export default function BottomNav() {
  const location = useLocation();
  const { cartCount, state } = useCart();
  const { customer, isLoggedIn } = useCustomerAuth();

  // Hide on admin routes
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const navItems = [
    {
      label: "Home",
      to: "/",
      isActive: location.pathname === "/",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={location.pathname === "/" ? 2.2 : 1.7}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      label: "Shop",
      to: "/shop",
      isActive: location.pathname === "/shop",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={location.pathname === "/shop" ? 2.2 : 1.7}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      label: "Wishlist",
      to: "/wishlist",
      isActive: location.pathname === "/wishlist",
      badge: state.wishlist.length > 0 ? state.wishlist.length : null,
      icon: (
        <svg className="w-5 h-5" fill={location.pathname === "/wishlist" ? "#E11D48" : "none"} viewBox="0 0 24 24" stroke={location.pathname === "/wishlist" ? "#E11D48" : "currentColor"}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
    {
      label: "Bag",
      to: "/cart",
      isActive: location.pathname === "/cart",
      badge: cartCount > 0 ? cartCount : null,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={location.pathname === "/cart" ? 2.2 : 1.7}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
    },
    {
      label: isLoggedIn ? (customer?.name?.split(" ")[0] || "Account") : "Account",
      to: "/account",
      isActive: ["/account", "/signin", "/track"].includes(location.pathname),
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={["/account", "/signin", "/track"].includes(location.pathname) ? 2.2 : 1.7}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FAF8F1]/95 backdrop-blur-md border-t border-[#E8E2D5] shadow-lg px-2 py-1.5 pb-safe">
      <nav className="flex items-center justify-around">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 mobile-touch-zoom active:scale-115 ${
              item.isActive
                ? "text-[#064E3B] font-bold scale-105"
                : "text-[#5C635E] hover:text-[#C9A227] font-medium"
            }`}
          >
            <div className="relative transition-transform duration-200 active:scale-125">
              {item.icon}
              {item.badge !== null && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#064E3B] text-[#FAF8F1] border border-[#C9A227] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 max-w-[56px] truncate">
              {item.label}
            </span>
            {item.isActive && (
              <span className="absolute bottom-0 w-4 h-0.5 bg-[#C9A227] rounded-full" />
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
