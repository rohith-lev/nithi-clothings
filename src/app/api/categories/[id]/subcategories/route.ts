import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import { getAuthUser } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  getAuthUser(request);
  try {
    await connectToDatabase();
    const { id } = await params;
    const { name, parentGroup } = await request.json();

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Subcategory name is required" },
        { status: 400 }
      );
    }

    const subId = `sub-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const category = await Category.findOne({ $or: [{ id }, { slug: id }] });

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    const exists = (category.subcategories || []).some(
      (s: { name: string }) => s.name.toLowerCase() === name.toLowerCase()
    );

    if (!exists) {
      category.subcategories.push({
        id: subId,
        name: name.trim(),
        parentGroup: parentGroup || "",
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
