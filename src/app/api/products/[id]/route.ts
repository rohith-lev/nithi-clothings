import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import AuditLog from "@/lib/models/AuditLog";
import { requireAdmin, escapeRegex } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const rawId = id ? decodeURIComponent(id).trim() : "";
    if (!rawId || rawId.toLowerCase().includes("priya")) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }
    const safeId = escapeRegex(rawId);

    const query: any = {
      $or: [
        { id: rawId },
        { id: safeId },
        { sku: rawId },
        { code: rawId },
      ],
    };
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      query.$or.push({ _id: rawId });
    }

    const product = await Product.findOne(query).lean();
    if (!product || (product.name && product.name.toLowerCase().includes("priya"))) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop&auto=format";
    const rawList = [(product as any).coverImage, ...(Array.isArray((product as any).images) ? (product as any).images : [])];
    const valid = rawList
      .filter((img): img is string => typeof img === "string" && img.trim().length > 0)
      .filter((img) => !img.startsWith("blob:") && !img.includes("__LOCAL_") && img !== "null" && img !== "undefined" && img !== "[object Object]");
    const cleanList = Array.from(new Set(valid));
    const finalImages = cleanList.length > 0 ? cleanList : [FALLBACK_PRODUCT_IMAGE];

    const sanitizedProduct = {
      ...product,
      coverImage: finalImages[0],
      images: finalImages,
    };

    return NextResponse.json({ success: true, data: sanitizedProduct });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;
  try {
    await connectToDatabase();
    const { id } = await params;
    const rawId = id ? decodeURIComponent(id).trim() : "";
    const safeId = escapeRegex(rawId);

    // Optional body payload with additional identifier fallbacks
    const body = await request.json().catch(() => ({}));

    const query: any = {
      $or: [
        { id: rawId },
        { id: new RegExp(`^${safeId}$`, "i") },
        { code: rawId },
        { code: new RegExp(`^${safeId}$`, "i") },
        { sku: rawId },
        { sku: new RegExp(`^${safeId}$`, "i") },
      ],
    };
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      query.$or.push({ _id: rawId });
      try {
        query.$or.push({ _id: new mongoose.Types.ObjectId(rawId) });
      } catch {}
    }

    if (body._id && mongoose.Types.ObjectId.isValid(body._id)) {
      query.$or.push({ _id: body._id });
      try {
        query.$or.push({ _id: new mongoose.Types.ObjectId(body._id) });
      } catch {}
    }
    if (body.id && typeof body.id === "string") {
      const extraId = body.id.trim();
      query.$or.push({ id: extraId });
      query.$or.push({ id: new RegExp(`^${escapeRegex(extraId)}$`, "i") });
    }
    if (body.sku && typeof body.sku === "string") {
      query.$or.push({ sku: body.sku.trim() });
    }
    if (body.code && typeof body.code === "string") {
      query.$or.push({ code: body.code.trim() });
    }

    const product = await Product.findOne(query);
    const productName = product?.name || "Product";
    const targetId = product?.id || rawId;

    // Collect associated product images to delete from MongoDB Media collection
    const imageUrls: string[] = [];
    if (product) {
      if (product.coverImage) imageUrls.push(product.coverImage);
      if (Array.isArray(product.images)) imageUrls.push(...product.images);
      if (Array.isArray(product.colorOptions)) {
        product.colorOptions.forEach((co: any) => co?.image && imageUrls.push(co.image));
      }
      if (Array.isArray(product.variants)) {
        product.variants.forEach((v: any) => v?.image && imageUrls.push(v.image));
      }
      if (Array.isArray(product.productTypes)) {
        product.productTypes.forEach((pt: any) => pt?.image && imageUrls.push(pt.image));
      }
      if (product.colorImages && typeof product.colorImages === "object") {
        Object.values(product.colorImages).forEach((img: any) => img && imageUrls.push(String(img)));
      }
    }

    const delResult = await Product.deleteMany(query);
    if (!product && delResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Clean up associated images from MongoDB Media collection and local uploads
    if (imageUrls.length > 0) {
      try {
        const { deleteMediaFiles } = await import("@/lib/mediaStorage");
        await deleteMediaFiles(imageUrls);
      } catch (err) {
        console.warn("Cleanup media error:", err);
      }
    }

    // Clean up related inventory transactions and references
    try {
      const InventoryTransaction = (await import("@/lib/models/InventoryTransaction")).default;
      await InventoryTransaction.deleteMany({
        $or: [
          { productId: rawId },
          { productId: targetId },
          { productId: safeId },
        ],
      });
    } catch (e) {
      console.warn("Cleanup inventory transactions error:", e);
    }

    try {
      await new AuditLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: user?.name || "Super Admin",
        action: "DELETE",
        targetType: "PRODUCT",
        targetId: targetId,
        targetName: productName,
        oldValue: `Product ${productName} deleted`,
        reason: "Deleted from Admin catalogue view",
      }).save();
    } catch (e) {
      console.error("Audit log error:", e);
    }

    return NextResponse.json({
      success: true,
      message: `Product "${productName}" deleted successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { id } = await params;
    const rawId = id ? decodeURIComponent(id).trim() : "";
    const safeId = escapeRegex(rawId);
    const body = await request.json();

    const query: any = {
      $or: [
        { id: rawId },
        { id: safeId },
        { sku: rawId },
        { code: rawId },
      ],
    };
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      query.$or.push({ _id: rawId });
    }

    const product = await Product.findOne(query);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    if (body.sizeOptions !== undefined && Array.isArray(body.sizeOptions)) {
      product.sizeOptions = body.sizeOptions;
      product.sizes = body.sizeOptions.map((s: any) => s.size);
      product.stock = body.sizeOptions.reduce((acc: number, curr: any) => acc + (Number(curr.stock) || 0), 0);
    } else if (body.stock !== undefined) {
      product.stock = Number(body.stock);
    }

    if (body.price !== undefined) product.price = Number(body.price);
    if (body.discount !== undefined) product.discount = Number(body.discount);
    if (body.status !== undefined) product.status = body.status;
    if (body.name !== undefined) product.name = String(body.name).trim();

    await product.save();

    return NextResponse.json({
      success: true,
      data: product,
      message: "Product updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

