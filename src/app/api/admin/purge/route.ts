import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/lib/models/Product";
import AuditLog from "@/lib/models/AuditLog";
import { requireAdmin } from "@/lib/auth";
import { deleteAllMedia, deleteOrphanedMedia } from "@/lib/mediaStorage";

export async function POST(request: NextRequest) {
  const { user, errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const target = body.target || "both"; // "products" | "images" | "both" | "orphaned_images"

    let deletedProducts = 0;
    let deletedMedia = 0;

    if (target === "products" || target === "both") {
      const prodRes = await Product.deleteMany({});
      deletedProducts = prodRes.deletedCount || 0;

      // Clean up related inventory transactions
      try {
        const InventoryTransaction = (await import("@/lib/models/InventoryTransaction")).default;
        await InventoryTransaction.deleteMany({});
      } catch (e) {
        console.warn("Cleanup inventory transactions error:", e);
      }
    }

    if (target === "images" || target === "both") {
      deletedMedia = await deleteAllMedia();
    } else if (target === "orphaned_images") {
      deletedMedia = await deleteOrphanedMedia();
    }

    // Audit log
    try {
      await new AuditLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: user?.name || "Super Admin",
        action: "PURGE",
        targetType: target.toUpperCase(),
        targetId: `PURGE_${target.toUpperCase()}`,
        targetName: `Admin Settings Database Purge (${target})`,
        oldValue: `Deleted ${deletedProducts} products and ${deletedMedia} media files from MongoDB`,
        reason: "Purge executed from Admin Settings Storage & Database Manager",
      }).save();
    } catch (e) {
      console.warn("Audit log creation error:", e);
    }

    let message = "";
    if (target === "both") {
      message = `Successfully deleted all products (${deletedProducts}) and images (${deletedMedia}) from MongoDB Atlas.`;
    } else if (target === "products") {
      message = `Successfully deleted ${deletedProducts} product(s) from MongoDB.`;
    } else if (target === "images") {
      message = `Successfully deleted ${deletedMedia} image blob(s) from MongoDB Media collection.`;
    } else if (target === "orphaned_images") {
      message = `Cleaned ${deletedMedia} orphaned image(s) no longer linked to any products.`;
    }

    return NextResponse.json({
      success: true,
      message,
      data: {
        deletedProducts,
        deletedMedia,
      },
    });
  } catch (error: any) {
    console.error("Purge API error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to purge database data." },
      { status: 500 }
    );
  }
}

// Support DELETE method as well
export async function DELETE(request: NextRequest) {
  return POST(request);
}
