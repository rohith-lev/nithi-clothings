import assert from "node:assert";

const BASE_URL = "http://127.0.0.1:3000";

const SAMPLE_PRODUCTS = [
  // ----------------------------------------------------
  // 1. Category: Nighty
  // ----------------------------------------------------
  // Subcategory: Zip nighty (already has 1 product: "nigthy")
  {
    name: "Jaipuri Floral Print Cotton Zip Nighty",
    category: "Nighty",
    subcategory: "Zip nighty",
    brand: "Nithi Collection",
    price: 850,
    mrp: 1199,
    discount: 29,
    discountType: "percentage",
    fabric: "100% Pure Cotton",
    material: "Pure Cotton 60s Count",
    pattern: "Floral Jaipuri Print",
    neckType: "Round Neck with Front Zip",
    sleeveType: "Half Sleeve",
    length: "55 Inches",
    description: "Breathable pure cotton nighty featuring soft Jaipuri floral prints, reinforced seams, and durable smooth front zipper for everyday comfort.",
    shortDescription: "Ultra-soft cotton nighty with front zipper and traditional floral motifs.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "S", price: 850, mrp: 1199, stock: 10, sku: "NC-NIG-Z1-S" },
      { size: "M", price: 850, mrp: 1199, stock: 15, sku: "NC-NIG-Z1-M" },
      { size: "L", price: 850, mrp: 1199, stock: 20, sku: "NC-NIG-Z1-L" },
      { size: "XL", price: 850, mrp: 1199, stock: 15, sku: "NC-NIG-Z1-XL" },
      { size: "XXL", price: 890, mrp: 1249, stock: 10, sku: "NC-NIG-Z1-XXL" },
    ],
    images: [
      "/uploads/WhatsApp_Image_2026-10-06_at_7.23.45_PM.jpeg",
      "/uploads/WhatsApp_Image_2026-10-06_at_7.23.50_PM.jpeg",
    ],
    coverImage: "/uploads/WhatsApp_Image_2026-10-06_at_7.23.45_PM.jpeg",
  },
  {
    name: "Premium Alpine Cotton Front Zip Nighty",
    category: "Nighty",
    subcategory: "Zip nighty",
    brand: "Nithi Collection",
    price: 950,
    mrp: 1299,
    discount: 27,
    discountType: "percentage",
    fabric: "Alpine Pure Cotton",
    material: "Heavy Gauge Combed Cotton",
    pattern: "Geometric Paisley Print",
    neckType: "Square Neck with Concealed Zip",
    sleeveType: "Short Sleeve",
    length: "55 Inches",
    description: "Tailored with heavyweight Alpine cotton for lasting durability. Features a concealed front zipper, side utility pocket, and relaxed fit.",
    shortDescription: "Heavyweight Alpine cotton nightwear with concealed zip and side pocket.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "M", price: 950, mrp: 1299, stock: 15, sku: "NC-NIG-Z2-M" },
      { size: "L", price: 950, mrp: 1299, stock: 20, sku: "NC-NIG-Z2-L" },
      { size: "XL", price: 950, mrp: 1299, stock: 15, sku: "NC-NIG-Z2-XL" },
      { size: "XXL", price: 990, mrp: 1349, stock: 10, sku: "NC-NIG-Z2-XXL" },
    ],
    images: [
      "/uploads/WhatsApp_Image_2026-10-06_at_7.23.53_PM.jpeg",
      "/uploads/WhatsApp_Image_2026-10-06_at_7.23.54_PM.jpeg",
    ],
    coverImage: "/uploads/WhatsApp_Image_2026-10-06_at_7.23.53_PM.jpeg",
  },

  // Subcategory: Zipless nighty
  {
    name: "Batik Printed Pure Cotton Zipless Nighty",
    category: "Nighty",
    subcategory: "Zipless nighty",
    brand: "Nithi Collection",
    price: 799,
    mrp: 1099,
    discount: 27,
    discountType: "percentage",
    fabric: "100% Pure Cotton",
    material: "Soft Sheeting Cotton",
    pattern: "Handcrafted Batik Print",
    neckType: "Comfort Scoop Neck",
    sleeveType: "Half Sleeve",
    length: "55 Inches",
    description: "Classic slip-on zipless cotton nighty designed for unconstrained sleeping comfort. Beautiful batik motif with colorfast dyes.",
    shortDescription: "Classic slip-on zipless nighty in artisanal batik print.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "Free Size", price: 799, mrp: 1099, stock: 25, sku: "NC-NIG-ZL1-FS" },
      { size: "XL", price: 799, mrp: 1099, stock: 20, sku: "NC-NIG-ZL1-XL" },
      { size: "XXL", price: 849, mrp: 1149, stock: 15, sku: "NC-NIG-ZL1-XXL" },
    ],
    images: [
      "/uploads/WhatsApp_Image_2026-10-06_at_7.22.08_PM.jpeg",
      "/uploads/WhatsApp_Image_2026-10-06_at_7.22.11_PM.jpeg",
    ],
    coverImage: "/uploads/WhatsApp_Image_2026-10-06_at_7.22.08_PM.jpeg",
  },
  {
    name: "Soft Malmal Cotton Round Neck Nighty",
    category: "Nighty",
    subcategory: "Zipless nighty",
    brand: "Nithi Collection",
    price: 749,
    mrp: 999,
    discount: 25,
    discountType: "percentage",
    fabric: "Mulmul Cotton",
    material: "Featherlight Cotton Mulmul",
    pattern: "Pastel Dotted Print",
    neckType: "Round Neck",
    sleeveType: "Cap Sleeve",
    length: "55 Inches",
    description: "Featherlight mulmul cotton fabric ensures maximum airflow and coolness even on warm summer nights. Soft piping along neck and sleeves.",
    shortDescription: "Featherlight mulmul cotton round neck nighty for everyday relaxation.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "L", price: 749, mrp: 999, stock: 20, sku: "NC-NIG-ZL2-L" },
      { size: "XL", price: 749, mrp: 999, stock: 20, sku: "NC-NIG-ZL2-XL" },
      { size: "XXL", price: 799, mrp: 1049, stock: 15, sku: "NC-NIG-ZL2-XXL" },
    ],
    images: [
      "/uploads/WhatsApp_Image_2026-10-06_at_7.22.21_PM.jpeg",
      "/uploads/WhatsApp_Image_2026-10-06_at_7.22.22_PM.jpeg",
    ],
    coverImage: "/uploads/WhatsApp_Image_2026-10-06_at_7.22.21_PM.jpeg",
  },

  // ----------------------------------------------------
  // 2. Category: Kurtis
  // ----------------------------------------------------
  // Subcategory: Anarkali Kurti
  {
    name: "Flared Cotton Anarkali Kurti with Gold Foil Print",
    category: "Kurtis",
    subcategory: "Anarkali Kurti",
    brand: "Nithi Collection",
    price: 1199,
    mrp: 1699,
    discount: 29,
    discountType: "percentage",
    fabric: "Pure Cotton Cambric",
    material: "Cambric Cotton 60s",
    pattern: "Ethnic Gold Foil Print",
    neckType: "Mandarin Collar Neck",
    sleeveType: "3/4 Sleeve",
    length: "48 Inches",
    description: "Graceful festive Anarkali kurti featuring voluminous kalis, metallic gold foil detailing, and elegant tie-up tassels at waist.",
    shortDescription: "Voluminous kalidar cotton Anarkali kurti with gold foil highlights.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "S", price: 1199, mrp: 1699, stock: 10, sku: "NC-KRT-AN1-S" },
      { size: "M", price: 1199, mrp: 1699, stock: 15, sku: "NC-KRT-AN1-M" },
      { size: "L", price: 1199, mrp: 1699, stock: 20, sku: "NC-KRT-AN1-L" },
      { size: "XL", price: 1199, mrp: 1699, stock: 15, sku: "NC-KRT-AN1-XL" },
      { size: "XXL", price: 1249, mrp: 1749, stock: 10, sku: "NC-KRT-AN1-XXL" },
    ],
    images: [
      "/uploads/img-1791805104946-24edca8df81afd26e1814048bee8223d.jpg",
      "/uploads/img-1791805105035-37c83c1ff0c0739b19d93e56f707ebc6.jpg",
    ],
    coverImage: "/uploads/img-1791805104946-24edca8df81afd26e1814048bee8223d.jpg",
  },
  {
    name: "Rayon Tiered Anarkali Gown Kurti",
    category: "Kurtis",
    subcategory: "Anarkali Kurti",
    brand: "Nithi Collection",
    price: 1299,
    mrp: 1799,
    discount: 28,
    discountType: "percentage",
    fabric: "Premium Rayon 14kg",
    material: "Viscose Rayon",
    pattern: "Tiered Solid & Floral Combo",
    neckType: "V-Neck with Lace Border",
    sleeveType: "Full Sleeve with Elastic Cuffs",
    length: "50 Inches",
    description: "Flowy 3-tier Anarkali gown kurti tailored in soft drape rayon. Features delicate crochet lace trims and a flattering fit-and-flare silhouette.",
    shortDescription: "Three-tier flowy rayon Anarkali gown kurti with lace border.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "M", price: 1299, mrp: 1799, stock: 15, sku: "NC-KRT-AN2-M" },
      { size: "L", price: 1299, mrp: 1799, stock: 20, sku: "NC-KRT-AN2-L" },
      { size: "XL", price: 1299, mrp: 1799, stock: 15, sku: "NC-KRT-AN2-XL" },
      { size: "XXL", price: 1349, mrp: 1849, stock: 10, sku: "NC-KRT-AN2-XXL" },
    ],
    images: [
      "/uploads/img-1791805105055-d8c271a7683b16adc1d1f25902283d84.jpg",
    ],
    coverImage: "/uploads/img-1791805105055-d8c271a7683b16adc1d1f25902283d84.jpg",
  },

  // Subcategory: Straight Kurti
  {
    name: "Daily Wear Office Cotton Straight Kurti",
    category: "Kurtis",
    subcategory: "Straight Kurti",
    brand: "Nithi Collection",
    price: 699,
    mrp: 999,
    discount: 30,
    discountType: "percentage",
    fabric: "100% Pure Cotton",
    material: "Cotton Slub",
    pattern: "Striped Ikat Print",
    neckType: "Keyhole Neck with Wooden Buttons",
    sleeveType: "3/4 Sleeve",
    length: "44 Inches",
    description: "Crisp and comfortable office wear straight kurti with side slits. Pairs effortlessly with palazzos, leggings, or trousers.",
    shortDescription: "Breathable cotton slub straight kurti ideal for daily college and office wear.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "S", price: 699, mrp: 999, stock: 15, sku: "NC-KRT-ST1-S" },
      { size: "M", price: 699, mrp: 999, stock: 25, sku: "NC-KRT-ST1-M" },
      { size: "L", price: 699, mrp: 999, stock: 25, sku: "NC-KRT-ST1-L" },
      { size: "XL", price: 699, mrp: 999, stock: 20, sku: "NC-KRT-ST1-XL" },
      { size: "XXL", price: 749, mrp: 1049, stock: 15, sku: "NC-KRT-ST1-XXL" },
    ],
    images: [
      "/uploads/img-1791805205525-40536f509e780793e2094bd2efc18cc3.jpg",
      "/uploads/img-1791805205535-27923e8a70563939a824f1f8f0c78302.jpg",
    ],
    coverImage: "/uploads/img-1791805205525-40536f509e780793e2094bd2efc18cc3.jpg",
  },
  {
    name: "Embroidered Slub Rayon Straight Kurti",
    category: "Kurtis",
    subcategory: "Straight Kurti",
    brand: "Nithi Collection",
    price: 799,
    mrp: 1149,
    discount: 30,
    discountType: "percentage",
    fabric: "Slub Rayon",
    material: "Heavy Slub Rayon",
    pattern: "Floral Yoke Embroidery",
    neckType: "Sweetheart Neck",
    sleeveType: "3/4 Sleeve",
    length: "44 Inches",
    description: "Detailed thread embroidery on yoke elevates this straight kurti for evening gatherings and casual outings. Non-see-through fabric.",
    shortDescription: "Elegant yoke embroidered straight kurti in premium slub rayon.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "M", price: 799, mrp: 1149, stock: 18, sku: "NC-KRT-ST2-M" },
      { size: "L", price: 799, mrp: 1149, stock: 20, sku: "NC-KRT-ST2-L" },
      { size: "XL", price: 799, mrp: 1149, stock: 18, sku: "NC-KRT-ST2-XL" },
      { size: "XXL", price: 849, mrp: 1199, stock: 12, sku: "NC-KRT-ST2-XXL" },
    ],
    images: [
      "/uploads/img-1791805205544-6c1ad1ac5739d4d5a2d5b479fbc2ab7c.jpg",
    ],
    coverImage: "/uploads/img-1791805205544-6c1ad1ac5739d4d5a2d5b479fbc2ab7c.jpg",
  },

  // Subcategory: Feeding Kurti
  {
    name: "Double Zip Feeding Cotton Maternity Kurti",
    category: "Kurtis",
    subcategory: "Feeding Kurti",
    brand: "Nithi Collection",
    price: 999,
    mrp: 1399,
    discount: 29,
    discountType: "percentage",
    fabric: "100% Pure Combed Cotton",
    material: "Pure Cotton 60s",
    pattern: "Micro Polka Dot Print",
    neckType: "Round Neck with Dual Concealed Zippers",
    sleeveType: "3/4 Sleeve",
    length: "46 Inches",
    description: "Designed thoughtfully for nursing mothers. Concealed vertical zippers on both sides allow discreet and effortless baby feeding anytime.",
    shortDescription: "Dual concealed side zip feeding kurti in ultra-soft combed cotton.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "M", price: 999, mrp: 1399, stock: 15, sku: "NC-KRT-FD1-M" },
      { size: "L", price: 999, mrp: 1399, stock: 20, sku: "NC-KRT-FD1-L" },
      { size: "XL", price: 999, mrp: 1399, stock: 20, sku: "NC-KRT-FD1-XL" },
      { size: "XXL", price: 1049, mrp: 1449, stock: 15, sku: "NC-KRT-FD1-XXL" },
    ],
    images: [
      "/uploads/img-1791805205559-a4aa2bc5e6f4536117589a102d34b679.jpg",
      "/uploads/img-1791805205576-cce010f3f081db6056fd97dd8161ae0c.jpg",
    ],
    coverImage: "/uploads/img-1791805205559-a4aa2bc5e6f4536117589a102d34b679.jpg",
  },
  {
    name: "Pure Rayon Maternity Feeding A-Line Kurti",
    category: "Kurtis",
    subcategory: "Feeding Kurti",
    brand: "Nithi Collection",
    price: 1050,
    mrp: 1450,
    discount: 28,
    discountType: "percentage",
    fabric: "Premium Rayon",
    material: "Rayon 14kg",
    pattern: "Floral Jaal Pattern",
    neckType: "Notched Neck with Feeding Zips",
    sleeveType: "Half Sleeve",
    length: "46 Inches",
    description: "Soft A-line silhouette with generous pleating to comfortably fit baby bumps, plus dual hidden zippers for postpartum nursing ease.",
    shortDescription: "Maternity and nursing A-line kurti with hidden feeding zippers.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "L", price: 1050, mrp: 1450, stock: 20, sku: "NC-KRT-FD2-L" },
      { size: "XL", price: 1050, mrp: 1450, stock: 20, sku: "NC-KRT-FD2-XL" },
      { size: "XXL", price: 1099, mrp: 1499, stock: 15, sku: "NC-KRT-FD2-XXL" },
    ],
    images: [
      "/uploads/img-1791805271706-0327d7c1a8fc0cc8ec5e53ad86eb520e.jpg",
    ],
    coverImage: "/uploads/img-1791805271706-0327d7c1a8fc0cc8ec5e53ad86eb520e.jpg",
  },

  // ----------------------------------------------------
  // 3. Category: Sarees
  // ----------------------------------------------------
  // Subcategory: Silk Saree
  {
    name: "Traditional Kanchipuram Soft Silk Saree with Rich Pallu",
    category: "Sarees",
    subcategory: "Silk Saree",
    brand: "Nithi Collection",
    price: 2499,
    mrp: 3999,
    discount: 38,
    discountType: "percentage",
    fabric: "Soft Silk Blend",
    material: "Art Silk with Zari",
    pattern: "Zari Woven Temple Border",
    length: "6.3 Meters (with Blouse)",
    description: "Rich Kanchipuram inspired festive soft silk saree adorned with golden zari weaving, majestic peacock pallu, and matching unstitched blouse piece.",
    shortDescription: "Festive soft silk saree with rich zari woven pallu and blouse piece.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "Free Size", price: 2499, mrp: 3999, stock: 35, sku: "NC-SAR-SLK1-FS" },
    ],
    images: [
      "/uploads/img-1791805271719-b5282e0ad390eed67490dd90bdf36327.jpg",
      "/uploads/img-1791805271739-bfdc74a145e17fde7d928f3d28b8b6c0.jpg",
    ],
    coverImage: "/uploads/img-1791805271719-b5282e0ad390eed67490dd90bdf36327.jpg",
  },
  {
    name: "Banarasi Art Silk Festive Saree with Blouse Piece",
    category: "Sarees",
    subcategory: "Silk Saree",
    brand: "Nithi Collection",
    price: 1999,
    mrp: 2999,
    discount: 33,
    discountType: "percentage",
    fabric: "Banarasi Art Silk",
    material: "Poly Silk with Zari",
    pattern: "All-Over Floral Buta",
    length: "6.3 Meters (with Blouse)",
    description: "Lustrous Banarasi art silk saree decorated with delicate silver-gold floral butis across the drape. Lightweight yet grand for weddings.",
    shortDescription: "All-over floral buta Banarasi art silk saree with unstitched blouse piece.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "Free Size", price: 1999, mrp: 2999, stock: 40, sku: "NC-SAR-SLK2-FS" },
    ],
    images: [
      "/uploads/img-1791805353659-21f812eaf474b6e7ca01e0ab0b223e85.jpg",
    ],
    coverImage: "/uploads/img-1791805353659-21f812eaf474b6e7ca01e0ab0b223e85.jpg",
  },

  // Subcategory: Cotton Saree
  {
    name: "Handwoven Chettinad Pure Cotton Saree",
    category: "Sarees",
    subcategory: "Cotton Saree",
    brand: "Nithi Collection",
    price: 1150,
    mrp: 1599,
    discount: 28,
    discountType: "percentage",
    fabric: "100% Pure Cotton",
    material: "Chettinad 80s Cotton",
    pattern: "Traditional Check Pattern with Contrast Border",
    length: "5.5 Meters",
    description: "Authentic Chettinad pure cotton saree crafted with vibrant checks and rich contrast korvai border. Breathable and sweat-absorbent.",
    shortDescription: "Traditional Chettinad handloom style pure cotton saree with contrast border.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "Free Size", price: 1150, mrp: 1599, stock: 50, sku: "NC-SAR-COT1-FS" },
    ],
    images: [
      "/uploads/img-1791805353666-980194294877fd17d0864a88439b8327.jpg",
    ],
    coverImage: "/uploads/img-1791805353666-980194294877fd17d0864a88439b8327.jpg",
  },
  {
    name: "Mulmul Printed Daily Wear Cotton Saree",
    category: "Sarees",
    subcategory: "Cotton Saree",
    brand: "Nithi Collection",
    price: 899,
    mrp: 1299,
    discount: 31,
    discountType: "percentage",
    fabric: "Mulmul Cotton",
    material: "Ultra Soft Cotton Mulmul",
    pattern: "Sanganeri Floral Print",
    length: "5.5 Meters",
    description: "Feather-soft Mulmul cotton drape featuring authentic Sanganeri handblock floral prints. Ideal for temple visits, teaching, and daily elegance.",
    shortDescription: "Soft and breathable Mulmul cotton printed daily wear saree.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "Free Size", price: 899, mrp: 1299, stock: 45, sku: "NC-SAR-COT2-FS" },
    ],
    images: [
      "/uploads/img-1791865990441-571924e1d1e57b6f3337ec743e4da75b.jpg",
    ],
    coverImage: "/uploads/img-1791865990441-571924e1d1e57b6f3337ec743e4da75b.jpg",
  },

  // ----------------------------------------------------
  // 4. Category: Kids Wear
  // ----------------------------------------------------
  // Subcategory: Girls Frock
  {
    name: "Floral Party Wear Cotton Frock for Girls",
    category: "Kids Wear",
    subcategory: "Girls Frock",
    brand: "Nithi Collection",
    price: 599,
    mrp: 899,
    discount: 33,
    discountType: "percentage",
    fabric: "100% Breathable Cotton",
    material: "Cotton Poplin with Cotton Lining",
    pattern: "Multi-Color Floral Print",
    neckType: "Round Neck",
    sleeveType: "Sleeveless",
    length: "Knee Length",
    description: "Charming cotton party frock for girls with soft pure cotton inner lining to prevent itching. Features a pretty waist bow and back zip closure.",
    shortDescription: "Vibrant floral cotton frock for girls with soft inner cotton lining.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "2-3 Yrs", price: 599, mrp: 899, stock: 12, sku: "NC-KID-FR1-23" },
      { size: "4-5 Yrs", price: 599, mrp: 899, stock: 18, sku: "NC-KID-FR1-45" },
      { size: "6-7 Yrs", price: 629, mrp: 929, stock: 15, sku: "NC-KID-FR1-67" },
      { size: "8-9 Yrs", price: 649, mrp: 949, stock: 10, sku: "NC-KID-FR1-89" },
    ],
    images: [
      "/uploads/img-1791865990457-8152e214df5724075c03cb2c71b92d83.jpg",
    ],
    coverImage: "/uploads/img-1791865990457-8152e214df5724075c03cb2c71b92d83.jpg",
  },
  {
    name: "Traditional Pattu Pavadai Style Girls Frock",
    category: "Kids Wear",
    subcategory: "Girls Frock",
    brand: "Nithi Collection",
    price: 799,
    mrp: 1199,
    discount: 33,
    discountType: "percentage",
    fabric: "Art Silk & Cotton",
    material: "South Indian Festive Fabric",
    pattern: "Zari Woven Border",
    neckType: "Square Neck",
    sleeveType: "Puff Sleeve",
    length: "Below Knee",
    description: "Festive South Indian traditional style frock for young girls. Adorned with golden zari borders and puff sleeves for festivals and birthdays.",
    shortDescription: "Traditional festive South Indian style girl frock with zari border.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "3-4 Yrs", price: 799, mrp: 1199, stock: 15, sku: "NC-KID-FR2-34" },
      { size: "5-6 Yrs", price: 799, mrp: 1199, stock: 20, sku: "NC-KID-FR2-56" },
      { size: "7-8 Yrs", price: 849, mrp: 1249, stock: 15, sku: "NC-KID-FR2-78" },
    ],
    images: [
      "/uploads/img-1791865990467-c222e2f92fda798cc1a0d8e51b8e462c.jpg",
    ],
    coverImage: "/uploads/img-1791865990467-c222e2f92fda798cc1a0d8e51b8e462c.jpg",
  },

  // Subcategory: Kids Nightwear
  {
    name: "Soft Cotton Printed Kids Nightsuit Set",
    category: "Kids Wear",
    subcategory: "Kids Nightwear",
    brand: "Nithi Collection",
    price: 499,
    mrp: 699,
    discount: 29,
    discountType: "percentage",
    fabric: "100% Combed Cotton Hosiery",
    material: "Interlock Soft Cotton",
    pattern: "Playful Star & Moon Print",
    neckType: "Round Neck T-Shirt & Pyjama Set",
    sleeveType: "Half Sleeve",
    description: "Ultra-comfy 2-piece nightsuit with elasticated waistband pyjamas. Pre-washed to ensure non-shrink and baby-soft feel against delicate skin.",
    shortDescription: "2-piece comfy cotton pyjama nightsuit set for boys and girls.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "2-3 Yrs", price: 499, mrp: 699, stock: 18, sku: "NC-KID-NW1-23" },
      { size: "4-5 Yrs", price: 499, mrp: 699, stock: 20, sku: "NC-KID-NW1-45" },
      { size: "6-7 Yrs", price: 529, mrp: 729, stock: 15, sku: "NC-KID-NW1-67" },
    ],
    images: [
      "/uploads/img-1791865990474-4d17ff1906ef6fe96e6debe91f1663ce.jpg",
    ],
    coverImage: "/uploads/img-1791865990474-4d17ff1906ef6fe96e6debe91f1663ce.jpg",
  },
  {
    name: "Cute Cartoon Character Kids Cotton Nightwear",
    category: "Kids Wear",
    subcategory: "Kids Nightwear",
    brand: "Nithi Collection",
    price: 549,
    mrp: 799,
    discount: 31,
    discountType: "percentage",
    fabric: "100% Cotton Rib",
    material: "Ribbed Bio-Washed Cotton",
    pattern: "Cute Animal Cartoon Print",
    neckType: "Envelope Neck Top & Pant Set",
    sleeveType: "Full Sleeve",
    description: "Full sleeve cozy night suit set to keep kids warm during night sleep. Ribbed ankles prevent pyjamas from riding up.",
    shortDescription: "Full sleeve cartoon print nightwear set with ribbed cuffs and ankles.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "3-4 Yrs", price: 549, mrp: 799, stock: 15, sku: "NC-KID-NW2-34" },
      { size: "5-6 Yrs", price: 549, mrp: 799, stock: 20, sku: "NC-KID-NW2-56" },
      { size: "7-8 Yrs", price: 579, mrp: 829, stock: 15, sku: "NC-KID-NW2-78" },
    ],
    images: [
      "/uploads/img-1791866184876-c5668ef8bca0ef975427a5e21abf7960.jpg",
    ],
    coverImage: "/uploads/img-1791866184876-c5668ef8bca0ef975427a5e21abf7960.jpg",
  },

  // ----------------------------------------------------
  // 5. Category: Unstitched salwar material
  // ----------------------------------------------------
  // Subcategory: Pure Cotton Printed Material
  {
    name: "Chanderi Cotton Unstitched Salwar Suit with Dupatta",
    category: "Unstitched salwar material",
    subcategory: "Pure Cotton Printed Material",
    brand: "Nithi Collection",
    price: 1299,
    mrp: 1899,
    discount: 32,
    discountType: "percentage",
    fabric: "Chanderi Cotton Blend",
    material: "Top: 2.5m, Bottom: 2.0m, Dupatta: 2.25m",
    pattern: "Block Print with Zari Weave Dupatta",
    description: "Premium 3-piece unstitched dress material package. Includes rich Chanderi cotton top, matching cotton salwar bottom, and lightweight woven dupatta.",
    shortDescription: "3-piece Chanderi cotton dress material with woven zari border dupatta.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "Free Size", price: 1299, mrp: 1899, stock: 40, sku: "NC-SLW-MAT1-FS" },
    ],
    images: [
      "/uploads/img-1791866184903-0707989ac8695aba5b4ee38c63959928.jpg",
    ],
    coverImage: "/uploads/img-1791866184903-0707989ac8695aba5b4ee38c63959928.jpg",
  },
  {
    name: "Bandhani Printed Pure Cotton Dress Material",
    category: "Unstitched salwar material",
    subcategory: "Pure Cotton Printed Material",
    brand: "Nithi Collection",
    price: 1099,
    mrp: 1499,
    discount: 27,
    discountType: "percentage",
    fabric: "100% Pure Cambric Cotton",
    material: "Top: 2.25m, Bottom: 2.0m, Dupatta: 2.25m",
    pattern: "Traditional Bandhani Tie-Dye",
    description: "Authentic Gujarati Bandhani tie-dye printed pure cotton salwar suit material. High color longevity and soft breathable cotton feel.",
    shortDescription: "Vibrant traditional Bandhani print unstitched 3-piece cotton suit material.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "Free Size", price: 1099, mrp: 1499, stock: 45, sku: "NC-SLW-MAT2-FS" },
    ],
    images: [
      "/uploads/img-1791866275143-aade090026e1e4f4ea64624bc9df2c31.jpg",
    ],
    coverImage: "/uploads/img-1791866275143-aade090026e1e4f4ea64624bc9df2c31.jpg",
  },
  {
    name: "Kalamkari Handblock Unstitched Cotton Suit",
    category: "Unstitched salwar material",
    subcategory: "Pure Cotton Printed Material",
    brand: "Nithi Collection",
    price: 1399,
    mrp: 1999,
    discount: 30,
    discountType: "percentage",
    fabric: "Mangalagiri Pure Cotton",
    material: "Top: 2.5m, Bottom: 2.0m, Dupatta: 2.4m",
    pattern: "Kalamkari Natural Dye Motif",
    description: "Exquisite handblock Kalamkari design on fine Mangalagiri cotton fabric. Accompanied by solid bottom cloth and matching printed cotton dupatta.",
    shortDescription: "Artisanal handblock Kalamkari unstitched dress material with dupatta.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "Free Size", price: 1399, mrp: 1999, stock: 35, sku: "NC-SLW-MAT3-FS" },
    ],
    images: [
      "/uploads/img-1791866275149-2cd4100132912207bbe389264be2e1dd.jpg",
    ],
    coverImage: "/uploads/img-1791866275149-2cd4100132912207bbe389264be2e1dd.jpg",
  },

  // ----------------------------------------------------
  // 6. Category: Salwar set
  // ----------------------------------------------------
  // Subcategory: Readymade Cotton Salwar Suit
  {
    name: "Stitched Pure Cotton Salwar Suit Set with Pant & Dupatta",
    category: "Salwar set",
    subcategory: "Readymade Cotton Salwar Suit",
    brand: "Nithi Collection",
    price: 1499,
    mrp: 2199,
    discount: 32,
    discountType: "percentage",
    fabric: "100% Pure Cotton",
    material: "Pure Cotton 60s Count",
    pattern: "Straight Kurta with Cigarette Pants",
    neckType: "Round Neck with Slit",
    sleeveType: "3/4 Sleeve",
    description: "Complete 3-piece ready-to-wear salwar set consisting of stitched calf-length kurta, tailored ankle pants with elastic waist, and chiffon printed dupatta.",
    shortDescription: "Ready-to-wear 3-piece cotton salwar suit set with pant and dupatta.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "S", price: 1499, mrp: 2199, stock: 10, sku: "NC-SLW-SET1-S" },
      { size: "M", price: 1499, mrp: 2199, stock: 15, sku: "NC-SLW-SET1-M" },
      { size: "L", price: 1499, mrp: 2199, stock: 20, sku: "NC-SLW-SET1-L" },
      { size: "XL", price: 1499, mrp: 2199, stock: 15, sku: "NC-SLW-SET1-XL" },
      { size: "XXL", price: 1549, mrp: 2249, stock: 10, sku: "NC-SLW-SET1-XXL" },
    ],
    images: [
      "/uploads/img-1791866329546-8c79a099d88ca515913214022a36d3c5.jpg",
    ],
    coverImage: "/uploads/img-1791866329546-8c79a099d88ca515913214022a36d3c5.jpg",
  },
  {
    name: "Floral Printed Ready to Wear Cotton Salwar Suit",
    category: "Salwar set",
    subcategory: "Readymade Cotton Salwar Suit",
    brand: "Nithi Collection",
    price: 1399,
    mrp: 1999,
    discount: 30,
    discountType: "percentage",
    fabric: "Cambric Cotton",
    material: "Breathable Combed Cotton",
    pattern: "All-Over Floral Jaal with Solid Pant",
    neckType: "Boat Neck with Piping",
    sleeveType: "3/4 Sleeve",
    description: "Vibrant ready-to-wear cotton suit designed for festive occasions and family functions. Easy to wash and wear with zero transparency.",
    shortDescription: "Graceful floral printed ready-to-wear salwar suit set with soft dupatta.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "M", price: 1399, mrp: 1999, stock: 15, sku: "NC-SLW-SET2-M" },
      { size: "L", price: 1399, mrp: 1999, stock: 20, sku: "NC-SLW-SET2-L" },
      { size: "XL", price: 1399, mrp: 1999, stock: 15, sku: "NC-SLW-SET2-XL" },
      { size: "XXL", price: 1449, mrp: 2049, stock: 10, sku: "NC-SLW-SET2-XXL" },
    ],
    images: [
      "/uploads/img-1791866329567-ad655726589ca082918c5ba96877943a.jpg",
    ],
    coverImage: "/uploads/img-1791866329567-ad655726589ca082918c5ba96877943a.jpg",
  },

  // ----------------------------------------------------
  // 7. Category: Kurtis(Tops)
  // ----------------------------------------------------
  // Subcategory: Straight Cut Kurti
  {
    name: "Solid Pastel Pure Cotton Straight Cut Kurti",
    category: "Kurtis(Tops)",
    subcategory: "Straight Cut Kurti",
    brand: "Nithi Collection",
    price: 649,
    mrp: 899,
    discount: 28,
    discountType: "percentage",
    fabric: "100% Pure Cotton",
    material: "Cotton Poplin",
    pattern: "Solid Pastel with Contrast Stitch Lines",
    neckType: "Mandarin V-Neck",
    sleeveType: "Roll-Up Tab Sleeves",
    length: "42 Inches",
    description: "Minimalist pastel straight cut kurti top crafted with roll-up tab sleeves and side slit design. Pairs smoothly with denim jeans or cotton pants.",
    shortDescription: "Versatile pastel cotton straight cut kurti top with roll-up sleeves.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "S", price: 649, mrp: 899, stock: 15, sku: "NC-TOP-ST1-S" },
      { size: "M", price: 649, mrp: 899, stock: 20, sku: "NC-TOP-ST1-M" },
      { size: "L", price: 649, mrp: 899, stock: 25, sku: "NC-TOP-ST1-L" },
      { size: "XL", price: 649, mrp: 899, stock: 18, sku: "NC-TOP-ST1-XL" },
      { size: "XXL", price: 699, mrp: 949, stock: 12, sku: "NC-TOP-ST1-XXL" },
    ],
    images: [
      "/uploads/img-1791866329572-839cc1611e910e12a497b2b30df8ad30.jpg",
    ],
    coverImage: "/uploads/img-1791866329572-839cc1611e910e12a497b2b30df8ad30.jpg",
  },
  {
    name: "Casual Printed Short Kurti Top for Jeans",
    category: "Kurtis(Tops)",
    subcategory: "Straight Cut Kurti",
    brand: "Nithi Collection",
    price: 599,
    mrp: 799,
    discount: 25,
    discountType: "percentage",
    fabric: "Pure Rayon Cotton",
    material: "Soft Drape Cotton Rayon",
    pattern: "Boho Geometric Print",
    neckType: "Round Neck with Tassel Tie",
    sleeveType: "Half Sleeve",
    length: "32 Inches",
    description: "Trendy short tunic style kurti top designed specially to be worn over denim and jeggings. Features playful boho prints and tassel cords.",
    shortDescription: "Boho printed short kurti top crafted for modern jeans pairing.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "S", price: 599, mrp: 799, stock: 15, sku: "NC-TOP-ST2-S" },
      { size: "M", price: 599, mrp: 799, stock: 20, sku: "NC-TOP-ST2-M" },
      { size: "L", price: 599, mrp: 799, stock: 20, sku: "NC-TOP-ST2-L" },
      { size: "XL", price: 599, mrp: 799, stock: 15, sku: "NC-TOP-ST2-XL" },
    ],
    images: [
      "/uploads/img-1791866376542-88d280e6b15d7cd0770e3eb487bc32c6.jpg",
    ],
    coverImage: "/uploads/img-1791866376542-88d280e6b15d7cd0770e3eb487bc32c6.jpg",
  },
  {
    name: "Classic Striped Straight Cut Everyday Kurti",
    category: "Kurtis(Tops)",
    subcategory: "Straight Cut Kurti",
    brand: "Nithi Collection",
    price: 699,
    mrp: 949,
    discount: 26,
    discountType: "percentage",
    fabric: "100% Khadi Cotton",
    material: "Breathable Khadi Weave",
    pattern: "Vertical Pinstripe Weave",
    neckType: "Collared Neck",
    sleeveType: "3/4 Sleeve",
    length: "42 Inches",
    description: "Elegant pinstriped Khadi cotton kurti tailored with a neat shirt collar and front placket. Keeps you cool all day long.",
    shortDescription: "Collared vertical stripe Khadi cotton straight cut everyday kurti.",
    status: "ACTIVE",
    inStock: true,
    sizeOptions: [
      { size: "M", price: 699, mrp: 949, stock: 18, sku: "NC-TOP-ST3-M" },
      { size: "L", price: 699, mrp: 949, stock: 20, sku: "NC-TOP-ST3-L" },
      { size: "XL", price: 699, mrp: 949, stock: 18, sku: "NC-TOP-ST3-XL" },
      { size: "XXL", price: 749, mrp: 999, stock: 12, sku: "NC-TOP-ST3-XXL" },
    ],
    images: [
      "/uploads/img-1791866376557-59829101ba6c424988b98ba6a4d43c5e.jpg",
    ],
    coverImage: "/uploads/img-1791866376557-59829101ba6c424988b98ba6a4d43c5e.jpg",
  },
];

async function addSampleProducts() {
  console.log("==================================================");
  console.log("ADDING SAMPLE PRODUCTS VIA EXISTING ADMIN API");
  console.log("==================================================\n");

  const results = [];

  for (let i = 0; i < SAMPLE_PRODUCTS.length; i++) {
    const p = SAMPLE_PRODUCTS[i];
    const totalStock = p.sizeOptions.reduce((acc, opt) => acc + opt.stock, 0);
    const prodId = `prod-${Date.now()}-${i + 1}`;

    const payload = {
      ...p,
      id: prodId,
      code: `NC-${p.category.slice(0, 3).toUpperCase()}-${100 + i}`,
      sku: `SKU-${p.category.slice(0, 3).toUpperCase()}-${100 + i}`,
      stock: totalStock,
      sizes: p.sizeOptions.map((s) => s.size),
      finalPrice: Math.round(p.price - (p.price * (p.discount || 0)) / 100),
    };

    try {
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer nithi_dev_session_token",
        },
        body: JSON.stringify(payload),
      });

      const resJson = await res.json();
      if (!res.ok || !resJson.success) {
        throw new Error(`API error (${res.status}): ${JSON.stringify(resJson)}`);
      }

      console.log(`[${i + 1}/${SAMPLE_PRODUCTS.length}] ✓ Added "${p.name}"`);
      console.log(`    Category: "${p.category}" | Subcategory: "${p.subcategory}" | Stock: ${totalStock} | Price: ₹${p.price}`);
      results.push({ name: p.name, category: p.category, subcategory: p.subcategory, id: prodId, stock: totalStock });
    } catch (err) {
      console.error(`[${i + 1}/${SAMPLE_PRODUCTS.length}] ❌ Failed to add "${p.name}":`, err.message);
      throw err;
    }
  }

  console.log("\n==================================================");
  console.log(`SUCCESSFULLY ADDED ${results.length} SAMPLE PRODUCTS!`);
  console.log("==================================================");
}

addSampleProducts().catch((err) => {
  console.error("FATAL ERROR:", err);
  process.exit(1);
});
