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
  seo?: {
    title?: string;
    metaDescription?: string;
    urlSlug?: string;
    focusKeyword?: string;
    socialImage?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface SubCategory {
  id: string;
  name: string;
  parentGroup?: string;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  subcategories?: SubCategory[];
  isCustom?: boolean;
  isActive?: boolean;
  showOnHome?: boolean;
  priority?: number;
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

// No hardcoded sample data: Categories & products are loaded dynamically from MongoDB Atlas
export const categories: Category[] = [];

export const products: Product[] = [];

export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getProductsByCategory = (category: string) =>
  products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
export const getBestSellers = () => products.filter((p) => p.isBestSeller);
