import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import { requireAdmin, escapeRegex } from "@/lib/auth";
import { categories as defaultCategories, CATEGORY_HIERARCHY } from "@/data/products";

const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  "90s": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=700&fit=crop&auto=format",
  "90s-dress": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=700&fit=crop&auto=format",
  "90s dress": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=700&fit=crop&auto=format",
  nighty: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=600&h=700&fit=crop&auto=format",
  nighties: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=600&h=700&fit=crop&auto=format",
  "night-dress": "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=600&h=700&fit=crop&auto=format",
  "night dress": "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=600&h=700&fit=crop&auto=format",
  unstitched: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=700&fit=crop&auto=format",
  "unstitched-salwar": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=700&fit=crop&auto=format",
  "unstitched salwar material": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=700&fit=crop&auto=format",
  chudis: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=700&fit=crop&auto=format",
  "cord-set": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=700&fit=crop&auto=format",
  "cord set": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=700&fit=crop&auto=format",
  "coord-set": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=700&fit=crop&auto=format",
  "coord sets": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=700&fit=crop&auto=format",
  kurtis: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=700&fit=crop&auto=format",
  "kurtis(tops)": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=700&fit=crop&auto=format",
  "kurtis & tops": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=700&fit=crop&auto=format",
  "salwar-set": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=700&fit=crop&auto=format",
  "salwar set": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=700&fit=crop&auto=format",
  "salwar sets": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=700&fit=crop&auto=format",
  maxi: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=700&fit=crop&auto=format",
  "maxi gowns": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=700&fit=crop&auto=format",
  default: "https://images.unsplash.com/photo-1594938298603-c8148c4b4e75?w=600&h=700&fit=crop&auto=format",
};

function resolveCategoryImage(name?: string, slug?: string, existingImg?: string): string {
  if (existingImg && typeof existingImg === "string" && existingImg.trim().length > 0 && !existingImg.includes("[object")) {
    return existingImg.trim();
  }
  const slugKey = (slug || "").toLowerCase().trim();
  const nameKey = (name || "").toLowerCase().trim();
  return CATEGORY_FALLBACK_IMAGES[slugKey] || CATEGORY_FALLBACK_IMAGES[nameKey] || CATEGORY_FALLBACK_IMAGES.default;
}

// Single source of truth: fetch synchronized categories directly from database
async function getSynchronizedCategories(activeOnly = false) {
  await connectToDatabase();

  let dbCategories = await Category.find().sort({ priority: 1, createdAt: 1 }).lean();

  // If DB has no categories at all (e.g. initial setup), seed from defaultCategories once
  if (!dbCategories || dbCategories.length === 0) {
    try {
      const seedList = defaultCategories.map((c, idx) => {
        const hierarchy = CATEGORY_HIERARCHY[c.name];
        let subcategories = c.subcategories || [];

        if ((!subcategories || subcategories.length === 0) && hierarchy) {
          if (hierarchy.groups) {
            subcategories = hierarchy.groups.flatMap((grp) =>
              grp.items.map((it) => ({
                id: `sub-${it.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
                name: it,
                parentGroup: grp.name,
                image: "",
              }))
            );
          } else if (hierarchy.items) {
            subcategories = hierarchy.items.map((it) => ({
              id: `sub-${it.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
              name: it,
              parentGroup: "",
              image: "",
            }));
          }
        }

        return {
          id: c.id,
          name: c.name,
          slug: c.slug || c.id,
          image: resolveCategoryImage(c.name, c.slug, c.image),
          description: "",
          subcategories: subcategories || [],
          isCustom: false,
          isActive: true,
          showOnHome: true,
          priority: idx + 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      await Category.insertMany(seedList);
      dbCategories = await Category.find().sort({ priority: 1, createdAt: 1 }).lean();
    } catch (seedErr) {
      console.error("Auto-seeding categories error:", seedErr);
    }
  }

  // Permanently purge any test/deleted Priya categories from database
  try {
    await Category.deleteMany({
      $or: [
        { name: /priya/i },
        { slug: /priya/i },
        { id: /priya/i },
      ],
    });
    dbCategories = await Category.find().sort({ priority: 1, createdAt: 1 }).lean();
  } catch {}

  // Format DB categories directly without re-inserting deleted/stale records
  const formatted = (dbCategories || []).map((cat: any) => ({
    id: cat.id || String(cat._id),
    name: cat.name,
    slug: cat.slug || cat.id,
    image: resolveCategoryImage(cat.name, cat.slug, cat.image),
    description: cat.description || "",
    isActive: cat.isActive !== false,
    showOnHome: cat.showOnHome !== false,
    priority: typeof cat.priority === "number" ? cat.priority : 0,
    subcategories: Array.isArray(cat.subcategories) ? cat.subcategories : [],
  }));

  if (activeOnly) {
    return formatted.filter((c) => c.isActive !== false);
  }

  return formatted;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";
    const categories = await getSynchronizedCategories(activeOnly);
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const { id, name, slug, image, description, subcategories, isCustom, isActive, showOnHome, priority } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { success: false, error: "Category name is required" },
        { status: 400 }
      );
    }

    const cleanName = name.trim().slice(0, 100).replace(/[<>]/g, "");
    const cleanDesc = typeof description === "string" ? description.slice(0, 500).replace(/[<>]/g, "") : "";

    const catId =
      (typeof id === "string" && id.trim())
        ? id.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "")
        : `cat-${cleanName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")}`;

    const catSlug =
      (typeof slug === "string" && slug.trim())
        ? slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "")
        : cleanName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "");

    const safeSubcategories = Array.isArray(subcategories)
      ? subcategories
          .map((sub: any) => {
            const rawName = typeof sub === "string" ? sub : sub?.name || "";
            const cleanSubName = rawName.trim().slice(0, 100).replace(/[<>]/g, "");
            const subId =
              typeof sub === "object" && sub?.id
                ? String(sub.id).replace(/[^a-z0-9_-]/g, "")
                : `sub-${cleanSubName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
            return {
              id: subId,
              name: cleanSubName,
              parentGroup:
                typeof sub === "object" && typeof sub.parentGroup === "string"
                  ? sub.parentGroup.slice(0, 100)
                  : "",
              image:
                typeof sub === "object" && typeof sub.image === "string"
                  ? sub.image.slice(0, 500)
                  : "",
            };
          })
          .filter((s: any) => Boolean(s.name))
      : [];

    const query: any[] = [{ id: catId }, { slug: catSlug }];
    if (typeof id === "string" && mongoose.Types.ObjectId.isValid(id)) {
      query.push({ _id: id });
    }

    const updated = await Category.findOneAndUpdate(
      { $or: query },
      {
        $set: {
          id: catId,
          name: cleanName,
          slug: catSlug,
          image:
            typeof image === "string" && image.trim()
              ? image.trim()
              : resolveCategoryImage(cleanName, catSlug),
          description: cleanDesc,
          subcategories: safeSubcategories,
          isCustom: isCustom !== undefined ? Boolean(isCustom) : true,
          isActive: isActive !== undefined ? Boolean(isActive) : true,
          showOnHome: showOnHome !== undefined ? Boolean(showOnHome) : true,
          priority: typeof priority === "number" ? priority : parseInt(String(priority)) || 0,
          updatedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
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

export async function DELETE(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get("id");
    const body = await request.json().catch(() => ({}));
    const id = (queryId || body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 }
      );
    }

    const safeId = escapeRegex(id);
    const orClauses: any[] = [
      { id: safeId },
      { slug: safeId },
      { id: new RegExp(`^${safeId}$`, "i") },
      { slug: new RegExp(`^${safeId}$`, "i") },
      { name: new RegExp(`^${safeId}$`, "i") },
    ];

    if (mongoose.Types.ObjectId.isValid(id)) {
      orClauses.push({ _id: id });
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
