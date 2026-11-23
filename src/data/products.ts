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

export interface ProductTypeOption {
  id: string;
  name: string;
  price: number;
  mrp?: number;
  stock?: number;
  image?: string;
  active?: boolean;
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
  colors?: string[];
  colorOptions?: ColorOption[];
  sizes: string[];
  sizeOptions?: SizeOption[];
  productTypes?: ProductTypeOption[];
  colorImages?: Record<string, string>;
  variants?: ProductVariant[];
  fabric: string;
  material?: string;
  length?: string;
  productLength?: string;
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
          "Piping nighty",
          "Titanic model nighty",
          "Collar model nighty",
          "Elastic model nighty",
          "Tie & Dye model nighty",
          "Battik nighty",
        ],
      },
      {
        name: "60 inch Nighty",
        items: [
          "60 inch Zip nighty",
          "60 inch Zipless nighty",
          "60 inch Piping nighty",
          "60 inch Collar nighty",
          "60 inch Non feeding frock model",
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
        name: "Maternity & Feeding wear",
        items: [
          "Double side vertical zip",
          "Long zip nighty",
          "Full open nighty",
        ],
      },
      {
        name: "Specialty Nighties",
        items: [
          "Smocking nighty",
          "Queen model nighty",
          "Elite model nighty",
          "3XL Nighty collections",
        ],
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
    items: ["Solid Casual Cord Set", "Embroidered Festive Cord Set"],
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

export const products: Product[] = [
  {
    "id": "elite-xl-zip-model-nighty-collections",
    "name": "Elite XL Zip Model Nighty collections",
    "code": "NC-NIG-101",
    "sku": "NC-NIG-101",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xl-zip-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/elite-xl-zip-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-101-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-101-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-101-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xl-zip-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Elite zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 14,
    "newArrival": true,
    "isNew": true,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.636Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-xl-zip-model-nighty-collections-2",
    "name": "Elite XL Zip Model Nighty collections",
    "code": "NC-NIG-102",
    "sku": "NC-NIG-102",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xl-zip-model-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/elite-xl-zip-model-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-102-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-102-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-102-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xl-zip-model-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Elite zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 15,
    "newArrival": true,
    "isNew": true,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-xl-piping-nighty-collections",
    "name": "Elite XL Piping Nighty collections",
    "code": "NC-NIG-103",
    "sku": "NC-NIG-103",
    "category": "Nighty",
    "subcategory": "Piping nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xl-piping-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/elite-xl-piping-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-103-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-103-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-103-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "piping-nighty",
        "name": "Piping Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xl-piping-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Elite Cotton piping nighty Price: 340rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Piping Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 16,
    "newArrival": true,
    "isNew": true,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-xl-piping-model-nighty-collections",
    "name": "Elite XL Piping model Nighty collections",
    "code": "NC-NIG-104",
    "sku": "NC-NIG-104",
    "category": "Nighty",
    "subcategory": "Piping nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xl-piping-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/elite-xl-piping-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-104-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-104-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-104-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "piping-nighty",
        "name": "Piping Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xl-piping-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Elite Cotton piping nighty Price: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Piping Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 17,
    "newArrival": true,
    "isNew": true,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-xl-piping-model-nighty-collections-2",
    "name": "Elite XL Piping model Nighty collections",
    "code": "NC-NIG-105",
    "sku": "NC-NIG-105",
    "category": "Nighty",
    "subcategory": "Piping nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xl-piping-model-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/elite-xl-piping-model-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-105-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-105-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-105-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "piping-nighty",
        "name": "Piping Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xl-piping-model-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Elite Cotton piping nighty Price: 340rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Piping Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 18,
    "newArrival": true,
    "isNew": true,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-xxl-zip-model-nighty-collections",
    "name": "Elite XXL Zip model Nighty collections",
    "code": "NC-NIG-106",
    "sku": "NC-NIG-106",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xxl-zip-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/elite-xxl-zip-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-106-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-106-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-106-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xxl-zip-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Elite zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 19,
    "newArrival": true,
    "isNew": true,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-xxl-without-zip-model-collections",
    "name": "Elite XXL Without Zip model collections",
    "code": "NC-UNS-107",
    "sku": "NC-UNS-107",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xxl-without-zip-model-collections.jpg",
    "images": [
      "/uploads/catalog/elite-xxl-without-zip-model-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-UNS-107-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xxl-without-zip-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "XXL Size Elite Piping model nighty Price: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 20,
    "newArrival": true,
    "isNew": true,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-xxl-without-zip-collections",
    "name": "Elite XXL Without zip collections",
    "code": "NC-UNS-108",
    "sku": "NC-UNS-108",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xxl-without-zip-collections.jpg",
    "images": [
      "/uploads/catalog/elite-xxl-without-zip-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-UNS-108-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xxl-without-zip-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "XXL Size Elite Piping model nighty Price: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 21,
    "newArrival": true,
    "isNew": true,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-xxl-without-zip-model-collections-2",
    "name": "Elite XXL Without zip model collections",
    "code": "NC-UNS-109",
    "sku": "NC-UNS-109",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xxl-without-zip-model-collections-2.jpg",
    "images": [
      "/uploads/catalog/elite-xxl-without-zip-model-collections-2.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-UNS-109-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xxl-without-zip-model-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "XXL Size Elite Piping model nighty Price: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 22,
    "newArrival": true,
    "isNew": true,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-xl-titanic-model-nighty-collections",
    "name": "Elite XL Titanic model nighty collections",
    "code": "NC-NIG-110",
    "sku": "NC-NIG-110",
    "category": "Nighty",
    "subcategory": "Titanic model nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xl-titanic-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/elite-xl-titanic-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-110-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-110-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-110-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "titanic-nighty",
        "name": "Titanic Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xl-titanic-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Elite Titanic model nighty Price: 340rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Titanic Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 23,
    "newArrival": true,
    "isNew": true,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-xl-elastic-model-nighty-collections",
    "name": "Elite XL Elastic model nighty collections",
    "code": "NC-NIG-111",
    "sku": "NC-NIG-111",
    "category": "Nighty",
    "subcategory": "Elastic model nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xl-elastic-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/elite-xl-elastic-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-111-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-111-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-111-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "elastic-nighty",
        "name": "Elastic Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xl-elastic-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Elastic Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 24,
    "newArrival": true,
    "isNew": true,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-3xl-piping-nighty-collections",
    "name": "Elite 3XL Piping nighty collections",
    "code": "NC-NIG-112",
    "sku": "NC-NIG-112",
    "category": "Nighty",
    "subcategory": "Piping nighty",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/elite-3xl-piping-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/elite-3xl-piping-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL",
      "3XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-112-L"
      },
      {
        "size": "XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-112-XL"
      },
      {
        "size": "2XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-112-2XL"
      },
      {
        "size": "3XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-112-3XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "piping-nighty",
        "name": "Piping Nighty",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/elite-3xl-piping-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "3XL Size Elite Piping model nighty Price: 350rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Piping Nighty (3XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 25,
    "newArrival": true,
    "isNew": true,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-3xl-piping-model-nighty-collections",
    "name": "Elite 3XL Piping model nighty collections",
    "code": "NC-NIG-113",
    "sku": "NC-NIG-113",
    "category": "Nighty",
    "subcategory": "Piping nighty",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/elite-3xl-piping-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/elite-3xl-piping-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL",
      "3XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-113-L"
      },
      {
        "size": "XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-113-XL"
      },
      {
        "size": "2XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-113-2XL"
      },
      {
        "size": "3XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-113-3XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "piping-nighty",
        "name": "Piping Nighty",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/elite-3xl-piping-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "3XL Size Elite Piping model nighty Price: 350rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Piping Nighty (3XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 26,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-3xl-zip-model-nighty-collections",
    "name": "Elite 3XL Zip model Nighty collections",
    "code": "NC-NIG-114",
    "sku": "NC-NIG-114",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/elite-3xl-zip-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/elite-3xl-zip-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL",
      "3XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-114-L"
      },
      {
        "size": "XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-114-XL"
      },
      {
        "size": "2XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-114-2XL"
      },
      {
        "size": "3XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-114-3XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/elite-3xl-zip-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (3XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 27,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "l-size-night-dress-zip-model",
    "name": "L Size Night dress Zip model",
    "code": "NC-NIG-115",
    "sku": "NC-NIG-115",
    "category": "Night dress",
    "subcategory": "2-Piece Night Dress",
    "brand": "Nithi Collections",
    "price": 375,
    "mrp": 510,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 375,
    "coverImage": "/uploads/catalog/l-size-night-dress-zip-model.jpg",
    "images": [
      "/uploads/catalog/l-size-night-dress-zip-model.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-115-L"
      },
      {
        "size": "XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-115-XL"
      },
      {
        "size": "2XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-115-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "night-dress",
        "name": "Night Dress",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "image": "/uploads/catalog/l-size-night-dress-zip-model.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "L Size Elite Zip Night suit collections  Price : 375rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Night Dress (L)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 28,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "l-size-night-dress-zip-model-collections",
    "name": "L Size Night dress Zip model collections",
    "code": "NC-NIG-116",
    "sku": "NC-NIG-116",
    "category": "Night dress",
    "subcategory": "2-Piece Night Dress",
    "brand": "Nithi Collections",
    "price": 375,
    "mrp": 510,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 375,
    "coverImage": "/uploads/catalog/l-size-night-dress-zip-model-collections.jpg",
    "images": [
      "/uploads/catalog/l-size-night-dress-zip-model-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-116-L"
      },
      {
        "size": "XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-116-XL"
      },
      {
        "size": "2XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-116-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "night-dress",
        "name": "Night Dress",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "image": "/uploads/catalog/l-size-night-dress-zip-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "L Size Elite Zip Night suit collections  Price : 375rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Night Dress (L)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 29,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-60-inch-xl-piping-model-collections",
    "name": "Elite 60 inch XL Piping model collections",
    "code": "NC-UNS-117",
    "sku": "NC-UNS-117",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/elite-60-inch-xl-piping-model-collections.jpg",
    "images": [
      "/uploads/catalog/elite-60-inch-xl-piping-model-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-UNS-117-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/elite-60-inch-xl-piping-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 30,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.645Z",
    "updatedAt": "2026-11-20T13:31:09.645Z"
  },
  {
    "id": "elite-60inch-xl-piping-model-collections",
    "name": "Elite 60inch XL Piping model collections",
    "code": "NC-UNS-118",
    "sku": "NC-UNS-118",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/elite-60inch-xl-piping-model-collections.jpg",
    "images": [
      "/uploads/catalog/elite-60inch-xl-piping-model-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-UNS-118-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/elite-60inch-xl-piping-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 14,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "long-zip-xl-feeding-nighty-collections",
    "name": "Long Zip XL Feeding Nighty collections",
    "code": "NC-NIG-119",
    "sku": "NC-NIG-119",
    "category": "Nighty",
    "subcategory": "Double side vertical zip",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/long-zip-xl-feeding-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/long-zip-xl-feeding-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-119-L"
      },
      {
        "size": "XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-119-XL"
      },
      {
        "size": "2XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-119-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "feeding-zip-nighty",
        "name": "Feeding Zip Nighty",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/long-zip-xl-feeding-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Feeding Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 15,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-3xl-piping-model-nighty-collections-2",
    "name": "Elite 3XL Piping Model Nighty collections",
    "code": "NC-NIG-120",
    "sku": "NC-NIG-120",
    "category": "Nighty",
    "subcategory": "Piping nighty",
    "brand": "Nithi Collections",
    "price": 399,
    "mrp": 540,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 399,
    "coverImage": "/uploads/catalog/elite-3xl-piping-model-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/elite-3xl-piping-model-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL",
      "3XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "sku": "NC-NIG-120-L"
      },
      {
        "size": "XL",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "sku": "NC-NIG-120-XL"
      },
      {
        "size": "2XL",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "sku": "NC-NIG-120-2XL"
      },
      {
        "size": "3XL",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "sku": "NC-NIG-120-3XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "piping-nighty",
        "name": "Piping Nighty",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "image": "/uploads/catalog/elite-3xl-piping-model-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "3XL Size Elite Piping model nighty Price: 399rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Piping Nighty (3XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 16,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "xxl-double-side-vertical-zip-feeding-nighty",
    "name": "XXL Double side Vertical zip feeding Nighty",
    "code": "NC-NIG-121",
    "sku": "NC-NIG-121",
    "category": "Nighty",
    "subcategory": "Double side vertical zip",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/xxl-double-side-vertical-zip-feeding-nighty.jpg",
    "images": [
      "/uploads/catalog/xxl-double-side-vertical-zip-feeding-nighty.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-121-L"
      },
      {
        "size": "XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-121-XL"
      },
      {
        "size": "2XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-121-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "feeding-zip-nighty",
        "name": "Feeding Zip Nighty",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/xxl-double-side-vertical-zip-feeding-nighty.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Feeding Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 17,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-xxl-without-zip-collections-2",
    "name": "Elite XXL Without Zip collections",
    "code": "NC-UNS-122",
    "sku": "NC-UNS-122",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xxl-without-zip-collections-2.jpg",
    "images": [
      "/uploads/catalog/elite-xxl-without-zip-collections-2.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-UNS-122-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xxl-without-zip-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "XXL Size Elite Piping model nighty Price: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 18,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-xxl-zip-model-nighty-collections-2",
    "name": "Elite XXL Zip model Nighty collections",
    "code": "NC-NIG-123",
    "sku": "NC-NIG-123",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/elite-xxl-zip-model-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/elite-xxl-zip-model-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-123-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-123-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-123-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/elite-xxl-zip-model-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 19,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "tie-dye-xl-piping-model-collections",
    "name": "Tie & Dye XL Piping model collections",
    "code": "NC-UNS-124",
    "sku": "NC-UNS-124",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/tie-dye-xl-piping-model-collections.jpg",
    "images": [
      "/uploads/catalog/tie-dye-xl-piping-model-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-UNS-124-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/tie-dye-xl-piping-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "Tie & Dye Cotton",
    "material": "Tie & Dye Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "XL Size Tie - Dye Piping Nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Premium Tie & Dye Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 20,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xxl-zip-model-nighty-collections",
    "name": "Queen XXL Zip model Nighty collections",
    "code": "NC-NIG-125",
    "sku": "NC-NIG-125",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/queen-xxl-zip-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/queen-xxl-zip-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-125-L"
      },
      {
        "size": "XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-125-XL"
      },
      {
        "size": "2XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-125-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/queen-xxl-zip-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Queen quality Zip model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 21,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-60inch-xxl-piping-model-collections",
    "name": "Elite 60inch XXL Piping model collections",
    "code": "NC-UNS-126",
    "sku": "NC-UNS-126",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/elite-60inch-xxl-piping-model-collections.jpg",
    "images": [
      "/uploads/catalog/elite-60inch-xxl-piping-model-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-UNS-126-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/elite-60inch-xxl-piping-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 22,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-60inch-xxl-zip-collections",
    "name": "Elite 60inch XXL Zip collections",
    "code": "NC-UNS-127",
    "sku": "NC-UNS-127",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 399,
    "mrp": 540,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 399,
    "coverImage": "/uploads/catalog/elite-60inch-xxl-zip-collections.jpg",
    "images": [
      "/uploads/catalog/elite-60inch-xxl-zip-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "sku": "NC-UNS-127-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "image": "/uploads/catalog/elite-60inch-xxl-zip-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 23,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-xxl-titanic-model-collections",
    "name": "Elite XXL Titanic model collections",
    "code": "NC-UNS-128",
    "sku": "NC-UNS-128",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/elite-xxl-titanic-model-collections.jpg",
    "images": [
      "/uploads/catalog/elite-xxl-titanic-model-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-UNS-128-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/elite-xxl-titanic-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 24,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "collar-xxl-zip-model-nighty-collections",
    "name": "Collar XXL Zip model Nighty collections",
    "code": "NC-NIG-129",
    "sku": "NC-NIG-129",
    "category": "Nighty",
    "subcategory": "Collar model nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/collar-xxl-zip-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/collar-xxl-zip-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-129-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-129-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-129-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "collar-nighty",
        "name": "Collar Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/collar-xxl-zip-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Collar zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Collar Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 25,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xl-zip-nighty-collections",
    "name": "Queen XL Zip Nighty collections",
    "code": "NC-NIG-130",
    "sku": "NC-NIG-130",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 390,
    "mrp": 530,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 390,
    "coverImage": "/uploads/catalog/queen-xl-zip-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/queen-xl-zip-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-130-L"
      },
      {
        "size": "XL",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-130-XL"
      },
      {
        "size": "2XL",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-130-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "image": "/uploads/catalog/queen-xl-zip-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Queen zip Cotton nighty \nPrice: 390rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 26,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-collar-xl-nighty-collections",
    "name": "Elite Collar XL Nighty collections",
    "code": "NC-NIG-131",
    "sku": "NC-NIG-131",
    "category": "Nighty",
    "subcategory": "Collar model nighty",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/elite-collar-xl-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/elite-collar-xl-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-131-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-131-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-131-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "collar-nighty",
        "name": "Collar Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/elite-collar-xl-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Collar Zip Cotton nighty \nPrice: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Collar Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 27,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xl-zip-nighty-collections-2",
    "name": "Queen XL Zip Nighty collections",
    "code": "NC-NIG-132",
    "sku": "NC-NIG-132",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/queen-xl-zip-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/queen-xl-zip-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-132-L"
      },
      {
        "size": "XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-132-XL"
      },
      {
        "size": "2XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-132-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/queen-xl-zip-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Queen zip Cotton nighty \nPrice: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 28,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-xxl-elastic-model-nighty-collections",
    "name": "Elite XXL Elastic model nighty collections",
    "code": "NC-NIG-133",
    "sku": "NC-NIG-133",
    "category": "Nighty",
    "subcategory": "Elastic model nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xxl-elastic-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/elite-xxl-elastic-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-133-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-133-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-133-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "elastic-nighty",
        "name": "Elastic Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xxl-elastic-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Elastic Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 29,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-xxl-elastic-model-nighty-collections-2",
    "name": "Elite XXL Elastic model Nighty collections",
    "code": "NC-NIG-134",
    "sku": "NC-NIG-134",
    "category": "Nighty",
    "subcategory": "Elastic model nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xxl-elastic-model-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/elite-xxl-elastic-model-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-134-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-134-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-134-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "elastic-nighty",
        "name": "Elastic Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xxl-elastic-model-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Elastic Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 30,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xxl-zip-model-nighty-collections-2",
    "name": "Queen XXL Zip model Nighty collections",
    "code": "NC-NIG-135",
    "sku": "NC-NIG-135",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/queen-xxl-zip-model-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/queen-xxl-zip-model-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-135-L"
      },
      {
        "size": "XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-135-XL"
      },
      {
        "size": "2XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-135-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/queen-xxl-zip-model-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Queen quality Zip model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 14,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xl-piping-model-collections",
    "name": "Queen XL Piping model collections",
    "code": "NC-UNS-136",
    "sku": "NC-UNS-136",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/queen-xl-piping-model-collections.jpg",
    "images": [
      "/uploads/catalog/queen-xl-piping-model-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-UNS-136-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/queen-xl-piping-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "XL Size Queen quality Piping model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 15,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-60inch-xxl-zip-collections-2",
    "name": "Elite 60inch XXL Zip collections",
    "code": "NC-UNS-137",
    "sku": "NC-UNS-137",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/elite-60inch-xxl-zip-collections-2.jpg",
    "images": [
      "/uploads/catalog/elite-60inch-xxl-zip-collections-2.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-UNS-137-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/elite-60inch-xxl-zip-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 16,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "tie-dye-xxl-without-zip-collections",
    "name": "Tie & Dye XXL without zip collections",
    "code": "NC-UNS-138",
    "sku": "NC-UNS-138",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/tie-dye-xxl-without-zip-collections.jpg",
    "images": [
      "/uploads/catalog/tie-dye-xxl-without-zip-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-UNS-138-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/tie-dye-xxl-without-zip-collections.jpg",
        "active": true
      }
    ],
    "fabric": "Tie & Dye Cotton",
    "material": "Tie & Dye Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "XXL Size Tie & dye Piping model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium Tie & Dye Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 17,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "long-zip-xxl-feeding-nighty-collections",
    "name": "Long Zip XXL feeding Nighty collections",
    "code": "NC-NIG-139",
    "sku": "NC-NIG-139",
    "category": "Nighty",
    "subcategory": "Double side vertical zip",
    "brand": "Nithi Collections",
    "price": 380,
    "mrp": 510,
    "discount": 25,
    "discountType": "percentage",
    "discountValue": 25,
    "finalPrice": 380,
    "coverImage": "/uploads/catalog/long-zip-xxl-feeding-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/long-zip-xxl-feeding-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 380,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-139-L"
      },
      {
        "size": "XL",
        "price": 380,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-139-XL"
      },
      {
        "size": "2XL",
        "price": 380,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-139-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "feeding-zip-nighty",
        "name": "Feeding Zip Nighty",
        "price": 380,
        "mrp": 510,
        "stock": 25,
        "image": "/uploads/catalog/long-zip-xxl-feeding-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Feeding Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 18,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "battik-xl-zip-nighty-collections",
    "name": "Battik XL Zip Nighty collections",
    "code": "NC-NIG-140",
    "sku": "NC-NIG-140",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/battik-xl-zip-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/battik-xl-zip-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-140-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-140-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-140-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/battik-xl-zip-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "Batik Cotton",
    "material": "Batik Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Battik zip Cotton nighty \nPrice: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 19,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "xl-double-side-vertical-zip-feeding-nighty",
    "name": "XL Double side Vertical zip feeding Nighty",
    "code": "NC-NIG-141",
    "sku": "NC-NIG-141",
    "category": "Nighty",
    "subcategory": "Double side vertical zip",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/xl-double-side-vertical-zip-feeding-nighty.jpg",
    "images": [
      "/uploads/catalog/xl-double-side-vertical-zip-feeding-nighty.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-141-L"
      },
      {
        "size": "XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-141-XL"
      },
      {
        "size": "2XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-141-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "feeding-zip-nighty",
        "name": "Feeding Zip Nighty",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/xl-double-side-vertical-zip-feeding-nighty.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Feeding Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 20,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "collar-xxl-zip-model-nighty-collections-2",
    "name": "Collar XXL Zip model Nighty collections",
    "code": "NC-NIG-142",
    "sku": "NC-NIG-142",
    "category": "Nighty",
    "subcategory": "Collar model nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/collar-xxl-zip-model-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/collar-xxl-zip-model-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-142-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-142-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-142-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "collar-nighty",
        "name": "Collar Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/collar-xxl-zip-model-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Collar Zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Collar Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 21,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-60inch-xxl-piping-model-collections-2",
    "name": "Elite 60inch XXL Piping model collections",
    "code": "NC-UNS-143",
    "sku": "NC-UNS-143",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 399,
    "mrp": 540,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 399,
    "coverImage": "/uploads/catalog/elite-60inch-xxl-piping-model-collections-2.jpg",
    "images": [
      "/uploads/catalog/elite-60inch-xxl-piping-model-collections-2.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "sku": "NC-UNS-143-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "image": "/uploads/catalog/elite-60inch-xxl-piping-model-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 22,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-xxl-titanic-model-nighty-collections",
    "name": "Elite XXL Titanic model Nighty collections",
    "code": "NC-NIG-144",
    "sku": "NC-NIG-144",
    "category": "Nighty",
    "subcategory": "Titanic model nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xxl-titanic-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/elite-xxl-titanic-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-144-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-144-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-144-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "titanic-nighty",
        "name": "Titanic Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xxl-titanic-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Elite Titanic model nighty Price: 340rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Titanic Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 23,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "battik-xxl-zip-model-nighty-collections",
    "name": "Battik XXL Zip model nighty collections",
    "code": "NC-NIG-145",
    "sku": "NC-NIG-145",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/battik-xxl-zip-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/battik-xxl-zip-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-145-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-145-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-145-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/battik-xxl-zip-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "Batik Cotton",
    "material": "Batik Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Battik Zip model nighty \nPrice: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 24,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "collar-xxl-zip-model-nighty-collections-3",
    "name": "Collar XXL Zip model Nighty collections",
    "code": "NC-NIG-146",
    "sku": "NC-NIG-146",
    "category": "Nighty",
    "subcategory": "Collar model nighty",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/collar-xxl-zip-model-nighty-collections-3.jpg",
    "images": [
      "/uploads/catalog/collar-xxl-zip-model-nighty-collections-3.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-146-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-146-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-146-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "collar-nighty",
        "name": "Collar Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/collar-xxl-zip-model-nighty-collections-3.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Collar Zip Cotton nighty Price:370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Collar Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 25,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "tie-dye-xl-zip-model-nighty-collections",
    "name": "Tie & Dye XL Zip model Nighty collections",
    "code": "NC-NIG-147",
    "sku": "NC-NIG-147",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/tie-dye-xl-zip-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/tie-dye-xl-zip-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-147-L"
      },
      {
        "size": "XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-147-XL"
      },
      {
        "size": "2XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-147-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/tie-dye-xl-zip-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "Tie & Dye Cotton",
    "material": "Tie & Dye Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Tie & Dye zip Cotton nighty \nPrice: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 26,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "xl-night-dress-collar-model-collections",
    "name": "XL Night dress Collar model collections",
    "code": "NC-NIG-148",
    "sku": "NC-NIG-148",
    "category": "Night dress",
    "subcategory": "2-Piece Night Dress",
    "brand": "Nithi Collections",
    "price": 375,
    "mrp": 510,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 375,
    "coverImage": "/uploads/catalog/xl-night-dress-collar-model-collections.jpg",
    "images": [
      "/uploads/catalog/xl-night-dress-collar-model-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-148-L"
      },
      {
        "size": "XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-148-XL"
      },
      {
        "size": "2XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-148-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "night-dress",
        "name": "Night Dress",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "image": "/uploads/catalog/xl-night-dress-collar-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Elite Collar Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Night Dress (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 27,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-xl-piping-model-nighty-collections-3",
    "name": "Elite XL Piping model Nighty collections",
    "code": "NC-NIG-149",
    "sku": "NC-NIG-149",
    "category": "Nighty",
    "subcategory": "Piping nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xl-piping-model-nighty-collections-3.jpg",
    "images": [
      "/uploads/catalog/elite-xl-piping-model-nighty-collections-3.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-149-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-149-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-149-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "piping-nighty",
        "name": "Piping Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xl-piping-model-nighty-collections-3.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Elite Cotton piping nighty Price: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Piping Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 28,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "xxl-size-night-dress-zip-model-collections",
    "name": "XXL size Night dress Zip model collections",
    "code": "NC-NIG-150",
    "sku": "NC-NIG-150",
    "category": "Night dress",
    "subcategory": "2-Piece Night Dress",
    "brand": "Nithi Collections",
    "price": 375,
    "mrp": 510,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 375,
    "coverImage": "/uploads/catalog/xxl-size-night-dress-zip-model-collections.jpg",
    "images": [
      "/uploads/catalog/xxl-size-night-dress-zip-model-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-150-L"
      },
      {
        "size": "XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-150-XL"
      },
      {
        "size": "2XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-150-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "night-dress",
        "name": "Night Dress",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "image": "/uploads/catalog/xxl-size-night-dress-zip-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Elite Zip Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Night Dress (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 29,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "battick-xxl-without-zip-collections",
    "name": "Battick XXL without zip collections",
    "code": "NC-UNS-151",
    "sku": "NC-UNS-151",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/battick-xxl-without-zip-collections.jpg",
    "images": [
      "/uploads/catalog/battick-xxl-without-zip-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-UNS-151-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/battick-xxl-without-zip-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "Battick  XXL Size Piping model nighty Price: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 30,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-xl-feeding-frock-model-nighty",
    "name": "Elite XL Feeding Frock model Nighty",
    "code": "NC-NIG-152",
    "sku": "NC-NIG-152",
    "category": "Nighty",
    "subcategory": "Double side vertical zip",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/elite-xl-feeding-frock-model-nighty.jpg",
    "images": [
      "/uploads/catalog/elite-xl-feeding-frock-model-nighty.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-152-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-152-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-152-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "feeding-zip-nighty",
        "name": "Feeding Zip Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/elite-xl-feeding-frock-model-nighty.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Feeding Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 14,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-60inch-xl-zip-collections",
    "name": "Elite 60inch XL zip collections",
    "code": "NC-UNS-153",
    "sku": "NC-UNS-153",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/elite-60inch-xl-zip-collections.jpg",
    "images": [
      "/uploads/catalog/elite-60inch-xl-zip-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-UNS-153-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/elite-60inch-xl-zip-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 15,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "collar-xl-nighty-collections",
    "name": "Collar XL Nighty collections",
    "code": "NC-NIG-154",
    "sku": "NC-NIG-154",
    "category": "Nighty",
    "subcategory": "Collar model nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/collar-xl-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/collar-xl-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-154-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-154-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-154-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "collar-nighty",
        "name": "Collar Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/collar-xl-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Collar Zip Cotton nighty \nPrice: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Collar Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 16,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "tie-dye-xxl-zip-model-nighty-collections",
    "name": "Tie & Dye XXL Zip model Nighty collections",
    "code": "NC-NIG-155",
    "sku": "NC-NIG-155",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/tie-dye-xxl-zip-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/tie-dye-xxl-zip-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-155-L"
      },
      {
        "size": "XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-155-XL"
      },
      {
        "size": "2XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-155-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/tie-dye-xxl-zip-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "Tie & Dye Cotton",
    "material": "Tie & Dye Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Tie & Dye Zip Cotton nighty Price:360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 17,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xxl-without-zip-collections",
    "name": "Queen XXL without zip collections",
    "code": "NC-UNS-156",
    "sku": "NC-UNS-156",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/queen-xxl-without-zip-collections.jpg",
    "images": [
      "/uploads/catalog/queen-xxl-without-zip-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-UNS-156-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/queen-xxl-without-zip-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "Queen XXL Size Piping model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 18,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xl-piping-model-collections-2",
    "name": "Queen XL Piping model collections",
    "code": "NC-UNS-157",
    "sku": "NC-UNS-157",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/queen-xl-piping-model-collections-2.jpg",
    "images": [
      "/uploads/catalog/queen-xl-piping-model-collections-2.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-UNS-157-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/queen-xl-piping-model-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "XL Size Queen quality Piping model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 19,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "xl-night-dress-zip-model-collections",
    "name": "XL Night dress Zip model collections",
    "code": "NC-NIG-158",
    "sku": "NC-NIG-158",
    "category": "Night dress",
    "subcategory": "2-Piece Night Dress",
    "brand": "Nithi Collections",
    "price": 375,
    "mrp": 510,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 375,
    "coverImage": "/uploads/catalog/xl-night-dress-zip-model-collections.jpg",
    "images": [
      "/uploads/catalog/xl-night-dress-zip-model-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-158-L"
      },
      {
        "size": "XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-158-XL"
      },
      {
        "size": "2XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-158-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "night-dress",
        "name": "Night Dress",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "image": "/uploads/catalog/xl-night-dress-zip-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Elite Zip Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Night Dress (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 20,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xl-piping-nighty-collections",
    "name": "Queen XL Piping nighty collections",
    "code": "NC-NIG-159",
    "sku": "NC-NIG-159",
    "category": "Nighty",
    "subcategory": "Piping nighty",
    "brand": "Nithi Collections",
    "price": 390,
    "mrp": 530,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 390,
    "coverImage": "/uploads/catalog/queen-xl-piping-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/queen-xl-piping-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-159-L"
      },
      {
        "size": "XL",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-159-XL"
      },
      {
        "size": "2XL",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-159-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "piping-nighty",
        "name": "Piping Nighty",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "image": "/uploads/catalog/queen-xl-piping-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Queen quality Piping model nighty Price: 390rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Piping Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 21,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "xl-night-dress-without-zip-model-collections",
    "name": "XL Night dress Without zip model collections",
    "code": "NC-NIG-160",
    "sku": "NC-NIG-160",
    "category": "Night dress",
    "subcategory": "2-Piece Night Dress",
    "brand": "Nithi Collections",
    "price": 375,
    "mrp": 510,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 375,
    "coverImage": "/uploads/catalog/xl-night-dress-without-zip-model-collections.jpg",
    "images": [
      "/uploads/catalog/xl-night-dress-without-zip-model-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-160-L"
      },
      {
        "size": "XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-160-XL"
      },
      {
        "size": "2XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-160-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "night-dress",
        "name": "Night Dress",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "image": "/uploads/catalog/xl-night-dress-without-zip-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Elite Without Zip Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Night Dress (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 22,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "xxl-size-collar-night-dress-collections",
    "name": "XXL size Collar Night dress collections",
    "code": "NC-NIG-161",
    "sku": "NC-NIG-161",
    "category": "Night dress",
    "subcategory": "2-Piece Night Dress",
    "brand": "Nithi Collections",
    "price": 375,
    "mrp": 510,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 375,
    "coverImage": "/uploads/catalog/xxl-size-collar-night-dress-collections.jpg",
    "images": [
      "/uploads/catalog/xxl-size-collar-night-dress-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-161-L"
      },
      {
        "size": "XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-161-XL"
      },
      {
        "size": "2XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-161-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "night-dress",
        "name": "Night Dress",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "image": "/uploads/catalog/xxl-size-collar-night-dress-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Elite Collar Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Night Dress (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 23,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "long-zip-xxl-feeding-nighty-collections-2",
    "name": "Long Zip XXL feeding Nighty collections",
    "code": "NC-NIG-162",
    "sku": "NC-NIG-162",
    "category": "Nighty",
    "subcategory": "Double side vertical zip",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/long-zip-xxl-feeding-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/long-zip-xxl-feeding-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-162-L"
      },
      {
        "size": "XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-162-XL"
      },
      {
        "size": "2XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-162-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "feeding-zip-nighty",
        "name": "Feeding Zip Nighty",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/long-zip-xxl-feeding-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Feeding Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 24,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-xxl-feeding-frock-model-nighty",
    "name": "Elite XXL feeding Frock model Nighty",
    "code": "NC-NIG-163",
    "sku": "NC-NIG-163",
    "category": "Nighty",
    "subcategory": "Double side vertical zip",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/elite-xxl-feeding-frock-model-nighty.jpg",
    "images": [
      "/uploads/catalog/elite-xxl-feeding-frock-model-nighty.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-163-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-163-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-163-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "feeding-zip-nighty",
        "name": "Feeding Zip Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/elite-xxl-feeding-frock-model-nighty.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Feeding Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 25,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-xxl-feeding-frock-model-nighty-2",
    "name": "Elite XXL feeding Frock model nighty",
    "code": "NC-NIG-164",
    "sku": "NC-NIG-164",
    "category": "Nighty",
    "subcategory": "Double side vertical zip",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/elite-xxl-feeding-frock-model-nighty-2.jpg",
    "images": [
      "/uploads/catalog/elite-xxl-feeding-frock-model-nighty-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-164-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-164-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-164-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "feeding-zip-nighty",
        "name": "Feeding Zip Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/elite-xxl-feeding-frock-model-nighty-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Feeding Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 26,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "xl-double-side-vertical-zip-feeding-nighty-2",
    "name": "XL Double side Vertical zip feeding nighty",
    "code": "NC-NIG-165",
    "sku": "NC-NIG-165",
    "category": "Nighty",
    "subcategory": "Double side vertical zip",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/xl-double-side-vertical-zip-feeding-nighty-2.jpg",
    "images": [
      "/uploads/catalog/xl-double-side-vertical-zip-feeding-nighty-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-165-L"
      },
      {
        "size": "XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-165-XL"
      },
      {
        "size": "2XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-165-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "feeding-zip-nighty",
        "name": "Feeding Zip Nighty",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/xl-double-side-vertical-zip-feeding-nighty-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Feeding Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 27,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "battik-xl-piping-model-collections",
    "name": "Battik XL Piping model collections",
    "code": "NC-UNS-166",
    "sku": "NC-UNS-166",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/battik-xl-piping-model-collections.jpg",
    "images": [
      "/uploads/catalog/battik-xl-piping-model-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-UNS-166-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/battik-xl-piping-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "Batik Cotton",
    "material": "Batik Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "XL Size Battik quality Piping model nighty Price: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Premium Batik Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 28,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "battik-xl-piping-model-collections-2",
    "name": "Battik XL Piping model collections",
    "code": "NC-UNS-167",
    "sku": "NC-UNS-167",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 420,
    "mrp": 570,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 420,
    "coverImage": "/uploads/catalog/battik-xl-piping-model-collections-2.jpg",
    "images": [
      "/uploads/catalog/battik-xl-piping-model-collections-2.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "sku": "NC-UNS-167-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "image": "/uploads/catalog/battik-xl-piping-model-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "Batik Cotton",
    "material": "Batik Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium Batik Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 29,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "long-zip-xl-feeding-nighty-collections-2",
    "name": "Long Zip XL Feeding Nighty collections",
    "code": "NC-NIG-168",
    "sku": "NC-NIG-168",
    "category": "Nighty",
    "subcategory": "Double side vertical zip",
    "brand": "Nithi Collections",
    "price": 380,
    "mrp": 510,
    "discount": 25,
    "discountType": "percentage",
    "discountValue": 25,
    "finalPrice": 380,
    "coverImage": "/uploads/catalog/long-zip-xl-feeding-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/long-zip-xl-feeding-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 380,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-168-L"
      },
      {
        "size": "XL",
        "price": 380,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-168-XL"
      },
      {
        "size": "2XL",
        "price": 380,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-168-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "feeding-zip-nighty",
        "name": "Feeding Zip Nighty",
        "price": 380,
        "mrp": 510,
        "stock": 25,
        "image": "/uploads/catalog/long-zip-xl-feeding-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Feeding Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 30,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xxl-zip-model-nighty-collections-3",
    "name": "Queen XXL Zip model Nighty collections",
    "code": "NC-NIG-169",
    "sku": "NC-NIG-169",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 390,
    "mrp": 530,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 390,
    "coverImage": "/uploads/catalog/queen-xxl-zip-model-nighty-collections-3.jpg",
    "images": [
      "/uploads/catalog/queen-xxl-zip-model-nighty-collections-3.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-169-L"
      },
      {
        "size": "XL",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-169-XL"
      },
      {
        "size": "2XL",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-169-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "image": "/uploads/catalog/queen-xxl-zip-model-nighty-collections-3.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Queen quality Zip model nighty Price: 390rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 14,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xxl-zip-model-nighty-collections-4",
    "name": "Queen XXL Zip model Nighty collections",
    "code": "NC-NIG-170",
    "sku": "NC-NIG-170",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/queen-xxl-zip-model-nighty-collections-4.jpg",
    "images": [
      "/uploads/catalog/queen-xxl-zip-model-nighty-collections-4.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-170-L"
      },
      {
        "size": "XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-170-XL"
      },
      {
        "size": "2XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-170-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/queen-xxl-zip-model-nighty-collections-4.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Queen quality Zip model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 15,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "collar-xl-nighty-collections-2",
    "name": "Collar XL Nighty collections",
    "code": "NC-NIG-171",
    "sku": "NC-NIG-171",
    "category": "Nighty",
    "subcategory": "Collar model nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/collar-xl-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/collar-xl-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-171-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-171-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-171-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "collar-nighty",
        "name": "Collar Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/collar-xl-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Collar Zip Cotton nighty \nPrice: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Collar Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 16,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "xxl-size-night-dress-without-zip-model-collections",
    "name": "XXL size Night dress Without zip model collections",
    "code": "NC-NIG-172",
    "sku": "NC-NIG-172",
    "category": "Night dress",
    "subcategory": "2-Piece Night Dress",
    "brand": "Nithi Collections",
    "price": 375,
    "mrp": 510,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 375,
    "coverImage": "/uploads/catalog/xxl-size-night-dress-without-zip-model-collections.jpg",
    "images": [
      "/uploads/catalog/xxl-size-night-dress-without-zip-model-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-172-L"
      },
      {
        "size": "XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-172-XL"
      },
      {
        "size": "2XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-172-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "night-dress",
        "name": "Night Dress",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "image": "/uploads/catalog/xxl-size-night-dress-without-zip-model-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Elite Without Zip Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Night Dress (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 17,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "tie-dye-xl-zip-model-nighty-collections-2",
    "name": "Tie & Dye XL Zip model nighty collections",
    "code": "NC-NIG-173",
    "sku": "NC-NIG-173",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/tie-dye-xl-zip-model-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/tie-dye-xl-zip-model-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-173-L"
      },
      {
        "size": "XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-173-XL"
      },
      {
        "size": "2XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-173-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/tie-dye-xl-zip-model-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "Tie & Dye Cotton",
    "material": "Tie & Dye Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Tie & Dye zip Cotton nighty \nPrice: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 18,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "battick-xxl-without-zip-nighty-collections",
    "name": "Battick XXL Without zip nighty collections",
    "code": "NC-NIG-174",
    "sku": "NC-NIG-174",
    "category": "Nighty",
    "subcategory": "Zipless nighty",
    "brand": "Nithi Collections",
    "price": 420,
    "mrp": 570,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 420,
    "coverImage": "/uploads/catalog/battick-xxl-without-zip-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/battick-xxl-without-zip-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "sku": "NC-NIG-174-L"
      },
      {
        "size": "XL",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "sku": "NC-NIG-174-XL"
      },
      {
        "size": "2XL",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "sku": "NC-NIG-174-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zipless-nighty",
        "name": "Zipless Nighty",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "image": "/uploads/catalog/battick-xxl-without-zip-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zipless Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 19,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-xl-zip-model-nighty-collections-3",
    "name": "Elite XL Zip Model Nighty collections",
    "code": "NC-NIG-175",
    "sku": "NC-NIG-175",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/elite-xl-zip-model-nighty-collections-3.jpg",
    "images": [
      "/uploads/catalog/elite-xl-zip-model-nighty-collections-3.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-175-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-175-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-175-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/elite-xl-zip-model-nighty-collections-3.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 20,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xxl-without-zip-collections-2",
    "name": "Queen XXL without zip collections",
    "code": "NC-UNS-176",
    "sku": "NC-UNS-176",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/queen-xxl-without-zip-collections-2.jpg",
    "images": [
      "/uploads/catalog/queen-xxl-without-zip-collections-2.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-UNS-176-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/queen-xxl-without-zip-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "Queen XXL Size Piping model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 21,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "collar-xxl-zip-model-nighty-collections-4",
    "name": "Collar XXL Zip model Nighty collections",
    "code": "NC-NIG-177",
    "sku": "NC-NIG-177",
    "category": "Nighty",
    "subcategory": "Collar model nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/collar-xxl-zip-model-nighty-collections-4.jpg",
    "images": [
      "/uploads/catalog/collar-xxl-zip-model-nighty-collections-4.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-177-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-177-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-177-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "collar-nighty",
        "name": "Collar Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/collar-xxl-zip-model-nighty-collections-4.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Collar Zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Collar Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 22,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-3xl-zip-model-nighty-collections-2",
    "name": "Elite 3XL Zip model Nighty collections",
    "code": "NC-NIG-178",
    "sku": "NC-NIG-178",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 399,
    "mrp": 540,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 399,
    "coverImage": "/uploads/catalog/elite-3xl-zip-model-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/elite-3xl-zip-model-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL",
      "3XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "sku": "NC-NIG-178-L"
      },
      {
        "size": "XL",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "sku": "NC-NIG-178-XL"
      },
      {
        "size": "2XL",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "sku": "NC-NIG-178-2XL"
      },
      {
        "size": "3XL",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "sku": "NC-NIG-178-3XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "image": "/uploads/catalog/elite-3xl-zip-model-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (3XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 23,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-60inch-xxl-piping-model-collections-3",
    "name": "Elite 60inch XXL Piping Model collections",
    "code": "NC-UNS-179",
    "sku": "NC-UNS-179",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/elite-60inch-xxl-piping-model-collections-3.jpg",
    "images": [
      "/uploads/catalog/elite-60inch-xxl-piping-model-collections-3.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-UNS-179-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/elite-60inch-xxl-piping-model-collections-3.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 24,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "tie-dye-xl-piping-model-nighty-collections",
    "name": "Tie & Dye XL Piping model Nighty collections",
    "code": "NC-NIG-180",
    "sku": "NC-NIG-180",
    "category": "Nighty",
    "subcategory": "Piping nighty",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/tie-dye-xl-piping-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/tie-dye-xl-piping-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-180-L"
      },
      {
        "size": "XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-180-XL"
      },
      {
        "size": "2XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-180-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "piping-nighty",
        "name": "Piping Nighty",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/tie-dye-xl-piping-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "Tie & Dye Cotton",
    "material": "Tie & Dye Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Tie - Dye Piping Nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Piping Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 25,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "tie-dye-xl-zip-model-nighty-collections-3",
    "name": "Tie & Dye XL Zip model nighty collections",
    "code": "NC-NIG-181",
    "sku": "NC-NIG-181",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/tie-dye-xl-zip-model-nighty-collections-3.jpg",
    "images": [
      "/uploads/catalog/tie-dye-xl-zip-model-nighty-collections-3.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-181-L"
      },
      {
        "size": "XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-181-XL"
      },
      {
        "size": "2XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-181-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/tie-dye-xl-zip-model-nighty-collections-3.jpg",
        "active": true
      }
    ],
    "fabric": "Tie & Dye Cotton",
    "material": "Tie & Dye Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Tie & Dye zip Cotton nighty Price:360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 26,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "battik-xxl-zip-model-nighty-collections-2",
    "name": "Battik XXL Zip model Nighty collections",
    "code": "NC-NIG-182",
    "sku": "NC-NIG-182",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/battik-xxl-zip-model-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/battik-xxl-zip-model-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-182-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-182-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-182-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/battik-xxl-zip-model-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "Batik Cotton",
    "material": "Batik Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Battik Zip model nighty \nPrice: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 27,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "tie-dye-xxl-without-zip-collections-2",
    "name": "Tie & Dye XXL without Zip collections",
    "code": "NC-UNS-183",
    "sku": "NC-UNS-183",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/tie-dye-xxl-without-zip-collections-2.jpg",
    "images": [
      "/uploads/catalog/tie-dye-xxl-without-zip-collections-2.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-UNS-183-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/tie-dye-xxl-without-zip-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "Tie & Dye Cotton",
    "material": "Tie & Dye Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "XXL Size Tie & dye Piping model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium Tie & Dye Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 28,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-xl-zip-model-nighty-collections-4",
    "name": "Elite XL Zip Model Nighty collections",
    "code": "NC-NIG-184",
    "sku": "NC-NIG-184",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/elite-xl-zip-model-nighty-collections-4.jpg",
    "images": [
      "/uploads/catalog/elite-xl-zip-model-nighty-collections-4.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-184-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-184-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-184-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/elite-xl-zip-model-nighty-collections-4.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 29,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "collar-xxl-zip-nighty-collections",
    "name": "Collar XXL Zip nighty collections",
    "code": "NC-NIG-185",
    "sku": "NC-NIG-185",
    "category": "Nighty",
    "subcategory": "Collar model nighty",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/collar-xxl-zip-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/collar-xxl-zip-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-185-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-185-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-185-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "collar-nighty",
        "name": "Collar Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/collar-xxl-zip-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Collar Zip Cotton nighty Price:370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Collar Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 30,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "battik-xl-zip-model-nighty-collections",
    "name": "Battik XL Zip Model Nighty collections",
    "code": "NC-NIG-186",
    "sku": "NC-NIG-186",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/battik-xl-zip-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/battik-xl-zip-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-186-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-186-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-186-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/battik-xl-zip-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "Batik Cotton",
    "material": "Batik Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Battik zip Cotton nighty \nPrice: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 14,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-xxl-feeding-frock-model-nighty-3",
    "name": "Elite XXL Feeding Frock model nighty",
    "code": "NC-NIG-187",
    "sku": "NC-NIG-187",
    "category": "Nighty",
    "subcategory": "Double side vertical zip",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/elite-xxl-feeding-frock-model-nighty-3.jpg",
    "images": [
      "/uploads/catalog/elite-xxl-feeding-frock-model-nighty-3.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-187-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-187-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-187-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "feeding-zip-nighty",
        "name": "Feeding Zip Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/elite-xxl-feeding-frock-model-nighty-3.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Feeding Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 15,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xl-piping-model-nighty-collections",
    "name": "Queen XL Piping model Nighty collections",
    "code": "NC-NIG-188",
    "sku": "NC-NIG-188",
    "category": "Nighty",
    "subcategory": "Piping nighty",
    "brand": "Nithi Collections",
    "price": 390,
    "mrp": 530,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 390,
    "coverImage": "/uploads/catalog/queen-xl-piping-model-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/queen-xl-piping-model-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-188-L"
      },
      {
        "size": "XL",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-188-XL"
      },
      {
        "size": "2XL",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-188-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "piping-nighty",
        "name": "Piping Nighty",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "image": "/uploads/catalog/queen-xl-piping-model-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Queen quality Piping model nighty Price: 390rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Piping Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 16,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "3xl-tie-dye-without-zip-nighty-collections",
    "name": "3XL Tie & Dye Without zip nighty collections",
    "code": "NC-NIG-189",
    "sku": "NC-NIG-189",
    "category": "Nighty",
    "subcategory": "Zipless nighty",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/3xl-tie-dye-without-zip-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/3xl-tie-dye-without-zip-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL",
      "3XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-189-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-189-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-189-2XL"
      },
      {
        "size": "3XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-189-3XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zipless-nighty",
        "name": "Zipless Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/3xl-tie-dye-without-zip-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "Tie & Dye Cotton",
    "material": "Tie & Dye Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "3XL Size Tie & Dye  Piping model nighty Price: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zipless Nighty (3XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 17,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "xxl-size-night-dress-zip-model-collections-2",
    "name": "XXL Size Night dress Zip model collections",
    "code": "NC-NIG-190",
    "sku": "NC-NIG-190",
    "category": "Night dress",
    "subcategory": "2-Piece Night Dress",
    "brand": "Nithi Collections",
    "price": 375,
    "mrp": 510,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 375,
    "coverImage": "/uploads/catalog/xxl-size-night-dress-zip-model-collections-2.jpg",
    "images": [
      "/uploads/catalog/xxl-size-night-dress-zip-model-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-190-L"
      },
      {
        "size": "XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-190-XL"
      },
      {
        "size": "2XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-190-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "night-dress",
        "name": "Night Dress",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "image": "/uploads/catalog/xxl-size-night-dress-zip-model-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Elite Zip Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Night Dress (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 18,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xl-zip-nighty-collections-3",
    "name": "Queen XL Zip Nighty collections",
    "code": "NC-NIG-191",
    "sku": "NC-NIG-191",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 360,
    "mrp": 490,
    "discount": 27,
    "discountType": "percentage",
    "discountValue": 27,
    "finalPrice": 360,
    "coverImage": "/uploads/catalog/queen-xl-zip-nighty-collections-3.jpg",
    "images": [
      "/uploads/catalog/queen-xl-zip-nighty-collections-3.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-191-L"
      },
      {
        "size": "XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-191-XL"
      },
      {
        "size": "2XL",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "sku": "NC-NIG-191-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 360,
        "mrp": 490,
        "stock": 25,
        "image": "/uploads/catalog/queen-xl-zip-nighty-collections-3.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Queen zip Cotton nighty \nPrice: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 19,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-60inch-xl-zip-collections-2",
    "name": "Elite 60inch XL zip collections",
    "code": "NC-UNS-192",
    "sku": "NC-UNS-192",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 399,
    "mrp": 540,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 399,
    "coverImage": "/uploads/catalog/elite-60inch-xl-zip-collections-2.jpg",
    "images": [
      "/uploads/catalog/elite-60inch-xl-zip-collections-2.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "sku": "NC-UNS-192-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 399,
        "mrp": 540,
        "stock": 25,
        "image": "/uploads/catalog/elite-60inch-xl-zip-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 20,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "l-size-night-dress-without-zip-collections",
    "name": "L Size Night dress Without zip collections",
    "code": "NC-NIG-193",
    "sku": "NC-NIG-193",
    "category": "Night dress",
    "subcategory": "2-Piece Night Dress",
    "brand": "Nithi Collections",
    "price": 375,
    "mrp": 510,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 375,
    "coverImage": "/uploads/catalog/l-size-night-dress-without-zip-collections.jpg",
    "images": [
      "/uploads/catalog/l-size-night-dress-without-zip-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-193-L"
      },
      {
        "size": "XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-193-XL"
      },
      {
        "size": "2XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-193-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "night-dress",
        "name": "Night Dress",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "image": "/uploads/catalog/l-size-night-dress-without-zip-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "L Size Elite Without Zip Night suit collections  Price : 375rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Night Dress (L)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 21,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-3xl-piping-model-nighty-collections-3",
    "name": "Elite 3XL Piping Model nighty collections",
    "code": "NC-NIG-194",
    "sku": "NC-NIG-194",
    "category": "Nighty",
    "subcategory": "Piping nighty",
    "brand": "Nithi Collections",
    "price": 350,
    "mrp": 470,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 350,
    "coverImage": "/uploads/catalog/elite-3xl-piping-model-nighty-collections-3.jpg",
    "images": [
      "/uploads/catalog/elite-3xl-piping-model-nighty-collections-3.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL",
      "3XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-194-L"
      },
      {
        "size": "XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-194-XL"
      },
      {
        "size": "2XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-194-2XL"
      },
      {
        "size": "3XL",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "sku": "NC-NIG-194-3XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "piping-nighty",
        "name": "Piping Nighty",
        "price": 350,
        "mrp": 470,
        "stock": 25,
        "image": "/uploads/catalog/elite-3xl-piping-model-nighty-collections-3.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "3XL Size Elite Piping model nighty Price: 350rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Piping Nighty (3XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 22,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "queen-xxl-without-zip-nighty-collections",
    "name": "Queen XXL without zip nighty collections",
    "code": "NC-NIG-195",
    "sku": "NC-NIG-195",
    "category": "Nighty",
    "subcategory": "Zipless nighty",
    "brand": "Nithi Collections",
    "price": 390,
    "mrp": 530,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 390,
    "coverImage": "/uploads/catalog/queen-xxl-without-zip-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/queen-xxl-without-zip-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-195-L"
      },
      {
        "size": "XL",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-195-XL"
      },
      {
        "size": "2XL",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "sku": "NC-NIG-195-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zipless-nighty",
        "name": "Zipless Nighty",
        "price": 390,
        "mrp": 530,
        "stock": 25,
        "image": "/uploads/catalog/queen-xxl-without-zip-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "Queen XXL Size Piping model nighty Price: 390rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zipless Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 23,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "xl-night-dress-without-zip-collections",
    "name": "XL Night dress Without Zip collections",
    "code": "NC-NIG-196",
    "sku": "NC-NIG-196",
    "category": "Night dress",
    "subcategory": "2-Piece Night Dress",
    "brand": "Nithi Collections",
    "price": 375,
    "mrp": 510,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 375,
    "coverImage": "/uploads/catalog/xl-night-dress-without-zip-collections.jpg",
    "images": [
      "/uploads/catalog/xl-night-dress-without-zip-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-196-L"
      },
      {
        "size": "XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-196-XL"
      },
      {
        "size": "2XL",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "sku": "NC-NIG-196-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "night-dress",
        "name": "Night Dress",
        "price": 375,
        "mrp": 510,
        "stock": 25,
        "image": "/uploads/catalog/xl-night-dress-without-zip-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Elite Without Zip Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Night Dress (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 24,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.646Z",
    "updatedAt": "2026-11-20T13:31:09.646Z"
  },
  {
    "id": "elite-60inch-4xl-zip-collections",
    "name": "Elite 60inch 4XL Zip collections",
    "code": "NC-UNS-197",
    "sku": "NC-UNS-197",
    "category": "Unstitched salwar material",
    "subcategory": "Unstitched Salwar Material",
    "brand": "Nithi Collections",
    "price": 450,
    "mrp": 610,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 450,
    "coverImage": "/uploads/catalog/elite-60inch-4xl-zip-collections.jpg",
    "images": [
      "/uploads/catalog/elite-60inch-4xl-zip-collections.jpg"
    ],
    "sizes": [
      "Free Size"
    ],
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 450,
        "mrp": 610,
        "stock": 25,
        "sku": "NC-UNS-197-Free Size"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "salwar-material",
        "name": "Salwar Material",
        "price": 450,
        "mrp": 610,
        "stock": 25,
        "image": "/uploads/catalog/elite-60inch-4xl-zip-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "productLength": "Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m",
    "pattern": "Printed",
    "sleeveType": "Unstitched",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Premium 100% Pure Cotton Unstitched Salwar Material with Dupatta",
    "care": "First wash dry clean recommended. Gentle hand wash thereafter.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 25,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.647Z",
    "updatedAt": "2026-11-20T13:31:09.647Z"
  },
  {
    "id": "elite-xl-zip-nighty-collections",
    "name": "Elite XL Zip Nighty collections",
    "code": "NC-NIG-198",
    "sku": "NC-NIG-198",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 340,
    "mrp": 460,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 340,
    "coverImage": "/uploads/catalog/elite-xl-zip-nighty-collections.jpg",
    "images": [
      "/uploads/catalog/elite-xl-zip-nighty-collections.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-198-L"
      },
      {
        "size": "XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-198-XL"
      },
      {
        "size": "2XL",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "sku": "NC-NIG-198-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 340,
        "mrp": 460,
        "stock": 25,
        "image": "/uploads/catalog/elite-xl-zip-nighty-collections.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XL Size Elite zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 26,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.647Z",
    "updatedAt": "2026-11-20T13:31:09.647Z"
  },
  {
    "id": "battik-xl-zip-model-nighty-collections-2",
    "name": "Battik XL Zip Model Nighty collections",
    "code": "NC-NIG-199",
    "sku": "NC-NIG-199",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 420,
    "mrp": 570,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 420,
    "coverImage": "/uploads/catalog/battik-xl-zip-model-nighty-collections-2.jpg",
    "images": [
      "/uploads/catalog/battik-xl-zip-model-nighty-collections-2.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "sku": "NC-NIG-199-L"
      },
      {
        "size": "XL",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "sku": "NC-NIG-199-XL"
      },
      {
        "size": "2XL",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "sku": "NC-NIG-199-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "image": "/uploads/catalog/battik-xl-zip-model-nighty-collections-2.jpg",
        "active": true
      }
    ],
    "fabric": "Batik Cotton",
    "material": "Batik Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 27,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.647Z",
    "updatedAt": "2026-11-20T13:31:09.647Z"
  },
  {
    "id": "collar-xxl-zip-model-nighty-collections-5",
    "name": "Collar XXL zip model nighty collections",
    "code": "NC-NIG-200",
    "sku": "NC-NIG-200",
    "category": "Nighty",
    "subcategory": "Collar model nighty",
    "brand": "Nithi Collections",
    "price": 370,
    "mrp": 500,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 370,
    "coverImage": "/uploads/catalog/collar-xxl-zip-model-nighty-collections-5.jpg",
    "images": [
      "/uploads/catalog/collar-xxl-zip-model-nighty-collections-5.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-200-L"
      },
      {
        "size": "XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-200-XL"
      },
      {
        "size": "2XL",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "sku": "NC-NIG-200-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "collar-nighty",
        "name": "Collar Nighty",
        "price": 370,
        "mrp": 500,
        "stock": 25,
        "image": "/uploads/catalog/collar-xxl-zip-model-nighty-collections-5.jpg",
        "active": true
      }
    ],
    "fabric": "100% Pure Cotton",
    "material": "100% Pure Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "XXL Size Collar Zip Cotton nighty Price:370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Collar Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 28,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": false,
    "createdAt": "2026-11-20T13:31:09.647Z",
    "updatedAt": "2026-11-20T13:31:09.647Z"
  },
  {
    "id": "battik-xxl-zip-model-nighty-collections-3",
    "name": "Battik XXL Zip model Nighty collections",
    "code": "NC-NIG-201",
    "sku": "NC-NIG-201",
    "category": "Nighty",
    "subcategory": "Zip nighty",
    "brand": "Nithi Collections",
    "price": 420,
    "mrp": 570,
    "discount": 26,
    "discountType": "percentage",
    "discountValue": 26,
    "finalPrice": 420,
    "coverImage": "/uploads/catalog/battik-xxl-zip-model-nighty-collections-3.jpg",
    "images": [
      "/uploads/catalog/battik-xxl-zip-model-nighty-collections-3.jpg"
    ],
    "sizes": [
      "L",
      "XL",
      "2XL"
    ],
    "sizeOptions": [
      {
        "size": "L",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "sku": "NC-NIG-201-L"
      },
      {
        "size": "XL",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "sku": "NC-NIG-201-XL"
      },
      {
        "size": "2XL",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "sku": "NC-NIG-201-2XL"
      }
    ],
    "colors": [],
    "productTypes": [
      {
        "id": "zip-nighty",
        "name": "Zip Nighty",
        "price": 420,
        "mrp": 570,
        "stock": 25,
        "image": "/uploads/catalog/battik-xxl-zip-model-nighty-collections-3.jpg",
        "active": true
      }
    ],
    "fabric": "Batik Cotton",
    "material": "Batik Cotton",
    "length": "55 Inches",
    "productLength": "55 Inches",
    "pattern": "Printed",
    "sleeveType": "Half Sleeve",
    "neckType": "Round Neck",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "shortDescription": "Pure Breathable Cotton Zip Nighty (XXL)",
    "care": "Machine wash cold with like colors. Do not bleach. Dry in shade.",
    "inStock": true,
    "stock": 25,
    "status": "ACTIVE",
    "rating": 4.8,
    "reviews": 29,
    "newArrival": false,
    "isNew": false,
    "isBestSeller": true,
    "createdAt": "2026-11-20T13:31:09.647Z",
    "updatedAt": "2026-11-20T13:31:09.647Z"
  }
];

export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getProductsByCategory = (category: string) =>
  products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
export const getBestSellers = () => products.filter((p) => p.isBestSeller);
