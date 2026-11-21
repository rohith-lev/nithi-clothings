import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/lib/models/Category";
import AuditLog from "@/lib/models/AuditLog";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { user, errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const orders = body.orders; // Array of { id: string, priority: number }

    if (!Array.isArray(orders) || orders.length === 0) {
      return NextResponse.json(
        { success: false, error: "An array of category orders ({ id, priority }) is required." },
        { status: 400 }
      );
    }

    const bulkOps = orders.map((item: { id: string; priority: number }, index: number) => {
      const priority = typeof item.priority === "number" ? item.priority : index + 1;
      return {
        updateOne: {
          filter: { $or: [{ id: item.id }, { slug: item.id }] },
          update: { $set: { priority, updatedAt: new Date() } },
        },
      };
    });

    const result = await Category.bulkWrite(bulkOps);

    try {
      await new AuditLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: user?.name || "Super Admin",
        action: "UPDATE",
        targetType: "CATEGORY",
        targetId: "REORDER_BATCH",
        targetName: "Category Display Order",
        oldValue: `Updated order for ${orders.length} categories`,
        reason: "Admin saved custom drag-and-drop category display order",
      }).save();
    } catch (e) {
      console.warn("Audit log error:", e);
    }

    return NextResponse.json({
      success: true,
      message: `Category display order updated successfully (${result.modifiedCount} updated).`,
      data: { modifiedCount: result.modifiedCount },
    });
  } catch (error: any) {
    console.error("Reorder categories error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update category order." },
      { status: 500 }
    );
  }
}
