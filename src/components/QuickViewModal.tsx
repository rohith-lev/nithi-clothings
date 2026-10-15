import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import type { Product } from "../types/store";
import { useCart } from "../store/cart";

interface QuickViewModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, isOpen, onClose }: QuickViewModalProps) {
  const navigate = useNavigate();
  const { dispatch } = useCart();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Sync initial selections
  useEffect(() => {
    if (product) {
      setSelectedSize(
        (product.sizes && product.sizes[0]) ||
        (product.sizeOptions && product.sizeOptions[0]?.size) ||
        "Free Size"
      );
      setSelectedImageIndex(0);
      setQuantity(1);
      setAddedAnimation(false);
    }
  }, [product]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const FALLBACK_MODAL_IMG = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=700&fit=crop";

  const galleryImages = [product.coverImage, ...(product.images || [])]
    .filter((img): img is string => typeof img === "string" && img.trim().length > 0)
    .filter((img) => !img.startsWith("blob:") && !img.includes("__LOCAL_") && img !== "null" && img !== "undefined" && img !== "[object Object]")
    .filter((img, idx, arr) => arr.indexOf(img) === idx);

  const cleanGallery = galleryImages.length > 0 ? galleryImages : [FALLBACK_MODAL_IMG];
  const safeIdx = selectedImageIndex >= 0 && selectedImageIndex < cleanGallery.length ? selectedImageIndex : 0;
  const activePhoto = cleanGallery[safeIdx] || cleanGallery[0] || FALLBACK_MODAL_IMG;

  const activeSizeOpt = product.sizeOptions?.find(
    (s) => s.size && s.size.toLowerCase() === selectedSize.toLowerCase()
  );

  const rawSizePrice = activeSizeOpt ? Number(activeSizeOpt.price) : Number(product.price || 0);
  const effectivePrice = rawSizePrice;
  const basePrice = Math.max(activeSizeOpt?.mrp || product.mrp || rawSizePrice, effectivePrice);
  const dynamicDiscount = basePrice > effectivePrice ? Math.round(((basePrice - effectivePrice) / basePrice) * 100) : 0;
  const sizeStock = activeSizeOpt ? Number(activeSizeOpt.stock) : Number(product.stock || 0);
  const isOutOfStock = (product && product.status === "OUT OF STOCK") || (sizeStock <= 0 && (product.stock || 0) <= 0);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const finalSize = selectedSize || (product.sizes && product.sizes[0]) || (product.sizeOptions && product.sizeOptions[0]?.size) || "Free Size";
    const finalColor = (product.colors && product.colors[0]) || product.color || "Standard";

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product: {
          ...product,
          price: effectivePrice,
          mrp: basePrice,
        },
        quantity: Math.max(1, quantity),
        selectedColor: finalColor,
        selectedSize: finalSize,
        unitPrice: effectivePrice,
        mrp: basePrice,
        colorImage: activePhoto,
        stock: sizeStock > 0 ? sizeStock : (product.stock || 50),
      },
    });
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 900);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const finalSize = selectedSize || (product.sizes && product.sizes[0]) || (product.sizeOptions && product.sizeOptions[0]?.size) || "Free Size";
    const finalColor = (product.colors && product.colors[0]) || product.color || "Standard";

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product: {
          ...product,
          price: effectivePrice,
          mrp: basePrice,
        },
        quantity: Math.max(1, quantity),
        selectedColor: finalColor,
        selectedSize: finalSize,
        unitPrice: effectivePrice,
        mrp: basePrice,
        colorImage: activePhoto,
        stock: sizeStock > 0 ? sizeStock : (product.stock || 50),
      },
    });
    onClose();
    navigate("/checkout");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#171A18]/70 backdrop-blur-xs p-4 sm:p-6 font-body overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl border border-[#E8E2D5] bg-[#FAF8F1] p-6 sm:p-8 text-[#171A18] shadow-2xl animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-[#FFFFFF] border border-[#E8E2D5] text-sm font-bold text-[#171A18] hover:bg-[#064E3B] hover:text-[#FAF8F1] transition-colors shadow-xs"
          aria-label="Close modal"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 sm:grid-cols-2 items-start">
          {/* Left: Image & Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-2xl border border-[#E8E2D5] bg-[#F3EFE3] shadow-xs">
              <img
                src={activePhoto}
                alt={product.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = FALLBACK_MODAL_IMG;
                }}
                className="h-full w-full object-cover transition-all duration-300"
              />
              {/* Badges */}
              <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                {(product.newArrival || product.isNew) && (
                  <span className="rounded-full bg-[#064E3B] px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FAF8F1] shadow-xs">
                    New
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="rounded-full bg-[#C9A227] px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#171A18] shadow-xs">
                    Bestseller
                  </span>
                )}
                {dynamicDiscount > 0 && (
                  <span className="rounded-full bg-white/95 px-2.5 py-0.5 text-[9px] font-bold text-[#064E3B] border border-[#E8E2D5] shadow-xs">
                    {dynamicDiscount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto pb-1">
                {galleryImages.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImageIndex(i)}
                    className={`aspect-[3/4] w-14 shrink-0 overflow-hidden rounded-xl border transition-all ${
                      galleryImages[selectedImageIndex] === img
                        ? "border-[#064E3B] ring-2 ring-[#C9A227]"
                        : "border-[#E8E2D5] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt="thumb"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_MODAL_IMG;
                      }}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info & Controls */}
          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                {product.category || "Nithi Collection"}
              </span>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#064E3B] leading-tight mt-0.5">
                {product.name}
              </h2>
              <p className="text-[11px] font-mono text-[#5C635E] mt-0.5">
                SKU: {product.sku || product.code}
              </p>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-2.5 pb-2 border-b border-[#E8E2D5]">
              <span className="font-display text-2xl font-bold text-[#064E3B]">
                ₹{(effectivePrice * quantity).toLocaleString("en-IN")}
              </span>
              {basePrice > effectivePrice && (
                <span className="text-xs text-[#5C635E] line-through">
                  ₹{(basePrice * quantity).toLocaleString("en-IN")}
                </span>
              )}
              {dynamicDiscount > 0 && (
                <span className="rounded-full bg-[#C9A227]/15 px-2.5 py-0.5 text-xs font-bold text-[#A8811A]">
                  Save ₹{((basePrice - effectivePrice) * quantity).toLocaleString("en-IN")} ({dynamicDiscount}%)
                </span>
              )}
              {quantity > 1 && (
                <span className="text-[11px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                  ₹{effectivePrice} × {quantity}
                </span>
              )}
            </div>

            {/* Live Stock indicator */}
            <div>
              {isOutOfStock ? (
                <span className="inline-block rounded-full bg-rose-50 border border-rose-200 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-700">
                  ⚠️ Out of Stock for {selectedSize} (0 left)
                </span>
              ) : sizeStock <= 5 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-300 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  ⚡ Only {sizeStock} Left in Stock for {selectedSize}!
                </span>
              ) : (
                <span className="inline-block text-[11px] font-medium text-emerald-700">
                  ✓ In Stock ({sizeStock} remaining for Size {selectedSize})
                </span>
              )}
            </div>

            {/* Sizes */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#171A18] mb-1.5">
                Size: <span className="text-[#064E3B] font-bold">{selectedSize}</span> {sizeStock > 0 ? `(${sizeStock} left)` : ""}
              </label>
              <div className="flex flex-wrap gap-1.5">
                {(product.sizeOptions && product.sizeOptions.length > 0
                  ? product.sizeOptions
                  : (product.sizes || ["Free Size"]).map((sz) => ({
                      size: sz,
                      price: product.price,
                      mrp: product.mrp,
                      stock: product.stock,
                    }))
                ).map((szOpt) => {
                  const szName = szOpt.size;
                  const isSelected = selectedSize.toLowerCase() === szName.toLowerCase();
                  const remaining = Number(szOpt.stock) ?? 0;
                  const isSoldOut = remaining <= 0;

                  return (
                    <button
                      key={szName}
                      type="button"
                      onClick={() => !isSoldOut && setSelectedSize(szName)}
                      disabled={isSoldOut}
                      className={`flex flex-col items-center justify-center rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all min-w-[55px] ${
                        isSelected
                          ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] shadow-xs scale-105"
                          : isSoldOut
                          ? "border-stone-200 bg-stone-100 text-stone-400 opacity-60 cursor-not-allowed"
                          : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#C9A227]"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {szName} {isSelected && "✓"}
                      </span>
                      <span
                        className={`text-[9px] ${
                          isSelected
                            ? "text-emerald-100"
                            : isSoldOut
                            ? "text-rose-500 line-through"
                            : remaining <= 5
                            ? "text-amber-700 font-bold"
                            : "text-stone-400"
                        }`}
                      >
                        {isSoldOut ? "Sold Out" : `${remaining} left`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#171A18]">
                Quantity:
              </span>
              <div className="flex items-center border border-[#E8E2D5] rounded-xl bg-[#FFFFFF] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 text-xs font-bold text-[#171A18] hover:bg-[#F3EFE3]"
                >
                  −
                </button>
                <span className="px-3.5 py-1 text-xs font-semibold border-x border-[#E8E2D5]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
                  className="px-3 py-1 text-xs font-bold text-[#171A18] hover:bg-[#F3EFE3]"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 rounded-xl py-3.5 text-xs font-bold uppercase tracking-[0.16em] transition-all shadow-md ${
                    addedAnimation
                      ? "bg-[#C9A227] text-[#171A18]"
                      : "bg-[#064E3B] text-[#FAF8F1] hover:bg-[#0B3D2E] disabled:opacity-50"
                  }`}
                >
                  {addedAnimation ? "✓ Added to Bag!" : isOutOfStock ? "Out of Stock" : "Add to Bag"}
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 rounded-xl bg-[#C9A227] py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#171A18] hover:bg-[#E2C467] transition-colors shadow-md disabled:opacity-50"
                >
                  Buy Now
                </button>
              </div>

              <div className="text-center pt-1">
                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="text-xs font-semibold text-[#064E3B] underline underline-offset-4 hover:text-[#C9A227] transition-colors"
                >
                  View Full Product Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
