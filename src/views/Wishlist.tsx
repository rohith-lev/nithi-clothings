import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useCart } from "../store/cart";
import { useStoreProducts } from "../services/storefront";
import type { Product } from "../types/store";

export default function Wishlist() {
  const { state, dispatch } = useCart();
  const allProducts = useStoreProducts();
  const [addedToast, setAddedToast] = useState<string | null>(null);

  // Filter products by wishlist IDs, preserving order
  const wishlistedProducts = useMemo(() => {
    if (!state.wishlist || state.wishlist.length === 0) return [];
    const idMap = new Map<string, Product>();
    for (const p of allProducts) {
      idMap.set(p.id, p);
    }
    return state.wishlist
      .map((id) => idMap.get(id))
      .filter((p): p is Product => Boolean(p));
  }, [state.wishlist, allProducts]);

  const handleRemove = (productId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    dispatch({ type: "TOGGLE_WISHLIST", payload: productId });
  };

  const handleMoveToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const selectedColor = product.color || (product.colors && product.colors[0]) || "Standard";
    const selectedSize = (product.sizes && product.sizes[0]) || "Free Size";

    const activeSizeOpt = product.sizeOptions?.find(
      (s: { size?: string; price?: number; stock?: number; mrp?: number }) =>
        s.size && s.size.toLowerCase() === selectedSize.toLowerCase()
    );

    const rawSizePrice = activeSizeOpt ? Number(activeSizeOpt.price) : Number(product.price || 0);
    const effectivePrice =
      product.discountType === "fixed"
        ? Math.max(0, rawSizePrice - (Number(product.discount) || 0))
        : (product.discount || 0) > 0
        ? Math.max(0, Math.round(rawSizePrice * (1 - (Number(product.discount) || 0) / 100)))
        : rawSizePrice;

    const basePrice = activeSizeOpt?.mrp || product.mrp || rawSizePrice;
    const sizeStock = activeSizeOpt ? Number(activeSizeOpt.stock) : Number(product.stock || 0);

    const rawPrimary =
      (product.colorImages && product.colorImages[selectedColor]) ||
      product.coverImage ||
      (product.images && product.images[0]) ||
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=600&fit=crop";

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product: {
          ...product,
          price: effectivePrice,
          mrp: basePrice,
        },
        quantity: 1,
        selectedColor,
        selectedSize,
        unitPrice: effectivePrice,
        mrp: basePrice,
        colorImage: rawPrimary,
        stock: sizeStock,
      },
    });

    setAddedToast(`Added "${product.name}" to your shopping bag!`);
    setTimeout(() => setAddedToast(null), 3000);
  };

  const handleClearWishlist = () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      for (const id of state.wishlist) {
        dispatch({ type: "TOGGLE_WISHLIST", payload: id });
      }
    }
  };

  if (wishlistedProducts.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-body bg-[#FAF8F1] px-4 py-16">
        <div className="text-center max-w-md p-8 sm:p-10 bg-white border border-[#E8E2D5] rounded-3xl shadow-sm">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FAF8F1] border border-[#E8E2D5] flex items-center justify-center text-rose-500 shadow-inner">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#064E3B] mb-2">
            Your Wishlist is Empty
          </h1>
          <p className="text-xs sm:text-sm text-[#5C635E] mb-8 leading-relaxed">
            Save items you love by tapping the heart icon on any product to easily revisit or add them to your bag later.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#064E3B] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-[#FAF8F1] hover:bg-[#0B3D2E] transition-all shadow-md hover:shadow-lg"
          >
            <span>Explore Boutique</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F1] font-body py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Added Notification Toast */}
        {addedToast && (
          <div className="fixed bottom-6 right-6 z-50 animate-fade-in bg-[#064E3B] text-[#FAF8F1] border border-[#C9A227] px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold">
            <span>✓</span>
            <span>{addedToast}</span>
            <Link to="/cart" className="underline font-bold text-[#C9A227] ml-2">
              View Bag
            </Link>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E2D5] mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#C9A227] uppercase mb-1">
              <span>Saved Items</span>
              <span>•</span>
              <span className="text-[#5C635E]">{wishlistedProducts.length} {wishlistedProducts.length === 1 ? "Item" : "Items"}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#064E3B]">
              My Wishlist
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shop"
              className="text-xs font-bold uppercase tracking-wider text-[#064E3B] hover:text-[#C9A227] transition-colors py-2 px-3 border border-[#E8E2D5] rounded-xl bg-white hover:border-[#C9A227]"
            >
              Continue Shopping
            </Link>
            <button
              type="button"
              onClick={handleClearWishlist}
              className="text-xs font-medium text-rose-700 hover:text-rose-900 transition-colors py-2 px-3 hover:underline"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => {
            const rawPrice = Number(product.price || 0);
            const discount = Number(product.discount || 0);
            const effectivePrice =
              product.discountType === "fixed"
                ? Math.max(0, rawPrice - discount)
                : discount > 0
                ? Math.max(0, Math.round(rawPrice * (1 - discount / 100)))
                : rawPrice;
            const mrp = Number(product.mrp || rawPrice);
            const isOutOfStock = product.stock <= 0 || product.inStock === false;
            const primaryImage =
              product.coverImage ||
              (product.images && product.images[0]) ||
              "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=600&fit=crop";

            return (
              <div
                key={product.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E8E2D5] bg-white transition-all duration-300 hover:border-[#C9A227]/70 hover:shadow-xl shadow-xs"
              >
                <div>
                  {/* Image & Remove button */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-[#F3EFE3]">
                    <Link to={`/product/${product.id}`} className="block h-full w-full">
                      <img
                        src={primaryImage}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </Link>

                    {/* Stock Status Badge */}
                    <div className="absolute left-3 top-3 z-10 flex flex-col gap-1">
                      {isOutOfStock ? (
                        <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-sm">
                          Sold Out
                        </span>
                      ) : discount > 0 ? (
                        <span className="rounded-full bg-[#064E3B] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FAF8F1] shadow-sm">
                          {discount}% OFF
                        </span>
                      ) : null}
                    </div>

                    {/* Remove from Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleRemove(product.id, e)}
                      className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-rose-600 shadow-sm backdrop-blur-xs transition-all hover:scale-110 hover:bg-rose-50"
                      title="Remove from Wishlist"
                      aria-label="Remove from Wishlist"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>

                  {/* Details */}
                  <div className="p-4 sm:p-5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A227] block mb-1">
                      {product.category}
                    </span>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="font-display text-sm sm:text-base font-semibold text-[#171A18] line-clamp-1 hover:text-[#064E3B] transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Pricing */}
                    <div className="mt-2.5 flex items-baseline gap-2">
                      <span className="font-display text-base sm:text-lg font-bold text-[#064E3B]">
                        ₹{effectivePrice.toLocaleString("en-IN")}
                      </span>
                      {mrp > effectivePrice && (
                        <span className="text-xs text-[#5C635E] line-through">
                          ₹{mrp.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>

                    {/* Features pill summary */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.fabric && (
                        <span className="rounded-md bg-[#FAF8F1] border border-[#E8E2D5] px-2 py-0.5 text-[10px] text-[#5C635E]">
                          {product.fabric}
                        </span>
                      )}
                      {product.sizes && product.sizes.length > 0 && (
                        <span className="rounded-md bg-[#FAF8F1] border border-[#E8E2D5] px-2 py-0.5 text-[10px] text-[#5C635E]">
                          {product.sizes.slice(0, 3).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 sm:p-5 pt-0">
                  <button
                    type="button"
                    onClick={(e) => handleMoveToCart(product, e)}
                    disabled={isOutOfStock}
                    className={`w-full rounded-xl py-3 text-xs font-bold uppercase tracking-[0.16em] transition-all shadow-sm ${
                      isOutOfStock
                        ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                        : "bg-[#064E3B] text-[#FAF8F1] hover:bg-[#0B3D2E] active:scale-[0.98]"
                    }`}
                  >
                    {isOutOfStock ? "Out of Stock" : "Move to Bag"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
