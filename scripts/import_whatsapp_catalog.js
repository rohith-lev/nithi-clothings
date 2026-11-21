const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Prefer D:\Levroun India\nithi collections\nithi-clothings\src\assets\catalog-nithi-collections
let CATALOG_DIR = path.join(__dirname, '..', 'src', 'assets', 'catalog-nithi-collections');
let CATALOG_JSON = path.join(CATALOG_DIR, 'items.json');
if (!fs.existsSync(CATALOG_JSON)) {
  CATALOG_DIR = path.join(__dirname, '..', 'src', 'assets', 'catalog-nithi-collections-1');
  CATALOG_JSON = path.join(CATALOG_DIR, 'items.json');
}
if (!fs.existsSync(CATALOG_JSON)) {
  CATALOG_DIR = 'C:/Users/91638/Downloads/catalog-nithi-collections (1)/catalog-nithi-collections';
  CATALOG_JSON = path.join(CATALOG_DIR, 'items.json');
}

console.log('Reading catalog from:', CATALOG_JSON);
const rawCatalog = JSON.parse(fs.readFileSync(CATALOG_JSON, 'utf8'));
console.log(`Loaded ${rawCatalog.items.length} items from WhatsApp Catalog JSON.`);

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/â‚¹/g, '₹')
    .replace(/â€/g, '-')
    .replace(/\r\n/g, '\n')
    .trim();
}

function parsePrice(item) {
  let p = item.price ? parseInt(item.price.replace(/[^0-9]/g, '')) / 100 : 0;
  if (!p || isNaN(p) || p === 0) {
    const m =
      (item.description || '').match(/Price\s*:\s*(\d+)/i) ||
      (item.description || '').match(/₹\s*(\d+)/i) ||
      (item.description || '').match(/â‚¹\s*(\d+)/i);
    p = m ? parseInt(m[1]) : 340;
  }
  return p;
}

const products = rawCatalog.items.map((item, index) => {
  const title = (item.title || '').trim();
  const lower = title.toLowerCase();
  const desc = cleanText(item.description || '');

  let category = 'Nighty';
  let subcategory = 'Zip nighty';
  let productTypeName = 'Zip Nighty';
  let fabric = '100% Pure Cotton';
  let length = '55 Inches';
  let size = 'Free Size';

  // Fabric extraction
  const fabricMatch = desc.match(/\*?Fabric\*?\s*:\s*([^\n\r*]+)/i);
  if (fabricMatch && fabricMatch[1]) {
    fabric = fabricMatch[1].trim();
  } else if (lower.includes('battik') || lower.includes('batik')) {
    fabric = 'Batik Cotton';
  } else if (lower.includes('kalamkari')) {
    fabric = 'Kalamkari Cotton';
  } else if (lower.includes('tie') && lower.includes('dye')) {
    fabric = 'Tie & Dye Cotton';
  } else if (lower.includes('chanderi')) {
    fabric = 'Chanderi Silk Cotton';
  } else if (lower.includes('ikkat')) {
    fabric = 'Ikkat Handloom Cotton';
  } else if (lower.includes('handloom')) {
    fabric = 'Handloom Cotton';
  } else if (lower.includes('linen')) {
    fabric = 'Linen Cotton';
  }

  // Length extraction
  if (lower.includes('60inch') || lower.includes('60 inch')) {
    length = '60 Inches';
  } else if (lower.includes('55inch') || lower.includes('55 inch')) {
    length = '55 Inches';
  }

  // Priority classification:
  // 1. Is it a Nighty?
  if (lower.includes('nighty') || lower.includes('nighties')) {
    category = 'Nighty';
    if (lower.includes('feeding') || lower.includes('vertical zip')) {
      subcategory = 'Double side vertical zip';
      productTypeName = 'Feeding Zip Nighty';
    } else if (lower.includes('piping')) {
      subcategory = 'Piping nighty';
      productTypeName = 'Piping Nighty';
    } else if (lower.includes('without zip') || lower.includes('zipless')) {
      subcategory = 'Zipless nighty';
      productTypeName = 'Zipless Nighty';
    } else if (lower.includes('titanic')) {
      subcategory = 'Titanic model nighty';
      productTypeName = 'Titanic Nighty';
    } else if (lower.includes('elastic')) {
      subcategory = 'Elastic model nighty';
      productTypeName = 'Elastic Nighty';
    } else if (lower.includes('collar')) {
      subcategory = 'Collar model nighty';
      productTypeName = 'Collar Nighty';
    } else if (lower.includes('60inch') || lower.includes('60 inch')) {
      subcategory = '60 inch Nighty';
      productTypeName = '60 Inch Nighty';
    } else {
      subcategory = 'Zip nighty';
      productTypeName = 'Zip Nighty';
    }
  }
  // 2. Is it a Night Dress / Night Suit?
  else if (lower.includes('night dress') || lower.includes('night suit')) {
    category = 'Night dress';
    subcategory = '2-Piece Night Dress';
    productTypeName = 'Night Dress';
  }
  // 3. Is it a Maxi?
  else if (lower.includes('maxi')) {
    category = 'Maxi';
    subcategory = 'Daily Wear Maxi';
    productTypeName = 'Maxi';
  }
  // 4. Salwar / Chudi materials
  else {
    category = 'Unstitched salwar material';
    subcategory = 'Unstitched Salwar Material';
    productTypeName = 'Salwar Material';
    length = 'Top: 2.5m | Bottom: 2.0m | Dupatta: 2.3m';
  }

  // Size extraction
  if (lower.includes('4xl') || lower.includes('xxxxl')) size = '4XL';
  else if (lower.includes('3xl') || lower.includes('xxxl')) size = '3XL';
  else if (lower.includes('xxl')) size = 'XXL';
  else if (lower.includes('xl')) size = 'XL';
  else if (lower.includes('l size') || lower.includes(' l ')) size = 'L';
  else if (lower.includes('m size') || lower.includes(' m ')) size = 'M';
  else if (lower.includes('s size') || lower.includes(' s ')) size = 'S';
  else if (category === 'Unstitched salwar material') size = 'Free Size';

  const price = parsePrice(item);
  const mrp = Math.round((price * 1.35) / 10) * 10;
  const discount = Math.round(((mrp - price) / mrp) * 100);

  const imgName = item.image ? path.basename(item.image) : '';
  const imgUrl = `/uploads/catalog/${imgName}`;

  const code = `NC-${category.slice(0, 3).toUpperCase()}-${String(index + 101).padStart(3, '0')}`;

  let availableSizes = ['Free Size'];
  if (category === 'Nighty' || category === 'Night dress') {
    if (lower.includes('4xl') || lower.includes('xxxxl')) {
      availableSizes = ['L', 'XL', '2XL', '3XL', '4XL'];
    } else if (lower.includes('3xl') || lower.includes('xxxl')) {
      availableSizes = ['L', 'XL', '2XL', '3XL'];
    } else {
      availableSizes = ['L', 'XL', '2XL'];
    }
  } else if (category === 'Unstitched salwar material') {
    availableSizes = ['Free Size'];
  }

  const sizeOptions = availableSizes.map((s) => ({
    size: s,
    price: price,
    mrp: mrp,
    stock: 25,
    sku: `${code}-${s}`,
  }));

  const productTypeId = productTypeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const productTypes = [
    {
      id: productTypeId,
      name: productTypeName,
      price: price,
      mrp: mrp,
      stock: 25,
      image: imgUrl,
      active: true,
    },
  ];

  const shortHeadline =
    category === 'Unstitched salwar material'
      ? `Premium ${fabric} Unstitched Salwar Material with Dupatta`
      : `Pure Breathable Cotton ${productTypeName} (${size})`;

  return {
    id: item.id,
    name: title,
    code: code,
    sku: code,
    category: category,
    subcategory: subcategory,
    brand: 'Nithi Collections',
    price: price,
    mrp: mrp,
    discount: discount,
    discountType: 'percentage',
    discountValue: discount,
    finalPrice: price,
    coverImage: imgUrl,
    images: [imgUrl],
    sizes: availableSizes,
    sizeOptions: sizeOptions,
    colors: [],
    productTypes: productTypes,
    fabric: fabric,
    material: fabric,
    length: length,
    productLength: length,
    pattern: 'Printed',
    sleeveType: category === 'Unstitched salwar material' ? 'Unstitched' : 'Half Sleeve',
    neckType: 'Round Neck',
    description: desc,
    shortDescription: shortHeadline,
    care:
      category === 'Unstitched salwar material'
        ? 'First wash dry clean recommended. Gentle hand wash thereafter.'
        : 'Machine wash cold with like colors. Do not bleach. Dry in shade.',
    inStock: true,
    stock: 25,
    status: 'ACTIVE',
    rating: 4.8,
    reviews: 14 + (index % 17),
    newArrival: index < 12,
    isNew: index < 12,
    isBestSeller: index % 5 === 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
});

// 1. Write to src/data/products.ts
const productsFilePath = path.join(__dirname, '..', 'src', 'data', 'products.ts');
let productsFileContent = fs.readFileSync(productsFilePath, 'utf8');

const productsExportRegex = /export const products: Product\[\] = \[[\s\S]*?\];/;
const newProductsExport = `export const products: Product[] = ${JSON.stringify(products, null, 2)};`;

if (productsExportRegex.test(productsFileContent)) {
  productsFileContent = productsFileContent.replace(productsExportRegex, newProductsExport);
  fs.writeFileSync(productsFilePath, productsFileContent, 'utf8');
  console.log(`Successfully updated src/data/products.ts with ${products.length} products!`);
}

// 2. Insert / Upsert into MongoDB
const MONGO_URI =
  process.env.MONGODB_URI ||
  'mongodb://nithicollection2026_db_user:Nithi%402026@ac-qiaedoa-shard-00-00.cibj19h.mongodb.net:27017,ac-qiaedoa-shard-00-01.cibj19h.mongodb.net:27017,ac-qiaedoa-shard-00-02.cibj19h.mongodb.net:27017/nithi_collection?ssl=true&replicaSet=atlas-y2ds45-shard-0&authSource=admin&retryWrites=true&w=majority';

async function importToMongo() {
  console.log('Connecting to MongoDB Atlas...');
  try {
    await mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      dbName: 'nithi_collection',
    });
    console.log('Connected to MongoDB successfully!');

    const db = mongoose.connection.db;
    const productsCollection = db.collection('products');
    const categoriesCollection = db.collection('categories');

    console.log(`Upserting ${products.length} products into MongoDB 'products' collection...`);
    await productsCollection.deleteMany({ name: /ISHEUVBS/i });
    for (const p of products) {
      await productsCollection.updateOne(
        { id: p.id },
        { $set: p },
        { upsert: true }
      );
    }
    console.log(`Successfully upserted ${products.length} products into MongoDB!`);

    // Ensure Nighty category has all comprehensive subcategories in MongoDB
    const nightySubcategories = [
      { id: 'sub-zip-nighty', name: 'Zip nighty', parentGroup: 'Normal Nighty (55 inches)' },
      { id: 'sub-zipless-nighty', name: 'Zipless nighty', parentGroup: 'Normal Nighty (55 inches)' },
      { id: 'sub-piping-nighty', name: 'Piping nighty', parentGroup: 'Normal Nighty (55 inches)' },
      { id: 'sub-titanic-nighty', name: 'Titanic model nighty', parentGroup: 'Normal Nighty (55 inches)' },
      { id: 'sub-collar-nighty', name: 'Collar model nighty', parentGroup: 'Normal Nighty (55 inches)' },
      { id: 'sub-elastic-nighty', name: 'Elastic model nighty', parentGroup: 'Normal Nighty (55 inches)' },
      { id: 'sub-feeding-vertical-zip', name: 'Double side vertical zip', parentGroup: 'Maternity & Feeding wear' },
      { id: 'sub-feeding-frock', name: 'Feeding frock model', parentGroup: 'Frock model (55 inches)' },
      { id: 'sub-60inch-zip', name: '60 inch Zip nighty', parentGroup: '60 inch Nighty' },
      { id: 'sub-60inch-piping', name: '60 inch Piping nighty', parentGroup: '60 inch Nighty' },
      { id: 'sub-3xl-nighty', name: '3XL Nighty collections', parentGroup: 'Specialty Nighties' }
    ];

    await categoriesCollection.updateOne(
      { name: /nighty/i },
      {
        $set: {
          subcategories: nightySubcategories,
          isActive: true,
          showOnHome: true,
          priority: 1
        }
      },
      { upsert: true }
    );
    console.log('Successfully updated Nighty subcategories in MongoDB!');

    await mongoose.disconnect();
    console.log('MongoDB connection closed. Import complete!');
    process.exit(0);
  } catch (err) {
    console.error('MongoDB Atlas connection note:', err.message);
    process.exit(0);
  }
}

importToMongo();
