import XLSX from "xlsx";
import Product from "@/lib/models/Product";
import Order from "@/lib/models/Order";
import Customer from "@/lib/models/Customer";
import Booking from "@/lib/models/Booking";
import InventoryTransaction from "@/lib/models/InventoryTransaction";
import ComboOffer from "@/lib/models/ComboOffer";
import ShippingRule from "@/lib/models/ShippingRule";

export async function getAllBackupData() {
  const [products, orders, customers, bookings, inventoryTx, combos, shippingRules] =
    await Promise.all([
      Product.find().lean(),
      Order.find().lean(),
      Customer.find().lean(),
      Booking.find().lean(),
      InventoryTransaction.find().lean(),
      ComboOffer.find().lean(),
      ShippingRule.find().lean(),
    ]);

  const variants: object[] = [];
  (products as Array<{ id: string; name: string; sku?: string; code?: string; color?: string; price: number; mrp?: number; stock?: number; sizeOptions?: Array<{ size: string; sku?: string; price: number; mrp?: number; stock: number }>; sizes?: string[] }>).forEach((p) => {
    if (p.sizeOptions && p.sizeOptions.length > 0) {
      p.sizeOptions.forEach((s) => {
        variants.push({ productId: p.id, productName: p.name, sku: s.sku || `${p.sku || p.code}-${s.size}`, color: p.color || "Standard", size: s.size, price: s.price || p.price, mrp: s.mrp || p.mrp || s.price || p.price, stock: s.stock || 0 });
      });
    } else if (p.sizes && p.sizes.length > 0) {
      p.sizes.forEach((sz) => { variants.push({ productId: p.id, productName: p.name, sku: `${p.sku || p.code}-${sz}`, color: p.color || "Standard", size: sz, price: p.price, mrp: p.mrp || p.price, stock: p.stock || 0 }); });
    }
  });

  const orderItems: object[] = [];
  (orders as Array<{ orderId: string; customerName: string; customerPhone: string; createdAt?: Date; paymentStatus?: string; orderStatus?: string; items?: Array<{ productId: string; productName: string; selectedColor?: string; selectedSize?: string; quantity: number; price: number; discount?: number; finalPrice: number }> }>).forEach((o) => {
    (o.items || []).forEach((it) => {
      orderItems.push({ orderId: o.orderId, customerName: o.customerName, customerPhone: o.customerPhone, productId: it.productId, productName: it.productName, selectedColor: it.selectedColor || "Standard", selectedSize: it.selectedSize || "Free Size", quantity: it.quantity, unitPrice: it.price, discount: it.discount || 0, finalPrice: it.finalPrice, itemTotal: it.finalPrice * it.quantity, orderDate: o.createdAt ? new Date(o.createdAt).toLocaleString("en-IN") : "", paymentStatus: o.paymentStatus, orderStatus: o.orderStatus });
    });
  });

  return { products, variants, customers, orders, orderItems, bookings, inventoryTx, combos, shippingRules };
}

export async function generateExcelBackup(): Promise<Buffer> {
  const data = await getAllBackupData();
  const wb = XLSX.utils.book_new();

  const productsSheetData = (data.products as Array<Record<string, unknown>>).map((p) => ({
    "Product ID": p.id, Name: p.name, SKU: p.sku || p.code, Category: p.category, Subcategory: p.subcategory || "",
    "Selling Price (₹)": (p.finalPrice || p.price) as number, "MRP (₹)": (p.mrp || p.price) as number,
    "Discount (%)": (p.discount || 0) as number, Stock: (p.stock ?? 0) as number,
    "Stock Status": (p.stock as number) <= 0 ? "OUT OF STOCK" : (p.stock as number) <= 10 ? "LOW STOCK" : "IN STOCK",
    Color: p.color || ((p.colors as string[] | undefined)?.[0]) || "", Sizes: ((p.sizes as string[] | undefined) || []).join(", "),
    Status: p.status, "Created Date": p.createdAt ? new Date(p.createdAt as string).toLocaleDateString("en-IN") : "",
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(productsSheetData), "Products");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.variants as object[]), "Product Variants");

  const customersSheetData = (data.customers as Array<Record<string, unknown>>).map((c) => ({
    "Customer ID": c.customerId, Name: c.name, Phone: c.phone, Email: c.email || "",
    Address: c.address || "", City: c.city || "", State: c.state || "", Pincode: c.pincode || "",
    "Total Orders": (c.totalOrders || 0) as number, "Total Spent (₹)": (c.totalSpent || 0) as number, Status: c.status,
    "Registered Date": c.registrationDate ? new Date(c.registrationDate as string).toLocaleDateString("en-IN") : "",
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(customersSheetData), "Customers");

  const ordersSheetData = (data.orders as Array<Record<string, unknown>>).map((o) => ({
    "Order ID": o.orderId, "Customer Name": o.customerName, Phone: o.customerPhone, Email: o.customerEmail || "",
    Address: o.shippingAddress, State: o.shippingState, "Subtotal (₹)": o.subtotal, "Shipping Fee (₹)": o.shippingFee,
    "Discount (₹)": o.discount, "Total Amount (₹)": o.total, "Payment Method": o.paymentMethod,
    "Payment Status": o.paymentStatus, "Order Status": o.orderStatus, "Invoice Number": o.invoiceNumber || "",
    "Order Date": o.createdAt ? new Date(o.createdAt as string).toLocaleString("en-IN") : "",
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ordersSheetData), "Orders");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data.orderItems as object[]), "Order Items");

  const bookingsSheetData = (data.bookings as Array<Record<string, unknown>>).map((b) => ({
    "Booking ID": b.bookingId, "Customer Name": b.customerName, Phone: b.customerPhone, Email: b.customerEmail || "",
    "Service / Product": b.serviceOrProduct, Date: b.date, Time: b.time || "", Quantity: b.quantity,
    "Price (₹)": b.price, "Payment Status": b.paymentStatus, "Booking Status": b.bookingStatus,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(bookingsSheetData), "Bookings");

  const inventorySheetData = (data.inventoryTx as Array<Record<string, unknown>>).map((tx) => ({
    "Transaction ID": tx.id, "Product ID": tx.productId, "Product Name": tx.productName,
    Action: tx.action, Quantity: tx.quantity, "Previous Stock": tx.previousStock, "New Stock": tx.newStock,
    Reason: tx.reason, "Changed By": tx.changedBy, Timestamp: tx.date,
  }));
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(inventorySheetData), "Inventory Transactions");

  return XLSX.write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
}

export function validateImportData(records: Record<string, unknown>[], targetCollection = "products") {
  const errors: string[] = [];
  const validRecords: Record<string, unknown>[] = [];

  if (!Array.isArray(records) || records.length === 0) {
    return { isValid: false, totalCount: 0, validCount: 0, errorCount: 1, errors: ["The uploaded file contains no data rows."], preview: [] };
  }

  records.forEach((row, idx) => {
    const rowNum = idx + 2;
    if (targetCollection === "products") {
      const name = row.Name || row.name || row["Product Name"];
      const price = Number(row.Price || row.price || row["Selling Price (₹)"] || row["Price (₹)"]);
      const sku = row.SKU || row.sku || row.code || row["SKU Code"];
      if (!name) { errors.push(`Row ${rowNum}: Missing required product name.`); }
      else if (isNaN(price) || price < 0) { errors.push(`Row ${rowNum} ("${name}"): Invalid price "${price}".`); }
      else {
        validRecords.push({ id: row["Product ID"] || row.id || `p${Date.now().toString().slice(-6)}${idx}`, name: String(name).trim(), sku: sku ? String(sku).trim() : `NC-GEN-${idx + 1}`, category: row.Category || row.category || "Nighty", price, mrp: Number(row.MRP || row.mrp || row["MRP (₹)"]) || price, discount: Number(row.Discount || row.discount || row["Discount (%)"]) || 0, stock: Number(row.Stock || row.stock) || 0, color: row.Color || row.color || "Standard", status: row.Status || row.status || "ACTIVE" });
      }
    } else if (targetCollection === "customers") {
      const name = row.Name || row.name || row["Customer Name"];
      const phone = row.Phone || row.phone || row["Mobile"];
      if (!name || !phone) { errors.push(`Row ${rowNum}: Name and phone number are required.`); }
      else { validRecords.push({ customerId: row["Customer ID"] || row.customerId || `CUST-${Date.now().toString().slice(-4)}${idx}`, name: String(name).trim(), phone: String(phone).trim(), email: row.Email || row.email || "", address: row.Address || row.address || "", city: row.City || row.city || "", state: row.State || row.state || "Tamil Nadu", pincode: row.Pincode || row.pincode || "", status: "ACTIVE" }); }
    }
  });

  return { isValid: errors.length === 0, totalCount: records.length, validCount: validRecords.length, errorCount: errors.length, errors: errors.slice(0, 15), preview: validRecords.slice(0, 5), validRecords };
}

export async function executeSafeImport(validRecords: Record<string, unknown>[], targetCollection = "products", mode = "add_new") {
  let imported = 0, updated = 0, skipped = 0, failed = 0;
  const errorDetails: string[] = [];

  if (targetCollection === "products") {
    for (const rec of validRecords) {
      try {
        const existing = await Product.findOne({ $or: [{ id: rec.id }, { sku: rec.sku }, { name: rec.name }] });
        if (existing) {
          if (mode === "skip_duplicates") { skipped++; continue; }
          if (mode === "update_existing") {
            Object.assign(existing, { price: rec.price, mrp: rec.mrp, discount: rec.discount, stock: rec.stock, color: rec.color || existing.color, status: rec.status || existing.status, updatedAt: new Date() });
            await existing.save(); updated++; continue;
          }
        }
        await new Product({ ...rec, id: rec.id || `p${Date.now().toString().slice(-6)}`, finalPrice: Math.max(0, Math.round((rec.price as number) - ((rec.price as number) * ((rec.discount as number) || 0)) / 100)), inStock: ((rec.stock as number) || 0) > 0, status: (rec.stock as number) === 0 ? "OUT OF STOCK" : rec.status || "ACTIVE", sizes: ["Free Size"], colors: [rec.color || "Standard"], images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=400&h=500&fit=crop"], coverImage: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=400&h=500&fit=crop", updatedAt: new Date() }).save();
        imported++;
      } catch (e) { failed++; errorDetails.push(`Failed on "${rec.name}": ${(e as Error).message}`); }
    }
  } else if (targetCollection === "customers") {
    for (const rec of validRecords) {
      try {
        const existing = await Customer.findOne({ $or: [{ phone: rec.phone }, { customerId: rec.customerId }] });
        if (existing) {
          if (mode === "skip_duplicates") { skipped++; continue; }
          if (mode === "update_existing") { Object.assign(existing, { name: rec.name, email: rec.email || existing.email, address: rec.address || existing.address, state: rec.state || existing.state }); await existing.save(); updated++; continue; }
        }
        await new Customer(rec).save(); imported++;
      } catch (e) { failed++; errorDetails.push(`Failed on customer "${rec.name}": ${(e as Error).message}`); }
    }
  }

  return { success: true, imported, updated, skipped, failed, errorDetails };
}
