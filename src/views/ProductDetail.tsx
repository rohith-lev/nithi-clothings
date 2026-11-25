import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useStoreProduct, useStoreProducts, useStoreCategories } from "../services/storefront";
import { useCart } from "../store/cart";
import ProductCard from "../components/ProductCard";
import ImageZoomViewer from "../components/ImageZoomViewer";
import RecentlyViewedSection from "../components/RecentlyViewedSection";
import SEO from "../components/SEO";
import { addRecentlyViewed, useRecentlyViewed } from "../utils/recentlyViewed";

const FALLBACK_DETAIL_IMG = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&fit=crop";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { product, loading } = useStoreProduct(id);
  const allProducts = useStoreProducts();
  const categories = useStoreCategories();
  const { state, dispatch } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedTypeIdx, setSelectedTypeIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string>("description");
  const [addedToast, setAddedToast] = useState(false);
  const [wishlistAnimate, setWishlistAnimate] = useState(false);

  const activeType = product?.productTypes && product.productTypes.length > 0
    ? product.productTypes[selectedTypeIdx] || product.productTypes[0]
    : null;

  // Sync initial selections when product loads
  useEffect(() => {
    if (product) {
      setSelectedTypeIdx(0);

      // Determine initial selected size strictly from the product's configured sizes
      const configuredSizes: string[] = [];
      if (product.sizeOptions && product.sizeOptions.length > 0) {
        configuredSizes.push(...product.sizeOptions.map((o) => o.size).filter(Boolean));
      } else if (product.sizes && product.sizes.length > 0) {
        configuredSizes.push(...product.sizes.filter(Boolean));
      }

      if (configuredSizes.length > 0) {
        // Prefer first in-stock size if available, otherwise first size
        const inStockOption = product.sizeOptions?.find((o) => (Number(o.stock) || 0) > 0);
        setSelectedSize(inStockOption?.size || configuredSizes[0]);
      } else {
        setSelectedSize("Free Size");
      }

      setSelectedImage(0);
      setQuantity(1);
      setPincodeMsg(null);
      addRecentlyViewed(product.id);
    }
  }, [product?.id]);

  // Computed available sizes for display - STRICTLY displays the sizes configured by the admin!
  // Prevents phantom sizes (like unconfigured 2XL) from appearing or being purchased.
  const availableDisplaySizes = useMemo(() => {
    if (!product) return [];

    let rawList: { size: string; price: number; mrp?: number; stock: number; sku?: string }[] = [];
    if (product.sizeOptions && product.sizeOptions.length > 0) {
      rawList = product.sizeOptions.map((opt) => ({
        size: opt.size,
        price: opt.price || product.finalPrice || product.price,
        mrp: opt.mrp || product.mrp,
        stock: Number(opt.stock) || 0,
        sku: opt.sku,
      }));
    } else if (product.sizes && product.sizes.length > 0) {
      const perSizeStock = Math.max(1, Math.floor((product.stock || 10) / product.sizes.length));
      rawList = product.sizes.map((sz) => ({
        size: sz,
        price: product.finalPrice || product.price,
        mrp: product.mrp,
        stock: perSizeStock,
      }));
    } else {
      rawList = [
        {
          size: "Free Size",
          price: product.finalPrice || product.price,
          mrp: product.mrp,
          stock: product.stock ?? 10,
        },
      ];
    }

    return rawList;
  }, [product]);

  const recentProducts = useRecentlyViewed(allProducts, product?.id);

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

  const activeSizeOption = product?.sizeOptions?.find(
    (s) => s.size && s.size.toLowerCase() === selectedSize.toLowerCase()
  );

  // Price resolution: type price > size price > product price
  const rawTypePrice = activeType ? Number(activeType.price) || 0 : 0;
  const rawSizePrice = activeSizeOption ? Number(activeSizeOption.price) : Number(product?.price || 0);
  const basePrice = rawTypePrice > 0 ? rawTypePrice : rawSizePrice;
  const rawMrp =
    (activeType?.mrp ? Number(activeType.mrp) : 0) ||
    (activeSizeOption?.mrp ? Number(activeSizeOption.mrp) : 0) ||
    Number(product?.mrp || product?.price || basePrice);

  const effectivePrice = basePrice;
  const mrp = Math.max(rawMrp, effectivePrice);
  const discountPercent = mrp > effectivePrice ? Math.round(((mrp - effectivePrice) / mrp) * 100) : 0;
  const savingsAmount = mrp > effectivePrice ? (mrp - effectivePrice) * quantity : 0;

  // Stock resolution: type stock > size stock > product stock
  const sizeStock = activeSizeOption ? Number(activeSizeOption.stock) : 0;
  const typeStock = activeType ? Number(activeType.stock ?? 0) : -1;
  const stock =
    typeStock >= 0
      ? typeStock
      : sizeStock > 0
        ? sizeStock
        : Number(product?.stock ?? 0);
  const productOutOfStock = product && product.status === "OUT OF STOCK";
  const selectionOutOfStock = productOutOfStock || stock <= 0;
  const isWishlisted = product ? state.wishlist.includes(product.id) : false;

  // Build clean gallery images; when a type has its own image, surface it first
  const cleanGallery = useMemo(() => {
    if (!product) return [FALLBACK_DETAIL_IMG];
    const raw = [
      activeType?.image || "",
      product.coverImage || "",
      ...((activeType?.image ? [] : product.images) || []),
      ...((!activeType?.image ? [] : product.images) || []),
    ];
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
  }, [product, activeType]);

  const safeSelectedImage = selectedImage >= 0 && selectedImage < cleanGallery.length ? selectedImage : 0;
  const primaryImage = cleanGallery[safeSelectedImage] || cleanGallery[0] || FALLBACK_DETAIL_IMG;

  const buildCartItem = () => {
    if (!product) return null;
    return {
      product: {
        ...product,
        price: effectivePrice,
        mrp,
      },
      quantity: Math.max(1, quantity),
      selectedColor: "Standard",
      selectedType: activeType?.name || "",
      selectedSize: selectedSize || "Free Size",
      unitPrice: effectivePrice,
      mrp,
      colorImage: primaryImage,
      stock: stock > 0 ? stock : 1,
    };
  };

  const is350Offer =
    effectivePrice === 350 ||
    product?.price === 350 ||
    Boolean(product?.name && product.name.includes("350"));

  const handleAddToCart = () => {
    const payload = buildCartItem();
    if (!payload || selectionOutOfStock) return;
    dispatch({ type: "ADD_TO_CART", payload: payload as any });
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2400);
  };

  const handleBuyNow = () => {
    const payload = buildCartItem();
    if (!payload || selectionOutOfStock) return;
    dispatch({ type: "ADD_TO_CART", payload: payload as any });
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
      setPincodeMsg({
        type: "success",
        text: isTN
          ? "✓ Express Delivery in 2–3 business days. Cash on Delivery Available."
          : "✓ Standard Pan-India Delivery in 4–6 business days. COD Available.",
      });
    } else {
      setPincodeMsg({ type: "error", text: "Please enter a valid 6-digit Indian delivery pincode." });
    }
  };

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

  // Display only non-empty specifications
  const specs = useMemo(() => {
    if (!product) return [];
    const list: { label: string; value: string }[] = [];
    const sDesc = (product.shortDescription || "").trim();
    if (sDesc) list.push({ label: "Short Headline", value: sDesc });
    const fab = (product.fabric || "").trim();
    if (fab) list.push({ label: "Fabric", value: fab });
    const slv = (product.sleeveType || "").trim();
    if (slv) list.push({ label: "Sleeve Type", value: slv });
    const len = (((product as any).productLength || product.length) || "").trim();
    if (len) list.push({ label: "Product Length", value: len });
    const cr = (product.care || "").trim();
    if (cr) list.push({ label: "Wash Care", value: cr });
    return list;
  }, [product]);

  if (loading && !product) {
    return (
      <div className="bg-[#FAF8F1] min-h-screen py-10 font-body">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 w-52 bg-[#E8E2D5] rounded-full mb-8 animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-7 space-y-4">
              <div className="aspect-[4/5] bg-[#E8E2D5] rounded-3xl animate-pulse" />
            </div>
            <div className="lg:col-span-5 space-y-6">
              <div className="h-10 w-3/4 bg-[#E8E2D5] rounded-2xl animate-pulse" />
              <div className="h-8 w-40 bg-[#E8E2D5] rounded-xl animate-pulse" />
              <div className="h-28 bg-[#E8E2D5] rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center font-body bg-[#FAF8F1] px-4">
        <div className="max-w-md w-full text-center bg-[#FFFFFF] p-8 sm:p-10 rounded-3xl border border-[#E8E2D5] shadow-sm">
          <h2 className="font-display text-2xl font-bold text-[#064E3B] mb-2">Product Not Found</h2>
          <p className="text-xs sm:text-sm text-[#5C635E] mb-6 leading-relaxed">
            The requested product may have been moved or is currently unavailable.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#064E3B] px-7 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-[#FAF8F1] hover:bg-[#0B3D2E] transition-all shadow-md"
          >
            <span>Explore All Products</span>
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
        description: product.description || `Shop ${product.name} at Nithi Collections.`,
        sku: product.sku || product.code || product.id,
        brand: { "@type": "Brand", name: product.brand || "Nithi Collections" },
        offers: {
          "@type": "Offer",
          url: `https://nithiclothings.com/product/${product.id}`,
          priceCurrency: "INR",
          price: effectivePrice,
          availability: selectionOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          seller: { "@type": "Organization", name: "Nithi Collections" },
        },
      },
    ],
  };

  return (
    <div className="font-body bg-[#FAF8F1] text-[#171A18] min-h-screen pb-16">
      <SEO
        title={`${product.name} | Nithi Collections`}
        description={product.shortDescription || product.description || `Buy ${product.name} online at Nithi Collections.`}
        canonical={`/product/${product.id}`}
        ogImage={primaryImage}
        ogType="product"
        structuredData={productSchema}
      />

      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center gap-2 rounded-xl bg-[#064E3B]/95 text-[#FAF8F1] px-3.5 py-2 text-xs font-semibold shadow-xl border border-[#C9A227]/40 pointer-events-none backdrop-blur-sm">
          <span className="w-4 h-4 rounded-full bg-[#C9A227] text-[#064E3B] flex items-center justify-center font-bold text-[10px]">✓</span>
          <span>Added to Bag ({selectedSize || "Standard"})</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Breadcrumbs */}
        <nav className="text-xs text-[#5C635E] mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Link to="/" className="hover:text-[#064E3B]">Home</Link>
          <span className="text-[#C9A227]">/</span>
          <Link to="/shop" className="hover:text-[#064E3B]">Shop</Link>
          <span className="text-[#C9A227]">/</span>
          <Link to={`/category/${encodeURIComponent(categorySlug)}`} className="hover:text-[#064E3B] capitalize">{categoryName}</Link>
          <span className="text-[#C9A227]">/</span>
          <span className="text-[#171A18] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Gallery */}
          <div className="lg:col-span-7">
            <ImageZoomViewer
              images={cleanGallery}
              selectedIndex={safeSelectedImage}
              onSelectIndex={setSelectedImage}
              alt={product.name}
            />
          </div>

          {/* Info column */}
          <div className="lg:col-span-5 space-y-5">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C9A227]">
                {categoryName}{product.subcategory ? ` • ${product.subcategory}` : ""}
              </span>
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`flex h-10 w-10 items-center justify-center rounded-full border border-[#E8E2D5] bg-[#FFFFFF] transition-all hover:scale-110 shadow-2xs cursor-pointer ${wishlistAnimate ? "animate-heart-pop" : ""} ${isWishlisted ? "text-rose-600 border-rose-200 bg-rose-50" : "text-[#171A18] hover:text-rose-600"}`}
                aria-label="Wishlist"
              >
                <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Short headline above name */}
            {(product.shortDescription || "").trim() && (
              <p className="font-nav text-xs font-medium uppercase tracking-[0.16em] text-[#5C635E]">
                {product.shortDescription}
              </p>
            )}

            <h1 className="font-product text-2xl sm:text-3xl lg:text-4xl font-medium text-[#064E3B] leading-[1.18] tracking-[-0.015em]">
              {product.name}
            </h1>

            {/* Price card */}
            <div className="bg-[#FFFFFF] p-4 sm:p-5 rounded-2xl border border-[#E8E2D5] shadow-xs space-y-2">
              <div className="flex flex-wrap items-baseline gap-3">
                <span className="font-price text-3xl sm:text-4xl font-bold text-[#064E3B] tracking-[-0.02em]">
                  ₹{(effectivePrice * quantity).toLocaleString("en-IN")}
                </span>
                {mrp > effectivePrice && (
                  <span className="font-price text-base text-[#5C635E] line-through font-normal">₹{(mrp * quantity).toLocaleString("en-IN")}</span>
                )}
              </div>
              <div className="flex items-center justify-between font-sans text-xs pt-1 text-[#5C635E] border-t border-[#E8E2D5]/50">
                <span>Inclusive of all taxes</span>
                {savingsAmount > 0 && (
                  <span className="font-semibold text-emerald-700">You save ₹{savingsAmount.toLocaleString("en-IN")}</span>
                )}
              </div>
            </div>

            {/* Stock availability */}
            <div>
              {selectionOutOfStock ? (
                <div className="inline-flex items-center gap-2 rounded-2xl bg-rose-50 border border-rose-200 px-4 py-2 text-xs font-bold text-rose-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                  <span>Out of Stock{selectedSize ? ` — Size ${selectedSize}` : ""}</span>
                </div>
              ) : stock <= 5 ? (
                <div className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 border border-amber-300 px-4 py-2 text-xs font-bold text-amber-900">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-ping" />
                  <span>⚡ Only {stock} left{selectedSize ? ` in Size ${selectedSize}` : ""}!</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-xs font-semibold text-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>In Stock ({stock} available)</span>
                </div>
              )}
            </div>

            {/* Product Type Selection */}
            {product.productTypes && product.productTypes.length > 0 && (
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#171A18] block">
                  Select Product Type:{" "}
                  <span className="text-[#064E3B]">{activeType?.name}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.productTypes
                    .filter((t) => t.active !== false)
                    .map((t, idx) => {
                      const realIdx = product.productTypes!.indexOf(t);
                      const isSel = selectedTypeIdx === realIdx;
                      const out = Number(t.stock ?? 0) <= 0;
                      const tPrice = Number(t.price) || effectivePrice;
                      return (
                        <button
                          key={t.id || t.name}
                          type="button"
                          disabled={out}
                          onClick={() => { setSelectedTypeIdx(realIdx); setSelectedImage(0); setQuantity(1); }}
                          className={`rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all shadow-2xs cursor-pointer ${isSel
                            ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] ring-2 ring-[#C9A227]/50 scale-[1.03]"
                            : out
                              ? "border-stone-200 bg-stone-100 text-stone-400 opacity-60 cursor-not-allowed"
                              : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#C9A227]"
                            }`}
                        >
                          <span className="block">{t.name}</span>
                          <span className={`block text-[10px] mt-0.5 ${isSel ? "text-[#DFC15E]" : out ? "text-rose-500" : "text-[#5C635E]"}`}>
                            {out ? "Out of Stock" : `₹${tPrice.toLocaleString("en-IN")}${Number(t.stock ?? 0) <= 5 ? ` • Only ${t.stock} left` : ""}`}
                          </span>
                        </button>
                      );
                    })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-[#171A18] flex items-center gap-2">
                  <span>Select Size:</span>
                  <span className="text-[#064E3B] font-bold px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200">{selectedSize}</span>
                </label>
                {product.sizeChart && <span className="text-xs text-[#064E3B] underline cursor-pointer hover:text-[#C9A227] font-semibold">Size Guide</span>}
              </div>

              <div className="flex flex-wrap gap-2.5">
                {availableDisplaySizes.map((szOpt) => {
                  const szName = szOpt.size;
                  const isSelected =
                    selectedSize.toLowerCase() === szName.toLowerCase() ||
                    (selectedSize.toLowerCase() === "xxl" && szName.toLowerCase() === "2xl") ||
                    (selectedSize.toLowerCase() === "2xl" && szName.toLowerCase() === "xxl") ||
                    (selectedSize.toLowerCase() === "xxxl" && szName.toLowerCase() === "3xl") ||
                    (selectedSize.toLowerCase() === "3xl" && szName.toLowerCase() === "xxxl");
                  const remaining = Number(szOpt.stock) ?? 0;
                  const isSoldOut = remaining <= 0;
                  return (
                    <button
                      key={szName}
                      type="button"
                      onClick={() => !isSoldOut && setSelectedSize(szName)}
                      disabled={isSoldOut}
                      className={`flex min-w-[76px] flex-col items-center rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all shadow-2xs cursor-pointer ${isSelected
                        ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] ring-2 ring-[#C9A227]/50 scale-105 shadow-md"
                        : isSoldOut
                          ? "border-stone-200 bg-stone-100 text-stone-400 opacity-60 cursor-not-allowed"
                          : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#C9A227] hover:bg-stone-50"
                        }`}
                    >
                      <span className="font-display text-sm font-bold">{szName}{isSelected && <span className="text-[10px] text-[#DFC15E]"> ✓</span>}</span>
                      <span className={`text-[10px] mt-0.5 ${isSoldOut ? "text-rose-500" : isSelected ? "text-[#FAF8F1]/80" : "text-emerald-700"}`}>
                        {isSoldOut ? "Out of Stock" : "In Stock"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity + subtotal */}
          <div className="flex items-center justify-between p-4 bg-[#FFFFFF] rounded-2xl border border-[#E8E2D5] shadow-2xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-[#E8E2D5] rounded-xl bg-[#FAF8F1] overflow-hidden">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-3.5 py-1.5 text-sm font-bold hover:bg-[#E8E2D5] cursor-pointer">−</button>
                <span className="px-4 py-1.5 text-sm font-bold border-x border-[#E8E2D5]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(stock > 0 ? stock : 10, quantity + 1))}
                  disabled={selectionOutOfStock || quantity >= stock}
                  className="px-3.5 py-1.5 text-sm font-bold hover:bg-[#E8E2D5] disabled:opacity-30 cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-[#5C635E] block tracking-wider">Subtotal</span>
              <span className="font-price font-bold text-base text-[#064E3B]">₹{(effectivePrice * quantity).toLocaleString("en-IN")}</span>
            </div>
          </div>

          {/* Add to cart / Buy now (Omitted for ₹350 offer) */}
          {is350Offer ? (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-center space-y-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                ✦ Special Catalog Promotion
              </span>
              <p className="text-xs text-amber-900">
                This exclusive ₹350 collection item is featured for catalog showroom browsing.
              </p>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-xl bg-[#064E3B] text-white font-button text-xs font-semibold hover:bg-[#0B3D2E] transition-colors shadow-xs"
              >
                <span>Explore Available Collections</span>
                <span>→</span>
              </Link>
            </div>
          ) : (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={selectionOutOfStock}
                className={`flex-1 rounded-xl py-3.5 px-4 font-button text-xs sm:text-sm font-semibold tracking-[0.02em] shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  selectionOutOfStock
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "border-2 border-[#064E3B] text-[#064E3B] bg-white hover:bg-emerald-50 active:scale-[0.99]"
                }`}
              >
                {selectionOutOfStock ? "Out of Stock" : "Add to Bag"}
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={selectionOutOfStock}
                className={`flex-1 rounded-xl py-3.5 px-4 font-button text-xs sm:text-sm font-semibold tracking-[0.02em] transition-all shadow-sm cursor-pointer ${
                  selectionOutOfStock
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                    : "bg-[#064E3B] hover:bg-[#0B3D2E] text-white active:scale-[0.99]"
                }`}
              >
                Buy Now
              </button>
            </div>
          )}

                  {/* Customer Reassurance Guarantees */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8E2D5] text-[11px] font-semibold text-stone-700 shadow-2xs">
                      <span className="text-base">🚚</span>
                      <span>Free Delivery Above ₹999</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8E2D5] text-[11px] font-semibold text-stone-700 shadow-2xs">
                      <span className="text-base">💵</span>
                      <span>Cash on Delivery</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8E2D5] text-[11px] font-semibold text-stone-700 shadow-2xs">
                      <span className="text-base">🔄</span>
                      <span>Easy 7-Day Exchange</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8E2D5] text-[11px] font-semibold text-stone-700 shadow-2xs">
                      <span className="text-base">🌿</span>
                      <span>100% Breathable Fabric</span>
                    </div>
                  </div>

                  {/* Accordions: description (only when non-empty), specifications, shipping, refund */}
                  <div className="border-t border-[#E8E2D5] pt-4 space-y-3">
                    {(product.description || "").trim().length > 0 && (
                      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setActiveAccordion(activeAccordion === "description" ? "" : "description")}
                          className="w-full p-4 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#064E3B] cursor-pointer"
                        >
                          <span>Full Product Description</span>
                          <span>{activeAccordion === "description" ? "−" : "+"}</span>
                        </button>
                        {activeAccordion === "description" && (
                          <div className="px-4 pb-4 text-xs text-[#5C635E] leading-relaxed border-t border-[#E8E2D5]/50 pt-3">
                            <p className="whitespace-pre-line">{product.description}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Specifications (only non-empty fields shown) */}
                    {specs.length > 0 && (
                      <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => setActiveAccordion(activeAccordion === "specs" ? "" : "specs")}
                          className="w-full p-4 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#064E3B] cursor-pointer"
                        >
                          <span>Product Specifications</span>
                          <span>{activeAccordion === "specs" ? "−" : "+"}</span>
                        </button>
                        {activeAccordion === "specs" && (
                          <div className="border-t border-[#E8E2D5]/50">
                            <table className="w-full text-xs">
                              <tbody className="divide-y divide-[#E8E2D5]/60">
                                {specs.map((sp) => (
                                  <tr key={sp.label}>
                                    <td className="px-4 py-2.5 font-bold text-[#171A18] w-40">{sp.label}</td>
                                    <td className="px-4 py-2.5 text-[#5C635E]">{sp.value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setActiveAccordion(activeAccordion === "shipping" ? "" : "shipping")}
                        className="w-full p-4 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#064E3B] cursor-pointer"
                      >
                        <span>Shipping Information</span>
                        <span>{activeAccordion === "shipping" ? "−" : "+"}</span>
                      </button>
                      {activeAccordion === "shipping" && (
                        <div className="px-4 pb-4 pt-3 text-xs text-[#5C635E] leading-relaxed border-t border-[#E8E2D5]/50 space-y-1.5">
                          <p>• Dispatch within 24–48 hours of confirmed payment.</p>
                          <p>• Tamil Nadu: 2–3 business days. Rest of India: 4–6 business days.</p>
                          <p>• Free shipping on qualifying orders; COD available across India.</p>
                          <Link to="/shipping-policy" className="inline-block mt-1 font-bold text-[#064E3B] underline">Read full Shipping Information →</Link>
                        </div>
                      )}
                    </div>

                    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E8E2D5] overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setActiveAccordion(activeAccordion === "refund" ? "" : "refund")}
                        className="w-full p-4 text-left flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#064E3B] cursor-pointer"
                      >
                        <span>Refund & Return Information</span>
                        <span>{activeAccordion === "refund" ? "−" : "+"}</span>
                      </button>
                      {activeAccordion === "refund" && (
                        <div className="px-4 pb-4 pt-3 text-xs text-[#5C635E] leading-relaxed border-t border-[#E8E2D5]/50 space-y-1.5">
                          <p>• 7-day easy exchange on unused products with original packaging.</p>
                          <p>• Refunds issued to the original payment method within 5–7 business days of quality check.</p>
                          <Link to="/refund-policy" className="inline-block mt-1 font-bold text-[#064E3B] underline">Read full Refund & Return Policy →</Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Related products */}
              {relatedProducts.length > 0 && (
                <div className="mt-16">
                  <h2 className="font-display text-xl font-bold text-[#064E3B] mb-5">You May Also Like</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                </div>
              )}

              <RecentlyViewedSection products={recentProducts} />

              {/* Mobile Sticky Action Bar */}
              <div className="lg:hidden fixed bottom-14 inset-x-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-2xl px-3 py-2.5 flex items-center justify-between gap-2.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-display font-bold text-sm sm:text-base text-[#064E3B]">
                      ₹{(effectivePrice * quantity).toLocaleString("en-IN")}
                    </span>
                    {mrp > effectivePrice && (
                      <span className="text-[10px] text-stone-400 line-through">
                        ₹{mrp.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-600 truncate">
                    {activeType?.name ? `${activeType.name} • ` : ""}{selectedSize} • Qty {quantity}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={selectionOutOfStock}
                    className="px-3 py-2 rounded-xl bg-[#064E3B] text-[#FAF8F1] text-[11px] font-bold uppercase tracking-wider disabled:opacity-50 active:scale-95 transition-transform cursor-pointer"
                  >
                    Add to Bag
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={selectionOutOfStock}
                    className="px-3.5 py-2 rounded-xl bg-[#C9A227] text-[#171A18] text-[11px] font-bold uppercase tracking-wider shadow-sm disabled:opacity-50 active:scale-95 transition-transform cursor-pointer"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          );
}
