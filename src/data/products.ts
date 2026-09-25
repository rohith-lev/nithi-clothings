export interface SizeOption {
  size: string;
  price: number;
  mrp?: number;
  stock: number;
  sku?: string;
}

export interface ColorOption {
  name: string;
  hex?: string;
  image: string;
}

export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku?: string;
  price: number;
  stock: number;
  image?: string;
  status?: "active" | "inactive";
}

export interface Product {
  id: string;
  name: string;
  code: string;
  sku?: string;
  category: string;
  subcategory?: string;
  brand?: string;
  price: number;
  mrp: number;
  discount: number;
  finalPrice?: number;
  discountType?: "percentage" | "fixed";
  discountValue?: number;
  coverImage?: string;
  images: string[];
  color?: string;
  colors: string[];
  colorOptions?: ColorOption[];
  sizes: string[];
  sizeOptions?: SizeOption[];
  colorImages?: Record<string, string>;
  variants?: ProductVariant[];
  fabric: string;
  material?: string;
  length?: string;
  pattern?: string;
  sleeveType?: string;
  neckType?: string;
  description: string;
  shortDescription?: string;
  care: string;
  sizeChart?: string;
  specialFeatures?: string;
  inStock: boolean;
  stock: number;
  status?: "ACTIVE" | "DRAFT" | "OUT OF STOCK" | "DISCONTINUED";
  rating: number;
  reviews: number;
  isNew?: boolean;
  newArrival?: boolean;
  isBestSeller?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  parentGroup?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  subcategories?: SubCategory[];
}

export const CATEGORY_HIERARCHY: Record<string, { groups?: { name: string; items: string[] }[]; items?: string[] }> = {
  "Nighty": {
    groups: [
      {
        name: "Normal Nighty (55 inches)",
        items: [
          "Zip nighty",
          "Zipless nighty",
          "Titanic model nighty",
          "Collar model nighty",
          "Elastic model nighty",
        ],
      },
      {
        name: "60 inch Nighty",
        items: [
          "Zip nighty",
          "Zipless nighty",
          "Collar nighty",
          "Non feeding frock model",
        ],
      },
      {
        name: "Frock model (55 inches)",
        items: [
          "Feeding frock model",
          "Non feeding frock model",
        ],
      },
      {
        name: "Maternity wear (Normal nighty)",
        items: [
          "Long zip nighty",
          "Double side vertical zip",
          "Full open nighty",
        ],
      },
      {
        name: "Smocking nighty",
        items: ["Smocking nighty"],
      },
    ],
  },
  "Night dress": {
    items: ["2-Piece Night Dress", "Satin Lounge Set", "Cotton Sleepwear"],
  },
  "Unstitched salwar material": {
    items: ["Chanderi Silk Salwar Material", "Pure Cotton Printed Material", "Bandhani Suit Piece", "Jacquard Salwar Material"],
  },
  "Cord set": {
    items: ["Printed Cord Set", "Solid Casual Cord Set", "Embroidered Festive Cord Set"],
  },
  "Kurtis(Tops)": {
    items: ["A-Line Kurti", "Straight Cut Kurti", "Anarkali Kurti", "Short Top Kurti"],
  },
  "Salwar set": {
    items: ["Ready to Wear Salwar Set", "Readymade Cotton Salwar Suit", "Palazzo Salwar Set"],
  },
  "Maxi": {
    items: ["Floral Cotton Maxi", "Tiered Flared Maxi", "Printed Daily Wear Maxi"],
  },
};

export const categories: Category[] = [
  {
    id: "nighty",
    name: "Nighty",
    slug: "nighty",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=600&h=700&fit=crop&auto=format",
    subcategories: [
      { id: "normal-zip-55", name: "Zip nighty", parentGroup: "Normal Nighty (55 inches)" },
      { id: "normal-zipless-55", name: "Zipless nighty", parentGroup: "Normal Nighty (55 inches)" },
      { id: "normal-titanic-55", name: "Titanic model nighty", parentGroup: "Normal Nighty (55 inches)" },
      { id: "normal-collar-55", name: "Collar model nighty", parentGroup: "Normal Nighty (55 inches)" },
      { id: "normal-elastic-55", name: "Elastic model nighty", parentGroup: "Normal Nighty (55 inches)" },
      { id: "60-zip", name: "Zip nighty", parentGroup: "60 inch Nighty" },
      { id: "60-zipless", name: "Zipless nighty", parentGroup: "60 inch Nighty" },
      { id: "60-collar", name: "Collar nighty", parentGroup: "60 inch Nighty" },
      { id: "60-non-feeding-frock", name: "Non feeding frock model", parentGroup: "60 inch Nighty" },
      { id: "frock-55-feeding", name: "Feeding frock model", parentGroup: "Frock model (55 inches)" },
      { id: "frock-55-non-feeding", name: "Non feeding frock model", parentGroup: "Frock model (55 inches)" },
      { id: "maternity-long-zip", name: "Long zip nighty", parentGroup: "Maternity wear (Normal nighty)" },
      { id: "maternity-double-vertical-zip", name: "Double side vertical zip", parentGroup: "Maternity wear (Normal nighty)" },
      { id: "maternity-full-open", name: "Full open nighty", parentGroup: "Maternity wear (Normal nighty)" },
      { id: "smocking-nighty", name: "Smocking nighty", parentGroup: "Smocking nighty" },
    ],
  },
  {
    id: "night-dress",
    name: "Night dress",
    slug: "night-dress",
    image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: "unstitched-salwar",
    name: "Unstitched salwar material",
    slug: "unstitched-salwar",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: "cord-set",
    name: "Cord set",
    slug: "cord-set",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: "kurtis",
    name: "Kurtis(Tops)",
    slug: "kurtis",
    image: "https://images.unsplash.com/photo-1614886137799-70a90b8ab7a5?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: "salwar-set",
    name: "Salwar set",
    slug: "salwar-set",
    image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600&h=700&fit=crop&auto=format",
  },
  {
    id: "maxi",
    name: "Maxi",
    slug: "maxi",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=700&fit=crop&auto=format",
  },
];

export const products: Product[] = [
  // 1. Normal Nighty (55 inches) - Zip Nighty
  {
    id: "p-nighty-zip-55",
    name: "Pure Cotton Zip Nighty (55 Inch)",
    code: "NC-N55-01",
    sku: "SKU-N55-ZIP",
    category: "Nighty",
    subcategory: "Normal Nighty (55 inches) - Zip nighty",
    price: 549,
    mrp: 699,
    discount: 21,
    finalPrice: 434,
    coverImage: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format"],
    color: "Rose Pink",
    colors: ["Rose Pink", "Sky Blue", "Lavender"],
    sizes: ["55 Inch", "L", "XL", "XXL", "Free Size"],
    fabric: "100% Pure Combed Cotton",
    length: "55 Inches",
    description: "Premium breathable pure cotton daily-wear nighty with convenient front zip closure and reinforced stitching.",
    care: "Gentle machine wash with cold water. Dry in shade.",
    inStock: true,
    stock: 45,
    status: "ACTIVE",
    rating: 4.9,
    reviews: 28,
    isNew: true,
    newArrival: true,
    isBestSeller: true,
  },
  // 2. Normal Nighty (55 inches) - Zipless Nighty
  {
    id: "p-nighty-zipless-55",
    name: "Classic Round Neck Zipless Nighty (55 Inch)",
    code: "NC-N55-02",
    sku: "SKU-N55-ZIPLESS",
    category: "Nighty",
    subcategory: "Normal Nighty (55 inches) - Zipless nighty",
    price: 499,
    mrp: 649,
    discount: 23,
    finalPrice: 384,
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop&auto=format"],
    color: "Floral Blue",
    colors: ["Floral Blue", "Mint Green", "Peach"],
    sizes: ["55 Inch", "M", "L", "XL", "XXL"],
    fabric: "100% Pure Cotton",
    length: "55 Inches",
    description: "Soft slip-on everyday cotton nighty designed for supreme comfort and relaxed sleep.",
    care: "Machine wash cold with mild detergent.",
    inStock: true,
    stock: 35,
    status: "ACTIVE",
    rating: 4.8,
    reviews: 19,
    isNew: true,
    newArrival: true,
    isBestSeller: false,
  },
  // 3. Normal Nighty (55 inches) - Titanic Model Nighty
  {
    id: "p-nighty-titanic-55",
    name: "Designer Titanic Model Nighty (55 Inch)",
    code: "NC-N55-03",
    sku: "SKU-N55-TITANIC",
    category: "Nighty",
    subcategory: "Normal Nighty (55 inches) - Titanic model nighty",
    price: 599,
    mrp: 799,
    discount: 25,
    finalPrice: 449,
    coverImage: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop&auto=format"],
    color: "Peacock Green",
    colors: ["Peacock Green", "Wine Maroon"],
    sizes: ["55 Inch", "L", "XL", "XXL"],
    fabric: "100% Combed Cotton",
    length: "55 Inches",
    description: "Elegant Titanic pattern pleated chest design with tailored comfort cut and rich color fastness.",
    care: "Hand wash or gentle machine wash.",
    inStock: true,
    stock: 28,
    status: "ACTIVE",
    rating: 4.9,
    reviews: 14,
    isNew: true,
    newArrival: true,
  },
  // 4. Normal Nighty (55 inches) - Collar Model Nighty
  {
    id: "p-nighty-collar-55",
    name: "Executive Collar Model Cotton Nighty (55 Inch)",
    code: "NC-N55-04",
    sku: "SKU-N55-COLLAR",
    category: "Nighty",
    subcategory: "Normal Nighty (55 inches) - Collar model nighty",
    price: 579,
    mrp: 749,
    discount: 23,
    finalPrice: 446,
    coverImage: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format"],
    color: "Mustard Yellow",
    colors: ["Mustard Yellow", "Navy Blue"],
    sizes: ["55 Inch", "L", "XL", "XXL"],
    fabric: "100% Cotton",
    length: "55 Inches",
    description: "Smart Chinese collar nighty with button placket for stylish home lounge comfort.",
    care: "Gentle machine wash.",
    inStock: true,
    stock: 30,
    status: "ACTIVE",
    rating: 4.7,
    reviews: 11,
    isNew: true,
    newArrival: true,
  },
  // 5. Normal Nighty (55 inches) - Elastic Model Nighty
  {
    id: "p-nighty-elastic-55",
    name: "Smocked Elastic Chest Nighty (55 Inch)",
    code: "NC-N55-05",
    sku: "SKU-N55-ELASTIC",
    category: "Nighty",
    subcategory: "Normal Nighty (55 inches) - Elastic model nighty",
    price: 549,
    mrp: 699,
    discount: 21,
    finalPrice: 434,
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop&auto=format"],
    color: "Coral Peach",
    colors: ["Coral Peach", "Teal Blue"],
    sizes: ["55 Inch", "Free Size", "XL", "XXL"],
    fabric: "100% Pure Cotton",
    length: "55 Inches",
    description: "Flexible elastic yoke design that stretches effortlessly for supreme breathable comfort.",
    care: "Do not bleach. Dry in shade.",
    inStock: true,
    stock: 22,
    status: "ACTIVE",
    rating: 4.8,
    reviews: 15,
    isNew: true,
    newArrival: true,
  },
  // 6. 60 Inch Nighty - Zip Nighty
  {
    id: "p-nighty-60-zip",
    name: "Plus Length 60 Inch Zip Nighty",
    code: "NC-N60-01",
    sku: "SKU-N60-ZIP",
    category: "Nighty",
    subcategory: "60 inch Nighty - Zip nighty",
    price: 649,
    mrp: 849,
    discount: 24,
    finalPrice: 493,
    coverImage: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop&auto=format"],
    color: "Emerald Green",
    colors: ["Emerald Green", "Ruby Red", "Deep Navy"],
    sizes: ["60 Inch", "XL", "XXL", "3XL"],
    fabric: "100% Super Combed Cotton",
    length: "60 Inches",
    description: "Extra length 60-inch full-coverage nighty with premium front zipper and deep side pockets.",
    care: "Gentle wash.",
    inStock: true,
    stock: 40,
    status: "ACTIVE",
    rating: 4.9,
    reviews: 32,
    isNew: true,
    newArrival: true,
    isBestSeller: true,
  },
  // 7. 60 Inch Nighty - Zipless Nighty
  {
    id: "p-nighty-60-zipless",
    name: "Extra Long 60 Inch Zipless Nighty",
    code: "NC-N60-02",
    sku: "SKU-N60-ZIPLESS",
    category: "Nighty",
    subcategory: "60 inch Nighty - Zipless nighty",
    price: 599,
    mrp: 799,
    discount: 25,
    finalPrice: 449,
    coverImage: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format"],
    color: "Indigo Blue",
    colors: ["Indigo Blue", "Maroon"],
    sizes: ["60 Inch", "XL", "XXL", "3XL"],
    fabric: "100% Pure Cotton",
    length: "60 Inches",
    description: "Comfortable ankle-length 60-inch nighty tailored for tall posture and maximum airflow.",
    care: "Machine wash cold.",
    inStock: true,
    stock: 25,
    status: "ACTIVE",
    rating: 4.8,
    reviews: 18,
  },
  // 8. 60 Inch Nighty - Collar Nighty
  {
    id: "p-nighty-60-collar",
    name: "60 Inch Collar Model Long Nighty",
    code: "NC-N60-03",
    sku: "SKU-N60-COLLAR",
    category: "Nighty",
    subcategory: "60 inch Nighty - Collar nighty",
    price: 649,
    mrp: 849,
    discount: 24,
    finalPrice: 493,
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop&auto=format"],
    color: "Coffee Brown",
    colors: ["Coffee Brown", "Royal Blue"],
    sizes: ["60 Inch", "XL", "XXL"],
    fabric: "100% Pure Cotton",
    length: "60 Inches",
    description: "Structured collar design in a generous 60-inch cut.",
    care: "Gentle machine wash.",
    inStock: true,
    stock: 20,
    status: "ACTIVE",
    rating: 4.7,
    reviews: 12,
  },
  // 9. 60 Inch Nighty - Non Feeding Frock Model
  {
    id: "p-nighty-60-frock",
    name: "60 Inch Flared Frock Nighty",
    code: "NC-N60-04",
    sku: "SKU-N60-FROCK",
    category: "Nighty",
    subcategory: "60 inch Nighty - Non feeding frock model",
    price: 679,
    mrp: 899,
    discount: 24,
    finalPrice: 516,
    coverImage: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop&auto=format"],
    color: "Wine Violet",
    colors: ["Wine Violet", "Olive Green"],
    sizes: ["60 Inch", "Free Size", "XXL"],
    fabric: "100% Cotton",
    length: "60 Inches",
    description: "Flowing flared silhouette giving an elegant frock look with nighty comfort.",
    care: "Gentle wash.",
    inStock: true,
    stock: 18,
    status: "ACTIVE",
    rating: 4.9,
    reviews: 9,
  },
  // 10. Frock model (55 inches) - Feeding Frock Model
  {
    id: "p-frock-55-feeding",
    name: "Maternity Feeding Frock Nighty (55 Inch)",
    code: "NC-FR55-01",
    sku: "SKU-FR55-FEED",
    category: "Nighty",
    subcategory: "Frock model (55 inches) - Feeding frock model",
    price: 699,
    mrp: 949,
    discount: 26,
    finalPrice: 517,
    coverImage: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format"],
    color: "Pastel Lavender",
    colors: ["Pastel Lavender", "Blush Pink", "Sky Blue"],
    sizes: ["55 Inch", "L", "XL", "XXL"],
    fabric: "100% Combed Cotton",
    length: "55 Inches",
    description: "Concealed dual vertical zippers designed specifically for discreet, comfortable nursing and feeding.",
    care: "Gentle machine wash with mild detergent.",
    inStock: true,
    stock: 35,
    status: "ACTIVE",
    rating: 5.0,
    reviews: 44,
    isNew: true,
    newArrival: true,
    isBestSeller: true,
  },
  // 11. Frock model (55 inches) - Non Feeding Frock Model
  {
    id: "p-frock-55-nonfeeding",
    name: "A-Line Flared Frock Nighty (55 Inch)",
    code: "NC-FR55-02",
    sku: "SKU-FR55-NONFEED",
    category: "Nighty",
    subcategory: "Frock model (55 inches) - Non feeding frock model",
    price: 599,
    mrp: 799,
    discount: 25,
    finalPrice: 449,
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop&auto=format"],
    color: "Mint Floral",
    colors: ["Mint Floral", "Yellow Gold"],
    sizes: ["55 Inch", "M", "L", "XL", "XXL"],
    fabric: "100% Pure Cotton",
    length: "55 Inches",
    description: "Graceful non-feeding frock cut nighty with delicate pleats and wide hem flare.",
    care: "Machine wash cold.",
    inStock: true,
    stock: 26,
    status: "ACTIVE",
    rating: 4.8,
    reviews: 16,
  },
  // 12. Maternity wear - Long Zip Nighty
  {
    id: "p-maternity-long-zip",
    name: "Maternity Care Long Zip Nighty",
    code: "NC-MAT-01",
    sku: "SKU-MAT-LONGZIP",
    category: "Nighty",
    subcategory: "Maternity wear (Normal nighty) - Long zip nighty",
    price: 649,
    mrp: 899,
    discount: 28,
    finalPrice: 467,
    coverImage: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop&auto=format"],
    color: "Soft Rose",
    colors: ["Soft Rose", "Teal Green"],
    sizes: ["55 Inch", "XL", "XXL", "3XL"],
    fabric: "100% Super Soft Cotton",
    length: "55 Inches",
    description: "Extended 16-inch front zipper designed for pre- and post-pregnancy comfort and easy nursing.",
    care: "Gentle wash.",
    inStock: true,
    stock: 32,
    status: "ACTIVE",
    rating: 4.9,
    reviews: 24,
    isNew: true,
    newArrival: true,
  },
  // 13. Maternity wear - Double Side Vertical Zip
  {
    id: "p-maternity-double-zip",
    name: "Dual Vertical Zip Maternity Nighty",
    code: "NC-MAT-02",
    sku: "SKU-MAT-DOUBLEZIP",
    category: "Nighty",
    subcategory: "Maternity wear (Normal nighty) - Double side vertical zip",
    price: 699,
    mrp: 949,
    discount: 26,
    finalPrice: 517,
    coverImage: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format"],
    color: "Ocean Blue",
    colors: ["Ocean Blue", "Magenta", "Peach"],
    sizes: ["55 Inch", "L", "XL", "XXL"],
    fabric: "100% Pure Combed Cotton",
    length: "55 Inches",
    description: "Two concealed side vertical zips ensuring effortless and private feeding anytime.",
    care: "Gentle machine wash.",
    inStock: true,
    stock: 40,
    status: "ACTIVE",
    rating: 5.0,
    reviews: 38,
    isNew: true,
    newArrival: true,
    isBestSeller: true,
  },
  // 14. Maternity wear - Full Open Nighty
  {
    id: "p-maternity-full-open",
    name: "Front Full Open Buttoned Maternity Nighty",
    code: "NC-MAT-03",
    sku: "SKU-MAT-FULLOPEN",
    category: "Nighty",
    subcategory: "Maternity wear (Normal nighty) - Full open nighty",
    price: 749,
    mrp: 999,
    discount: 25,
    finalPrice: 562,
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop&auto=format"],
    color: "Wine Maroon",
    colors: ["Wine Maroon", "Navy Floral"],
    sizes: ["55 Inch", "L", "XL", "XXL"],
    fabric: "100% Pure Cotton",
    length: "55 Inches",
    description: "Full front button opening providing hospital-friendly and feeding-friendly wear.",
    care: "Gentle machine wash.",
    inStock: true,
    stock: 25,
    status: "ACTIVE",
    rating: 4.8,
    reviews: 17,
  },
  // 15. Smocking Nighty
  {
    id: "p-smocking-nighty",
    name: "Artisanal Smocking Work Cotton Nighty",
    code: "NC-SMK-01",
    sku: "SKU-SMK-001",
    category: "Nighty",
    subcategory: "Smocking nighty",
    price: 649,
    mrp: 849,
    discount: 24,
    finalPrice: 493,
    coverImage: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop&auto=format"],
    color: "Sage Green",
    colors: ["Sage Green", "Rose Pink", "Lemon Yellow"],
    sizes: ["55 Inch", "Free Size", "XL", "XXL"],
    fabric: "100% Pure Mulmul Cotton",
    length: "55 Inches",
    description: "Handcrafted smocking stitch work across the neckline with a relaxed flowy body.",
    care: "Gentle hand wash recommended.",
    inStock: true,
    stock: 30,
    status: "ACTIVE",
    rating: 4.9,
    reviews: 21,
    isNew: true,
    newArrival: true,
  },
  // 16. Night Dress
  {
    id: "p-night-dress-set",
    name: "Satin Finish 2-Piece Night Dress Set",
    code: "NC-ND-01",
    sku: "SKU-ND-001",
    category: "Night dress",
    subcategory: "2-Piece Night Dress",
    price: 799,
    mrp: 1199,
    discount: 33,
    finalPrice: 535,
    coverImage: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=800&h=1000&fit=crop&auto=format"],
    color: "Midnight Black",
    colors: ["Midnight Black", "Ruby Maroon", "Blush Pink"],
    sizes: ["S", "M", "L", "XL", "Free Size"],
    fabric: "Silky Modal Cotton Blend",
    description: "Modern top and pajama 2-piece night dress designed for relaxed evening lounging.",
    care: "Machine wash cold.",
    inStock: true,
    stock: 28,
    status: "ACTIVE",
    rating: 4.8,
    reviews: 19,
    isNew: true,
    newArrival: true,
  },
  // 17. Unstitched Salwar Material
  {
    id: "p-unstitched-salwar-chanderi",
    name: "Chanderi Silk Unstitched Salwar Suit Material",
    code: "NC-SAL-UN01",
    sku: "SKU-UNSAL-001",
    category: "Unstitched salwar material",
    subcategory: "Chanderi Silk Salwar Material",
    price: 1299,
    mrp: 1799,
    discount: 28,
    finalPrice: 935,
    coverImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop&auto=format"],
    color: "Emerald Green & Gold",
    colors: ["Emerald Green & Gold", "Crimson Red", "Royal Peacock"],
    sizes: ["Unstitched (2.5m Top, 2.5m Bottom, 2.25m Dupatta)"],
    fabric: "Chanderi Silk with Zari Border",
    description: "Premium unstitched 3-piece suit fabric with rich woven zari dupatta. Eligible for instant free shipping and multi-buy discounts!",
    care: "Dry clean recommended for initial wash.",
    inStock: true,
    stock: 50,
    status: "ACTIVE",
    rating: 5.0,
    reviews: 52,
    isNew: true,
    newArrival: true,
    isBestSeller: true,
  },
  // 18. Salwar Set (Readymade)
  {
    id: "p-salwar-set-ready",
    name: "Readymade Pure Cotton Salwar Set with Dupatta",
    code: "NC-SAL-SET01",
    sku: "SKU-SALSET-001",
    category: "Salwar set",
    subcategory: "Ready to Wear Salwar Set",
    price: 1499,
    mrp: 1999,
    discount: 25,
    finalPrice: 1124,
    coverImage: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&h=1000&fit=crop&auto=format"],
    color: "Mustard Gold",
    colors: ["Mustard Gold", "Rani Pink", "Navy Blue"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    fabric: "100% Pure Cambric Cotton",
    description: "Stitched ready-to-wear kurta, pant trousers, and matching printed mulmul dupatta.",
    care: "Gentle machine wash.",
    inStock: true,
    stock: 35,
    status: "ACTIVE",
    rating: 4.9,
    reviews: 31,
    isNew: true,
    newArrival: true,
    isBestSeller: true,
  },
  // 19. Cord Set
  {
    id: "p-cord-set-printed",
    name: "Designer Floral Printed Cotton Cord Set",
    code: "NC-CRD-01",
    sku: "SKU-CRD-001",
    category: "Cord set",
    subcategory: "Printed Cord Set",
    price: 999,
    mrp: 1399,
    discount: 29,
    finalPrice: 709,
    coverImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&h=1000&fit=crop&auto=format"],
    color: "Teal Green",
    colors: ["Teal Green", "Rust Orange", "Beige Floral"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    fabric: "100% Pure Slub Cotton",
    description: "Chic co-ord button-down collar shirt paired with matching relaxed-fit cropped trousers.",
    care: "Gentle machine wash.",
    inStock: true,
    stock: 32,
    status: "ACTIVE",
    rating: 4.9,
    reviews: 27,
    isNew: true,
    newArrival: true,
    isBestSeller: true,
  },
  // 20. Kurtis (Tops)
  {
    id: "p-kurti-anarkali",
    name: "Flared Anarkali Kurti Top",
    code: "NC-KUR-01",
    sku: "SKU-KUR-001",
    category: "Kurtis(Tops)",
    subcategory: "Anarkali Kurti",
    price: 699,
    mrp: 999,
    discount: 30,
    finalPrice: 489,
    coverImage: "https://images.unsplash.com/photo-1614886137799-70a90b8ab7a5?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1614886137799-70a90b8ab7a5?w=800&h=1000&fit=crop&auto=format"],
    color: "Sunshine Yellow",
    colors: ["Sunshine Yellow", "Royal Blue", "Maroon"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    fabric: "100% Pure Rayon Cotton",
    description: "Graceful daily and office wear Anarkali flared kurti top with mirror embroidery.",
    care: "Gentle machine wash.",
    inStock: true,
    stock: 45,
    status: "ACTIVE",
    rating: 4.8,
    reviews: 35,
    isNew: true,
    newArrival: true,
    isBestSeller: true,
  },
  // 21. Maxi
  {
    id: "p-maxi-flared",
    name: "Tiered Floral Daily Wear Cotton Maxi",
    code: "NC-MAX-01",
    sku: "SKU-MAX-001",
    category: "Maxi",
    subcategory: "Floral Cotton Maxi",
    price: 849,
    mrp: 1199,
    discount: 29,
    finalPrice: 603,
    coverImage: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1000&fit=crop&auto=format",
    images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1000&fit=crop&auto=format"],
    color: "Indigo Blue",
    colors: ["Indigo Blue", "Blush Pink", "Sage Green"],
    sizes: ["S", "M", "L", "XL", "XXL", "Free Size"],
    fabric: "100% Breathable Cotton",
    description: "Full length tiered ankle Maxi dress crafted for summer elegance and lightweight all-day comfort.",
    care: "Gentle wash.",
    inStock: true,
    stock: 25,
    status: "ACTIVE",
    rating: 4.8,
    reviews: 20,
    isNew: true,
    newArrival: true,
  },
];

export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getProductsByCategory = (category: string) =>
  products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
export const getBestSellers = () => products.filter((p) => p.isBestSeller);
