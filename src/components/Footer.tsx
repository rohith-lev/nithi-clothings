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
                  { name: "Instagram", href: "https://instagram.com", icon: "📸" },
                  { name: "Facebook", href: "https://facebook.com", icon: "📘" },
                  { name: "Pinterest", href: "https://pinterest.com", icon: "📌" },
                  { name: "WhatsApp", href: "https://wa.me/919876543210", icon: "💬" },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.name}
                    className="w-8 h-8 rounded-full border border-[#C9A227]/40 hover:border-[#C9A227] hover:bg-[#C9A227]/20 flex items-center justify-center text-xs transition-colors"
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
                { label: "⚙️ Admin Panel & Product Manager", to: "/admin/products" },
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
