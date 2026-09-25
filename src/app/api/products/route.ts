import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import InventoryTransaction from "@/lib/models/InventoryTransaction";
import AuditLog from "@/lib/models/AuditLog";
import { getAuthUser } from "@/lib/auth";
import fs from "fs";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const search = searchParams.get("search");
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};

    if (category && category !== "All") {
      filter.category = new RegExp(`^${category}$`, "i");
    }

    if (subcategory && subcategory !== "All") {
      filter.subcategory = new RegExp(`^${subcategory}$`, "i");
    }

    if (status && status !== "All") {
      filter.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { name: searchRegex },
        { code: searchRegex },
        { sku: searchRegex },
        { category: searchRegex },
      ];
    }

    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const user = getAuthUser(request);
  try {
    await connectToDatabase();

    let productData: any = {};
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const rawProductData = formData.get("productData");
      if (rawProductData && typeof rawProductData === "string") {
        try {
          productData = JSON.parse(rawProductData);
        } catch {
          productData = {};
        }
      }

      // Handle any files attached directly to this request
      const files = formData.getAll("images") as File[];
      if (files && files.length > 0) {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const uploadedUrls: string[] = [];
        for (const file of files) {
          if (typeof file === "object" && file !== null && "arrayBuffer" in file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const ext = path.extname(file.name || "") || ".jpg";
            const filename = `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`;
            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);
            uploadedUrls.push(`/uploads/${filename}`);
          }
        }

        if (uploadedUrls.length > 0) {
          // Replace any __LOCAL_X__ placeholders with actual uploaded URLs
          const resolvePlaceholder = (val: string) => {
            if (!val) return val;
            const match = val.match(/__LOCAL_(\d+)__/);
            if (match) {
              const idx = parseInt(match[1], 10);
              return uploadedUrls[idx] || uploadedUrls[0] || val;
            }
            if (val.startsWith("blob:")) {
              return uploadedUrls[0] || val;
            }
            return val;
          };

          if (Array.isArray(productData.images)) {
            productData.images = productData.images.map((img: string) => resolvePlaceholder(img));
          } else {
            productData.images = [];
          }

          // If images array didn't have the uploaded files, add them
          uploadedUrls.forEach((url) => {
            if (!productData.images.includes(url)) {
              productData.images.push(url);
            }
          });

          if (productData.coverImage) {
            productData.coverImage = resolvePlaceholder(productData.coverImage);
          }

          if (Array.isArray(productData.colorOptions)) {
            productData.colorOptions = productData.colorOptions.map((co: any) => ({
              ...co,
              image: resolvePlaceholder(co.image),
            }));
          }

          if (productData.colorImages && typeof productData.colorImages === "object") {
            const resolvedColorImages: Record<string, string> = {};
            for (const [clr, img] of Object.entries(productData.colorImages)) {
              resolvedColorImages[clr] = resolvePlaceholder(img as string);
            }
            productData.colorImages = resolvedColorImages;
          }

          if (Array.isArray(productData.variants)) {
            productData.variants = productData.variants.map((v: any) => ({
              ...v,
              image: resolvePlaceholder(v.image),
            }));
          }
        }
      }
    } else {
      const body = await request.json();
      productData = { ...body };
    }

    let isEdit = false;
    let oldProduct = null;

    if (productData.id) {
      oldProduct = await Product.findOne({ id: productData.id });
      if (oldProduct) isEdit = true;
    } else {
      productData.id = `p${Date.now().toString().slice(-6)}`;
    }

    if (!productData.sku && !productData.code) {
      productData.code = `NC-${productData.category ? productData.category.slice(0, 3).toUpperCase() : "NIG"}-${Math.floor(100 + Math.random() * 900)}`;
      productData.sku = productData.code;
    }

    // Default fallback image if empty
    const DEFAULT_FALLBACK_IMG = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=700&h=900&fit=crop";

    // Clean up any remaining blob or __LOCAL_ placeholders in productData
    const sanitizeUrl = (url: string) => {
      if (!url || typeof url !== "string") return DEFAULT_FALLBACK_IMG;
      if (url.startsWith("blob:") || url.includes("__LOCAL_")) {
        return DEFAULT_FALLBACK_IMG;
      }
      return url;
    };

    if (Array.isArray(productData.images)) {
      productData.images = productData.images.map(sanitizeUrl);
    }
    if (productData.coverImage) {
      productData.coverImage = sanitizeUrl(productData.coverImage);
    }

    if (!productData.coverImage && productData.images && productData.images.length > 0) {
      productData.coverImage = productData.images[0];
    } else if (!productData.coverImage) {
      productData.coverImage = DEFAULT_FALLBACK_IMG;
    }

    if (!productData.images || productData.images.length === 0) {
      productData.images = [productData.coverImage];
    }

    const savedProduct = await Product.findOneAndUpdate(
      { id: productData.id },
      { $set: productData },
      { upsert: true, new: true, runValidators: true }
    );

    // Audit log & Inventory transaction recording
    try {
      if (isEdit && oldProduct) {
        if (oldProduct.stock !== savedProduct.stock) {
          await new InventoryTransaction({
            id: `tx-${Date.now()}`,
            productId: savedProduct.id,
            productName: savedProduct.name,
            date: new Date().toISOString(),
            action: savedProduct.stock > oldProduct.stock ? "ADD" : "SET",
            quantity: Math.abs(savedProduct.stock - oldProduct.stock),
            previousStock: oldProduct.stock,
            newStock: savedProduct.stock,
            reason: "Manual admin product update",
            changedBy: user.name || "Super Admin",
          }).save();
        }

        await new AuditLog({
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          adminName: user.name || "Super Admin",
          action: "UPDATE",
          targetType: "PRODUCT",
          targetId: savedProduct.id,
          targetName: savedProduct.name,
          oldValue: `Price: ${oldProduct.price}, Stock: ${oldProduct.stock}`,
          newValue: `Price: ${savedProduct.price}, Stock: ${savedProduct.stock}`,
          reason: "Product info updated via Admin Console",
        }).save();
      } else {
        await new InventoryTransaction({
          id: `tx-${Date.now()}`,
          productId: savedProduct.id,
          productName: savedProduct.name,
          date: new Date().toISOString(),
          action: "ADD",
          quantity: savedProduct.stock || 0,
          previousStock: 0,
          newStock: savedProduct.stock || 0,
          reason: "Initial catalogue creation",
          changedBy: user.name || "Super Admin",
        }).save();

        await new AuditLog({
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          adminName: user.name || "Super Admin",
          action: "CREATE",
          targetType: "PRODUCT",
          targetId: savedProduct.id,
          targetName: savedProduct.name,
          newValue: `Added new product "${savedProduct.name}"`,
          reason: "New catalogue entry created",
        }).save();
      }
    } catch (logErr) {
      console.error("Non-fatal audit logging error:", logErr);
    }

    return NextResponse.json({
      success: true,
      data: savedProduct,
      message: isEdit ? "Product updated successfully" : "Product created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save product: " + (error as Error).message },
      { status: 500 }
    );
  }
}
