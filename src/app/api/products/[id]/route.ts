import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import AuditLog from "@/lib/models/AuditLog";
import { requireAdmin, escapeRegex } from "@/lib/auth";
import { products as defaultProducts } from "@/data/products";
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
      const defaultMatch = defaultProducts.find(
        (p) =>
          !p.name?.toLowerCase().includes("priya") &&
          ((p.id && p.id.toLowerCase() === rawId.toLowerCase()) ||
            (p.code && p.code.toLowerCase() === rawId.toLowerCase()) ||
            (p.sku && p.sku.toLowerCase() === rawId.toLowerCase()) ||
            (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === rawId.toLowerCase()))
      );
      if (defaultMatch) {
        return NextResponse.json({ success: true, data: defaultMatch });
      }
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const FALLBACK_PRODUCT_IMAGE = "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format";
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

    const query: any = {
      $or: [
        { id: rawId },
        { id: safeId },
        { code: rawId },
        { sku: rawId },
      ],
    };
    if (mongoose.Types.ObjectId.isValid(rawId)) {
      query.$or.push({ _id: rawId });
    }

    const product = await Product.findOne(query);
    if (!product) {
      // Try fallback direct delete in case findOne missed legacy format
      const deleteResult = await Product.deleteMany(query);
      if (deleteResult.deletedCount > 0) {
        return NextResponse.json({
          success: true,
          message: "Product deleted successfully",
        });
      }
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    const productName = product.name || "Product";
    const targetId = product.id || rawId;

    await Product.deleteMany(query);

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

