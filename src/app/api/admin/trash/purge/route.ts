import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import AuditLog from "@/lib/models/AuditLog";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { user, errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const mode = body.mode || "trash"; // "trash" | "all"

    let filter: any = {};
    if (mode === "trash") {
      filter = {
        $or: [
          { status: "TRASH" },
          { status: "DISCONTINUED" },
          { isTrash: true },
        ],
      };
    } else if (mode === "all") {
      // Purge all catalogue
      filter = {};
    }

    // Count first
    const countBefore = await Product.countDocuments(filter);
    const result = await Product.deleteMany(filter);

    // Audit log entry
    try {
      await new AuditLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: user?.name || "Super Admin",
        action: "DELETE",
        targetType: "PRODUCT",
        targetId: mode === "trash" ? "TRASH_PURGE" : "CATALOGUE_PURGE",
        targetName: mode === "trash" ? "Trash Purge" : "Full Catalogue Purge",
        oldValue: `Permanently deleted ${result.deletedCount} item(s) from database`,
        reason: "Admin executed Purge All in Trash Management",
      }).save();
    } catch (e) {
      console.warn("Audit log creation error:", e);
    }

    return NextResponse.json({
      success: true,
      data: { deletedCount: result.deletedCount },
      message: `${result.deletedCount} item(s) permanently deleted from Trash.`,
    });
  } catch (error: any) {
    console.error("Purge error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to purge trash items from database." },
      { status: 500 }
    );
  }
}
