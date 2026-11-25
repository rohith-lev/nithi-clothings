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
    const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop&auto=format";

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
    const DEFAULT_FALLBACK_IMG = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop&auto=format";

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

    // Normalize productTypes (e.g. Zip Nighty / Zipless Nighty / Elite Nighty)
    if (Array.isArray(productData.productTypes)) {
      productData.productTypes = productData.productTypes
        .filter((pt: any) => pt && typeof pt.name === "string" && pt.name.trim().length > 0)
        .map((pt: any) => ({
          id: pt.id ? String(pt.id).replace(/[^a-zA-Z0-9_-]/g, "") : `pt-${String(pt.name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          name: String(pt.name).trim().slice(0, 80),
          price: Math.max(0, Number(pt.price) || Number(productData.price) || 0),
          mrp: Math.max(0, Number(pt.mrp) || Number(productData.mrp) || 0),
          stock: Math.max(0, Number(pt.stock) || 0),
          image: typeof pt.image === "string" ? pt.image.slice(0, 500) : "",
          active: pt.active !== false,
        }));
      if (productData.productTypes.length === 0) delete productData.productTypes;
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
            image: savedProduct.coverImage || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop&auto=format",
            description: "",
            subcategories: [],
            isCustom: true,
            isActive: true,
            showOnHome: true,
          });
        } else {
          // Ensure existing category is active and shown on storefront
          categoryDoc.isActive = true;
          categoryDoc.showOnHome = true;
          if (!categoryDoc.image || categoryDoc.image.includes("[object") || categoryDoc.image.includes("unsplash")) {
            if (savedProduct.coverImage) {
              categoryDoc.image = savedProduct.coverImage;
            }
          }
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
              image: savedProduct.coverImage || "",
            });
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
    const rawIds = body.ids || (body.id ? [body.id] : null) || (searchParams.get("ids") ? searchParams.get("ids")!.split(",") : null) || (searchParams.get("id") ? [searchParams.get("id")!] : null);
    const purgeAll = searchParams.get("all") === "true" || body.all === true;

    let deleteFilter: any = {};
    let cleanIds: string[] = [];

    if (purgeAll) {
      // Explicit purge-all: permanently deletes every product in the catalogue.
      deleteFilter = {};
    } else if (Array.isArray(rawIds) && rawIds.length > 0) {
      cleanIds = rawIds.map((i: string) => String(i).trim()).filter(Boolean);
      if (cleanIds.length === 0) {
        return NextResponse.json(
          { success: false, error: "No valid product IDs provided for deletion." },
          { status: 400 }
        );
      }
      const validObjectIds = cleanIds.filter((id: string) => mongoose.Types.ObjectId.isValid(id));
      const objectIdInstances = validObjectIds.map((id: string) => {
        try {
          return new mongoose.Types.ObjectId(id);
        } catch {
          return null;
        }
      }).filter(Boolean);

      const regexList = cleanIds.map((id: string) => new RegExp(`^${escapeRegex(id)}$`, "i"));

      deleteFilter = {
        $or: [
          { id: { $in: cleanIds } },
          { id: { $in: regexList } },
          { sku: { $in: cleanIds } },
          { sku: { $in: regexList } },
          { code: { $in: cleanIds } },
          { code: { $in: regexList } },
          ...(validObjectIds.length > 0 ? [{ _id: { $in: validObjectIds } }] : []),
          ...(objectIdInstances.length > 0 ? [{ _id: { $in: objectIdInstances } }] : []),
        ],
      };
    } else {
      // Safety guard: never allow deleting all products without explicit confirmation
      return NextResponse.json(
        { success: false, error: "Product IDs are required. Pass ids[] in request body, or ?all=true for full purge." },
        { status: 400 }
      );
    }

    // Collect image URLs from products to be deleted
    const productsToDelete = await Product.find(deleteFilter).lean();
    const imageUrls: string[] = [];
    productsToDelete.forEach((p: any) => {
      if (p.coverImage) imageUrls.push(p.coverImage);
      if (Array.isArray(p.images)) imageUrls.push(...p.images);
      if (Array.isArray(p.colorOptions)) p.colorOptions.forEach((co: any) => co?.image && imageUrls.push(co.image));
      if (Array.isArray(p.variants)) p.variants.forEach((v: any) => v?.image && imageUrls.push(v.image));
      if (Array.isArray(p.productTypes)) p.productTypes.forEach((pt: any) => pt?.image && imageUrls.push(pt.image));
      if (p.colorImages && typeof p.colorImages === "object") {
        Object.values(p.colorImages).forEach((img: any) => img && imageUrls.push(String(img)));
      }
    });

    const result = await Product.deleteMany(deleteFilter);

    // Clean up associated images from MongoDB Media collection and disk
    if (purgeAll) {
      try {
        const { deleteAllMedia } = await import("@/lib/mediaStorage");
        await deleteAllMedia();
      } catch (err) {
        console.warn("Cleanup all media error:", err);
      }
    } else if (imageUrls.length > 0) {
      try {
        const { deleteMediaFiles } = await import("@/lib/mediaStorage");
        await deleteMediaFiles(imageUrls);
      } catch (err) {
        console.warn("Cleanup media error in bulk delete:", err);
      }
    }

    // Clean up related inventory transactions
    if (cleanIds.length > 0) {
      try {
        const InventoryTransaction = (await import("@/lib/models/InventoryTransaction")).default;
        await InventoryTransaction.deleteMany({
          $or: [
            { productId: { $in: cleanIds } },
            { productId: { $in: cleanIds.map((id) => new RegExp(`^${escapeRegex(id)}$`, "i")) } },
          ],
        });
      } catch (e) {
        console.warn("Cleanup inventory transactions error in bulk delete:", e);
      }
    }

    try {
      await new AuditLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: user?.name || "Super Admin",
        action: "DELETE",
        targetType: "PRODUCT",
        targetId: purgeAll ? "ALL (PURGE)" : cleanIds.length > 0 ? cleanIds.join(",") : "ALL",
        targetName: purgeAll ? "Full catalogue purge" : cleanIds.length > 0 ? `${result.deletedCount} products` : "All products",
        oldValue: `Permanently deleted ${result.deletedCount} products from database`,
        reason: purgeAll ? "Admin Purge All operation" : "Admin bulk delete operation",
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

