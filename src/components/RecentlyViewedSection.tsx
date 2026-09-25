import { Link } from "react-router";
import type { Product } from "../types/store";
import ProductCard from "./ProductCard";

interface RecentlyViewedSectionProps {
  products: Product[];
}

export default function RecentlyViewedSection({ products }: RecentlyViewedSectionProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-12 border-t border-[#E8E2D5] bg-[#FAF8F1] font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-5 h-[1px] bg-[#C9A227]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
                Your Browsing History
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#064E3B] tracking-tight">
              Recently Viewed
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-bold uppercase tracking-wider text-[#064E3B] hover:text-[#C9A227] transition-colors"
          >
            Explore More →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
