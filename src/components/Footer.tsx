import { useState } from "react";
import { Link } from "react-router";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setNewsletterEmail("");
    }
  };

  return (
    <footer className="bg-[#0B3D2E] text-[#FAF8F1] border-t-2 border-[#C9A227]/40 relative overflow-hidden font-body">
      {/* Decorative Subtle Gold Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#C9A227_1px,transparent_1px)] [background-size:24px_24px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Brand & Story Column */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" size="lg" showTagline={true} />
            <p className="text-xs text-[#FAF8F1]/80 leading-relaxed max-w-sm pt-2">
              Nithi Collection is an ode to authentic Indian textile heritage and contemporary couture.
              Handcrafted sarees, exquisite ethnic wear, and luxury daily ensembles woven with pure craftsmanship.
            </p>

            {/* Newsletter Subscription */}
            <div className="pt-3">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C9A227] block mb-2">
                Join Our Private Circle
              </span>
              <p className="text-[11px] text-[#FAF8F1]/70 mb-3">
                Receive curated collection previews, festival offers, and bespoke style guides.
              </p>
              {subscribed ? (
                <div className="p-3 bg-[#064E3B] border border-[#C9A227] text-xs text-[#C9A227] rounded-sm flex items-center gap-2">
                  <span>✓</span> Welcome to Nithi Collection. Your private offer code is dispatched.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address..."
                    className="flex-1 px-3.5 py-2.5 bg-[#064E3B] border border-[#C9A227]/40 text-xs text-[#FAF8F1] placeholder-[#FAF8F1]/40 rounded-l-sm focus:outline-none focus:border-[#C9A227]"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#C9A227] text-[#0B3D2E] hover:bg-[#E2C467] text-xs font-bold uppercase tracking-wider rounded-r-sm transition-colors shrink-0"
                  >
                    Subscribe
                  </button>
                </form>
              )}
            </div>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-3">
              <span className="text-[11px] text-[#C9A227] font-semibold uppercase tracking-wider">Follow Us:</span>
              <div className="flex gap-2.5">
                {[
                  {
                    name: "Instagram",
                    href: "https://instagram.com",
                    icon: (
                      <svg className="w-4 h-4 text-[#C9A227]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Facebook",
                    href: "https://facebook.com",
                    icon: (
                      <svg className="w-4 h-4 text-[#C9A227]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    ),
                  },
                  {
                    name: "Pinterest",
                    href: "https://pinterest.com",
                    icon: (
                      <svg className="w-4 h-4 text-[#C9A227]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.627 0-12 5.372-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.373-.053.224-.174.271-.4.165-1.49-.693-2.42-2.872-2.42-4.623 0-3.766 2.738-7.224 7.892-7.224 4.144 0 7.365 2.953 7.365 6.899 0 4.117-2.595 7.431-6.199 7.431-1.211 0-2.348-.63-2.738-1.374l-.744 2.834c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.535.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
                      </svg>
                    ),
                  },
                  {
                    name: "WhatsApp",
                    href: "https://wa.me/919876543210",
                    icon: (
                      <svg className="w-4 h-4 text-[#C9A227]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                      </svg>
                    ),
                  },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="w-8 h-8 rounded-full border border-[#C9A227]/40 hover:border-[#C9A227] hover:bg-[#C9A227]/20 flex items-center justify-center transition-colors"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-[#FAF8F1] uppercase tracking-[0.16em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF8F1]/80">
              {[
                { label: "Home", to: "/" },
                { label: "All Collections", to: "/shop" },
                { label: "Sarees & Silks", to: "/shop?category=sarees" },
                { label: "Ethnic Wear", to: "/shop?category=ethnic-wear" },
                { label: "New Arrivals", to: "/shop?filter=new" },
                { label: "Best Sellers", to: "/shop?filter=bestseller" },
                { label: "Special Offers", to: "/shop?filter=sale" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-[#C9A227] hover:translate-x-1 inline-block transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support & Policies */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-[#FAF8F1] uppercase tracking-[0.16em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
              Support & Policies
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF8F1]/80">
              {[
                { label: "Shipping & Delivery", to: "/#shipping" },
                { label: "Returns & Exchanges", to: "/#returns" },
                { label: "Cash on Delivery Info", to: "/#cod-info" },
                { label: "Order Tracking", to: "/account" },
                { label: "Privacy Policy", to: "/#privacy" },
                { label: "Terms & Conditions", to: "/#terms" },
                { label: "Admin Panel & Product Manager", to: "/admin/products" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-[#C9A227] hover:translate-x-1 inline-block transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-semibold text-[#FAF8F1] uppercase tracking-[0.16em] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
              Boutique Atelier
            </h4>
            <div className="space-y-2.5 text-xs text-[#FAF8F1]/80">
              <div>
                <span className="text-[#C9A227] font-semibold block uppercase text-[10px] tracking-wider">
                  Store Location:
                </span>
                <p>Nithi Collection Flagship Boutique</p>
                <p>Heritage Handloom Enclave, Madurai - 625001, Tamil Nadu, India</p>
              </div>
              <div>
                <span className="text-[#C9A227] font-semibold block uppercase text-[10px] tracking-wider">
                  Client Concierge:
                </span>
                <p>+91 98765 43210 / +91 98401 23456</p>
                <p className="text-[11px] text-[#FAF8F1]/60">Mon - Sat: 9:30 AM to 8:30 PM IST</p>
              </div>
              <div>
                <span className="text-[#C9A227] font-semibold block uppercase text-[10px] tracking-wider">
                  Direct Inquiries:
                </span>
                <p className="text-[#FAF8F1]">care@nithicollection.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Payment Badges Bar */}
        <div className="mt-14 pt-8 border-t border-[#C9A227]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F1]/70">
          <p>
            &copy; {new Date().getFullYear()} Nithi Collection. All Rights Reserved. Handcrafted with traditional elegance.
          </p>
          <div className="flex items-center gap-4 text-stone-300">
            <span className="text-[10px] uppercase tracking-wider text-[#C9A227]">100% Secure Checkout:</span>
            <span className="text-[11px]">UPI • Cards • NetBanking • Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
