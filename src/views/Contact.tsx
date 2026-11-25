import React, { useState } from "react";
import SEO from "../components/SEO";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Nithi Collections",
    description: "Contact Nithi Collections for order inquiries, wholesale assistance, and customer support.",
    url: typeof window !== "undefined" ? window.location.href : "https://nithicollections.com/contact",
  };

  return (
    <div className="font-body min-h-screen bg-[#FAF8F1]">
      <SEO
        title="Contact Us - Customer Support & Boutique Concierge"
        description="Get in touch with Nithi Collections for order assistance, size inquiries, and pure cotton nighties inquiries. Fast customer support on WhatsApp and email."
        canonical="/contact"
        structuredData={contactSchema}
      />
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl sm:text-5xl font-normal text-[#064E3B] mb-6 tracking-[-0.02em]">Contact Us</h1>
          <p className="font-sans text-base sm:text-lg text-[#5C635E] max-w-2xl mx-auto leading-relaxed font-normal">
            We are here to assist you. Whether you have a question about our collections, need styling advice, 
            or want to inquire about an order, our concierge is ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8 bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-xs">
            <div>
              <h3 className="font-display text-xl font-normal text-[#064E3B] mb-2 tracking-tight">Boutique & Atelier Address</h3>
              <p className="font-bold text-[#1A1008] text-sm">Nithi Collections</p>
              <p className="text-sm text-[#5C635E] leading-relaxed mt-1">
                385/2, Near South Indian Bank,<br />
                SAB Main Road, Athani,<br />
                Anthiyur – 638502,<br />
                Tamil Nadu, India.
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=385%2F2+Near+South+Indian+Bank+SAB+Main+Road+Athani+Anthiyur+638502+Tamil+Nadu+India"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 px-4 py-2 bg-[#FAF8F1] border border-[#C9A227]/40 rounded-xl text-xs font-bold text-[#064E3B] hover:bg-[#F3EFE3] transition"
              >
                <span>📍 Open in Google Maps</span>
                <span>↗</span>
              </a>
            </div>

            <div>
              <h3 className="font-display text-xl font-normal text-[#064E3B] mb-2 tracking-tight">Direct Contact</h3>
              <div className="text-sm text-[#5C635E] space-y-2">
                <p className="flex items-center gap-2">
                  <span className="font-semibold text-stone-700">Phone:</span>
                  <a href="tel:8122436850" className="font-bold text-[#064E3B] hover:underline">
                    8122436850
                  </a>
                  <span>/</span>
                  <a href="tel:9345136762" className="font-bold text-[#064E3B] hover:underline">
                    9345136762
                  </a>
                </p>
                <p>
                  <a
                    href="https://wa.me/918122436850"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition shadow-xs mt-1"
                  >
                    <span>💬 Chat on WhatsApp (+91 8122436850)</span>
                  </a>
                </p>
                <p className="text-xs text-[#5C635E] pt-1">Working Hours: Mon – Sat: 9:30 AM to 8:30 PM IST</p>
              </div>
            </div>

            <div>
              <h3 className="font-display text-xl font-bold text-[#064E3B] mb-2">Official Social Media</h3>
              <div className="flex flex-wrap gap-3 mt-3">
                {[
                  { name: "Instagram", href: "https://www.instagram.com/nithicollections" },
                  { name: "Facebook", href: "https://www.facebook.com/nithicollections" },
                  { name: "YouTube", href: "https://www.youtube.com/@nithicollections" },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-xl border border-[#C9A227]/40 bg-[#FAF8F1] text-xs font-bold text-[#064E3B] hover:bg-[#C9A227]/20 transition"
                  >
                    {s.name} ↗
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-sm border border-[#E8E2D5] shadow-sm">
            <h3 className="font-display text-2xl font-bold text-[#1A1008] mb-6">Send a Message</h3>
            {submitted ? (
              <div className="p-4 bg-[#064E3B] text-[#C9A227] text-sm rounded-sm font-medium">
                Thank you for your message. Our team will get back to you shortly.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1A1008] uppercase tracking-wider mb-2">Full Name</label>
                  <input type="text" required className="w-full px-4 py-3 border border-[#E8E2D5] rounded-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] text-sm" placeholder="Your Name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1008] uppercase tracking-wider mb-2">Email Address</label>
                  <input type="email" required className="w-full px-4 py-3 border border-[#E8E2D5] rounded-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] text-sm" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1A1008] uppercase tracking-wider mb-2">Message</label>
                  <textarea required rows={5} className="w-full px-4 py-3 border border-[#E8E2D5] rounded-sm focus:outline-none focus:border-[#C9A227] focus:ring-1 focus:ring-[#C9A227] text-sm resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#064E3B] text-white py-3.5 font-bold uppercase tracking-wider text-sm rounded-sm hover:bg-[#0B3D2E] transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
