import React from "react";
import { Link, useLocation } from "react-router";
import SEO from "../components/SEO";

interface PolicyContent {
  title: string;
  subtitle: string;
  sections: { heading: string; body: string[] }[];
}

const POLICIES: Record<string, PolicyContent> = {
  "return-policy": {
    title: "Refund and Return Policy",
    subtitle: "Hassle-Free 7-Day Exchange & Returns at Nithi Collections",
    sections: [
      {
        heading: "1. 7-Day Easy Exchange & Return Window",
        body: [
          "At Nithi Collections, your satisfaction is our foremost priority. If you receive a product that does not fit properly or has any manufacturing defect, you may request an exchange or return within 7 days of delivery.",
          "Items must be unused, unwashed, in their original condition with all tags intact and original packaging.",
        ],
      },
      {
        heading: "2. Eligible Products for Return",
        body: [
          "All regular nighties, sarees, unstitched salwar materials, and tops are eligible for size exchange or return.",
          "Customized products, altered clothing items, and clearance sale items marked as Non-Returnable are not eligible for refunds unless received damaged.",
        ],
      },
      {
        heading: "3. Refund Processing",
        body: [
          "Once your returned parcel is received at our Athani atelier and inspected (usually within 24–48 hours of receipt), your refund will be initiated.",
          "For Prepaid orders (UPI, Cards, NetBanking), refunds are credited back to the original source within 3–5 business days.",
          "For Cash on Delivery (COD) orders, our customer concierge will request your Bank Account or UPI ID to initiate an instant refund transfer.",
        ],
      },
      {
        heading: "4. Damaged or Defective Deliveries",
        body: [
          "In the unlikely event that your order arrives damaged or defective, please contact our support team on WhatsApp at +91 8122436850 or +91 9345136762 with photos within 48 hours. A replacement or full refund will be dispatched immediately at zero shipping cost.",
        ],
      },
    ],
  },
  "shipping-policy": {
    title: "Shipping & Delivery Information",
    subtitle: "Safe, Fast Pan-India Express Delivery Directly From Our Atelier",
    sections: [
      {
        heading: "1. Dispatch Timelines",
        body: [
          "All orders placed before 3:00 PM IST Monday through Saturday are dispatched from our Athani boutique within 24 to 48 hours.",
          "You will receive an automated confirmation and WhatsApp tracking alert once your parcel is packed and handed to our logistics partner.",
        ],
      },
      {
        heading: "2. Estimated Delivery Duration",
        body: [
          "Tamil Nadu & South India: 2 to 3 business days.",
          "Rest of India (Metro & Urban Hubs): 3 to 5 business days.",
          "Regional & North-East / J&K: 5 to 7 business days.",
        ],
      },
      {
        heading: "3. Shipping Charges & Free Delivery",
        body: [
          "Prepaid orders above ₹999 qualify for Complimentary Express Shipping pan-India.",
          "Standard delivery charge of ₹50–₹70 applies to smaller orders based on courier distance.",
          "Cash on Delivery (COD) is available with nominal advance payment to safeguard against transit refusal.",
        ],
      },
      {
        heading: "4. Courier Partners & Consignment Tracking",
        body: [
          "We partner with India's top courier logistics including DTDC, Professional Couriers, ST Courier, and Delhivery.",
          "Once your parcel is dispatched, use the Track Order tab on our website or click the courier tracking link sent to your mobile.",
        ],
      },
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    subtitle: "Protecting Your Personal Information & Privacy",
    sections: [
      {
        heading: "1. Information We Collect",
        body: [
          "We collect only essential details necessary to process and deliver your orders: your name, shipping address, email, telephone number, and payment preference.",
          "We never store credit card, debit card numbers, CVVs, or NetBanking credentials on our servers. All transactions are securely handled by RBI-regulated payment gateways (Razorpay).",
        ],
      },
      {
        heading: "2. How We Use Your Data",
        body: [
          "To process and deliver your boutique orders.",
          "To send order confirmations and WhatsApp dispatch alerts.",
          "To answer your customer care inquiries and handle returns/exchanges.",
        ],
      },
      {
        heading: "3. Data Security & Protection",
        body: [
          "We use modern 256-bit SSL encryption across our entire storefront. Customer records are strictly isolated, and we do not sell or share your personal details with third-party advertising brokers.",
        ],
      },
    ],
  },
  "terms-and-conditions": {
    title: "Terms and Conditions",
    subtitle: "Store Policies & Customer Agreement",
    sections: [
      {
        heading: "1. Overview & Agreement",
        body: [
          "This website is operated by Nithi Collections. Throughout the site, the terms 'we', 'us', and 'our' refer to Nithi Collections, located at 385/2, Near South Indian Bank, SAB Main Road, Athani, Anthiyur – 638502, Tamil Nadu, India.",
          "By visiting our website or purchasing a product from us, you engage in our service and agree to be bound by our terms and policies.",
        ],
      },
      {
        heading: "2. Pricing & Availability",
        body: [
          "All product prices are quoted in Indian Rupees (INR) inclusive of applicable taxes.",
          "We strive for complete accuracy in pricing, photographs, and inventory. In the event an item is erroneously priced or sold out, we will notify you before order dispatch.",
        ],
      },
      {
        heading: "3. Fabric Care & Handcrafted Nature",
        body: [
          "Our products are handcrafted using authentic cottons, silks, and traditional textiles. Natural variations in weave and print are signatures of handcrafted heritage and not considered defects.",
        ],
      },
      {
        heading: "4. Governing Jurisdiction",
        body: [
          "These Terms and any agreements shall be governed by and construed in accordance with the laws of Tamil Nadu, India, under the jurisdiction of courts in Erode / Anthiyur.",
        ],
      },
    ],
  },
};

export default function PolicyPage() {
  const location = useLocation();
  const slug = location.pathname.replace(/^\//, "").toLowerCase();
  const policyKey = POLICIES[slug] ? slug : "return-policy";
  const policy = POLICIES[policyKey];

  return (
    <div className="font-body min-h-screen bg-[#FAF8F1] py-12 lg:py-16">
      <SEO
        title={`${policy.title} - Nithi Collections`}
        description={policy.subtitle}
        canonical={`/${policyKey}`}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumbs */}
        <nav className="text-xs text-[#5C635E] mb-6 flex items-center gap-2">
          <Link to="/" className="hover:text-[#064E3B]">Home</Link>
          <span>/</span>
          <span className="text-[#064E3B] font-semibold">{policy.title}</span>
        </nav>

        {/* Policy Header */}
        <div className="bg-[#FFFFFF] rounded-3xl p-8 sm:p-10 border border-[#E8E2D5] shadow-xs mb-8">
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-[#C9A227] block mb-2">
            Nithi Collections Policy
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#064E3B] mb-3">
            {policy.title}
          </h1>
          <p className="text-sm text-[#5C635E] leading-relaxed">
            {policy.subtitle}
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {policy.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-[#FFFFFF] rounded-2xl p-6 sm:p-8 border border-[#E8E2D5] shadow-2xs space-y-3"
            >
              <h2 className="font-display text-lg sm:text-xl font-bold text-[#064E3B]">
                {section.heading}
              </h2>
              <div className="space-y-2.5 text-xs sm:text-sm text-[#5C635E] leading-relaxed">
                {section.body.map((p, pIdx) => (
                  <p key={pIdx}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Concierge Assistance Box */}
        <div className="mt-10 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-[#064E3B]">Have additional questions?</h3>
            <p className="text-xs text-emerald-800 mt-0.5">
              Our boutique support team is available Mon–Sat: 9:30 AM to 8:30 PM IST.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="tel:8122436850"
              className="px-4 py-2 bg-white border border-emerald-300 rounded-xl text-xs font-bold text-[#064E3B] hover:bg-emerald-100 transition shadow-2xs"
            >
              📞 8122436850
            </a>
            <a
              href="https://wa.me/918122436850"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#064E3B] rounded-xl text-xs font-bold text-white hover:bg-[#0B3D2E] transition shadow-xs"
            >
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
