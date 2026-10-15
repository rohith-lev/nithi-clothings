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
  const [selectedSize] = useState(
    (product.sizes && product.sizes[0]) ||
      (product.sizeOptions && product.sizeOptions[0]?.size) ||
      "Free Size"
  );
  const [addedToast, setAddedToast] = useState(false);
  const [wishlistAnimate, setWishlistAnimate] = useState(false);

  const isWishlisted = state.wishlist.includes(product.id);

  const FALLBACK_PRODUCT_IMG = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=600&fit=crop";

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
  const activeSizeOpt = product.sizeOptions?.find(
    (s) => s.size && s.size.toLowerCase() === selectedSize.toLowerCase()
  );

  const rawSizePrice = activeSizeOpt ? Number(activeSizeOpt.price) : Number(product.price || 0);
  const effectiveFinalPrice = rawSizePrice;
  const basePrice = Math.max(activeSizeOpt?.mrp || product.mrp || rawSizePrice, effectiveFinalPrice);
  const dynamicDiscount = basePrice > effectiveFinalPrice ? Math.round(((basePrice - effectiveFinalPrice) / basePrice) * 100) : 0;
  const sizeStock = activeSizeOpt ? Number(activeSizeOpt.stock) : Number(product.stock || 0);
  const isOutOfStock = (product && product.status === "OUT OF STOCK") || (sizeStock <= 0 && (product.stock || 0) <= 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const finalSize = selectedSize || (product.sizes && product.sizes[0]) || (product.sizeOptions && product.sizeOptions[0]?.size) || "Free Size";
    const finalColor = (product.colors && product.colors[0]) || product.color || "Standard";

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
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E8E2D5] bg-[#FFFFFF] font-body transition-all duration-300 hover:border-[#C9A227]/70 hover:shadow-xl shadow-xs"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Added Toast Pill */}
        {addedToast && (
          <div className="animate-fade-in absolute inset-x-3 top-3 z-30 rounded-xl bg-[#064E3B] px-3 py-2 text-center text-[11px] font-bold uppercase tracking-wider text-[#FAF8F1] shadow-lg border border-[#C9A227]">
            ✓ Added {product.name} ({selectedSize}) to Bag
          </div>
        )}

        {/* Image Container */}
        <div className="relative block aspect-[4/5] sm:aspect-[4/5] overflow-hidden rounded-t-2xl bg-[#F3EFE3] select-none">
          {/* Direct Product Link for entire image area */}
          <Link
            to={`/product/${product.id}`}
            className="absolute inset-0 z-0 block cursor-pointer"
            aria-label={product.name}
          >
            {/* Primary Image */}
            <img
              src={primaryImage}
              alt={`${product.name} - Pure Cotton Nighty Nithi Clothings`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = FALLBACK_PRODUCT_IMG;
              }}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out ${
                secondaryImage && isHovered
                  ? "opacity-0 scale-105"
                  : "opacity-100 group-hover:scale-105"
              }`}
              loading="lazy"
            />

            {/* Secondary Image on Hover (desktop only) */}
            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.name} Fabric Detail - Nithi Clothings`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
                className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out ${
                  isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
                }`}
                loading="lazy"
              />
            )}
          </Link>

          {/* Configurable Badges */}
          <div className="pointer-events-none absolute left-2 top-2 sm:left-3 sm:top-3 z-10 flex flex-col gap-1 sm:gap-1.5 items-start">
            {(product.newArrival || product.isNew) && (
              <span className="rounded-full border border-[#C9A227]/40 bg-[#064E3B] px-2 py-0.5 sm:px-3 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#FAF8F1] shadow-sm">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="rounded-full bg-[#C9A227] px-2 py-0.5 sm:px-3 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.16em] text-[#171A18] shadow-sm">
                BESTSELLER
              </span>
            )}
            {dynamicDiscount >= 25 && !product.isBestSeller && (
              <span className="rounded-full bg-[#B89222] px-2 py-0.5 sm:px-3 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-[#FAF8F1] shadow-sm">
                LIMITED
              </span>
            )}
            {dynamicDiscount > 0 && (
              <span className="rounded-full border border-[#E8E2D5] bg-[#FFFFFF]/95 px-2 py-0.5 sm:px-2.5 text-[8px] sm:text-[9px] font-bold text-[#064E3B] shadow-2xs">
                {dynamicDiscount}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button with Micro-interaction animation */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`absolute right-2 top-2 sm:right-3 sm:top-3 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#FFFFFF]/90 shadow-sm backdrop-blur-xs transition-all duration-200 hover:scale-110 cursor-pointer ${
              wishlistAnimate ? "animate-heart-pop" : ""
            } ${
              isWishlisted
                ? "text-rose-600 bg-[#FFFFFF]"
                : "text-[#171A18] hover:text-rose-600"
            }`}
            aria-label="Wishlist"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg
              className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-200"
              fill={isWishlisted ? "currentColor" : "none"}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.7}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>

          {/* Quick View Button on Hover */}
          <div className="absolute inset-x-3 bottom-14 z-10 hidden opacity-0 transition-all duration-300 group-hover:opacity-100 sm:block">
            <button
              type="button"
              onClick={handleOpenQuickView}
              className="w-full rounded-xl border border-[#E8E2D5] bg-[#FFFFFF]/95 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#171A18] shadow-md transition-all hover:bg-[#064E3B] hover:text-[#FAF8F1] hover:border-[#064E3B] cursor-pointer"
            >
              Quick View
            </button>
          </div>

          {/* Add to Cart slide-up action */}
          <div className="absolute inset-x-0 bottom-0 z-10 translate-y-full transition-transform duration-300 group-hover:translate-y-0">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex w-full items-center justify-center gap-2 bg-[#064E3B] py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F1] transition-colors hover:bg-[#0B3D2E] disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <Link
              to={`/product/${product.id}`}
              className="absolute inset-0 z-[5] flex items-center justify-center bg-[#FAF8F1]/75 backdrop-blur-[1px] cursor-pointer"
            >
              <span className="rounded-full bg-[#171A18] px-3 py-1 sm:px-4 sm:py-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] text-[#FAF8F1] shadow-md">
                Out of Stock
              </span>
            </Link>
          )}
        </div>

        {/* Product Details - Compact on mobile to maximize photo display */}
        <div className="flex flex-1 flex-col justify-between space-y-1.5 sm:space-y-2 bg-[#FFFFFF] p-2.5 sm:p-4 rounded-b-2xl">
          <div>
            <Link to={`/product/${product.id}`} className="block group/title cursor-pointer">
              <h3 className="font-display line-clamp-1 sm:line-clamp-2 text-xs sm:text-sm md:text-base font-semibold leading-snug text-[#171A18] transition-colors group-hover/title:text-[#064E3B]">
                {product.name}
              </h3>
            </Link>
          </div>

          {/* Pricing & Stock indicators */}
          <div className="border-t border-[#E8E2D5]/60 pt-2 flex items-center justify-between gap-1.5">
            <Link to={`/product/${product.id}`} className="flex flex-col flex-1 cursor-pointer">
              <div className="flex items-baseline gap-1.5 sm:gap-2">
                <span className="font-display text-sm sm:text-base md:text-lg font-bold text-[#064E3B]">
                  ₹{effectiveFinalPrice.toLocaleString("en-IN")}
                </span>
                {basePrice > effectiveFinalPrice && (
                  <span className="text-[10px] sm:text-xs font-normal text-[#5C635E] line-through">
                    ₹{basePrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-[8px] sm:text-[9px] font-bold text-amber-700">
                  Only {product.stock} left
                </span>
              )}
            </Link>

            {/* Mobile Quick Action Button */}
            <div className="sm:hidden shrink-0">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-8 h-8 rounded-full bg-[#064E3B] text-[#FAF8F1] flex items-center justify-center shadow-xs active:scale-90 transition-transform disabled:opacity-40 disabled:bg-stone-300 cursor-pointer"
                aria-label={isOutOfStock ? "Out of Stock" : "Add to Cart"}
                title="Add to Cart"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
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
