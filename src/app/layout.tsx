import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://nithiclothings.com";

export const viewport: Viewport = {
  themeColor: "#064E3B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nithi Clothings | Pure Cotton Nighties, Feeding Nighties & Ethnic Loungewear",
    template: "%s | Nithi Clothings",
  },
  description:
    "Buy premium 100% pure cotton nighties, zip feeding nighties, maternity wear, collar & frock models online at Nithi Clothings. Breathable all-day comfort with fast all-India delivery.",
  keywords: [
    "pure cotton nighties",
    "cotton nighties online india",
    "feeding nighty with zip",
    "maternity feeding nighty",
    "cotton night dress for women",
    "titanic model nighty",
    "collar model nighty",
    "bridal nighty sets",
    "south indian cotton nighties",
    "breathable loungewear women",
    "feeding kurtis cotton",
    "Nithi Clothings",
    "nithi collection",
  ],
  authors: [{ name: "Nithi Clothings", url: siteUrl }],
  creator: "Nithi Clothings",
  publisher: "Nithi Clothings",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Nithi Clothings | Pure Cotton Nighties & Feeding Wear",
    description:
      "Explore handcrafted pure cotton nighties, maternity zip nighties, and elegant loungewear designed for supreme softness and breathability.",
    url: siteUrl,
    siteName: "Nithi Clothings",
    images: [
      {
        url: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=1200&h=630&fit=crop&q=85",
        width: 1200,
        height: 630,
        alt: "Nithi Clothings Pure Cotton Nighties Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nithi Clothings | Pure Cotton Nighties & Ethnic Wear",
    description:
      "Handcrafted 100% pure cotton nighties, feeding friendly designs, and loungewear. Fast shipping across India.",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=1200&h=630&fit=crop&q=85"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
  verification: {
    google: "google-site-verification-token", // User can replace with their Search Console token
  },
  category: "ecommerce",
};

// Global Schema.org JSON-LD definitions
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ClothingStore",
      "@id": `${siteUrl}/#store`,
      name: "Nithi Clothings",
      url: siteUrl,
      logo: `${siteUrl}/favicon.ico`,
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=1200&h=630&fit=crop&q=85",
      description: "Premium pure cotton nighties, feeding zip nighties, and ethnic loungewear handcrafted for women.",
      priceRange: "₹₹",
      currenciesAccepted: "INR",
      paymentAccepted: "Cash, Credit Card, UPI, Net Banking, COD",
      address: {
        "@type": "PostalAddress",
        addressCountry: "IN",
        addressRegion: "Tamil Nadu",
      },
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 7,
        returnMethod: "https://schema.org/ReturnByMail",
        returnFees: "https://schema.org/FreeReturn",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Nithi Clothings",
      description: "Online store for Pure Cotton Nighties, Feeding Nighties, and Loungewear",
      publisher: {
        "@id": `${siteUrl}/#store`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${siteUrl}/shop?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What fabric is used in Nithi Clothings nighties?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "All our nighties are crafted from 100% premium combed and pure cotton fabrics that are soft, breathable, and pre-shrunk for maximum everyday comfort.",
          },
        },
        {
          "@type": "Question",
          name: "Do you have feeding / maternity friendly nighties?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we specialize in concealed two-side zip feeding nighties and frock models designed specifically for nursing mothers.",
          },
        },
        {
          "@type": "Question",
          name: "Do you provide Cash on Delivery (COD) and fast shipping?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes, we offer Cash on Delivery (COD) across India with express 2-4 business day delivery.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="antialiased min-h-screen bg-[#FAF8F1] text-[#171A18] font-body" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
