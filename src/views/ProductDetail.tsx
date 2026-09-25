import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useStoreProduct, useStoreProducts } from "../services/storefront";
import { useCart } from "../store/cart";
import ProductCard from "../components/ProductCard";
import ImageZoomViewer from "../components/ImageZoomViewer";
import RecentlyViewedSection from "../components/RecentlyViewedSection";
import { addRecentlyViewed, useRecentlyViewed } from "../utils/recentlyViewed";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = useStoreProduct(id);
  const allProducts = useStoreProducts();
  const { state, dispatch } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState("");
  const [pincodeMsg, setPincodeMsg] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [addedToCart, setAddedToCart] = useState(false);
  const [wishlistAnimate, setWishlistAnimate] = useState(false);

  // Sync initial color and size when product loads & save to recently viewed
  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      } else if (product.color) {
        setSelectedColor(product.color);
      } else {
        setSelectedColor("Standard");
      }

      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      } else {
        setSelectedSize("Free Size");
      }
      setSelectedImage(0);
      setQuantity(1);

      // Track in recently viewed
      addRecentlyViewed(product.id);
    }
  }, [product?.id]);

  const recentProducts = useRecentlyViewed(allProducts, product?.id);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-body bg-[#FAF8F1]">
        <div className="text-center p-8">
          <p className="font-display text-2xl text-[#064E3B] mb-3">Product not found</p>
          <p className="text-sm text-[#5C635E] mb-6">The requested garment may no longer be available.</p>
          <Link
            to="/shop"
            className="rounded-xl bg-[#064E3B] px-6 py-3 text-xs font-bold uppercase tracking-wider text-[#FAF8F1] hover:bg-[#0B3D2E] transition-colors shadow-sm"
          >
            Return to Shop
          </Link>
        </div>
      </div>
    );
  }

  // Active size option & dynamic calculations
  const activeSizeOption = product?.sizeOptions?.find(
    (s) => s.size && s.size.toLowerCase() === selectedSize.toLowerCase()
  );

  const rawSizePrice = activeSizeOption ? Number(activeSizeOption.price) : Number(product?.price || 0);
  const rawSizeMrp = activeSizeOption?.mrp ? Number(activeSizeOption.mrp) : Number(product?.mrp || product?.price || rawSizePrice);

  const effectivePrice = product
    ? product.discountType === "fixed"
      ? Math.max(0, rawSizePrice - (Number(product.discount) || 0))
      : (product.discount || 0) > 0
      ? Math.max(0, Math.round(rawSizePrice * (1 - (Number(product.discount) || 0) / 100)))
      : rawSizePrice
    : 0;

  const mrp = Math.max(rawSizeMrp, effectivePrice);
  const sizeStock = activeSizeOption ? Number(activeSizeOption.stock) : Number(product?.stock || 0);
  const isSizeOutOfStock = sizeStock <= 0 || (product && !product.inStock);
  const isWishlisted = product ? state.wishlist.includes(product.id) : false;

  // Build complete gallery images including color mapped photos
  const colorMap = product?.colorImages || {};
  const colorOptions = product?.colorOptions || [];
  
  const colorImagesList = [
    ...(colorOptions.map((c) => c.image).filter(Boolean)),
    ...Object.values(colorMap).filter(Boolean),
  ];

  const galleryImages = Array.from(
    new Set(
      [
        product?.coverImage,
        ...(product?.images || []),
        ...colorImagesList,
      ].filter(Boolean) as string[]
    )
  );

  // Mapped image for current active color
  const activeColorOption = colorOptions.find(
    (c) => c.name && c.name.toLowerCase() === selectedColor.toLowerCase()
  );
  const activeColorImage =
    activeColorOption?.image ||
    (selectedColor && colorMap[selectedColor]) ||
    product?.coverImage ||
    galleryImages[0] ||
    "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800";

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    // Find image assigned to this color
    const targetOpt = colorOptions.find(
      (c) => c.name && c.name.toLowerCase() === color.toLowerCase()
    );
    const targetUrl = targetOpt?.image || colorMap[color];

    if (targetUrl) {
      const matchIdx = galleryImages.indexOf(targetUrl);
      if (matchIdx >= 0) {
        setSelectedImage(matchIdx);
      } else {
        // If not in gallery yet, prepend or navigate
        setSelectedImage(0);
      }
    }
  };

  const handleAddToCart = () => {
    if (!product || isSizeOutOfStock) return;
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product: {
          ...product,
          price: effectivePrice,
          mrp,
        },
        quantity,
        selectedColor: selectedColor || "Standard",
        selectedSize: selectedSize || "Free Size",
        unitPrice: effectivePrice,
        mrp,
        colorImage: activeColorImage,
        stock: sizeStock,
      },
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  const handleBuyNow = () => {
    if (!product || isSizeOutOfStock) return;
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        product: {
          ...product,
          price: effectivePrice,
          mrp,
        },
        quantity,
        selectedColor: selectedColor || "Standard",
        selectedSize: selectedSize || "Free Size",
        unitPrice: effectivePrice,
        mrp,
        colorImage: activeColorImage,
        stock: sizeStock,
      },
    });
    navigate("/checkout");
  };

  const handleToggleWishlist = () => {
    setWishlistAnimate(true);
    setTimeout(() => setWishlistAnimate(false), 500);
    dispatch({ type: "TOGGLE_WISHLIST", payload: product.id });
  };

  const checkPincode = () => {
    if (pincode.length === 6) {
      const tnPincodes = ["6", "63", "64", "60", "61", "62"];
      const isTN = tnPincodes.some((p) => pincode.startsWith(p));
      if (isTN) {
        setPincodeMsg("✓ Express Delivery in 2–4 business days. Cash on Delivery available.");
      } else {
        setPincodeMsg("✓ Standard Delivery in 4–6 business days. Express COD available.");
      }
    } else {
      setPincodeMsg("Please enter a valid 6-digit Indian pincode.");
    }
  };

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id && (p.status === "ACTIVE" || !p.status))
    .slice(0, 4);

  return (
    <div className="font-body bg-[#FAF8F1] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="text-xs text-[#5C635E] mb-6 flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="hover:text-[#064E3B]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#064E3B]">Shop</Link>
          <span>/</span>
          <Link to={`/shop?category=${product.category}`} className="capitalize hover:text-[#064E3B]">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-[#171A18] font-semibold truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Product View Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-start">
          {/* Left: Premium Image Zoom Viewer */}
          <div>
            <ImageZoomViewer
              images={galleryImages.length > 0 ? galleryImages : ["https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800"]}
              selectedIndex={selectedImage}
              onSelectIndex={setSelectedImage}
              alt={product.name}
            />
          </div>

          {/* Right: Product Details & Buying Actions */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#C9A227]">
                  {product.category}
                </span>
                <span className="text-xs font-mono text-[#5C635E]">
                  SKU: {product.sku || product.code}
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#064E3B] mt-1 leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Price & Badges (Dynamically multiplied by quantity) */}
            <div className="flex flex-wrap items-baseline gap-3 pb-3 border-b border-[#E8E2D5]">
              <span className="font-display text-3xl font-bold text-[#064E3B]">
                ₹{(effectivePrice * quantity).toLocaleString("en-IN")}
              </span>
              {mrp > effectivePrice && (
                <span className="text-base text-[#5C635E] line-through">
                  ₹{(mrp * quantity).toLocaleString("en-IN")}
                </span>
              )}
              {product.discount > 0 && (
                <span className="rounded-full bg-[#C9A227]/15 px-3 py-0.5 text-xs font-bold text-[#A8811A]">
                  {product.discount}% OFF (Save ₹{((mrp - effectivePrice) * quantity).toLocaleString("en-IN")})
                </span>
              )}
              {quantity > 1 && (
                <span className="text-xs font-semibold text-[#5C635E] bg-[#FAF8F1] border border-[#E8E2D5] px-2.5 py-1 rounded-lg">
                  ₹{effectivePrice.toLocaleString("en-IN")} / pc × {quantity}
                </span>
              )}
            </div>

            {/* Live Size-Specific Stock Indicator */}
            <div>
              {isSizeOutOfStock ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  Out of Stock for Size {selectedSize}
                </span>
              ) : sizeStock <= 5 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-800">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                  ⚡ Only {sizeStock} units left in Size {selectedSize}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  ✓ In Stock & Ready to Dispatch (Size {selectedSize}: {sizeStock} available)
                </span>
              )}
            </div>

            {/* Color Selector with Swatches & Instant Image Switch */}
            {((product.colors && product.colors.length > 0) || (product.colorOptions && product.colorOptions.length > 0)) && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#171A18] mb-2.5">
                  Select Color: <span className="text-[#064E3B] font-extrabold">{selectedColor}</span>
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {(product.colorOptions && product.colorOptions.length > 0
                    ? product.colorOptions.map((co) => ({ name: co.name, hex: co.hex, image: co.image }))
                    : (product.colors || []).map((c) => ({
                        name: c,
                        hex: '#064E3B',
                        image: product.colorImages ? product.colorImages[c] : undefined
                      }))
                  ).map((c) => {
                    const isSelected = selectedColor.toLowerCase() === c.name.toLowerCase();
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => handleColorSelect(c.name)}
                        className={`group flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 shadow-2xs ${
                          isSelected
                            ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] ring-2 ring-[#064E3B]/20"
                            : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#C9A227] hover:bg-[#FAF8F1]"
                        }`}
                      >
                        {c.image ? (
                          <img
                            src={c.image}
                            alt={c.name}
                            className="w-5 h-5 rounded-full object-cover border border-white/40 shadow-xs"
                          />
                        ) : (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-stone-300 inline-block shrink-0"
                            style={{ backgroundColor: c.hex || "#064E3B" }}
                          />
                        )}
                        <span>{c.name}</span>
                        {isSelected && <span className="text-[10px]">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selector with Live Updates & Size Prices */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#171A18]">
                  Select Size: <span className="text-[#064E3B] font-extrabold">{selectedSize}</span>
                </label>
                {product.sizeChart && (
                  <span className="text-xs text-[#064E3B] underline cursor-pointer hover:text-[#C9A227]">
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
                      stock: product.stock
                    }))
                ).map((szOpt) => {
                  const szName = szOpt.size;
                  const isSelected = selectedSize.toLowerCase() === szName.toLowerCase();
                  const isSoldOut = (Number(szOpt.stock) || 0) <= 0;
                  const szPrice = Number(szOpt.price) || product.price;

                  return (
                    <button
                      key={szName}
                      type="button"
                      onClick={() => setSelectedSize(szName)}
                      className={`relative flex flex-col items-center justify-center rounded-xl border px-4 py-2 text-xs font-bold transition-all duration-200 shadow-2xs ${
                        isSelected
                          ? "border-[#064E3B] bg-[#064E3B] text-[#FAF8F1] ring-2 ring-[#064E3B]/20"
                          : isSoldOut
                          ? "border-stone-200 bg-stone-100 text-stone-400 opacity-60 hover:border-stone-300"
                          : "border-[#E8E2D5] bg-[#FFFFFF] text-[#171A18] hover:border-[#C9A227] hover:bg-[#FAF8F1]"
                      }`}
                    >
                      <span className="flex items-center gap-1">
                        {szName}
                        {isSelected && <span className="text-[10px]">✓</span>}
                      </span>
                      {product.sizeOptions && product.sizeOptions.length > 1 && (
                        <span className={`text-[10px] font-normal ${isSelected ? "text-amber-200" : "text-stone-500"}`}>
                          ₹{szPrice}
                        </span>
                      )}
                      {isSoldOut && (
                        <span className="absolute -top-1.5 -right-1 bg-rose-600 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                          Sold Out
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity Selector with Subtotal Readout */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-stone-50/80 rounded-2xl border border-stone-200/60">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#171A18]">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#E8E2D5] rounded-xl bg-[#FFFFFF] overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 text-sm font-bold text-[#171A18] hover:bg-[#F3EFE3] transition"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 text-sm font-semibold border-x border-[#E8E2D5]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(sizeStock > 0 ? sizeStock : 10, quantity + 1))}
                    disabled={isSizeOutOfStock || quantity >= sizeStock}
                    className="px-3.5 py-1.5 text-sm font-bold text-[#171A18] hover:bg-[#F3EFE3] disabled:opacity-30 transition"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-[#5C635E]">
                  Max {sizeStock} per order
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
                  Item Subtotal
                </span>
                <span className="font-display font-bold text-base text-[#064E3B]">
                  ₹{(effectivePrice * quantity).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Main Action Buttons & Wishlist */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isSizeOutOfStock}
                  className={`flex-1 rounded-xl py-4 text-xs font-bold uppercase tracking-[0.2em] shadow-md transition-all ${
                    addedToCart
                      ? "bg-[#C9A227] text-[#171A18]"
                      : isSizeOutOfStock
                      ? "bg-stone-300 text-stone-500 cursor-not-allowed"
                      : "bg-[#064E3B] text-[#FAF8F1] hover:bg-[#0B3D2E]"
                  }`}
                >
                  {addedToCart
                    ? "✓ Added to Bag!"
                    : isSizeOutOfStock
                    ? "Out of Stock for Selected Size"
                    : `Add to Bag • ₹${(effectivePrice * quantity).toLocaleString("en-IN")}`}
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={isSizeOutOfStock}
                  className={`flex-1 rounded-xl py-4 text-xs font-bold uppercase tracking-[0.2em] transition-all shadow-md ${
                    isSizeOutOfStock
                      ? "bg-stone-200 text-stone-400 cursor-not-allowed"
                      : "bg-[#C9A227] text-[#171A18] hover:bg-[#E2C467]"
                  }`}
                >
                  Buy Now
                </button>

                <button
                  type="button"
                  onClick={handleToggleWishlist}
                  className={`flex h-12 w-12 items-center justify-center rounded-xl border border-[#E8E2D5] bg-[#FFFFFF] transition-all hover:scale-105 shadow-xs ${
                    wishlistAnimate ? "animate-heart-pop" : ""
                  } ${isWishlisted ? "text-rose-600 border-rose-300" : "text-[#171A18]"}`}
                  title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  aria-label="Wishlist"
                >
                  <svg className="w-5 h-5" fill={isWishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Pincode & Delivery Checker */}
            <div className="rounded-2xl border border-[#E8E2D5] bg-[#FFFFFF] p-4 sm:p-5 space-y-2 shadow-2xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#064E3B] block">
                Check Delivery & COD Availability
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                  placeholder="Enter 6-digit pincode"
                  className="flex-1 rounded-xl border border-[#E8E2D5] px-3.5 py-2 text-xs focus:border-[#064E3B] focus:outline-none bg-[#FAF8F1]"
                />
                <button
                  type="button"
                  onClick={checkPincode}
                  className="rounded-xl bg-[#064E3B] px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#FAF8F1] hover:bg-[#0B3D2E] shadow-xs"
                >
                  Check
                </button>
              </div>
              {pincodeMsg && (
                <p className="text-[11px] font-medium text-[#064E3B] pt-1">{pincodeMsg}</p>
              )}
            </div>

            {/* Highlights & Features */}
            <div className="border-t border-[#E8E2D5] pt-4 space-y-2 text-xs text-[#5C635E]">
              <div className="flex items-center gap-2">
                <span className="text-[#C9A227]">✦</span>
                <span>Fabric: <strong className="text-[#171A18]">{product.fabric || "100% Pure Combed Cotton"}</strong></span>
              </div>
              {product.care && (
                <div className="flex items-center gap-2">
                  <span className="text-[#C9A227]">✦</span>
                  <span>Wash Care: <strong className="text-[#171A18]">{product.care}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-[#C9A227]">✦</span>
                <span>Free express shipping on orders above ₹999</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 border-t border-[#E8E2D5] pt-8">
          <div className="flex gap-6 border-b border-[#E8E2D5] text-xs font-bold uppercase tracking-wider pb-3">
            <button
              type="button"
              onClick={() => setActiveTab("description")}
              className={`pb-3 -mb-3 transition-colors ${
                activeTab === "description"
                  ? "border-b-2 border-[#064E3B] text-[#064E3B]"
                  : "text-[#5C635E] hover:text-[#064E3B]"
              }`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("details")}
              className={`pb-3 -mb-3 transition-colors ${
                activeTab === "details"
                  ? "border-b-2 border-[#064E3B] text-[#064E3B]"
                  : "text-[#5C635E] hover:text-[#064E3B]"
              }`}
            >
              Fabric & Details
            </button>
          </div>

          <div className="py-6 text-sm text-[#5C635E] leading-relaxed max-w-3xl">
            {activeTab === "description" && (
              <div className="space-y-4">
                <p>{product.description}</p>
                {product.specialFeatures && (
                  <div className="bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8E2D5] shadow-2xs">
                    <h4 className="font-bold text-[#064E3B] text-xs uppercase tracking-wider mb-1">
                      Key Highlights:
                    </h4>
                    <p className="text-xs">{product.specialFeatures}</p>
                  </div>
                )}
              </div>
            )}
            {activeTab === "details" && (
              <div className="grid grid-cols-2 gap-4 text-xs bg-[#FFFFFF] p-5 rounded-2xl border border-[#E8E2D5] shadow-2xs">
                <div>
                  <span className="text-[#5C635E]">Fabric Material:</span>
                  <p className="font-semibold text-[#171A18] mt-0.5">{product.fabric || "Pure Cotton"}</p>
                </div>
                <div>
                  <span className="text-[#5C635E]">Pattern:</span>
                  <p className="font-semibold text-[#171A18] mt-0.5">{product.pattern || "Floral / Traditional"}</p>
                </div>
                <div>
                  <span className="text-[#5C635E]">Sleeve Type:</span>
                  <p className="font-semibold text-[#171A18] mt-0.5">{product.sleeveType || "Short Sleeve"}</p>
                </div>
                <div>
                  <span className="text-[#5C635E]">Neckline:</span>
                  <p className="font-semibold text-[#171A18] mt-0.5">{product.neckType || "Round Neck / Zip"}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* You May Also Like / Recommendations */}
        {relatedProducts.length > 0 && (
          <section className="mt-16 border-t border-[#E8E2D5] pt-12">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-[1px] bg-[#C9A227]" />
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#C9A227] font-semibold">
                    Complete Your Wardrobe
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#064E3B]">
                  You May Also Like
                </h2>
              </div>
              <Link
                to={`/shop?category=${product.category}`}
                className="text-xs font-bold uppercase tracking-wider text-[#064E3B] hover:text-[#C9A227] transition-colors"
              >
                View Category →
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed Strip */}
        <RecentlyViewedSection products={recentProducts} />
      </div>

      {/* Sticky Mobile Add to Cart Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-[#FFFFFF] border-t border-[#E8E2D5] p-3.5 shadow-xl flex items-center gap-3">
        <div>
          <span className="text-[10px] text-[#5C635E] uppercase block">
            Total ({quantity} {quantity > 1 ? "pcs" : "pc"})
          </span>
          <span className="font-display text-base font-bold text-[#064E3B]">
            ₹{(effectivePrice * quantity).toLocaleString("en-IN")}
          </span>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isSizeOutOfStock}
          className="flex-1 rounded-xl bg-[#064E3B] py-3 text-xs font-bold uppercase tracking-[0.16em] text-[#FAF8F1] shadow-md hover:bg-[#0B3D2E] disabled:opacity-50"
        >
          {isSizeOutOfStock ? "Out of Stock" : `Add to Bag • ₹${(effectivePrice * quantity).toLocaleString("en-IN")}`}
        </button>
      </div>
    </div>
  );
}
