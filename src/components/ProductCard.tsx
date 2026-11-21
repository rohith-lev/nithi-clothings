import { useState, useMemo } from "react";
import { Link } from "react-router";
import { useCart } from "../store/cart";
import type { Product } from "../types/store";
import QuickViewModal from "./QuickViewModal";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { state, dispatch } = useCart();
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [wishlistAnimate, setWishlistAnimate] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  const isWishlisted = state.wishlist.includes(product.id);

  const FALLBACK_PRODUCT_IMG = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&fit=crop";

  // Filter and sanitize gallery images to eliminate blank/broken images
  const cleanImages = useMemo(() => {
    const rawList = [
      product.coverImage,
      ...(product.images || []),
    ];
    const valid = rawList
      .filter((img): img is string => typeof img === "string" && img.trim().length > 0)
      .filter((img) => !img.startsWith("blob:") && !img.includes("__LOCAL_") && img !== "null" && img !== "undefined" && img !== "[object Object]");
    const unique = Array.from(new Set(valid));
    return unique.length > 0 ? unique : [FALLBACK_PRODUCT_IMG];
  }, [product]);

  // Primary and secondary images
  const primaryImage = cleanImages[0] || FALLBACK_PRODUCT_IMG;
  const secondaryImage = cleanImages.length > 1 ? cleanImages[1] : null;

  // Active Size Option
  const activeSizeOpt = product.sizeOptions && product.sizeOptions.length > 0 ? product.sizeOptions[0] : undefined;

  const rawSizePrice = activeSizeOpt ? Number(activeSizeOpt.price) : Number(product.price || 0);
  const effectiveFinalPrice = rawSizePrice;
  const basePrice = Math.max(activeSizeOpt?.mrp || product.mrp || rawSizePrice, effectiveFinalPrice);
  const dynamicDiscount = basePrice > effectiveFinalPrice ? Math.round(((basePrice - effectiveFinalPrice) / basePrice) * 100) : 0;
  const sizeStock = activeSizeOpt ? Number(activeSizeOpt.stock) : Number(product.stock || 0);
  const isOutOfStock = (product && product.status === "OUT OF STOCK") || (sizeStock <= 0 && (product.stock || 0) <= 0);

  // Check if product is special ₹350 offer where Add to Cart should be omitted in favor of View Details
  const is350Offer =
    effectiveFinalPrice === 350 ||
    product.price === 350 ||
    (product.name && product.name.includes("350"));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const finalSize =
      (product.sizes && product.sizes[0]) ||
      (product.sizeOptions && product.sizeOptions[0]?.size) ||
      "Free Size";
    const finalColor =
      (product.colors && product.colors[0]) || product.color || "Standard";

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product: {
          ...product,
          price: effectiveFinalPrice,
          mrp: basePrice,
        },
        quantity: 1,
        selectedColor: finalColor,
        selectedSize: finalSize,
        unitPrice: effectiveFinalPrice,
        mrp: basePrice,
        colorImage: primaryImage,
        stock: sizeStock > 0 ? sizeStock : (product.stock || 50),
      },
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlistAnimate(true);
    setTimeout(() => setWishlistAnimate(false), 500);
    dispatch({ type: "TOGGLE_WISHLIST", payload: product.id });
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewOpen(true);
  };

  return (
    <>
      <div
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E8E2D5] bg-[#FFFFFF] font-body transition-all duration-300 hover:border-[#C9A227] hover:shadow-[0_0_22px_rgba(201,162,39,0.28)] focus-within:border-[#C9A227] focus-within:shadow-[0_0_22px_rgba(201,162,39,0.28)] shadow-xs"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Added Toast Pill */}
        {addedToast && (
          <div className="animate-fade-in absolute inset-x-3 top-3 z-30 rounded-xl bg-[#064E3B] px-3 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-[#FAF8F1] shadow-lg border border-[#C9A227]">
            ✓ Added to Bag
          </div>
        )}

        {/* Larger Image Container Filling Frame Cleanly */}
        <div className="relative block aspect-[3/4] sm:aspect-[3/4] overflow-hidden rounded-t-2xl bg-[#FAF8F5] select-none">
          {/* Direct Product Link for entire image area */}
          <Link
            to={`/product/${product.id}`}
            className="absolute inset-0 z-0 block cursor-pointer"
            aria-label={product.name}
          >
            {/* Primary Image */}
            <img
              src={primaryImage}
              alt={`${product.name} - Pure Cotton Nighty Nithi Collections`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_PRODUCT_IMG;
              }}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 ease-out ${
                secondaryImage && isHovered ? "opacity-0" : "opacity-100"
              }`}
              loading="lazy"
            />

            {/* Secondary Image on Hover (desktop only) */}
            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.name} Fabric Detail - Nithi Collections`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
                className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-300 ease-out ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
              />
            )}
          </Link>

          {/* Offer Badge Only (Showing just the number followed by %) */}
          {dynamicDiscount > 0 && (
            <div className="pointer-events-none absolute left-2 top-2 sm:left-2.5 sm:top-2.5 z-10">
              <span className="rounded-full border border-[#C9A227]/40 bg-[#064E3B] px-2 py-0.5 sm:px-2.5 text-[9px] sm:text-[10px] font-bold text-[#FAF8F1] shadow-2xs font-sans tracking-tight">
                {dynamicDiscount}%
              </span>
            </div>
          )}

          {/* Plain Heart-Shaped Like Button (no circular wrapper) */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`absolute right-2.5 top-2.5 sm:right-3.5 sm:top-3.5 z-10 transition-transform duration-200 hover:scale-125 cursor-pointer ${
              wishlistAnimate ? "animate-heart-pop" : ""
            } ${
              isWishlisted
                ? "text-rose-600 drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]"
                : "text-white/95 hover:text-rose-500 drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]"
            }`}
            aria-label="Wishlist"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-200"
              fill={isWishlisted ? "currentColor" : "rgba(0,0,0,0.2)"}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Quick View Button on Hover */}
          <div className="absolute inset-x-3 bottom-3 z-10 hidden opacity-0 transition-all duration-300 group-hover:opacity-100 sm:block">
            <button
              type="button"
              onClick={handleOpenQuickView}
              className="w-full rounded-xl border border-[#E8E2D5] bg-[#FFFFFF]/95 py-2 text-[11px] font-bold uppercase tracking-wider text-[#171A18] shadow-md transition-all hover:bg-[#064E3B] hover:text-[#FAF8F1] hover:border-[#064E3B] cursor-pointer"
            >
              Quick View
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <Link
              to={`/product/${product.id}`}
              className="absolute inset-0 z-[5] flex items-center justify-center bg-white/80 backdrop-blur-[1px] cursor-pointer"
            >
              <span className="rounded-full bg-slate-900 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-md">
                Out of Stock
              </span>
            </Link>
          )}
        </div>

        {/* Product Details & Bottom Bar (Reduced clean sans-serif text) */}
        <div className="flex flex-col justify-between flex-1 bg-[#FFFFFF] p-2.5 sm:p-3 rounded-b-2xl font-sans">
          <div className="mb-1.5">
            <Link to={`/product/${product.id}`} className="block group/title cursor-pointer">
              <h3 className="font-sans line-clamp-1 text-xs sm:text-[13px] font-medium leading-tight text-slate-800 transition-colors group-hover/title:text-[#064E3B] tracking-tight">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Bottom Row: Price on the LEFT, Add to Cart on the RIGHT */}
          <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-slate-100 mt-auto">
            {/* Price on Left */}
            <Link to={`/product/${product.id}`} className="flex flex-col cursor-pointer min-w-0">
              <div className="flex items-baseline gap-1">
                <span className="font-sans text-xs sm:text-sm font-bold text-[#064E3B] tracking-tight">
                  ₹{effectiveFinalPrice.toLocaleString("en-IN")}
                </span>
                {basePrice > effectiveFinalPrice && (
                  <span className="text-[10px] font-normal text-slate-400 line-through">
                    ₹{basePrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-[8px] font-medium text-amber-700">
                  Only {product.stock} left
                </span>
              )}
            </Link>

            {/* Add to Cart Button on Right (View Details for ₹350 offer) */}
            <div className="shrink-0">
              {is350Offer ? (
                <Link
                  to={`/product/${product.id}`}
                  className="py-1 px-2.5 rounded-lg border border-[#064E3B] text-[#064E3B] hover:bg-emerald-50 text-[10px] sm:text-[11px] font-medium transition-colors inline-flex items-center justify-center cursor-pointer"
                >
                  View Details
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="py-1 px-2.5 sm:px-3 rounded-lg bg-[#064E3B] hover:bg-[#0B3D2E] text-white text-[10px] sm:text-[11px] font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-2xs hover:shadow-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <span>🛒</span>
                  <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
      />
    </>
  );
}
