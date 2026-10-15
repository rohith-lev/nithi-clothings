import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useStoreProduct, useStoreProducts, useStoreCategories } from "../services/storefront";
import { useCart } from "../store/cart";
import ProductCard from "../components/ProductCard";
import ImageZoomViewer from "../components/ImageZoomViewer";
import RecentlyViewedSection from "../components/RecentlyViewedSection";
import SEO from "../components/SEO";
import { addRecentlyViewed, useRecentlyViewed } from "../utils/recentlyViewed";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useStoreProduct(id);
  const allProducts = useStoreProducts();
  const categories = useStoreCategories();
  const { state, dispatch } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string>("description");
  const [addedToast, setAddedToast] = useState(false);
  const [wishlistAnimate, setWishlistAnimate] = useState(false);

  // Sync initial size & color when product loads & save to recently viewed
  useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else if (product.sizeOptions && product.sizeOptions.length > 0) {
        setSelectedSize(product.sizeOptions[0].size);
      } else {
        setSelectedSize("Free Size");
      }

      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else if (product.color) {
        setSelectedColor(product.color);
      } else {
        setSelectedColor("Standard");
      }

      setSelectedImage(0);
      setQuantity(1);
      setPincodeMsg(null);

      // Track in recently viewed
      addRecentlyViewed(product.id);
    }
  }, [product?.id]);

  const recentProducts = useRecentlyViewed(allProducts, product?.id);

  // Find Category Display Object
  const categoryObj = useMemo(() => {
    if (!product?.category) return null;
    const catName = product.category.toLowerCase().trim();
    return categories.find(
      (c) =>
        c &&
        ((c.name && c.name.toLowerCase().trim() === catName) ||
          (c.slug && c.slug.toLowerCase().trim() === catName) ||
          (c.id && c.id.toLowerCase().trim() === catName))
    ) || null;
  }, [categories, product?.category]);

  const categoryName = categoryObj ? categoryObj.name : product?.category || "Shop";
  const categorySlug = categoryObj?.slug || categoryObj?.id || categoryName.toLowerCase().replace(/\s+/g, "-");

  // Active size option & dynamic calculations
  const activeSizeOption = product?.sizeOptions?.find(
    (s) => s.size && s.size.toLowerCase() === selectedSize.toLowerCase()
  );

  const rawSizePrice = activeSizeOption ? Number(activeSizeOption.price) : Number(product?.price || 0);
  const rawSizeMrp = activeSizeOption?.mrp
    ? Number(activeSizeOption.mrp)
    : Number(product?.mrp || product?.price || rawSizePrice);

  const effectivePrice = rawSizePrice;
  const mrp = Math.max(rawSizeMrp, effectivePrice);
  const discountPercent = mrp > effectivePrice ? Math.round(((mrp - effectivePrice) / mrp) * 100) : 0;
  const savingsAmount = mrp > effectivePrice ? (mrp - effectivePrice) * quantity : 0;

  const sizeStock = activeSizeOption ? Number(activeSizeOption.stock) : Number(product?.stock ?? 0);
  const isSizeOutOfStock = (product && product.status === "OUT OF STOCK") || (sizeStock <= 0 && (product?.stock ?? 0) <= 0);
  const isWishlisted = product ? state.wishlist.includes(product.id) : false;

  const FALLBACK_DETAIL_IMG = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&fit=crop";

  // Build clean gallery images without empty strings or dead blob URLs
  const cleanGallery = useMemo(() => {
    if (!product) return [FALLBACK_DETAIL_IMG];
    const raw = [product.coverImage, ...(product.images || [])];
    const valid = raw
      .filter((img): img is string => typeof img === "string" && img.trim().length > 0)
      .filter(
        (img) =>
          !img.startsWith("blob:") &&
          !img.includes("__LOCAL_") &&
          img !== "null" &&
          img !== "undefined" &&
          img !== "[object Object]"
      );
    const unique = Array.from(new Set(valid));
    return unique.length > 0 ? unique : [FALLBACK_DETAIL_IMG];
  }, [product]);

  const safeSelectedImage = selectedImage >= 0 && selectedImage < cleanGallery.length ? selectedImage : 0;
  const primaryImage = cleanGallery[safeSelectedImage] || cleanGallery[0] || FALLBACK_DETAIL_IMG;

  const handleAddToCart = () => {
    if (!product || isSizeOutOfStock) return;
    const finalSize = selectedSize || (product.sizes && product.sizes[0]) || (product.sizeOptions && product.sizeOptions[0]?.size) || "Free Size";
    const finalColor = selectedColor || (product.colors && product.colors[0]) || product.color || "Standard";

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product: {
          ...product,
          price: effectivePrice,
          mrp,
        },
        quantity: Math.max(1, quantity),
        selectedColor: finalColor,
        selectedSize: finalSize,
        unitPrice: effectivePrice,
        mrp,
        colorImage: primaryImage,
        stock: sizeStock > 0 ? sizeStock : (product.stock || 50),
      },
    });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  const handleBuyNow = () => {
    if (!product || isSizeOutOfStock) return;
    const finalSize = selectedSize || (product.sizes && product.sizes[0]) || (product.sizeOptions && product.sizeOptions[0]?.size) || "Free Size";
    const finalColor = selectedColor || (product.colors && product.colors[0]) || product.color || "Standard";

    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product: {
          ...product,
          price: effectivePrice,
          mrp,
        },
        quantity: Math.max(1, quantity),
        selectedColor: finalColor,
        selectedSize: finalSize,
        unitPrice: effectivePrice,
        mrp,
        colorImage: primaryImage,
        stock: sizeStock > 0 ? sizeStock : (product.stock || 50),
      },
    });
    navigate("/checkout");
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    setWishlistAnimate(true);
    setTimeout(() => setWishlistAnimate(false), 500);
    dispatch({ type: "TOGGLE_WISHLIST", payload: product.id });
  };

  const checkPincode = () => {
    const cleaned = pincode.trim().replace(/\D/g, "");
    if (cleaned.length === 6) {
      const tnPincodes = ["6", "63", "64", "60", "61", "62"];
      const isTN = tnPincodes.some((p) => cleaned.startsWith(p));
      if (isTN) {
        setPincodeMsg({
          type: "success",
          text: "✓ Express Delivery in 2–3 business days. Cash on Delivery Available.",
        });
      } else {
        setPincodeMsg({
          type: "success",
          text: "✓ Standard Pan-India Delivery in 4–6 business days. Express COD Available.",
        });
      }
    } else {
      setPincodeMsg({
        type: "error",
        text: "Please enter a valid 6-digit Indian delivery pincode.",
      });
    }
  };

  // Curated Related Products in same Category
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const pCat = (product.category || "").toLowerCase().trim();
    const pSub = (product.subcategory || "").toLowerCase().trim();

    return allProducts
      .filter((p) => {
        if (!p || p.id === product.id) return false;
        if (p.status === "OUT OF STOCK" || p.status === "DISCONTINUED") return false;
        const c = (p.category || "").toLowerCase().trim();
        const s = (p.subcategory || "").toLowerCase().trim();
        return c === pCat || (pSub && s === pSub);
      })
      .slice(0, 4);
  }, [allProducts, product]);

  // Loading Shimmer Skeleton
  if (loading && !product) {
    return (
      <div className="bg-[#FAF8F1] min-h-screen py-10 font-body">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-52 bg-[#E8E2D5] rounded-full mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-[4/5] bg-[#E8E2D5] rounded-3xl animate-pulse" />
              <div className="flex gap-3">
                <div className="w-20 h-24 bg-[#E8E2D5] rounded-2xl animate-pulse" />
                <div className="w-20 h-24 bg-[#E8E2D5] rounded-2xl animate-pulse" />
                <div className="w-20 h-24 bg-[#E8E2D5] rounded-2xl animate-pulse" />
              </div>
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="h-4 w-28 bg-[#E8E2D5] rounded-full animate-pulse" />
              <div className="h-10 w-3/4 bg-[#E8E2D5] rounded-2xl animate-pulse" />
              <div className="h-8 w-40 bg-[#E8E2D5] rounded-xl animate-pulse" />
              <div className="h-28 bg-[#E8E2D5] rounded-2xl animate-pulse" />
              <div className="h-14 bg-[#E8E2D5] rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 404 Product Not Found State
  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-body bg-[#FAF8F1] px-4">
        <div className="max-w-md w-full text-center bg-[#FFFFFF] p-8 sm:p-10 rounded-3xl border border-[#E8E2D5] shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F1] border border-[#C9A227]/40 flex items-center justify-center mx-auto mb-4 text-[#C9A227]">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="font-display text-2xl font-bold text-[#064E3B] mb-2">Garment Not Found</h2>
          <p className="text-xs sm:text-sm text-[#5C635E] mb-6 leading-relaxed">
            The requested design may have been moved, renamed, or is currently off the loom.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#064E3B] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#FAF8F1] hover:bg-[#0B3D2E] transition-all shadow-md"
          >
            <span>Explore All Collections</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    );
  }

  const productSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://nithiclothings.com/product/${product.id}#product`,
        name: product.name,
        image: cleanGallery,
        description:
          product.description ||
          `Shop ${product.name} crafted from pure breathable ${product.fabric || "cotton"} fabric with fast all-India delivery from Nithi Clothings.`,
        sku: product.sku || product.code || product.id,
        brand: {
          "@type": "Brand",
          name: product.brand || "Nithi Clothings",
        },
        offers: {
          "@type": "Offer",
          url: `https://nithiclothings.com/product/${product.id}`,
          priceCurrency: "INR",
          price: effectivePrice,
          priceValidUntil: "2027-12-31",
          itemCondition: "https://schema.org/NewCondition",
          availability: isSizeOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          seller: {
            "@type": "Organization",
            name: "Nithi Clothings",
          },
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product.rating || 4.9,
          reviewCount: product.reviews || 28,
        },
      },
    ],
  };

  return (
    <div className="font-body bg-[#FAF8F1] text-[#171A18] min-h-screen pb-16">
      <SEO
        title={`${product.name} - 100% Pure Cotton | Nithi Clothings`}
        description={`Buy ${product.name} online at Nithi Clothings. Pure breathable ${product.fabric || "cotton"} fabric. ₹${effectivePrice}. COD & Express Pan-India Delivery.`}
        keywords={`${product.name}, ${product.category}, ${product.subcategory || ""}, pure cotton nighty, ethnic wear, Nithi Clothings`}
        canonical={`/product/${product.id}`}
        ogImage={primaryImage}
        ogType="product"
        structuredData={productSchema}
      />

      {/* Floating Added to Bag Toast Pill */}
      {addedToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in flex items-center gap-2.5 rounded-full bg-[#064E3B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#FAF8F1] shadow-2xl border border-[#C9A227]">
          <span className="w-5 h-5 rounded-full bg-[#C9A227] text-[#064E3B] flex items-center justify-center font-bold text-xs">
            ✓
          </span>
          <span>Added {product.name} ({selectedSize}) to Bag!</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* 1. Breadcrumbs */}
        <nav className="text-xs text-[#5C635E] mb-6 sm:mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link to="/" className="hover:text-[#064E3B] transition-colors">Home</Link>
          <span className="text-[#C9A227]">/</span>
          <Link to="/shop" className="hover:text-[#064E3B] transition-colors">Shop</Link>
          <span className="text-[#C9A227]">/</span>
          <Link to={`/category/${encodeURIComponent(categorySlug)}`} className="hover:text-[#064E3B] transition-colors capitalize">
            {categoryName}
          </Link>
          {product.subcategory && (
            <>
              <span className="text-[#C9A227]">/</span>
              <Link
                to={`/category/${encodeURIComponent(categorySlug)}/${encodeURIComponent(product.subcategory)}`}
                className="hover:text-[#064E3B] transition-colors"
              >
                {product.subcategory}
              </Link>
            </>
          )}
          <span className="text-[#C9A227]">/</span>
          <span className="text-[#171A18] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* 2. Main Two-Column Luxury Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Image Gallery Viewport & Thumbnails */}
          <div className="lg:col-span-7">
            <ImageZoomViewer
              images={cleanGallery}
              selectedIndex={safeSelectedImage}
              onSelectIndex={setSelectedImage}
              alt={product.name}
            />
          </div>

          {/* Right Column: Product Info & Commerce Actions */}
          <div className="lg:col-span-5 space-y-6">
            {/* Category Eyebrow & Wishlist Action */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C9A227]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C9A227]">
                  {categoryName} {product.subcategory ? `• ${product.subcategory}` : ""}
                </span>
              </div>
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E2D5] bg-[#FFFFFF] transition-all hover:scale-110 shadow-2xs cursor-pointer ${
                  wishlistAnimate ? "animate-heart-pop" : ""
                } ${isWishlisted ? "text-rose-600 border-rose-200 bg-rose-50" : "text-[#171A18] hover:text-rose-600"}`}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Product Title & Ratings */}
            <div className="space-y-2">
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#064E3B] leading-[1.15] tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-3 text-xs text-[#5C635E]">
                <div className="flex items-center gap-1 bg-[#064E3B]/10 text-[#064E3B] px-2.5 py-0.5 rounded-full font-bold">
                  <span>★</span>
                  <span>{product.rating || "4.9"}</span>
                </div>
                <span className="text-[#C9A227]">•</span>
                <span>{product.reviews || 28} Verified Reviews</span>
                <span className="text-[#C9A227]">•</span>
                <span className="font-mono text-[11px] text-[#5C635E]">
                  SKU: {product.sku || product.code}
                </span>
              </div>
            </div>

            {/* Price Display Card */}
            <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-2">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-display text-3xl sm:text-4xl font-bold text-[#064E3B]">
                  ₹{(effectivePrice * quantity).toLocaleString("en-IN")}
                </span>
                {mrp > effectivePrice && (
                  <span className="text-base sm:text-lg text-[#5C635E] line-through font-normal">
                    ₹{(mrp * quantity).toLocaleString("en-IN")}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="rounded-full bg-[#C9A227]/15 border border-[#C9A227]/40 px-3 py-1 text-xs font-bold text-[#A8811A]">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs pt-1 text-[#5C635E] border-t border-[#E8E2D5]/50">
                <span>Inclusive of all taxes</span>
                {savingsAmount > 0 && (
                  <span className="font-semibold text-emerald-700">
                    You save ₹{savingsAmount.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Notification Banner */}
            <div>
              {isSizeOutOfStock ? (
                <div className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-2 text-xs font-bold text-rose-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  <span>Size {selectedSize} is Out of Stock</span>
                </div>
              ) : sizeStock <= 5 ? (
                <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-300 px-4 py-2 text-xs font-bold text-amber-900 shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping" />
                  <span>⚡ Only {sizeStock} left for Size {selectedSize}!</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-xs font-semibold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Size {selectedSize} • In Stock ({sizeStock} available)</span>
                </div>
              )}
            </div>

            {/* Size Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#171A18] flex items-center gap-2">
                  <span>Select Size:</span>
                  <span className="text-[#064E3B] font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                    {selectedSize}
                  </span>
                </label>
                {product.sizeChart && (
                  <span className="text-xs text-[#064E3B] underline cursor-pointer hover:text-[#C9A227] font-semibold">
                    Size Guide
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2.5">
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
                  const szPrice = Number(szOpt.price) || product.price;

                  return (
                    <button
                      key={szName}
                      type="button"
                      onClick={() => !isSoldOut && setSelectedSize(szName)}
                      disabled={isSoldOut}
                      className={`relative flex min-w-[80px] flex-col items-center justify-center rounded-2xl border px-3.5 py-2 text-xs font-bold transition-all duration-200 shadow-2xs cursor-pointer ${
                        isSelected
                          ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] ring-2 ring-[#C9A227]/50 scale-105 shadow-md"
                          : isSoldOut
                          ? "border-stone-200 bg-stone-100 text-stone-400 opacity-60 cursor-not-allowed"
                          : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#C9A227] hover:bg-[#FAF8F1]"
                      }`}
                    >
                      <span className="flex items-center gap-1 font-display text-sm font-bold">
                        {szName}
                        {isSelected && <span className="text-[10px] text-[#DFC15E]">✓</span>}
                      </span>
                      <span
                        className={`text-[10px] mt-0.5 font-medium ${
                          isSoldOut
                            ? "text-rose-500 font-bold"
                            : remaining <= 5
                            ? isSelected
                              ? "text-amber-200 font-bold"
                              : "text-amber-600 font-bold"
                            : isSelected
                            ? "text-[#FAF8F1]/80"
                            : "text-emerald-700"
                        }`}
                      >
                        {isSoldOut ? "Out of Stock" : remaining <= 5 ? `Only ${remaining} left` : "In Stock"}
                      </span>
                      {product.sizeOptions && product.sizeOptions.length > 1 && (
                        <span className={`text-[9px] font-normal mt-0.5 ${isSelected ? "text-[#DFC15E]" : "text-[#5C635E]"}`}>
                          ₹{szPrice}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Colors / Variations (if available) */}
            {product.colors && product.colors.length > 1 && (
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#171A18] block">
                  Color / Pattern: <span className="text-[#064E3B] font-bold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((col) => {
                    const isColSelected = selectedColor.toLowerCase() === col.toLowerCase();
                    return (
                      <button
                        key={col}
                        type="button"
                        onClick={() => setSelectedColor(col)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                          isColSelected
                            ? "bg-[#064E3B] text-[#FAF8F1] border-[#064E3B] ring-2 ring-[#C9A227]/40 shadow-xs"
                            : "bg-[#FFFFFF] text-[#171A18] border-[#E8E2D5] hover:border-[#C9A227]"
                        }`}
                      >
                        {col}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector with Live Subtotal */}
            <div className="flex items-center justify-between p-4 bg-[#FFFFFF] rounded-2xl border border-[#E8E2D5] shadow-2xs">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#171A18]">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#E8E2D5] rounded-xl bg-[#FAF8F1] overflow-hidden shadow-inner">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-sm font-bold text-[#171A18] hover:bg-[#E8E2D5] transition cursor-pointer"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold border-x border-[#E8E2D5]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(sizeStock > 0 ? sizeStock : 10, quantity + 1))}
                    disabled={isSizeOutOfStock || quantity >= sizeStock}
                    className="px-3.5 py-1.5 text-sm font-bold text-[#171A18] hover:bg-[#E8E2D5] disabled:opacity-30 transition cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-[#5C635E] block tracking-wider">
                  Subtotal
                </span>
                <span className="font-display font-bold text-base text-[#064E3B]">
                  ₹{(effectivePrice * quantity).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Main Action Buttons: Add to Bag & Buy Now */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isSizeOutOfStock}
                  className={`flex-1 rounded-2xl py-4 px-4 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] shadow-md transition-all text-center flex items-center justify-center gap-2 cursor-pointer ${
                    isSizeOutOfStock
                      ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                      : "bg-[#064E3B] text-[#FAF8F1] hover:bg-[#0B3D2E] active:scale-[0.99] shadow-lg"
                  }`}
                >
                  <svg className="w-4 h-4 text-[#C9A227]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  <span>{isSizeOutOfStock ? "Out of Stock" : "Add to Bag"}</span>
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isSizeOutOfStock}
                  className={`flex-1 rounded-2xl py-4 px-4 text-xs sm:text-sm font-bold uppercase tracking-[0.16em] transition-all shadow-md text-center cursor-pointer ${
                    isSizeOutOfStock
                      ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                      : "bg-[#C9A227] text-[#171A18] hover:bg-[#DFC15E] active:scale-[0.99]"
                  }`}
                >
                  Buy Now
                </button>
              </div>
            </div>

            {/* Pincode & Delivery Checker */}
            <div className="rounded-2xl border border-[#E8E2D5] bg-[#FFFFFF] p-4 sm:p-5 space-y-2.5 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B] block">
                Check Delivery & COD Availability
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit pincode (e.g. 641001)"
                  className="flex-1 rounded-xl border border-[#E8E2D5] px-3.5 py-2.5 text-xs focus:border-[#064E3B] focus:outline-none bg-[#FAF8F1]"
                />
                <button
                  type="button"
                  onClick={checkPincode}
                  className="rounded-xl bg-[#064E3B] px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FAF8F1] hover:bg-[#0B3D2E] shadow-xs cursor-pointer"
                >
                  Check
                </button>
              </div>
              {pincodeMsg && (
                <p
                  className={`text-[11px] font-semibold pt-1 ${
                    pincodeMsg.type === "success" ? "text-emerald-800" : "text-rose-600"
                  }`}
                >
                  {pincodeMsg.text}
                </p>
              )}
            </div>

            {/* Brand Value Pillars */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E8E2D5] flex items-center gap-2.5 text-xs text-[#5C635E]">
                <span className="text-[#C9A227] text-base">🌿</span>
                <span className="font-medium">100% Breathable Cotton</span>
              </div>
              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E8E2D5] flex items-center gap-2.5 text-xs text-[#5C635E]">
                <span className="text-[#C9A227] text-base">🚚</span>
                <span className="font-medium">Express Pan-India Dispatch</span>
              </div>
              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E8E2D5] flex items-center gap-2.5 text-xs text-[#5C635E]">
                <span className="text-[#C9A227] text-base">💵</span>
                <span className="font-medium">Cash on Delivery Available</span>
              </div>
              <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E8E2D5] flex items-center gap-2.5 text-xs text-[#5C635E]">
                <span className="text-[#C9A227] text-base">🔄</span>
                <span className="font-medium">Easy 7-Day Exchange</span>
              </div>
            </div>

            {/* Accordion Product Details & Specifications */}
            <div className="border-t border-[#E8E2D5] pt-4 space-y-3">
              {/* Description Section */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === "description" ? "" : "description")}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#064E3B] cursor-pointer"
                >
                  <span>Description & Highlights</span>
                  <span>{activeAccordion === "description" ? "−" : "+"}</span>
                </button>
                {activeAccordion === "description" && (
                  <div className="px-4 pb-4 text-xs text-[#5C635E] leading-relaxed space-y-3 border-t border-[#E8E2D5]/50 pt-3">
                    <p>{product.description || "Designed with 100% pure combed cotton for all-day breathability and effortless style."}</p>
                    {product.specialFeatures && (
                      <div className="bg-[#FAF8F1] p-3 rounded-xl border border-[#E8E2D5]">
                        <span className="font-bold text-[#064E3B] block mb-1">Key Features:</span>
                        <p>{product.specialFeatures}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Fabric & Specifications */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === "specs" ? "" : "specs")}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#064E3B] cursor-pointer"
                >
                  <span>Fabric & Garment Details</span>
                  <span>{activeAccordion === "specs" ? "−" : "+"}</span>
                </button>
                {activeAccordion === "specs" && (
                  <div className="px-4 pb-4 border-t border-[#E8E2D5]/50 pt-3">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-[#5C635E]">Fabric Material:</span>
                        <p className="font-semibold text-[#171A18] mt-0.5">{product.fabric || "100% Pure Combed Cotton"}</p>
                      </div>
                      {product.pattern && (
                        <div>
                          <span className="text-[#5C635E]">Pattern:</span>
                          <p className="font-semibold text-[#171A18] mt-0.5">{product.pattern}</p>
                        </div>
                      )}
                      {product.sleeveType && (
                        <div>
                          <span className="text-[#5C635E]">Sleeve Type:</span>
                          <p className="font-semibold text-[#171A18] mt-0.5">{product.sleeveType}</p>
                        </div>
                      )}
                      {product.neckType && (
                        <div>
                          <span className="text-[#5C635E]">Neckline:</span>
                          <p className="font-semibold text-[#171A18] mt-0.5">{product.neckType}</p>
                        </div>
                      )}
                      {product.length && (
                        <div>
                          <span className="text-[#5C635E]">Garment Length:</span>
                          <p className="font-semibold text-[#171A18] mt-0.5">{product.length}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Wash Care */}
              <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-2xs">
                <button
                  type="button"
                  onClick={() => setActiveAccordion(activeAccordion === "care" ? "" : "care")}
                  className="w-full p-4 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#064E3B] cursor-pointer"
                >
                  <span>Wash & Care Instructions</span>
                  <span>{activeAccordion === "care" ? "−" : "+"}</span>
                </button>
                {activeAccordion === "care" && (
                  <div className="px-4 pb-4 text-xs text-[#5C635E] border-t border-[#E8E2D5]/50 pt-3">
                    <p>{product.care || "Gentle machine wash with cold water. Avoid harsh bleach. Dry in shade for long-lasting color brilliance."}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Related Products Section */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-[#E8E2D5] pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-[1.5px] bg-[#C9A227]" />
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
                    Matching Coutures
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#064E3B]">
                  You May Also Like
                </h2>
              </div>
              <Link
                to={`/category/${encodeURIComponent(categorySlug)}`}
                className="text-xs font-bold uppercase tracking-wider text-[#064E3B] hover:text-[#C9A227] transition-colors"
              >
                View Full Category →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* 4. Recently Viewed Section */}
        <RecentlyViewedSection products={recentProducts} />
      </div>

      {/* 5. Mobile Sticky Bottom Action Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFFFF] border-t border-[#E8E2D5] p-3.5 shadow-2xl flex items-center gap-3">
        <div>
          <span className="text-[10px] text-[#5C635E] uppercase block font-medium">
            Total ({quantity} {quantity > 1 ? "pcs" : "pc"})
          </span>
          <span className="font-display text-base font-bold text-[#064E3B]">
            ₹{(effectivePrice * quantity).toLocaleString("en-IN")}
          </span>
        </div>
        <div className="flex-1 flex gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isSizeOutOfStock}
            className="flex-1 rounded-xl bg-[#064E3B] py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#FAF8F1] shadow-md hover:bg-[#0B3D2E] disabled:opacity-50 cursor-pointer"
          >
            {isSizeOutOfStock ? "Sold Out" : "Add to Bag"}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            disabled={isSizeOutOfStock}
            className="flex-1 rounded-xl bg-[#C9A227] py-3 text-xs font-bold uppercase tracking-[0.14em] text-[#171A18] shadow-md hover:bg-[#DFC15E] disabled:opacity-50 cursor-pointer"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}
