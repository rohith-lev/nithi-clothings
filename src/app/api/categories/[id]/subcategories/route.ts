import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import { requireAdmin, escapeRegex } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { id } = await params;
    const safeId = escapeRegex(id.trim());
    const body = await request.json().catch(() => ({}));
    const { name, parentGroup } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Subcategory name is required" },
        { status: 400 }
      );
    }

    const cleanName = name.trim().slice(0, 100).replace(/[<>]/g, "");
    const subId = `sub-${cleanName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const category = await Category.findOne({ $or: [{ id: safeId }, { slug: safeId }] });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    const exists = (category.subcategories || []).some(
      (s: { name: string }) => s.name.toLowerCase() === cleanName.toLowerCase()
    );

    if (!exists) {
      category.subcategories.push({
        id: subId,
        name: cleanName,
        parentGroup: typeof parentGroup === "string" ? parentGroup.slice(0, 100) : "",
      });
      await category.save();
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: "Subcategory added successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
