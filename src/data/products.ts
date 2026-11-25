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
  lowStockThreshold?: number;
  reservedStock?: number;
  soldQuantity?: number;
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
    "id": "budget-friendly-cotton-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-001",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/budget-friendly-cotton-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:19.026Z",
    "description": "*Cotton chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹550\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 550,
    "images": [
      "/uploads/budget-friendly-cotton-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 689,
    "name": "Budget friendly Cotton Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 550,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 12,
    "shortDescription": "Cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 550,
        "mrp": 689,
        "stock": 100,
        "sku": "NC-UNS-001-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-001",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.329Z",
    "variants": []
  },
  {
    "id": "budget-friendly-cotton-unstitched-salwar-material-collection",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-002",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/budget-friendly-cotton-unstitched-salwar-material-collection.jpg",
    "createdAt": "2026-11-24T09:02:19.442Z",
    "description": "*Cotton chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹550\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 550,
    "images": [
      "/uploads/budget-friendly-cotton-unstitched-salwar-material-collection.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 689,
    "name": "Budget friendly Cotton Unstitched salwar material collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 550,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 13,
    "shortDescription": "Cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 550,
        "mrp": 689,
        "stock": 100,
        "sku": "NC-UNS-002-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-002",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.379Z",
    "variants": []
  },
  {
    "id": "battik-unstitched-salwar-material-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-003",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/battik-unstitched-salwar-material-collections.jpg",
    "createdAt": "2026-11-24T09:02:19.752Z",
    "description": "*Batik cotton chudi material*\n\nFabric : Batik cotton\n\n*Top* : 2.35 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.25 meter\n\n*Price* : ₹699\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Batik Pure Cotton",
    "finalPrice": 699,
    "images": [
      "/uploads/battik-unstitched-salwar-material-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 879,
    "name": "Battik unstitched salwar material collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 699,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 14,
    "shortDescription": "Batik cotton chudi material Fabric : Batik cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 699,
        "mrp": 879,
        "stock": 100,
        "sku": "NC-UNS-003-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-003",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.420Z",
    "variants": []
  },
  {
    "id": "kalamkari-2-piece-set",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-004",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/kalamkari-2-piece-set.jpg",
    "createdAt": "2026-11-24T09:02:20.098Z",
    "description": "*Kalamkari 2 piece set chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 2.5 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹550\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 580,
    "images": [
      "/uploads/kalamkari-2-piece-set.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 729,
    "name": "Kalamkari 2 piece set",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 580,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 15,
    "shortDescription": "Kalamkari 2 piece set chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 580,
        "mrp": 729,
        "stock": 100,
        "sku": "NC-UNS-004-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-004",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.462Z",
    "variants": []
  },
  {
    "id": "ikkat-cotton-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-005",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/ikkat-cotton-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:20.452Z",
    "description": "*Ikkat model cotton chudi material*\n\nFabric : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.25 meter\n\n*Price* : ₹699\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 699,
    "images": [
      "/uploads/ikkat-cotton-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 879,
    "name": "Ikkat Cotton Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 699,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 16,
    "shortDescription": "Ikkat model cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 699,
        "mrp": 879,
        "stock": 100,
        "sku": "NC-UNS-005-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-005",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.512Z",
    "variants": []
  },
  {
    "id": "premium-kanchi-soft-silk-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-006",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/premium-kanchi-soft-silk-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:20.680Z",
    "description": "*Premium Kanchi soft silk salwar material*\n\n*Fabric* : Soft Silk\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.0 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹1299\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 1299,
    "images": [
      "/uploads/premium-kanchi-soft-silk-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1629,
    "name": "Premium Kanchi soft silk Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 1299,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 17,
    "shortDescription": "Premium Kanchi soft silk salwar material Fabric : Soft Silk",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 1299,
        "mrp": 1629,
        "stock": 100,
        "sku": "NC-UNS-006-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-006",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.551Z",
    "variants": []
  },
  {
    "id": "kalamkari-design-unstitched-salwar-material-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-007",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/kalamkari-design-unstitched-salwar-material-collections.jpg",
    "createdAt": "2026-11-24T09:02:20.960Z",
    "description": "*Kalamkari cotton chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹850\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 850,
    "images": [
      "/uploads/kalamkari-design-unstitched-salwar-material-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1069,
    "name": "Kalamkari design Unstitched salwar material collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 850,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 18,
    "shortDescription": "Kalamkari cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 850,
        "mrp": 1069,
        "stock": 100,
        "sku": "NC-UNS-007-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-007",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.593Z",
    "variants": []
  },
  {
    "id": "cotton-unstitched-salwar-material-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-008",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/cotton-unstitched-salwar-material-collections.jpg",
    "createdAt": "2026-11-24T09:02:21.203Z",
    "description": "*Cotton chudi material with grand shawl*\n\nFabric : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.4 meter\n\n*Price* : ₹999\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 999,
    "images": [
      "/uploads/cotton-unstitched-salwar-material-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1249,
    "name": "Cotton Unstitched salwar material collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 999,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 19,
    "shortDescription": "Cotton chudi material with grand shawl Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 999,
        "mrp": 1249,
        "stock": 100,
        "sku": "NC-UNS-008-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-008",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.633Z",
    "variants": []
  },
  {
    "id": "mangalagiri-cotton-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-009",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/mangalagiri-cotton-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:21.636Z",
    "description": "*Mangalagiri cotton chudi material*\n\nFabric : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.25 meter\n\n*Price* : ₹750\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 750,
    "images": [
      "/uploads/mangalagiri-cotton-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 939,
    "name": "Mangalagiri cotton salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 750,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 20,
    "shortDescription": "Mangalagiri cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 750,
        "mrp": 939,
        "stock": 100,
        "sku": "NC-UNS-009-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-009",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.682Z",
    "variants": []
  },
  {
    "id": "battik-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-010",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/battik-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:21.988Z",
    "description": "*Batik cotton chudi material*\n\nFabric : Batik cotton\n\n*Top* : 2.35 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.25 meter\n\n*Price* : ₹650\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "Batik Pure Cotton",
    "finalPrice": 650,
    "images": [
      "/uploads/battik-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 819,
    "name": "Battik Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 650,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 21,
    "shortDescription": "Batik cotton chudi material Fabric : Batik cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 650,
        "mrp": 819,
        "stock": 100,
        "sku": "NC-UNS-010-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-010",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.726Z",
    "variants": []
  },
  {
    "id": "battik-unstitched-salwar-material-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-011",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/battik-unstitched-salwar-material-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:22.407Z",
    "description": "*Batik cotton chudi material*\n\nFabric : Batik cotton\n\n*Top* : 2.35 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.25 meter\n\n*Price* : ₹650\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "Batik Pure Cotton",
    "finalPrice": 650,
    "images": [
      "/uploads/battik-unstitched-salwar-material-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 819,
    "name": "Battik Unstitched salwar material collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 650,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 22,
    "shortDescription": "Batik cotton chudi material Fabric : Batik cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 650,
        "mrp": 819,
        "stock": 100,
        "sku": "NC-UNS-011-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-011",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.764Z",
    "variants": []
  },
  {
    "id": "kalamkari-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-012",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/kalamkari-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:22.796Z",
    "description": "*Dual shade kalamkari cotton chudi material*\n\nFabric : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹830\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 830,
    "images": [
      "/uploads/kalamkari-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1039,
    "name": "Kalamkari Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 830,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 23,
    "shortDescription": "Dual shade kalamkari cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 830,
        "mrp": 1039,
        "stock": 100,
        "sku": "NC-UNS-012-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-012",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.801Z",
    "variants": []
  },
  {
    "id": "handloom-cotton-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-013",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/handloom-cotton-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:23.107Z",
    "description": "*Handloom Cotton chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.4 meter\n\n*Price* : ₹850\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 850,
    "images": [
      "/uploads/handloom-cotton-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1069,
    "name": "Handloom cotton Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 850,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 24,
    "shortDescription": "Handloom Cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 850,
        "mrp": 1069,
        "stock": 100,
        "sku": "NC-UNS-013-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-013",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.843Z",
    "variants": []
  },
  {
    "id": "handloom-cotton-unstitched-salwar-material-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-014",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/handloom-cotton-unstitched-salwar-material-2.jpg",
    "createdAt": "2026-11-24T09:02:23.340Z",
    "description": "*Handloom Cotton chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.4 meter\n\n*Price* : ₹799\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 799,
    "images": [
      "/uploads/handloom-cotton-unstitched-salwar-material-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 999,
    "name": "Handloom cotton Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 799,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 25,
    "shortDescription": "Handloom Cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 799,
        "mrp": 999,
        "stock": 100,
        "sku": "NC-UNS-014-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-014",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.881Z",
    "variants": []
  },
  {
    "id": "mangalagiri-cotton-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-015",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/mangalagiri-cotton-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:23.659Z",
    "description": "*Mangalagiri cotton chudi material*\n\nFabric : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.25 meter\n\n*Price* : ₹750\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 750,
    "images": [
      "/uploads/mangalagiri-cotton-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 939,
    "name": "Mangalagiri cotton Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 750,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 26,
    "shortDescription": "Mangalagiri cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 750,
        "mrp": 939,
        "stock": 100,
        "sku": "NC-UNS-015-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-015",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.919Z",
    "variants": []
  },
  {
    "id": "premium-kanchi-soft-silk-unstitched-salwar-material-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-016",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/premium-kanchi-soft-silk-unstitched-salwar-material-2.jpg",
    "createdAt": "2026-11-24T09:02:23.891Z",
    "description": "*Premium Kanchi soft silk salwar material*\n\n*Fabric* : Soft Silk\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.0 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹1199\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 1199,
    "images": [
      "/uploads/premium-kanchi-soft-silk-unstitched-salwar-material-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1499,
    "name": "Premium Kanchi soft silk Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 1199,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 27,
    "shortDescription": "Premium Kanchi soft silk salwar material Fabric : Soft Silk",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 1199,
        "mrp": 1499,
        "stock": 100,
        "sku": "NC-UNS-016-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-016",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.958Z",
    "variants": []
  },
  {
    "id": "tie-dye-embroidery-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-017",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/tie-dye-embroidery-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:24.315Z",
    "description": "*Tie & dye Unstitched salwar material*\n\n*Fabric* : Cotton\n\n*Top* : 2.35 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹799\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 799,
    "images": [
      "/uploads/tie-dye-embroidery-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 999,
    "name": "Tie & Dye Embroidery unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 799,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 28,
    "shortDescription": "Tie & dye Unstitched salwar material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 799,
        "mrp": 999,
        "stock": 100,
        "sku": "NC-UNS-017-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-017",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:51.997Z",
    "variants": []
  },
  {
    "id": "bhagalpur-cotton-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-018",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/bhagalpur-cotton-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:24.699Z",
    "description": "*Bhagalpuri cotton chudi material*\n\nFabric : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.4 meter\n\n*Price* : ₹799\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 799,
    "images": [
      "/uploads/bhagalpur-cotton-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 999,
    "name": "Bhagalpur cotton Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 799,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 29,
    "shortDescription": "Bhagalpuri cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 799,
        "mrp": 999,
        "stock": 100,
        "sku": "NC-UNS-018-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-018",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.034Z",
    "variants": []
  },
  {
    "id": "bhagalpuri-unstitched-salwar-material-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-019",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/bhagalpuri-unstitched-salwar-material-collections.jpg",
    "createdAt": "2026-11-24T09:02:24.939Z",
    "description": "*Bhagalpuri cotton chudi material*\n\nFabric : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.5 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹899\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 899,
    "images": [
      "/uploads/bhagalpuri-unstitched-salwar-material-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1129,
    "name": "Bhagalpuri Unstitched salwar material collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 899,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 12,
    "shortDescription": "Bhagalpuri cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 899,
        "mrp": 1129,
        "stock": 100,
        "sku": "NC-UNS-019-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-019",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.072Z",
    "variants": []
  },
  {
    "id": "mangalagiri-cotton-chudi-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-020",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/mangalagiri-cotton-chudi-material.jpg",
    "createdAt": "2026-11-24T09:02:25.298Z",
    "description": "*Mangalagiri cotton chudi material*\n\nFabric : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.25 meter\n\n*Price* : ₹750\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 750,
    "images": [
      "/uploads/mangalagiri-cotton-chudi-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": true,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 939,
    "name": "Mangalagiri cotton chudi material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": true,
    "pattern": "Printed Handcrafted",
    "price": 750,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 13,
    "shortDescription": "Mangalagiri cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 750,
        "mrp": 939,
        "stock": 100,
        "sku": "NC-UNS-020-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-020",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.112Z",
    "variants": []
  },
  {
    "id": "jute-cotton-with-tassur-silk-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-021",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/jute-cotton-with-tassur-silk-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:25.490Z",
    "description": "*Jute cotton with tassure silk chudi material*\n\nFabric : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.5 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹899\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 899,
    "images": [
      "/uploads/jute-cotton-with-tassur-silk-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1129,
    "name": "Jute cotton with tassur silk Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 899,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 14,
    "shortDescription": "Jute cotton with tassure silk chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 899,
        "mrp": 1129,
        "stock": 100,
        "sku": "NC-UNS-021-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-021",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.149Z",
    "variants": []
  },
  {
    "id": "katan-silk-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-022",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/katan-silk-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:25.724Z",
    "description": "*Katan silk chudi material*\n\n*Fabric* : Silk\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.5 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹1070\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 1070,
    "images": [
      "/uploads/katan-silk-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1339,
    "name": "Katan Silk Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 1070,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 15,
    "shortDescription": "Katan silk chudi material Fabric : Silk",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 1070,
        "mrp": 1339,
        "stock": 100,
        "sku": "NC-UNS-022-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-022",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.186Z",
    "variants": []
  },
  {
    "id": "raw-silk-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-023",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/raw-silk-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:25.945Z",
    "description": "*Slub cotton (Raw silk) cotton chudi material*\n\nFabric : Raw silk\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹799\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 799,
    "images": [
      "/uploads/raw-silk-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 999,
    "name": "Raw silk Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 799,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 16,
    "shortDescription": "Slub cotton (Raw silk) cotton chudi material Fabric : Raw silk",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 799,
        "mrp": 999,
        "stock": 100,
        "sku": "NC-UNS-023-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-023",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.225Z",
    "variants": []
  },
  {
    "id": "tissue-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-024",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/tissue-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:26.332Z",
    "description": "*Tissue chudi material*\n\n*Fabric* : Tissue\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹799\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 799,
    "images": [
      "/uploads/tissue-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 999,
    "name": "Tissue unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 799,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 17,
    "shortDescription": "Tissue chudi material Fabric : Tissue",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 799,
        "mrp": 999,
        "stock": 100,
        "sku": "NC-UNS-024-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-024",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.262Z",
    "variants": []
  },
  {
    "id": "sungudi-cotton-unstitched-salwar-material-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-025",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/sungudi-cotton-unstitched-salwar-material-collections.jpg",
    "createdAt": "2026-11-24T09:02:26.588Z",
    "description": "*Sungudi cotton chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹920\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 920,
    "images": [
      "/uploads/sungudi-cotton-unstitched-salwar-material-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1150,
    "name": "Sungudi cotton Unstitched salwar material collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 920,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 18,
    "shortDescription": "Sungudi cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 920,
        "mrp": 1150,
        "stock": 100,
        "sku": "NC-UNS-025-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-025",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.314Z",
    "variants": []
  },
  {
    "id": "katan-silk-unstitched-salwar-material-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-026",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/katan-silk-unstitched-salwar-material-collections.jpg",
    "createdAt": "2026-11-24T09:02:26.934Z",
    "description": "*Katan silk chudi material*\n\n*Fabric* : Silk\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.5 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹1070\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 1070,
    "images": [
      "/uploads/katan-silk-unstitched-salwar-material-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1339,
    "name": "Katan silk Unstitched salwar material collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 1070,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 19,
    "shortDescription": "Katan silk chudi material Fabric : Silk",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 1070,
        "mrp": 1339,
        "stock": 100,
        "sku": "NC-UNS-026-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-026",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.353Z",
    "variants": []
  },
  {
    "id": "katan-silk-unstitched-salwar-material-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-027",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/katan-silk-unstitched-salwar-material-2.jpg",
    "createdAt": "2026-11-24T09:02:27.234Z",
    "description": "*Katan silk chudi material*\n\n*Fabric* : Silk\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.5 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹1070\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 1070,
    "images": [
      "/uploads/katan-silk-unstitched-salwar-material-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1339,
    "name": "Katan silk Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 1070,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 20,
    "shortDescription": "Katan silk chudi material Fabric : Silk",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 1070,
        "mrp": 1339,
        "stock": 100,
        "sku": "NC-UNS-027-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-027",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.391Z",
    "variants": []
  },
  {
    "id": "ikkat-handloom-cotton-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-028",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/ikkat-handloom-cotton-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:27.511Z",
    "description": "*Handloom Ikkat chudi material*\n\nFabric : Handloom Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹899\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 899,
    "images": [
      "/uploads/ikkat-handloom-cotton-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1129,
    "name": "Ikkat Handloom cotton salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 899,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 21,
    "shortDescription": "Handloom Ikkat chudi material Fabric : Handloom Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 899,
        "mrp": 1129,
        "stock": 100,
        "sku": "NC-UNS-028-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-028",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.429Z",
    "variants": []
  },
  {
    "id": "ikkat-handloom-cotton-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-029",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/ikkat-handloom-cotton-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:27.770Z",
    "description": "*Handloom Ikkat chudi material*\n\nFabric : Handloom Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹899\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 899,
    "images": [
      "/uploads/ikkat-handloom-cotton-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1129,
    "name": "Ikkat Handloom cotton Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 899,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 22,
    "shortDescription": "Handloom Ikkat chudi material Fabric : Handloom Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 899,
        "mrp": 1129,
        "stock": 100,
        "sku": "NC-UNS-029-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-029",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.467Z",
    "variants": []
  },
  {
    "id": "premium-kanchi-cotton-2-piece-set-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-030",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/premium-kanchi-cotton-2-piece-set-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:28.081Z",
    "description": "*Premium Kanchi cotton 2 piece set salwar material*\n\n*Fabric* : Cotton\n\n*Top* : 3 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹1199\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 1199,
    "images": [
      "/uploads/premium-kanchi-cotton-2-piece-set-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1499,
    "name": "Premium Kanchi cotton 2 piece set salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 1199,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 23,
    "shortDescription": "Premium Kanchi cotton 2 piece set salwar material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 1199,
        "mrp": 1499,
        "stock": 100,
        "sku": "NC-UNS-030-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-030",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.504Z",
    "variants": []
  },
  {
    "id": "soft-battik-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-031",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/soft-battik-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:28.397Z",
    "description": "*Soft Batik chudi material*\n\nFabric : Batik\n\n*Top* : 2.35 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.25 meter\n\n*Price* : ₹599\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 599,
    "images": [
      "/uploads/soft-battik-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 749,
    "name": "Soft Battik Salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 599,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 24,
    "shortDescription": "Soft Batik chudi material Fabric : Batik",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 599,
        "mrp": 749,
        "stock": 100,
        "sku": "NC-UNS-031-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-031",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.543Z",
    "variants": []
  },
  {
    "id": "poochampally-sico-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-032",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/poochampally-sico-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:28.719Z",
    "description": "*Poochampally silk chudi material*\n\n*Fabric* : Silk\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.0 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹1150\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 1150,
    "images": [
      "/uploads/poochampally-sico-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1439,
    "name": "Poochampally sico unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 1150,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 25,
    "shortDescription": "Poochampally silk chudi material Fabric : Silk",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 1150,
        "mrp": 1439,
        "stock": 100,
        "sku": "NC-UNS-032-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-032",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.580Z",
    "variants": []
  },
  {
    "id": "semi-mangalagiri-silk-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-033",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/semi-mangalagiri-silk-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:28.886Z",
    "description": "*Semi Mangalagiri silk salwar material*\n\nFabric : Silk\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.5 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹999\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 999,
    "images": [
      "/uploads/semi-mangalagiri-silk-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1249,
    "name": "Semi Mangalagiri silk salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 999,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 26,
    "shortDescription": "Semi Mangalagiri silk salwar material Fabric : Silk",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 999,
        "mrp": 1249,
        "stock": 100,
        "sku": "NC-UNS-033-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-033",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.617Z",
    "variants": []
  },
  {
    "id": "kalamkari-unstitched-salwar-material-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-034",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/kalamkari-unstitched-salwar-material-2.jpg",
    "createdAt": "2026-11-24T09:02:29.223Z",
    "description": "*Kalamkari cotton chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.25 meter\n\n*Price* : ₹750\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 750,
    "images": [
      "/uploads/kalamkari-unstitched-salwar-material-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 939,
    "name": "Kalamkari Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 750,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 27,
    "shortDescription": "Kalamkari cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 750,
        "mrp": 939,
        "stock": 100,
        "sku": "NC-UNS-034-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-034",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.655Z",
    "variants": []
  },
  {
    "id": "bhagalpuri-cotton-chudi-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-035",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/bhagalpuri-cotton-chudi-material.jpg",
    "createdAt": "2026-11-24T09:02:29.588Z",
    "description": "*Bhagalpuri cotton chudi material*\n\nFabric : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.4 meter\n\n*Price* : ₹799\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 799,
    "images": [
      "/uploads/bhagalpuri-cotton-chudi-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 999,
    "name": "Bhagalpuri cotton chudi material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 799,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 28,
    "shortDescription": "Bhagalpuri cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 799,
        "mrp": 999,
        "stock": 100,
        "sku": "NC-UNS-035-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-035",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.694Z",
    "variants": []
  },
  {
    "id": "kalamkari-kalahasti-2-piece-set",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-036",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/kalamkari-kalahasti-2-piece-set.jpg",
    "createdAt": "2026-11-24T09:02:29.996Z",
    "description": "*Kalamkari Kalahasti print 2 piece set chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 2.5 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹699\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 699,
    "images": [
      "/uploads/kalamkari-kalahasti-2-piece-set.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 879,
    "name": "Kalamkari Kalahasti 2 piece set",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 699,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 29,
    "shortDescription": "Kalamkari Kalahasti print 2 piece set chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 699,
        "mrp": 879,
        "stock": 100,
        "sku": "NC-UNS-036-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-036",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.732Z",
    "variants": []
  },
  {
    "id": "pochampally-sico-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-037",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/pochampally-sico-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:30.398Z",
    "description": "*Poochampally silk chudi material*\n\n*Fabric* : Silk\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.0 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹1150\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 1150,
    "images": [
      "/uploads/pochampally-sico-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1439,
    "name": "Pochampally sico unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 1150,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 12,
    "shortDescription": "Poochampally silk chudi material Fabric : Silk",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 1150,
        "mrp": 1439,
        "stock": 100,
        "sku": "NC-UNS-037-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-037",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.774Z",
    "variants": []
  },
  {
    "id": "katan-silk-discharge-print-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-038",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/katan-silk-discharge-print-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:30.615Z",
    "description": "*Katan silk discharge print chudi material*\n\n*Fabric* : Silk\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.5 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹999\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 999,
    "images": [
      "/uploads/katan-silk-discharge-print-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1249,
    "name": "Katan silk discharge print Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 999,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 13,
    "shortDescription": "Katan silk discharge print chudi material Fabric : Silk",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 999,
        "mrp": 1249,
        "stock": 100,
        "sku": "NC-UNS-038-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-038",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.812Z",
    "variants": []
  },
  {
    "id": "katan-silk-discharge-print",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-039",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/katan-silk-discharge-print.jpg",
    "createdAt": "2026-11-24T09:02:30.928Z",
    "description": "*Katan silk discharge print chudi material*\n\n*Fabric* : Silk\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.5 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹999\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 999,
    "images": [
      "/uploads/katan-silk-discharge-print.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1249,
    "name": "Katan silk discharge print",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 999,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 14,
    "shortDescription": "Katan silk discharge print chudi material Fabric : Silk",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 999,
        "mrp": 1249,
        "stock": 100,
        "sku": "NC-UNS-039-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-039",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.850Z",
    "variants": []
  },
  {
    "id": "tissue-unstitched-salwar-material-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-040",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/tissue-unstitched-salwar-material-2.jpg",
    "createdAt": "2026-11-24T09:02:31.338Z",
    "description": "*Tissue chudi material*\n\n*Fabric* : Tissue\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹899\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 899,
    "images": [
      "/uploads/tissue-unstitched-salwar-material-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": true,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1129,
    "name": "Tissue unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 899,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 15,
    "shortDescription": "Tissue chudi material Fabric : Tissue",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 899,
        "mrp": 1129,
        "stock": 100,
        "sku": "NC-UNS-040-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-040",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.889Z",
    "variants": []
  },
  {
    "id": "sungudi-cotton-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-041",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/sungudi-cotton-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:31.572Z",
    "description": "*Sungudi cotton chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹920\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 920,
    "images": [
      "/uploads/sungudi-cotton-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1150,
    "name": "Sungudi cotton Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 920,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 16,
    "shortDescription": "Sungudi cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 920,
        "mrp": 1150,
        "stock": 100,
        "sku": "NC-UNS-041-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-041",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.927Z",
    "variants": []
  },
  {
    "id": "khadi-cotton-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-042",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/khadi-cotton-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:32.007Z",
    "description": "*Khadi cotton chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.5 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹920\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 920,
    "images": [
      "/uploads/khadi-cotton-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1150,
    "name": "Khadi cotton Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 920,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 17,
    "shortDescription": "Khadi cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 920,
        "mrp": 1150,
        "stock": 100,
        "sku": "NC-UNS-042-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-042",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:52.970Z",
    "variants": []
  },
  {
    "id": "katan-viscose-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-043",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/katan-viscose-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:32.373Z",
    "description": "*Katan viscose salwar material*\n\n*Fabric* : Silk\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.5 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹950\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 950,
    "images": [
      "/uploads/katan-viscose-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1189,
    "name": "Katan viscose unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 950,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 18,
    "shortDescription": "Katan viscose salwar material Fabric : Silk",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 950,
        "mrp": 1189,
        "stock": 100,
        "sku": "NC-UNS-043-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-043",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:53.012Z",
    "variants": []
  },
  {
    "id": "narayanpet-2-piece-set-salwar-material-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-044",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/narayanpet-2-piece-set-salwar-material-collections.jpg",
    "createdAt": "2026-11-24T09:02:32.620Z",
    "description": "*Narayanpet 2 piece set chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 4.5 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹1099\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 1099,
    "images": [
      "/uploads/narayanpet-2-piece-set-salwar-material-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1379,
    "name": "Narayanpet 2 piece set salwar material collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 1099,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 19,
    "shortDescription": "Narayanpet 2 piece set chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 1099,
        "mrp": 1379,
        "stock": 100,
        "sku": "NC-UNS-044-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-044",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:53.051Z",
    "variants": []
  },
  {
    "id": "narayanpet-2-piece-set-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-045",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/narayanpet-2-piece-set-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:32.830Z",
    "description": "*Narayanpet 2 piece set chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 4.5 meter\n\n*Dupatta* : 2.5 meter\n\n*Price* : ₹1099\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 1099,
    "images": [
      "/uploads/narayanpet-2-piece-set-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1379,
    "name": "Narayanpet 2 piece set salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 1099,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 20,
    "shortDescription": "Narayanpet 2 piece set chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 1099,
        "mrp": 1379,
        "stock": 100,
        "sku": "NC-UNS-045-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-045",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:53.088Z",
    "variants": []
  },
  {
    "id": "cotton-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-046",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/cotton-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:33.199Z",
    "description": "*Cotton chudi material*\n\nFabric : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹899\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 899,
    "images": [
      "/uploads/cotton-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1129,
    "name": "Cotton Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 899,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 21,
    "shortDescription": "Cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 899,
        "mrp": 1129,
        "stock": 100,
        "sku": "NC-UNS-046-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-046",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:53.126Z",
    "variants": []
  },
  {
    "id": "linen-cotton-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-047",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/linen-cotton-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:33.510Z",
    "description": "*Linen Cotton material 3 piece set*\n\n*Top* : 2.50 meter\n\n*Bottom* : 2.0 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹799\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 799,
    "images": [
      "/uploads/linen-cotton-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 999,
    "name": "Linen cotton Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 799,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 22,
    "shortDescription": "Linen Cotton material 3 piece set Top : 2.50 meter",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 799,
        "mrp": 999,
        "stock": 100,
        "sku": "NC-UNS-047-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-047",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:53.164Z",
    "variants": []
  },
  {
    "id": "printed-mangalagiri-cotton-unstitched-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-048",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/printed-mangalagiri-cotton-unstitched-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:33.872Z",
    "description": "*Printed Mangalagiri cotton chudi material*\n\nFabric : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2.5 meter\n\n*Dupatta* : 2.3 meter\n\n*Price* : ₹799\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 799,
    "images": [
      "/uploads/printed-mangalagiri-cotton-unstitched-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 999,
    "name": "Printed Mangalagiri cotton Unstitched salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 799,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 23,
    "shortDescription": "Printed Mangalagiri cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 799,
        "mrp": 999,
        "stock": 100,
        "sku": "NC-UNS-048-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-048",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:53.202Z",
    "variants": []
  },
  {
    "id": "kota-cotton-2-piece-set",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-049",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/kota-cotton-2-piece-set.jpg",
    "createdAt": "2026-11-24T09:02:34.298Z",
    "description": "*Kota cotton 2 piece set chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 2.5 meter\n\n*Dupatta* : 2.4 meter\n\n*Price* : ₹799\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 799,
    "images": [
      "/uploads/kota-cotton-2-piece-set.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 999,
    "name": "Kota cotton 2 piece set",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 799,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 24,
    "shortDescription": "Kota cotton 2 piece set chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 799,
        "mrp": 999,
        "stock": 100,
        "sku": "NC-UNS-049-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-049",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:53.252Z",
    "variants": []
  },
  {
    "id": "chanderi-silk-cotton-salwar-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-050",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/chanderi-silk-cotton-salwar-material.jpg",
    "createdAt": "2026-11-24T09:02:34.555Z",
    "description": "*Chanderi silk chudi material*\n\nFabric : Chanderi silk Cotton\n\n*Top* : 2.5 meter (Chanderi silk)\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.25 meter (Shiffon with work)\n\n*Price* : ₹799\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 799,
    "images": [
      "/uploads/chanderi-silk-cotton-salwar-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 999,
    "name": "Chanderi silk cotton salwar material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 799,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 25,
    "shortDescription": "Chanderi silk chudi material Fabric : Chanderi silk Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 799,
        "mrp": 999,
        "stock": 100,
        "sku": "NC-UNS-050-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-050",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:53.291Z",
    "variants": []
  },
  {
    "id": "poochampally-cotton-chudi-material",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Unstitched salwar material",
    "code": "NC-UNS-051",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/poochampally-cotton-chudi-material.jpg",
    "createdAt": "2026-11-24T09:02:34.857Z",
    "description": "*Poochampally Cotton chudi material*\n\n*Fabric* : Cotton\n\n*Top* : 2.5 meter\n\n*Bottom* : 2 meter\n\n*Dupatta* : 2.4 meter\n\n*Price* : ₹899\n\nFree shipping for Online payment within Tamilnadu.\n\nFor Cash on Delivery extra 70rs shipping charge within Tamilnadu.",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "Premium Cotton Material",
    "finalPrice": 899,
    "images": [
      "/uploads/poochampally-cotton-chudi-material.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 1129,
    "name": "Poochampally cotton chudi material",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 899,
    "productLength": "Top: 2.5m, Bottom: 2m, Dupatta: 2.3m",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 26,
    "shortDescription": "Poochampally Cotton chudi material Fabric : Cotton",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "Free Size",
        "price": 899,
        "mrp": 1129,
        "stock": 100,
        "sku": "NC-UNS-051-Free Size"
      }
    ],
    "sizes": [
      "Free Size"
    ],
    "sku": "NC-UNS-051",
    "sleeveType": "Unstitched",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Unstitched Salwar Material",
    "updatedAt": "2026-11-24T09:23:53.328Z",
    "variants": []
  },
  {
    "id": "elite-xl-zip-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-052",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xl-zip-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:35.282Z",
    "description": "XL Size Elite zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xl-zip-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XL Zip Model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 27,
    "shortDescription": "XL Size Elite zip Cotton nighty Price:340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-052-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-052",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Zip Nighty",
    "updatedAt": "2026-11-24T09:23:53.367Z",
    "variants": []
  },
  {
    "id": "elite-xl-zip-model-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-053",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xl-zip-model-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:35.530Z",
    "description": "XL Size Elite zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xl-zip-model-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XL Zip Model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 28,
    "shortDescription": "XL Size Elite zip Cotton nighty Price:340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-053-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-053",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Zip Nighty",
    "updatedAt": "2026-11-24T09:23:53.404Z",
    "variants": []
  },
  {
    "id": "elite-xl-piping-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-054",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xl-piping-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:36.124Z",
    "description": "XL Size Elite Cotton piping nighty Price: 340rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "Elite Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xl-piping-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XL Piping Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 29,
    "shortDescription": "XL Size Elite Cotton piping nighty Price: 340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-054-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-054",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Piping Nighty",
    "updatedAt": "2026-11-24T09:23:53.452Z",
    "variants": []
  },
  {
    "id": "elite-xl-piping-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-055",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xl-piping-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:36.506Z",
    "description": "XL Size Elite Cotton piping nighty Price: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "Elite Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xl-piping-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XL Piping model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 12,
    "shortDescription": "XL Size Elite Cotton piping nighty Price: 340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-055-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-055",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Piping Nighty",
    "updatedAt": "2026-11-24T09:23:53.491Z",
    "variants": []
  },
  {
    "id": "elite-xl-piping-model-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-056",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xl-piping-model-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:36.939Z",
    "description": "XL Size Elite Cotton piping nighty Price: 340rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "Elite Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xl-piping-model-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XL Piping model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 13,
    "shortDescription": "XL Size Elite Cotton piping nighty Price: 340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-056-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-056",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Piping Nighty",
    "updatedAt": "2026-11-24T09:23:53.532Z",
    "variants": []
  },
  {
    "id": "elite-xxl-zip-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-057",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xxl-zip-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:37.244Z",
    "description": "XXL Size Elite zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xxl-zip-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XXL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 14,
    "shortDescription": "XXL Size Elite zip Cotton nighty Price:340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-057-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-057",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Zip Nighty",
    "updatedAt": "2026-11-24T09:23:53.577Z",
    "variants": []
  },
  {
    "id": "elite-xxl-without-zip-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-058",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xxl-without-zip-model-collections.jpg",
    "createdAt": "2026-11-24T09:02:37.552Z",
    "description": "XXL Size Elite Piping model nighty Price: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xxl-without-zip-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XXL Without Zip model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 15,
    "shortDescription": "XXL Size Elite Piping model nighty Price: 340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-058-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-058",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Without Zip Nighty",
    "updatedAt": "2026-11-24T09:23:53.616Z",
    "variants": []
  },
  {
    "id": "elite-xxl-without-zip-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-059",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xxl-without-zip-collections.jpg",
    "createdAt": "2026-11-24T09:02:37.914Z",
    "description": "XXL Size Elite Piping model nighty Price: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xxl-without-zip-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XXL Without zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 16,
    "shortDescription": "XXL Size Elite Piping model nighty Price: 340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-059-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-059",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Without Zip Nighty",
    "updatedAt": "2026-11-24T09:23:53.654Z",
    "variants": []
  },
  {
    "id": "elite-xxl-without-zip-model-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-060",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xxl-without-zip-model-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:38.769Z",
    "description": "XXL Size Elite Piping model nighty Price: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xxl-without-zip-model-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XXL Without zip model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 17,
    "shortDescription": "XXL Size Elite Piping model nighty Price: 340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-060-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-060",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Without Zip Nighty",
    "updatedAt": "2026-11-24T09:23:53.692Z",
    "variants": []
  },
  {
    "id": "elite-xl-titanic-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-061",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xl-titanic-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:39.142Z",
    "description": "XL Size Elite Titanic model nighty Price: 340rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xl-titanic-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XL Titanic model nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 18,
    "shortDescription": "XL Size Elite Titanic model nighty Price: 340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-061-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-061",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Titanic Nighty",
    "updatedAt": "2026-11-24T09:23:53.732Z",
    "variants": []
  },
  {
    "id": "elite-xl-elastic-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-062",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xl-elastic-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:39.520Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xl-elastic-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XL Elastic model nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 19,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-062-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-062",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Elastic Nighty",
    "updatedAt": "2026-11-24T09:23:53.770Z",
    "variants": []
  },
  {
    "id": "elite-3xl-piping-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-063",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-3xl-piping-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:39.867Z",
    "description": "3XL Size Elite Piping model nighty Price: 350rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/elite-3xl-piping-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "Elite 3XL Piping nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 20,
    "shortDescription": "3XL Size Elite Piping model nighty Price: 350rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "3XL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-063-3XL"
      }
    ],
    "sizes": [
      "3XL"
    ],
    "sku": "NC-NIG-063",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Piping Nighty",
    "updatedAt": "2026-11-24T09:23:53.808Z",
    "variants": []
  },
  {
    "id": "elite-3xl-piping-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-064",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-3xl-piping-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:40.186Z",
    "description": "3XL Size Elite Piping model nighty Price: 350rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/elite-3xl-piping-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "Elite 3XL Piping model nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 21,
    "shortDescription": "3XL Size Elite Piping model nighty Price: 350rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "3XL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-064-3XL"
      }
    ],
    "sizes": [
      "3XL"
    ],
    "sku": "NC-NIG-064",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Piping Nighty",
    "updatedAt": "2026-11-24T09:23:53.849Z",
    "variants": []
  },
  {
    "id": "elite-3xl-zip-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-065",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-3xl-zip-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:40.716Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/elite-3xl-zip-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "Elite 3XL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 22,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "3XL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-065-3XL"
      }
    ],
    "sizes": [
      "3XL"
    ],
    "sku": "NC-NIG-065",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Zip Nighty",
    "updatedAt": "2026-11-24T09:23:53.889Z",
    "variants": []
  },
  {
    "id": "l-size-night-dress-zip-model",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Night dress",
    "code": "NC-NIG-066",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/l-size-night-dress-zip-model.jpg",
    "createdAt": "2026-11-24T09:02:41.013Z",
    "description": "L Size Elite Zip Night suit collections  Price : 375rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 375,
    "images": [
      "/uploads/l-size-night-dress-zip-model.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "L Size Night dress Zip model",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 375,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 23,
    "shortDescription": "L Size Elite Zip Night suit collections  Price : 375rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-066-L"
      }
    ],
    "sizes": [
      "L"
    ],
    "sku": "NC-NIG-066",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Night dress",
    "updatedAt": "2026-11-24T09:23:53.929Z",
    "variants": []
  },
  {
    "id": "l-size-night-dress-zip-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Night dress",
    "code": "NC-NIG-067",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/l-size-night-dress-zip-model-collections.jpg",
    "createdAt": "2026-11-24T09:02:41.239Z",
    "description": "L Size Elite Zip Night suit collections  Price : 375rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 375,
    "images": [
      "/uploads/l-size-night-dress-zip-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "L Size Night dress Zip model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 375,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 24,
    "shortDescription": "L Size Elite Zip Night suit collections  Price : 375rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-067-L"
      }
    ],
    "sizes": [
      "L"
    ],
    "sku": "NC-NIG-067",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Night dress",
    "updatedAt": "2026-11-24T09:23:53.968Z",
    "variants": []
  },
  {
    "id": "elite-60-inch-xl-piping-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-068",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-60-inch-xl-piping-model-collections.jpg",
    "createdAt": "2026-11-24T09:02:41.636Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/elite-60-inch-xl-piping-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "Elite 60 inch XL Piping model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 25,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-068-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-068",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "60 Inch Nighty",
    "updatedAt": "2026-11-24T09:23:54.011Z",
    "variants": []
  },
  {
    "id": "elite-60inch-xl-piping-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-069",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-60inch-xl-piping-model-collections.jpg",
    "createdAt": "2026-11-24T09:02:41.931Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/elite-60inch-xl-piping-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "Elite 60inch XL Piping model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 26,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-069-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-069",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "60 Inch Nighty",
    "updatedAt": "2026-11-24T09:23:54.052Z",
    "variants": []
  },
  {
    "id": "long-zip-xl-feeding-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-070",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/long-zip-xl-feeding-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:42.346Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/long-zip-xl-feeding-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "Long Zip XL Feeding Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 27,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-070-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-070",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Feeding Nighty",
    "updatedAt": "2026-11-24T09:23:54.091Z",
    "variants": []
  },
  {
    "id": "elite-3xl-piping-model-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-071",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-3xl-piping-model-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:42.737Z",
    "description": "3XL Size Elite Piping model nighty Price: 399rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 399,
    "images": [
      "/uploads/elite-3xl-piping-model-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 499,
    "name": "Elite 3XL Piping Model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 399,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 28,
    "shortDescription": "3XL Size Elite Piping model nighty Price: 399rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "3XL",
        "price": 399,
        "mrp": 499,
        "stock": 100,
        "sku": "NC-NIG-071-3XL"
      }
    ],
    "sizes": [
      "3XL"
    ],
    "sku": "NC-NIG-071",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.129Z",
    "variants": []
  },
  {
    "id": "xxl-double-side-vertical-zip-feeding-nighty",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-072",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/xxl-double-side-vertical-zip-feeding-nighty.jpg",
    "createdAt": "2026-11-24T09:02:43.161Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/xxl-double-side-vertical-zip-feeding-nighty.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "XXL Double side Vertical zip feeding Nighty",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 29,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-072-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-072",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.167Z",
    "variants": []
  },
  {
    "id": "elite-xxl-without-zip-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-073",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xxl-without-zip-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:43.531Z",
    "description": "XXL Size Elite Piping model nighty Price: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xxl-without-zip-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XXL Without Zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 12,
    "shortDescription": "XXL Size Elite Piping model nighty Price: 340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-073-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-073",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.209Z",
    "variants": []
  },
  {
    "id": "elite-xxl-zip-model-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-074",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xxl-zip-model-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:44.130Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/elite-xxl-zip-model-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Elite XXL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 13,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-074-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-074",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.260Z",
    "variants": []
  },
  {
    "id": "tie-dye-xl-piping-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-075",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/tie-dye-xl-piping-model-collections.jpg",
    "createdAt": "2026-11-24T09:02:44.422Z",
    "description": "XL Size Tie - Dye Piping Nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/tie-dye-xl-piping-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Tie & Dye XL Piping model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 14,
    "shortDescription": "XL Size Tie - Dye Piping Nighty Price: 360rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-075-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-075",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.304Z",
    "variants": []
  },
  {
    "id": "queen-xxl-zip-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-076",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xxl-zip-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:44.816Z",
    "description": "XXL Size Queen quality Zip model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/queen-xxl-zip-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Queen XXL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 15,
    "shortDescription": "XXL Size Queen quality Zip model nighty Price: 360rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-076-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-076",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.343Z",
    "variants": []
  },
  {
    "id": "elite-60inch-xxl-piping-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-077",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-60inch-xxl-piping-model-collections.jpg",
    "createdAt": "2026-11-24T09:02:45.190Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/elite-60inch-xxl-piping-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "Elite 60inch XXL Piping model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 16,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-077-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-077",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.380Z",
    "variants": []
  },
  {
    "id": "elite-60inch-xxl-zip-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-078",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-60inch-xxl-zip-collections.jpg",
    "createdAt": "2026-11-24T09:02:45.701Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 399,
    "images": [
      "/uploads/elite-60inch-xxl-zip-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 499,
    "name": "Elite 60inch XXL Zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 399,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 17,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 399,
        "mrp": 499,
        "stock": 100,
        "sku": "NC-NIG-078-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-078",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.418Z",
    "variants": []
  },
  {
    "id": "elite-xxl-titanic-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-079",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xxl-titanic-model-collections.jpg",
    "createdAt": "2026-11-24T09:02:46.222Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/elite-xxl-titanic-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Elite XXL Titanic model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 18,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-079-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-079",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.456Z",
    "variants": []
  },
  {
    "id": "collar-xxl-zip-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-080",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/collar-xxl-zip-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:46.644Z",
    "description": "XXL Size Collar zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/collar-xxl-zip-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Collar XXL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 19,
    "shortDescription": "XXL Size Collar zip Cotton nighty Price:340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-080-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-080",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Collar Nighty",
    "updatedAt": "2026-11-24T09:23:54.494Z",
    "variants": []
  },
  {
    "id": "queen-xl-zip-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-081",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xl-zip-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:47.145Z",
    "description": "XL Size Queen zip Cotton nighty \nPrice: 390rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 390,
    "images": [
      "/uploads/queen-xl-zip-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 489,
    "name": "Queen XL Zip Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 390,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 20,
    "shortDescription": "XL Size Queen zip Cotton nighty  Price: 390rs👆",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 390,
        "mrp": 489,
        "stock": 100,
        "sku": "NC-NIG-081-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-081",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.532Z",
    "variants": []
  },
  {
    "id": "elite-collar-xl-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-082",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-collar-xl-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:47.735Z",
    "description": "XL Size Collar Zip Cotton nighty \nPrice: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/elite-collar-xl-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Elite Collar XL Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 21,
    "shortDescription": "XL Size Collar Zip Cotton nighty  Price: 370rs👆",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-082-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-082",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Collar Nighty",
    "updatedAt": "2026-11-24T09:23:54.571Z",
    "variants": []
  },
  {
    "id": "queen-xl-zip-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-083",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xl-zip-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:48.102Z",
    "description": "XL Size Queen zip Cotton nighty \nPrice: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/queen-xl-zip-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Queen XL Zip Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 22,
    "shortDescription": "XL Size Queen zip Cotton nighty  Price: 360rs👆",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-083-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-083",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.619Z",
    "variants": []
  },
  {
    "id": "elite-xxl-elastic-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-084",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xxl-elastic-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:48.384Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xxl-elastic-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XXL Elastic model nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 23,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-084-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-084",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.657Z",
    "variants": []
  },
  {
    "id": "elite-xxl-elastic-model-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-085",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xxl-elastic-model-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:48.763Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xxl-elastic-model-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XXL Elastic model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 24,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-085-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-085",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.696Z",
    "variants": []
  },
  {
    "id": "queen-xxl-zip-model-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-086",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xxl-zip-model-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:49.207Z",
    "description": "XXL Size Queen quality Zip model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/queen-xxl-zip-model-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Queen XXL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 25,
    "shortDescription": "XXL Size Queen quality Zip model nighty Price: 360rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-086-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-086",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.734Z",
    "variants": []
  },
  {
    "id": "queen-xl-piping-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-087",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xl-piping-model-collections.jpg",
    "createdAt": "2026-11-24T09:02:49.650Z",
    "description": "XL Size Queen quality Piping model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/queen-xl-piping-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Queen XL Piping model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 26,
    "shortDescription": "XL Size Queen quality Piping model nighty Price: 360rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-087-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-087",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.771Z",
    "variants": []
  },
  {
    "id": "elite-60inch-xxl-zip-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-088",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-60inch-xxl-zip-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:50.098Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/elite-60inch-xxl-zip-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "Elite 60inch XXL Zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 27,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-088-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-088",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.823Z",
    "variants": []
  },
  {
    "id": "tie-dye-xxl-without-zip-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-089",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/tie-dye-xxl-without-zip-collections.jpg",
    "createdAt": "2026-11-24T09:02:50.371Z",
    "description": "XXL Size Tie & dye Piping model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/tie-dye-xxl-without-zip-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Tie & Dye XXL without zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 28,
    "shortDescription": "XXL Size Tie & dye Piping model nighty Price: 360rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-089-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-089",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.869Z",
    "variants": []
  },
  {
    "id": "long-zip-xxl-feeding-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-090",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/long-zip-xxl-feeding-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:50.840Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 380,
    "images": [
      "/uploads/long-zip-xxl-feeding-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 479,
    "name": "Long Zip XXL feeding Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 380,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 29,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 380,
        "mrp": 479,
        "stock": 100,
        "sku": "NC-NIG-090-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-090",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.907Z",
    "variants": []
  },
  {
    "id": "battik-xl-zip-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-091",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/battik-xl-zip-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:51.240Z",
    "description": "XL Size Battik zip Cotton nighty \nPrice: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "Batik Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/battik-xl-zip-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Battik XL Zip Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 12,
    "shortDescription": "XL Size Battik zip Cotton nighty  Price: 370rs👆",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-091-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-091",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.944Z",
    "variants": []
  },
  {
    "id": "xl-double-side-vertical-zip-feeding-nighty",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-092",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/xl-double-side-vertical-zip-feeding-nighty.jpg",
    "createdAt": "2026-11-24T09:02:51.605Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/xl-double-side-vertical-zip-feeding-nighty.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "XL Double side Vertical zip feeding Nighty",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 13,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-092-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-092",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:54.981Z",
    "variants": []
  },
  {
    "id": "collar-xxl-zip-model-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-093",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/collar-xxl-zip-model-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:51.896Z",
    "description": "XXL Size Collar Zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/collar-xxl-zip-model-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Collar XXL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 14,
    "shortDescription": "XXL Size Collar Zip Cotton nighty Price:340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-093-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-093",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Collar Nighty",
    "updatedAt": "2026-11-24T09:23:55.026Z",
    "variants": []
  },
  {
    "id": "elite-60inch-xxl-piping-model-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-094",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-60inch-xxl-piping-model-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:52.399Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 399,
    "images": [
      "/uploads/elite-60inch-xxl-piping-model-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 499,
    "name": "Elite 60inch XXL Piping model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 399,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 15,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 399,
        "mrp": 499,
        "stock": 100,
        "sku": "NC-NIG-094-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-094",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.063Z",
    "variants": []
  },
  {
    "id": "elite-xxl-titanic-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-095",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xxl-titanic-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:52.673Z",
    "description": "XXL Size Elite Titanic model nighty Price: 340rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xxl-titanic-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XXL Titanic model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 16,
    "shortDescription": "XXL Size Elite Titanic model nighty Price: 340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-095-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-095",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.114Z",
    "variants": []
  },
  {
    "id": "battik-xxl-zip-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-096",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/battik-xxl-zip-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:52.928Z",
    "description": "XXL Size Battik Zip model nighty \nPrice: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "Batik Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/battik-xxl-zip-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Battik XXL Zip model nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 17,
    "shortDescription": "XXL Size Battik Zip model nighty  Price: 370rs👆",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-096-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-096",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.152Z",
    "variants": []
  },
  {
    "id": "collar-xxl-zip-model-nighty-collections-3",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-097",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/collar-xxl-zip-model-nighty-collections-3.jpg",
    "createdAt": "2026-11-24T09:02:53.329Z",
    "description": "XXL Size Collar Zip Cotton nighty Price:370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/collar-xxl-zip-model-nighty-collections-3.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Collar XXL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 18,
    "shortDescription": "XXL Size Collar Zip Cotton nighty Price:370rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-097-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-097",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Collar Nighty",
    "updatedAt": "2026-11-24T09:23:55.190Z",
    "variants": []
  },
  {
    "id": "tie-dye-xl-zip-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-098",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/tie-dye-xl-zip-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:54.005Z",
    "description": "XL Size Tie & Dye zip Cotton nighty \nPrice: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/tie-dye-xl-zip-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Tie & Dye XL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 19,
    "shortDescription": "XL Size Tie & Dye zip Cotton nighty  Price: 360rs👆",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-098-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-098",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.230Z",
    "variants": []
  },
  {
    "id": "xl-night-dress-collar-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-099",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/xl-night-dress-collar-model-collections.jpg",
    "createdAt": "2026-11-24T09:02:54.431Z",
    "description": "XL Size Elite Collar Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 375,
    "images": [
      "/uploads/xl-night-dress-collar-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "XL Night dress Collar model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 375,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 20,
    "shortDescription": "XL Size Elite Collar Night suit collections Price: 375rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 375,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-099-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-099",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Collar Nighty",
    "updatedAt": "2026-11-24T09:23:55.266Z",
    "variants": []
  },
  {
    "id": "elite-xl-piping-model-nighty-collections-3",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-100",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xl-piping-model-nighty-collections-3.jpg",
    "createdAt": "2026-11-24T09:02:54.765Z",
    "description": "XL Size Elite Cotton piping nighty Price: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "Elite Pure Cotton",
    "finalPrice": 499,
    "images": [
      "/uploads/elite-xl-piping-model-nighty-collections-3.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 629,
    "name": "Elite XL Piping model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 499,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 21,
    "shortDescription": "XL Size Elite Cotton piping nighty Price: 340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 499,
        "mrp": 629,
        "stock": 100,
        "sku": "NC-NIG-100-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-100",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.305Z",
    "variants": []
  },
  {
    "id": "xxl-size-night-dress-zip-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-101",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/xxl-size-night-dress-zip-model-collections.jpg",
    "createdAt": "2026-11-24T09:02:55.171Z",
    "description": "XXL Size Elite Zip Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 375,
    "images": [
      "/uploads/xxl-size-night-dress-zip-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "XXL size Night dress Zip model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 375,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 22,
    "shortDescription": "XXL Size Elite Zip Night suit collections Price: 375rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 375,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-101-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-101",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.344Z",
    "variants": []
  },
  {
    "id": "battick-xxl-without-zip-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-102",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/battick-xxl-without-zip-collections.jpg",
    "createdAt": "2026-11-24T09:02:55.433Z",
    "description": "Battick  XXL Size Piping model nighty Price: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/battick-xxl-without-zip-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Battick XXL without zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 23,
    "shortDescription": "Battick  XXL Size Piping model nighty Price: 370rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-102-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-102",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.383Z",
    "variants": []
  },
  {
    "id": "elite-xl-feeding-frock-model-nighty",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-103",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xl-feeding-frock-model-nighty.jpg",
    "createdAt": "2026-11-24T09:02:55.811Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/elite-xl-feeding-frock-model-nighty.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Elite XL Feeding Frock model Nighty",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 24,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-103-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-103",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.421Z",
    "variants": []
  },
  {
    "id": "elite-60inch-xl-zip-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-104",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-60inch-xl-zip-collections.jpg",
    "createdAt": "2026-11-24T09:02:56.251Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/elite-60inch-xl-zip-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "Elite 60inch XL zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 25,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-104-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-104",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.469Z",
    "variants": []
  },
  {
    "id": "collar-xl-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-105",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/collar-xl-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:56.773Z",
    "description": "XL Size Collar Zip Cotton nighty \nPrice: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/collar-xl-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Collar XL Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 26,
    "shortDescription": "XL Size Collar Zip Cotton nighty  Price: 340rs👆",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-105-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-105",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Collar Nighty",
    "updatedAt": "2026-11-24T09:23:55.508Z",
    "variants": []
  },
  {
    "id": "tie-dye-xxl-zip-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-106",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/tie-dye-xxl-zip-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:57.072Z",
    "description": "XXL Size Tie & Dye Zip Cotton nighty Price:360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/tie-dye-xxl-zip-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Tie & Dye XXL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 27,
    "shortDescription": "XXL Size Tie & Dye Zip Cotton nighty Price:360rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-106-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-106",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.546Z",
    "variants": []
  },
  {
    "id": "queen-xxl-without-zip-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-107",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xxl-without-zip-collections.jpg",
    "createdAt": "2026-11-24T09:02:57.439Z",
    "description": "Queen XXL Size Piping model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/queen-xxl-without-zip-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Queen XXL without zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 28,
    "shortDescription": "Queen XXL Size Piping model nighty Price: 360rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-107-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-107",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.585Z",
    "variants": []
  },
  {
    "id": "queen-xl-piping-model-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-108",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xl-piping-model-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:57.779Z",
    "description": "XL Size Queen quality Piping model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/queen-xl-piping-model-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Queen XL Piping model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 29,
    "shortDescription": "XL Size Queen quality Piping model nighty Price: 360rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-108-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-108",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.622Z",
    "variants": []
  },
  {
    "id": "xl-night-dress-zip-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-109",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/xl-night-dress-zip-model-collections.jpg",
    "createdAt": "2026-11-24T09:02:58.195Z",
    "description": "XL Size Elite Zip Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 375,
    "images": [
      "/uploads/xl-night-dress-zip-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "XL Night dress Zip model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 375,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 12,
    "shortDescription": "XL Size Elite Zip Night suit collections Price: 375rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 375,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-109-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-109",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.660Z",
    "variants": []
  },
  {
    "id": "queen-xl-piping-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-110",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xl-piping-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:02:58.646Z",
    "description": "XL Size Queen quality Piping model nighty Price: 390rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 390,
    "images": [
      "/uploads/queen-xl-piping-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 489,
    "name": "Queen XL Piping nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 390,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 13,
    "shortDescription": "XL Size Queen quality Piping model nighty Price: 390rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 390,
        "mrp": 489,
        "stock": 100,
        "sku": "NC-NIG-110-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-110",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.697Z",
    "variants": []
  },
  {
    "id": "xl-night-dress-without-zip-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-111",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/xl-night-dress-without-zip-model-collections.jpg",
    "createdAt": "2026-11-24T09:02:59.042Z",
    "description": "XL Size Elite Without Zip Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 375,
    "images": [
      "/uploads/xl-night-dress-without-zip-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "XL Night dress Without zip model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 375,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 14,
    "shortDescription": "XL Size Elite Without Zip Night suit collections Price: 375rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 375,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-111-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-111",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.735Z",
    "variants": []
  },
  {
    "id": "xxl-size-collar-night-dress-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-112",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/xxl-size-collar-night-dress-collections.jpg",
    "createdAt": "2026-11-24T09:02:59.404Z",
    "description": "XXL Size Elite Collar Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 375,
    "images": [
      "/uploads/xxl-size-collar-night-dress-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "XXL size Collar Night dress collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 375,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 15,
    "shortDescription": "XXL Size Elite Collar Night suit collections Price: 375rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 375,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-112-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-112",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Collar Nighty",
    "updatedAt": "2026-11-24T09:23:55.775Z",
    "variants": []
  },
  {
    "id": "long-zip-xxl-feeding-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-113",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/long-zip-xxl-feeding-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:02:59.697Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/long-zip-xxl-feeding-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "Long Zip XXL feeding Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 16,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-113-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-113",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.817Z",
    "variants": []
  },
  {
    "id": "elite-xxl-feeding-frock-model-nighty",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-114",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xxl-feeding-frock-model-nighty.jpg",
    "createdAt": "2026-11-24T09:03:00.030Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/elite-xxl-feeding-frock-model-nighty.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Elite XXL feeding Frock model Nighty",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 17,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-114-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-114",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.854Z",
    "variants": []
  },
  {
    "id": "elite-xxl-feeding-frock-model-nighty-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-115",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xxl-feeding-frock-model-nighty-2.jpg",
    "createdAt": "2026-11-24T09:03:00.246Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/elite-xxl-feeding-frock-model-nighty-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Elite XXL feeding Frock model nighty",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 18,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-115-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-115",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.892Z",
    "variants": []
  },
  {
    "id": "xl-double-side-vertical-zip-feeding-nighty-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-116",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/xl-double-side-vertical-zip-feeding-nighty-2.jpg",
    "createdAt": "2026-11-24T09:03:00.533Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/xl-double-side-vertical-zip-feeding-nighty-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "XL Double side Vertical zip feeding nighty",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 19,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-116-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-116",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.929Z",
    "variants": []
  },
  {
    "id": "battik-xl-piping-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-117",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/battik-xl-piping-model-collections.jpg",
    "createdAt": "2026-11-24T09:03:00.827Z",
    "description": "XL Size Battik quality Piping model nighty Price: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "Batik Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/battik-xl-piping-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Battik XL Piping model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 20,
    "shortDescription": "XL Size Battik quality Piping model nighty Price: 370rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-117-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-117",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:55.970Z",
    "variants": []
  },
  {
    "id": "battik-xl-piping-model-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-118",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/battik-xl-piping-model-collections-2.jpg",
    "createdAt": "2026-11-24T09:03:01.218Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 420,
    "images": [
      "/uploads/battik-xl-piping-model-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 529,
    "name": "Battik XL Piping model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 420,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 21,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕 💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 420,
        "mrp": 529,
        "stock": 100,
        "sku": "NC-NIG-118-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-118",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.009Z",
    "variants": []
  },
  {
    "id": "long-zip-xl-feeding-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-119",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/long-zip-xl-feeding-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:03:01.744Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 380,
    "images": [
      "/uploads/long-zip-xl-feeding-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 479,
    "name": "Long Zip XL Feeding Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 380,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 22,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 380,
        "mrp": 479,
        "stock": 100,
        "sku": "NC-NIG-119-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-119",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.046Z",
    "variants": []
  },
  {
    "id": "queen-xxl-zip-model-nighty-collections-3",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-120",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xxl-zip-model-nighty-collections-3.jpg",
    "createdAt": "2026-11-24T09:03:02.257Z",
    "description": "XXL Size Queen quality Zip model nighty Price: 390rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 390,
    "images": [
      "/uploads/queen-xxl-zip-model-nighty-collections-3.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 489,
    "name": "Queen XXL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 390,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 23,
    "shortDescription": "XXL Size Queen quality Zip model nighty Price: 390rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 390,
        "mrp": 489,
        "stock": 100,
        "sku": "NC-NIG-120-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-120",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.083Z",
    "variants": []
  },
  {
    "id": "queen-xxl-zip-model-nighty-collections-4",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-121",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xxl-zip-model-nighty-collections-4.jpg",
    "createdAt": "2026-11-24T09:03:02.548Z",
    "description": "XXL Size Queen quality Zip model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/queen-xxl-zip-model-nighty-collections-4.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Queen XXL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 24,
    "shortDescription": "XXL Size Queen quality Zip model nighty Price: 360rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-121-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-121",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.120Z",
    "variants": []
  },
  {
    "id": "collar-xl-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-122",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/collar-xl-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:03:03.040Z",
    "description": "XL Size Collar Zip Cotton nighty \nPrice: 340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/collar-xl-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Collar XL Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 25,
    "shortDescription": "XL Size Collar Zip Cotton nighty  Price: 340rs👆",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-122-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-122",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Collar Nighty",
    "updatedAt": "2026-11-24T09:23:56.159Z",
    "variants": []
  },
  {
    "id": "xxl-size-night-dress-without-zip-model-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-123",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/xxl-size-night-dress-without-zip-model-collections.jpg",
    "createdAt": "2026-11-24T09:03:03.338Z",
    "description": "XXL Size Elite Without Zip Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 375,
    "images": [
      "/uploads/xxl-size-night-dress-without-zip-model-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "XXL size Night dress Without zip model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 375,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 26,
    "shortDescription": "XXL Size Elite Without Zip Night suit collections Price: 375rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 375,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-123-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-123",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.198Z",
    "variants": []
  },
  {
    "id": "tie-dye-xl-zip-model-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-124",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/tie-dye-xl-zip-model-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:03:03.650Z",
    "description": "XL Size Tie & Dye zip Cotton nighty \nPrice: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/tie-dye-xl-zip-model-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Tie & Dye XL Zip model nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 27,
    "shortDescription": "XL Size Tie & Dye zip Cotton nighty  Price: 360rs👆",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-124-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-124",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.235Z",
    "variants": []
  },
  {
    "id": "battick-xxl-without-zip-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-125",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/battick-xxl-without-zip-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:03:04.024Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 420,
    "images": [
      "/uploads/battick-xxl-without-zip-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 529,
    "name": "Battick XXL Without zip nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 420,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 28,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 420,
        "mrp": 529,
        "stock": 100,
        "sku": "NC-NIG-125-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-125",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.273Z",
    "variants": []
  },
  {
    "id": "elite-xl-zip-model-nighty-collections-3",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-126",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xl-zip-model-nighty-collections-3.jpg",
    "createdAt": "2026-11-24T09:03:04.521Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/elite-xl-zip-model-nighty-collections-3.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Elite XL Zip Model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 29,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕 💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-126-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-126",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.311Z",
    "variants": []
  },
  {
    "id": "queen-xxl-without-zip-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-127",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xxl-without-zip-collections-2.jpg",
    "createdAt": "2026-11-24T09:03:04.834Z",
    "description": "Queen XXL Size Piping model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/queen-xxl-without-zip-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Queen XXL without zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 12,
    "shortDescription": "Queen XXL Size Piping model nighty Price: 360rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-127-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-127",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.348Z",
    "variants": []
  },
  {
    "id": "collar-xxl-zip-model-nighty-collections-4",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-128",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/collar-xxl-zip-model-nighty-collections-4.jpg",
    "createdAt": "2026-11-24T09:03:05.342Z",
    "description": "XXL Size Collar Zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/collar-xxl-zip-model-nighty-collections-4.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Collar XXL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 13,
    "shortDescription": "XXL Size Collar Zip Cotton nighty Price:340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-128-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-128",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Collar Nighty",
    "updatedAt": "2026-11-24T09:23:56.385Z",
    "variants": []
  },
  {
    "id": "elite-3xl-zip-model-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-129",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-3xl-zip-model-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:03:05.689Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 399,
    "images": [
      "/uploads/elite-3xl-zip-model-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 499,
    "name": "Elite 3XL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 399,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 14,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "3XL",
        "price": 399,
        "mrp": 499,
        "stock": 100,
        "sku": "NC-NIG-129-3XL"
      }
    ],
    "sizes": [
      "3XL"
    ],
    "sku": "NC-NIG-129",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.424Z",
    "variants": []
  },
  {
    "id": "elite-60inch-xxl-piping-model-collections-3",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-130",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-60inch-xxl-piping-model-collections-3.jpg",
    "createdAt": "2026-11-24T09:03:06.095Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/elite-60inch-xxl-piping-model-collections-3.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "Elite 60inch XXL Piping Model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 15,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-130-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-130",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.461Z",
    "variants": []
  },
  {
    "id": "tie-dye-xl-piping-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-131",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/tie-dye-xl-piping-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:03:06.338Z",
    "description": "XL Size Tie - Dye Piping Nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/tie-dye-xl-piping-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Tie & Dye XL Piping model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 16,
    "shortDescription": "XL Size Tie - Dye Piping Nighty Price: 360rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-131-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-131",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.498Z",
    "variants": []
  },
  {
    "id": "tie-dye-xl-zip-model-nighty-collections-3",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-132",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/tie-dye-xl-zip-model-nighty-collections-3.jpg",
    "createdAt": "2026-11-24T09:03:06.534Z",
    "description": "XL Size Tie & Dye zip Cotton nighty Price:360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/tie-dye-xl-zip-model-nighty-collections-3.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Tie & Dye XL Zip model nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 17,
    "shortDescription": "XL Size Tie & Dye zip Cotton nighty Price:360rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-132-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-132",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.535Z",
    "variants": []
  },
  {
    "id": "battik-xxl-zip-model-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-133",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/battik-xxl-zip-model-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:03:06.800Z",
    "description": "XXL Size Battik Zip model nighty \nPrice: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "Batik Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/battik-xxl-zip-model-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Battik XXL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 18,
    "shortDescription": "XXL Size Battik Zip model nighty  Price: 370rs👆",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-133-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-133",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.573Z",
    "variants": []
  },
  {
    "id": "tie-dye-xxl-without-zip-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-134",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/tie-dye-xxl-without-zip-collections-2.jpg",
    "createdAt": "2026-11-24T09:03:07.003Z",
    "description": "XXL Size Tie & dye Piping model nighty Price: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/tie-dye-xxl-without-zip-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Tie & Dye XXL without Zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 19,
    "shortDescription": "XXL Size Tie & dye Piping model nighty Price: 360rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-134-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-134",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.613Z",
    "variants": []
  },
  {
    "id": "elite-xl-zip-model-nighty-collections-4",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-135",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xl-zip-model-nighty-collections-4.jpg",
    "createdAt": "2026-11-24T09:03:07.521Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/elite-xl-zip-model-nighty-collections-4.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Elite XL Zip Model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 20,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕 💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-135-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-135",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.650Z",
    "variants": []
  },
  {
    "id": "collar-xxl-zip-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-136",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/collar-xxl-zip-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:03:07.876Z",
    "description": "XXL Size Collar Zip Cotton nighty Price:370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/collar-xxl-zip-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Collar XXL Zip nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 21,
    "shortDescription": "XXL Size Collar Zip Cotton nighty Price:370rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-136-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-136",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Collar Nighty",
    "updatedAt": "2026-11-24T09:23:56.688Z",
    "variants": []
  },
  {
    "id": "battik-xl-zip-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-137",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/battik-xl-zip-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:03:08.142Z",
    "description": "XL Size Battik zip Cotton nighty \nPrice: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "Batik Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/battik-xl-zip-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Battik XL Zip Model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 22,
    "shortDescription": "XL Size Battik zip Cotton nighty  Price: 370rs👆",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-137-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-137",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.726Z",
    "variants": []
  },
  {
    "id": "elite-xxl-feeding-frock-model-nighty-3",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-138",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xxl-feeding-frock-model-nighty-3.jpg",
    "createdAt": "2026-11-24T09:03:08.407Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/elite-xxl-feeding-frock-model-nighty-3.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Elite XXL Feeding Frock model nighty",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 23,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-138-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-138",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.764Z",
    "variants": []
  },
  {
    "id": "queen-xl-piping-model-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-139",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xl-piping-model-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:03:08.822Z",
    "description": "XL Size Queen quality Piping model nighty Price: 390rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 390,
    "images": [
      "/uploads/queen-xl-piping-model-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 489,
    "name": "Queen XL Piping model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 390,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 24,
    "shortDescription": "XL Size Queen quality Piping model nighty Price: 390rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 390,
        "mrp": 489,
        "stock": 100,
        "sku": "NC-NIG-139-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-139",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.808Z",
    "variants": []
  },
  {
    "id": "3xl-tie-dye-without-zip-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-140",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/3xl-tie-dye-without-zip-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:03:09.112Z",
    "description": "3XL Size Tie & Dye  Piping model nighty Price: 370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/3xl-tie-dye-without-zip-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "3XL Tie & Dye Without zip nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 25,
    "shortDescription": "3XL Size Tie & Dye  Piping model nighty Price: 370rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "3XL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-140-3XL"
      }
    ],
    "sizes": [
      "3XL"
    ],
    "sku": "NC-NIG-140",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.847Z",
    "variants": []
  },
  {
    "id": "xxl-size-night-dress-zip-model-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-141",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/xxl-size-night-dress-zip-model-collections-2.jpg",
    "createdAt": "2026-11-24T09:03:09.585Z",
    "description": "XXL Size Elite Zip Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 375,
    "images": [
      "/uploads/xxl-size-night-dress-zip-model-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "XXL Size Night dress Zip model collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 375,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 26,
    "shortDescription": "XXL Size Elite Zip Night suit collections Price: 375rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 375,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-141-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-141",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.885Z",
    "variants": []
  },
  {
    "id": "queen-xl-zip-nighty-collections-3",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-142",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xl-zip-nighty-collections-3.jpg",
    "createdAt": "2026-11-24T09:03:10.167Z",
    "description": "XL Size Queen zip Cotton nighty \nPrice: 360rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 360,
    "images": [
      "/uploads/queen-xl-zip-nighty-collections-3.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 450,
    "name": "Queen XL Zip Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 360,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 27,
    "shortDescription": "XL Size Queen zip Cotton nighty  Price: 360rs👆",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 360,
        "mrp": 450,
        "stock": 100,
        "sku": "NC-NIG-142-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-142",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.922Z",
    "variants": []
  },
  {
    "id": "elite-60inch-xl-zip-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-143",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-60inch-xl-zip-collections-2.jpg",
    "createdAt": "2026-11-24T09:03:10.669Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 399,
    "images": [
      "/uploads/elite-60inch-xl-zip-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 499,
    "name": "Elite 60inch XL zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 399,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 28,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 399,
        "mrp": 499,
        "stock": 100,
        "sku": "NC-NIG-143-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-143",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.960Z",
    "variants": []
  },
  {
    "id": "l-size-night-dress-without-zip-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-144",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/l-size-night-dress-without-zip-collections.jpg",
    "createdAt": "2026-11-24T09:03:10.975Z",
    "description": "L Size Elite Without Zip Night suit collections  Price : 375rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 375,
    "images": [
      "/uploads/l-size-night-dress-without-zip-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "L Size Night dress Without zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 375,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 29,
    "shortDescription": "L Size Elite Without Zip Night suit collections  Price : 375rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "L",
        "price": 375,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-144-L"
      }
    ],
    "sizes": [
      "L"
    ],
    "sku": "NC-NIG-144",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:56.996Z",
    "variants": []
  },
  {
    "id": "elite-3xl-piping-model-nighty-collections-3",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-145",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-3xl-piping-model-nighty-collections-3.jpg",
    "createdAt": "2026-11-24T09:03:11.256Z",
    "description": "3XL Size Elite Piping model nighty Price: 350rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 350,
    "images": [
      "/uploads/elite-3xl-piping-model-nighty-collections-3.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 439,
    "name": "Elite 3XL Piping Model nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 350,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 12,
    "shortDescription": "3XL Size Elite Piping model nighty Price: 350rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "3XL",
        "price": 350,
        "mrp": 439,
        "stock": 100,
        "sku": "NC-NIG-145-3XL"
      }
    ],
    "sizes": [
      "3XL"
    ],
    "sku": "NC-NIG-145",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:57.033Z",
    "variants": []
  },
  {
    "id": "queen-xxl-without-zip-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-146",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/queen-xxl-without-zip-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:03:11.638Z",
    "description": "Queen XXL Size Piping model nighty Price: 390rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 390,
    "images": [
      "/uploads/queen-xxl-without-zip-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 489,
    "name": "Queen XXL without zip nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 390,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 13,
    "shortDescription": "Queen XXL Size Piping model nighty Price: 390rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 390,
        "mrp": 489,
        "stock": 100,
        "sku": "NC-NIG-146-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-146",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:57.070Z",
    "variants": []
  },
  {
    "id": "xl-night-dress-without-zip-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-147",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/xl-night-dress-without-zip-collections.jpg",
    "createdAt": "2026-11-24T09:03:11.997Z",
    "description": "XL Size Elite Without Zip Night suit collections Price: 375rs👆\n\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹60 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 20,
    "discountType": "percentage",
    "discountValue": 20,
    "fabric": "100% Pure Cotton",
    "finalPrice": 375,
    "images": [
      "/uploads/xl-night-dress-without-zip-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "XL Night dress Without Zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 375,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 14,
    "shortDescription": "XL Size Elite Without Zip Night suit collections Price: 375rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 375,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-147-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-147",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:57.108Z",
    "variants": []
  },
  {
    "id": "elite-60inch-4xl-zip-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-148",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-60inch-4xl-zip-collections.jpg",
    "createdAt": "2026-11-24T09:03:12.514Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 450,
    "images": [
      "/uploads/elite-60inch-4xl-zip-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 569,
    "name": "Elite 60inch 4XL Zip collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 450,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 15,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "4XL",
        "price": 450,
        "mrp": 569,
        "stock": 100,
        "sku": "NC-NIG-148-4XL"
      }
    ],
    "sizes": [
      "4XL"
    ],
    "sku": "NC-NIG-148",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:57.146Z",
    "variants": []
  },
  {
    "id": "elite-xl-zip-nighty-collections",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-149",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/elite-xl-zip-nighty-collections.jpg",
    "createdAt": "2026-11-24T09:03:12.775Z",
    "description": "XL Size Elite zip Cotton nighty Price:340rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 340,
    "images": [
      "/uploads/elite-xl-zip-nighty-collections.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 429,
    "name": "Elite XL Zip Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 340,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 16,
    "shortDescription": "XL Size Elite zip Cotton nighty Price:340rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 340,
        "mrp": 429,
        "stock": 100,
        "sku": "NC-NIG-149-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-149",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:57.183Z",
    "variants": []
  },
  {
    "id": "battik-xl-zip-model-nighty-collections-2",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-150",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/battik-xl-zip-model-nighty-collections-2.jpg",
    "createdAt": "2026-11-24T09:03:13.342Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 420,
    "images": [
      "/uploads/battik-xl-zip-model-nighty-collections-2.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 529,
    "name": "Battik XL Zip Model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 420,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 17,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕 💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XL",
        "price": 420,
        "mrp": 529,
        "stock": 100,
        "sku": "NC-NIG-150-XL"
      }
    ],
    "sizes": [
      "XL"
    ],
    "sku": "NC-NIG-150",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:57.221Z",
    "variants": []
  },
  {
    "id": "collar-xxl-zip-model-nighty-collections-5",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-151",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/collar-xxl-zip-model-nighty-collections-5.jpg",
    "createdAt": "2026-11-24T09:03:13.916Z",
    "description": "XXL Size Collar Zip Cotton nighty Price:370rs👆\n\n💕 *BUY ANY 3 COTTON NIGHTIES* 💕\n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕\n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n🍬 *COMBO OFFER:*🍬\n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬\n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬\n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 370,
    "images": [
      "/uploads/collar-xxl-zip-model-nighty-collections-5.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 469,
    "name": "Collar XXL zip model nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 370,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 18,
    "shortDescription": "XXL Size Collar Zip Cotton nighty Price:370rs👆 💕 BUY ANY 3 COTTON NIGHTIES 💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 370,
        "mrp": 469,
        "stock": 100,
        "sku": "NC-NIG-151-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-151",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Collar Nighty",
    "updatedAt": "2026-11-24T09:23:57.258Z",
    "variants": []
  },
  {
    "id": "battik-xxl-zip-model-nighty-collections-3",
    "brand": "Nithi Collection",
    "care": "Machine wash cold with like colors / Hand wash with mild detergent.",
    "category": "Nighty",
    "code": "NC-NIG-152",
    "color": "Standard",
    "colors": [
      "Standard"
    ],
    "coverImage": "/uploads/battik-xxl-zip-model-nighty-collections-3.jpg",
    "createdAt": "2026-11-24T09:03:14.476Z",
    "description": "💕 *BUY ANY 3 COTTON NIGHTIES* 💕 \n\n💕 *FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*💕 \n\n💕*₹70 EXTRA SHIPPING CHARGE FOR CASH ON DELIVERY* 💕\n\n\n\n🍬 *COMBO OFFER:*🍬 \n\n🍬 *BUY ANY 5 COTTON NIGHTIES* 🍬 \n\n🍬 *TOTAL FLAT ₹75 DISCOUNT WITH FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT*🍬 \n\n🍬 *FREE SHIPPING WITHIN TAMILNADU FOR CASH ON DELIVERY* 🍬",
    "discount": 21,
    "discountType": "percentage",
    "discountValue": 21,
    "fabric": "100% Pure Cotton",
    "finalPrice": 420,
    "images": [
      "/uploads/battik-xxl-zip-model-nighty-collections-3.jpg"
    ],
    "inStock": true,
    "isBestSeller": false,
    "isNew": false,
    "lowStockThreshold": 5,
    "material": "Pure Cotton",
    "mrp": 529,
    "name": "Battik XXL Zip model Nighty collections",
    "neckType": "Standard Round / U-Neck",
    "newArrival": false,
    "pattern": "Printed Handcrafted",
    "price": 420,
    "productLength": "55 Inches",
    "rating": 4.8,
    "reservedStock": 0,
    "reviews": 19,
    "shortDescription": "💕 BUY ANY 3 COTTON NIGHTIES 💕  💕 FREE SHIPPING WITHIN TAMILNADU FOR ONLINE PAYMENT💕",
    "sizeChart": "Standard Indian Sizing",
    "sizeOptions": [
      {
        "size": "XXL",
        "price": 420,
        "mrp": 529,
        "stock": 100,
        "sku": "NC-NIG-152-XXL"
      }
    ],
    "sizes": [
      "XXL"
    ],
    "sku": "NC-NIG-152",
    "sleeveType": "Half Sleeve",
    "soldQuantity": 0,
    "status": "ACTIVE",
    "stock": 100,
    "subcategory": "Other Nighty",
    "updatedAt": "2026-11-24T09:23:57.295Z",
    "variants": []
  }
];

export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getProductsByCategory = (category: string) =>
  products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
export const getBestSellers = () => products.filter((p) => p.isBestSeller);
