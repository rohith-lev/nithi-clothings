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
  const [selectedSize, setSelectedSize] = useState(
    (product.sizes && product.sizes[0]) || "Free Size"
  );
  const [selectedColor, setSelectedColor] = useState(
    product.color || (product.colors && product.colors[0]) || "Standard"
  );
  const [addedToast, setAddedToast] = useState(false);
  const [wishlistAnimate, setWishlistAnimate] = useState(false);

  const isWishlisted = state.wishlist.includes(product.id);

  // Gallery array
  const gallery = useMemo(() => {
    return Array.from(
      new Set(
        [
          product.coverImage,
          ...(product.images || []),
          ...(product.colorImages ? Object.values(product.colorImages) : []),
        ].filter(Boolean) as string[]
      )
    );
  }, [product]);

  const FALLBACK_PRODUCT_IMG = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=600&fit=crop";

  // Primary image
  const rawPrimary =
    (product.colorImages && selectedColor && product.colorImages[selectedColor]) ||
    product.coverImage ||
    gallery[0] ||
    FALLBACK_PRODUCT_IMG;

  const primaryImage =
    rawPrimary && !rawPrimary.startsWith("blob:") && !rawPrimary.includes("__LOCAL_")
      ? rawPrimary
      : FALLBACK_PRODUCT_IMG;

  // Second image for desktop hover switch
  const rawSecondary = gallery.length > 1 ? gallery[1] : null;
  const secondaryImage =
    rawSecondary && !rawSecondary.startsWith("blob:") && !rawSecondary.includes("__LOCAL_")
      ? rawSecondary
      : null;

  // Active Size Option
  const activeSizeOpt = product.sizeOptions?.find(
    (s) => s.size && s.size.toLowerCase() === selectedSize.toLowerCase()
  );

  const rawSizePrice = activeSizeOpt ? Number(activeSizeOpt.price) : Number(product.price || 0);
  const effectiveFinalPrice = product.discountType === "fixed"
    ? Math.max(0, rawSizePrice - (Number(product.discount) || 0))
    : (product.discount || 0) > 0
    ? Math.max(0, Math.round(rawSizePrice * (1 - (Number(product.discount) || 0) / 100)))
    : rawSizePrice;

  const basePrice = activeSizeOpt?.mrp || product.mrp || rawSizePrice;
  const sizeStock = activeSizeOpt ? Number(activeSizeOpt.stock) : Number(product.stock || 0);
  const isOutOfStock = sizeStock <= 0 || !product.inStock;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product: {
          ...product,
          price: effectiveFinalPrice,
          mrp: basePrice,
        },
        quantity: 1,
        selectedColor,
        selectedSize,
        unitPrice: effectiveFinalPrice,
        mrp: basePrice,
        colorImage: primaryImage,
        stock: sizeStock,
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
            ✓ Added {selectedColor} ({selectedSize}) to Bag
          </div>
        )}

        {/* Image Container with Desktop 2nd Image Switch & Smooth Zoom */}
        <Link
          to={`/product/${product.id}`}
          className="relative block aspect-[3/4] overflow-hidden rounded-t-2xl bg-[#F3EFE3] select-none"
        >
          {/* Primary Image */}
          <img
            src={primaryImage}
            alt={product.name}
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
              alt={`${product.name} alternate angle`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 ease-out ${
                isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
              }`}
              loading="lazy"
            />
          )}

          {/* Configurable Badges */}
          <div className="pointer-events-none absolute left-3 top-3 z-10 flex flex-col gap-1.5 items-start">
            {(product.newArrival || product.isNew) && (
              <span className="rounded-full border border-[#C9A227]/40 bg-[#064E3B] px-3 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#FAF8F1] shadow-sm">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="rounded-full bg-[#C9A227] px-3 py-0.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#171A18] shadow-sm">
                BESTSELLER
              </span>
            )}
            {product.discount >= 25 && !product.isBestSeller && (
              <span className="rounded-full bg-[#B89222] px-3 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#FAF8F1] shadow-sm">
                LIMITED
              </span>
            )}
            {product.discount > 0 && (
              <span className="rounded-full border border-[#E8E2D5] bg-[#FFFFFF]/95 px-2.5 py-0.5 text-[9px] font-bold text-[#064E3B] shadow-2xs">
                {product.discount}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button with Micro-interaction animation */}
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#FFFFFF]/90 shadow-sm backdrop-blur-xs transition-all duration-200 hover:scale-110 ${
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
              className="h-4 w-4 transition-transform duration-200"
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
              className="w-full rounded-xl border border-[#E8E2D5] bg-[#FFFFFF]/95 py-2.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[#171A18] shadow-md transition-all hover:bg-[#064E3B] hover:text-[#FAF8F1] hover:border-[#064E3B]"
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
              className="flex w-full items-center justify-center gap-1.5 bg-[#064E3B] py-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#FAF8F1] transition-colors hover:bg-[#0B3D2E] disabled:opacity-50"
            >
              <span>👜</span>
              <span>{isOutOfStock ? "Out of Stock" : "Add to Cart"}</span>
            </button>
          </div>

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#FAF8F1]/75 backdrop-blur-[1px]">
              <span className="rounded-full bg-[#171A18] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#FAF8F1] shadow-md">
                Out of Stock
              </span>
            </div>
          )}
        </Link>

        {/* Product Details */}
        <div className="flex flex-1 flex-col justify-between space-y-2 bg-[#FFFFFF] p-4 rounded-b-2xl">
          <div>
            <div className="flex items-center justify-between text-[10px] font-medium uppercase tracking-wider text-[#5C635E]">
              <span className="capitalize">{product.category}</span>
              <span className="font-mono text-[#C9A227]">{product.sku || product.code}</span>
            </div>

            <Link to={`/product/${product.id}`} className="mt-1 block group/title">
              <h3 className="font-display line-clamp-2 text-sm font-semibold leading-snug text-[#171A18] transition-colors group-hover/title:text-[#064E3B] sm:text-base">
                {product.name}
              </h3>
            </Link>

            {/* Color Switcher Chips */}
            {product.colors && product.colors.length > 0 && (
              <div className="mt-2 flex flex-wrap items-center gap-1">
                {product.colors.slice(0, 3).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedColor(c);
                    }}
                    onMouseEnter={() => setSelectedColor(c)}
                    className={`rounded-full border px-2.5 py-0.5 text-[9px] transition-all ${
                      selectedColor === c
                        ? "border-[#064E3B] bg-[#064E3B] font-bold text-[#FAF8F1]"
                        : "border-[#E8E2D5] bg-[#FAF8F1] text-[#5C635E] hover:border-[#C9A227]"
                    }`}
                    title={`View ${c}`}
                  >
                    {c}
                  </button>
                ))}
                {product.colors.length > 3 && (
                  <span className="text-[9px] font-medium text-[#5C635E]">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Pricing & Stock indicators */}
          <div className="border-t border-[#E8E2D5]/60 pt-2.5">
            <div className="flex items-baseline justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-display text-base font-bold text-[#064E3B] sm:text-lg">
                  ₹{effectiveFinalPrice.toLocaleString("en-IN")}
                </span>
                {basePrice > effectiveFinalPrice && (
                  <span className="text-xs font-normal text-[#5C635E] line-through">
                    ₹{basePrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {/* Genuine Live Stock Indicator */}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                  Only {product.stock} left
                </span>
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
