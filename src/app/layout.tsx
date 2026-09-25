import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nithi Collection | Everyday Elegance in Nighties & Ethnic Wear",
  description:
    "Explore the finest collection of pure cotton nighties, feeding nighties, bridal sets, and ethnic wear crafted with premium breathable fabrics for all-day comfort.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#FAF8F1] text-[#171A18] font-body">
        {children}
      </body>
    </html>
  );
}
