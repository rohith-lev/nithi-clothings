import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import { requireAdmin, escapeRegex } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { id } = await params;
    const rawId = (id || "").trim();
    if (!rawId) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    const safeId = escapeRegex(rawId);
    const orClauses: any[] = [
      { id: safeId },
      { slug: safeId },
      { id: new RegExp(`^${safeId}$`, "i") },
      { slug: new RegExp(`^${safeId}$`, "i") },
      { name: new RegExp(`^${safeId}$`, "i") },
    ];

    if (mongoose.Types.ObjectId.isValid(rawId)) {
      orClauses.push({ _id: rawId });
    }

    const deleted = await Category.findOneAndDelete({ $or: orClauses });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
