import mongoose, { Schema } from "mongoose";

const variantSchema = new Schema(
  {
    id: { type: String, required: true },
    size: { type: String, default: "Free Size" },
    color: { type: String, default: "Standard" },
    sku: { type: String, default: "" },
    price: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    image: { type: String, default: "" },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { _id: false }
);

const sizeOptionSchema = new Schema(
  {
    size: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    mrp: { type: Number, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, default: "" },
  },
  { _id: false }
);

const colorOptionSchema = new Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, default: "#064E3B" },
    image: { type: String, default: "" },
  },
  { _id: false }
);

const productSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    category: { type: String, required: true },
    subcategory: { type: String, default: "" },
    brand: { type: String, default: "Nithi Collection" },
    price: { type: Number, required: true },
    mrp: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discountType: { type: String, enum: ["percentage", "fixed"], default: "percentage" },
    discountValue: { type: Number, default: 0 },
    finalPrice: { type: Number },
    sizes: { type: [String], default: [] },
    sizeOptions: { type: [sizeOptionSchema], default: [] },
    color: { type: String, default: "" },
    colors: { type: [String], default: [] },
    colorOptions: { type: [colorOptionSchema], default: [] },
    fabric: { type: String, default: "100% Pure Cotton" },
    material: { type: String, default: "Pure Cotton" },
    length: { type: String, default: "55 Inches" },
    pattern: { type: String, default: "Printed" },
    sleeveType: { type: String, default: "Half Sleeve" },
    neckType: { type: String, default: "Round Neck" },
    care: { type: String, default: "Machine wash cold with like colors." },
    sizeChart: { type: String, default: "Standard Regular Indian Sizing" },
    specialFeatures: { type: String, default: "" },
    stock: { type: Number, default: 0 },
    lowStockThreshold: { type: Number, default: 10 },
    reservedStock: { type: Number, default: 0 },
    soldQuantity: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["Active", "Inactive", "ACTIVE", "DRAFT", "OUT OF STOCK", "DISCONTINUED"],
      default: "ACTIVE",
    },
    variants: { type: [variantSchema], default: [] },
    images: { type: [String], default: [] },
    coverImage: { type: String, default: "" },
    colorImages: { type: Map, of: String, default: {} },
    sku: { type: String, default: "" },
    code: { type: String, default: "" },
    newArrival: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    seo: {
      title: { type: String, default: "" },
      metaDescription: { type: String, default: "" },
      urlSlug: { type: String, default: "" },
      focusKeyword: { type: String, default: "" },
      socialImage: { type: String, default: "" },
    },
    offers: {
      type: { type: String, default: "none" },
      discountValue: { type: Number, default: 0 },
      buyQty: { type: Number, default: 1 },
      getQty: { type: Number, default: 0 },
      minQtyForFreeShipping: { type: Number, default: 3 },
      tierQuantity: { type: Number, default: 5 },
      tierDiscountPerItem: { type: Number, default: 15 },
    },
    shippingOverride: {
      enabled: { type: Boolean, default: false },
      freeShippingMinQty: { type: Number, default: 3 },
      fixedCharge: { type: Number, default: 0 },
    },
    codOverride: {
      enabled: { type: Boolean, default: true },
      minQty: { type: Number, default: 1 },
      advanceAmount: { type: Number, default: 100 },
      shippingCharge: { type: Number, default: 70 },
    },
    rating: { type: Number, default: 4.8 },
    reviews: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { suppressReservedKeysWarning: true }
);

productSchema.pre("save", function () {
  if (this.sizeOptions && this.sizeOptions.length > 0) {
    this.sizes = this.sizeOptions.map((s) => s.size);
    const totalSizeStock = this.sizeOptions.reduce((sum, s) => sum + (Number(s.stock) || 0), 0);
    this.stock = totalSizeStock;
    const minSizePrice = Math.min(...this.sizeOptions.map((s) => Number(s.price) || Infinity));
    if (minSizePrice !== Infinity && minSizePrice > 0) this.price = minSizePrice;
  }
  if (this.colorOptions && this.colorOptions.length > 0) {
    this.colors = this.colorOptions.map((c) => c.name);
    if (!this.color) this.color = this.colorOptions[0].name;
    const map = new Map<string, string>();
    this.colorOptions.forEach((c) => { if (c.name && c.image) map.set(c.name, c.image); });
    this.colorImages = map;
  }
  const basePrice = Number(this.price) || 0;
  if (!this.mrp || this.mrp < basePrice) this.mrp = basePrice;
  const discountVal = Number(this.discount) || 0;
  if (this.discountType === "fixed") {
    this.finalPrice = Math.max(0, basePrice - discountVal);
  } else {
    this.finalPrice = discountVal > 0
      ? Math.max(0, Math.round((basePrice - (basePrice * discountVal) / 100) * 100) / 100)
      : basePrice;
  }
  const stockNum = Number(this.stock) || 0;
  this.inStock = stockNum > 0;
  if (stockNum === 0 && this.status === "ACTIVE") this.status = "OUT OF STOCK";
  else if (stockNum > 0 && this.status === "OUT OF STOCK") this.status = "ACTIVE";
  this.isNew = Boolean(this.newArrival);
  if (!this.coverImage && this.images && this.images.length > 0) this.coverImage = this.images[0];
  this.updatedAt = new Date();
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);
export default Product;
