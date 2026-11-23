import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) {
      return NextResponse.json({ success: false, error: "Database not connected" }, { status: 500 });
    }

    const beforeDbStats = await db.command({ dbStats: 1 }).catch(() => ({ storageSize: 0, dataSize: 0 }));

    // 1. Audit referenced images
    const products = await db.collection("products").find({}).toArray();
    const categories = await db.collection("categories").find({}).toArray();

    const referencedFiles = new Set<string>();
    products.forEach((p: any) => {
      if (typeof p.coverImage === "string") {
        const fn = p.coverImage.split("/").pop()?.split("?")[0];
        if (fn) referencedFiles.add(fn);
      }
      if (Array.isArray(p.images)) {
        p.images.forEach((img: string) => {
          if (typeof img === "string") {
            const fn = img.split("/").pop()?.split("?")[0];
            if (fn) referencedFiles.add(fn);
          }
        });
      }
    });
    categories.forEach((c: any) => {
      if (typeof c.image === "string") {
        const fn = c.image.split("/").pop()?.split("?")[0];
        if (fn) referencedFiles.add(fn);
      }
    });

    // 2. Remove unreferenced media
    const allMedia = await db.collection("media").find({}, { projection: { filename: 1 } }).toArray();
    const orphanFilenames = allMedia
      .map((m: any) => m.filename)
      .filter((fn: string) => fn && !referencedFiles.has(fn));

    let deletedOrphans = 0;
    if (orphanFilenames.length > 0) {
      const delMediaRes = await db.collection("media").deleteMany({ filename: { $in: orphanFilenames } });
      deletedOrphans = delMediaRes.deletedCount || 0;
    }

    // 3. If media collection has 0 items, drop and recreate to reclaim WiredTiger disk blocks
    const mediaRemaining = await db.collection("media").countDocuments();
    let mediaReclaimed = false;
    if (mediaRemaining === 0 && allMedia.length > 0) {
      try {
        await db.collection("media").drop();
        await db.createCollection("media");
        await db.collection("media").createIndex({ filename: 1 }, { unique: true });
        mediaReclaimed = true;
      } catch (err) {
        console.warn("[clean-storage] media drop error:", err);
      }
    }

    // 4. Prune audit logs (retain last 50)
    const auditCount = await db.collection("auditlogs").countDocuments();
    let prunedAuditLogs = 0;
    if (auditCount > 50) {
      const latestLogs = await db.collection("auditlogs").find({}).sort({ createdAt: -1 }).limit(50).toArray();
      const keepIds = latestLogs.map((l: any) => l._id);
      const delAudit = await db.collection("auditlogs").deleteMany({ _id: { $nin: keepIds } });
      prunedAuditLogs = delAudit.deletedCount || 0;
    }

    const afterDbStats = await db.command({ dbStats: 1 }).catch(() => ({ storageSize: 0, dataSize: 0 }));

    const freedBytes = Math.max(0, (beforeDbStats.storageSize || 0) - (afterDbStats.storageSize || 0));
    const freedMB = +(freedBytes / (1024 * 1024)).toFixed(2);
    const currentStorageMB = +( (afterDbStats.storageSize || afterDbStats.dataSize || 0) / (1024 * 1024) ).toFixed(2);

    return NextResponse.json({
      success: true,
      message: "MongoDB storage cleaned and optimized successfully.",
      data: {
        freedMB,
        currentStorageMB,
        deletedOrphanMedia: deletedOrphans,
        mediaReclaimed,
        prunedAuditLogs,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
