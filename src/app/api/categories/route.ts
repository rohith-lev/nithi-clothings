import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import { getAuthUser } from "@/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();
    const categories = await Category.find().sort({ createdAt: 1 }).lean();
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  getAuthUser(request); // Auth check
  try {
    await connectToDatabase();
    const body = await request.json();
    const { id, name, slug, image, description, subcategories, isCustom } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const catId =
      id ||
      `cat-${name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")}`;
    const catSlug =
      slug ||
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    const updated = await Category.findOneAndUpdate(
      { $or: [{ id: catId }, { slug: catSlug }] },
      {
        $set: {
          id: catId,
          name: name.trim(),
          slug: catSlug,
          image:
            image ||
            "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=800&h=1000&fit=crop&auto=format",
          description: description || "",
          subcategories: Array.isArray(subcategories) ? subcategories : [],
          isCustom: isCustom !== undefined ? isCustom : true,
          updatedAt: new Date(),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Category saved successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to save category: " + (error as Error).message },
      { status: 500 }
    );
  }
}
