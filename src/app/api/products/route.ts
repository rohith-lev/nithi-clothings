import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import Category from "@/lib/models/Category";
import InventoryTransaction from "@/lib/models/InventoryTransaction";
import AuditLog from "@/lib/models/AuditLog";
import { requireAdmin, escapeRegex } from "@/lib/auth";
import { saveMediaBuffer } from "@/lib/mediaStorage";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const activeOnly = searchParams.get("activeOnly") === "true";

    const filter: Record<string, unknown> = {};

    if (activeOnly) {
      filter.status = "ACTIVE";
    }

    if (category && category !== "All") {
      const safeCat = escapeRegex(category.trim());
      if (safeCat) filter.category = new RegExp(`^${safeCat}$`, "i");
    }

    if (subcategory && subcategory !== "All") {
      const safeSub = escapeRegex(subcategory.trim());
      if (safeSub) {
        filter.subcategory = new RegExp(`(^| - )${safeSub}$|^${safeSub}$`, "i");
      }
    }

    if (status && status !== "All") {
      filter.status = escapeRegex(status.trim());
    }

    if (search) {
      const safeSearch = escapeRegex(search.trim());
      if (safeSearch) {
        const searchRegex = new RegExp(safeSearch, "i");
        filter.$or = [
          { name: searchRegex },
          { code: searchRegex },
          { sku: searchRegex },
          { category: searchRegex },
        ];
      }
    }

    const rawProducts = await Product.find(filter).sort({ createdAt: -1 }).lean();
    const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format";

    const products = rawProducts.map((p: any) => {
      const rawList = [p.coverImage, ...(Array.isArray(p.images) ? p.images : [])];
      const valid = rawList
        .filter((img): img is string => typeof img === "string" && img.trim().length > 0)
        .filter((img) => !img.startsWith("blob:") && !img.includes("__LOCAL_") && img !== "null" && img !== "undefined" && img !== "[object Object]");
      const cleanList = Array.from(new Set(valid));
      const finalImages = cleanList.length > 0 ? cleanList : [FALLBACK_PRODUCT_IMAGE];
      return {
        ...p,
        coverImage: finalImages[0],
        images: finalImages,
      };
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch products: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { user, errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;
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
        const uploadedUrls: string[] = [];
        for (const file of files) {
          if (typeof file === "object" && file !== null && "arrayBuffer" in file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const saved = await saveMediaBuffer(buffer, file.name, file.type);
            uploadedUrls.push(saved.url);
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

    // Clean immutable and internal fields before updating MongoDB
    delete productData._id;
    delete productData.__v;

    // Normalize sizeOptions to prevent schema validation failure
    if (Array.isArray(productData.sizeOptions)) {
      productData.sizeOptions = productData.sizeOptions
        .filter((so: any) => so && typeof so === "object" && typeof so.size === "string" && so.size.trim().length > 0)
        .map((so: any) => ({
          size: String(so.size).trim(),
          price: Number(so.price) || Number(productData.price) || 0,
          mrp: Number(so.mrp) || Number(productData.mrp) || 0,
          stock: Math.max(0, Number(so.stock) || 0),
          sku: so.sku ? String(so.sku).trim() : `${productData.sku || "NC"}-${String(so.size).trim()}`,
        }));
      productData.sizes = productData.sizeOptions.map((s: any) => s.size);
    }

    const savedProduct = await Product.findOneAndUpdate(
      { id: productData.id },
      { $set: productData },
      { upsert: true, returnDocument: "after", runValidators: true }
    );

    // Auto-sync category and subcategory to Category collection
    try {
      if (savedProduct.category && typeof savedProduct.category === "string" && savedProduct.category.trim()) {
        const catName = savedProduct.category.trim();
        const catSlug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
        const catId = `cat-${catSlug}`;

        let categoryDoc = await Category.findOne({
          $or: [{ name: new RegExp(`^${escapeRegex(catName)}$`, "i") }, { slug: catSlug }, { id: catId }],
        });

        if (!categoryDoc) {
          categoryDoc = new Category({
            id: catId,
            name: catName,
            slug: catSlug,
            image: savedProduct.coverImage || "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format",
            description: "",
            subcategories: [],
            isCustom: true,
          });
        }

        if (savedProduct.subcategory && typeof savedProduct.subcategory === "string" && savedProduct.subcategory.trim()) {
          let subName = savedProduct.subcategory.trim();
          let parentGroup = "";

          if (subName.includes(" - ")) {
            const parts = subName.split(" - ");
            parentGroup = parts[0].trim();
            subName = parts.slice(1).join(" - ").trim();
          }

          const existingSub = (categoryDoc.subcategories || []).some(
            (s: any) => s && s.name && s.name.toLowerCase().trim() === subName.toLowerCase().trim()
          );

          if (!existingSub) {
            categoryDoc.subcategories.push({
              id: `sub-${subName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
              name: subName,
              parentGroup,
            });
            // Must markModified so Mongoose detects nested array mutation
            categoryDoc.markModified("subcategories");
          }
        }

        await categoryDoc.save();
      }
    } catch (catSyncErr) {
      console.error("Non-fatal category auto-sync error:", catSyncErr);
    }

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
            changedBy: user?.name || "Super Admin",
          }).save();
        }

        await new AuditLog({
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          adminName: user?.name || "Super Admin",
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
          changedBy: user?.name || "Super Admin",
        }).save();

        await new AuditLog({
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          adminName: user?.name || "Super Admin",
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

export async function DELETE(request: NextRequest) {
  const { user, errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const { searchParams } = new URL(request.url);
    const ids = body.ids || (searchParams.get("ids") ? searchParams.get("ids")!.split(",") : null);

    let deleteFilter: any = {};
    if (Array.isArray(ids) && ids.length > 0) {
      const cleanIds = ids.map((i: string) => String(i).trim()).filter(Boolean);
      if (cleanIds.length === 0) {
        return NextResponse.json(
          { success: false, error: "No valid product IDs provided for deletion." },
          { status: 400 }
        );
      }
      const validObjectIds = cleanIds.filter((id: string) => mongoose.Types.ObjectId.isValid(id));
      deleteFilter = {
        $or: [
          { id: { $in: cleanIds } },
          ...(validObjectIds.length > 0 ? [{ _id: { $in: validObjectIds } }] : []),
        ],
      };
    } else {
      // Safety guard: never allow deleting all products without explicit IDs
      return NextResponse.json(
        { success: false, error: "Product IDs are required. Pass ids[] in request body." },
        { status: 400 }
      );
    }

    const result = await Product.deleteMany(deleteFilter);

    try {
      await new AuditLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: user?.name || "Super Admin",
        action: "DELETE",
        targetType: "PRODUCT",
        targetId: ids ? ids.join(",") : "ALL",
        targetName: ids ? `${result.deletedCount} products` : "All products",
        oldValue: `Deleted ${result.deletedCount} products from database`,
        reason: "Admin bulk delete operation",
      }).save();
    } catch (e) {
      console.error("Audit log error:", e);
    }

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} product(s) deleted successfully`,
      data: { deletedCount: result.deletedCount },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete products: " + (error as Error).message },
      { status: 500 }
    );
  }
}

