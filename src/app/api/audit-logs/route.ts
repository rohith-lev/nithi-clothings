import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import AuditLog from "@/lib/models/AuditLog";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
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
    const body = await request.json().catch(() => ({}));

    const all = searchParams.get("all") === "true" || body.all === true;
    const id = searchParams.get("id") || body.id;

    if (all || !id || id === "all") {
      const res = await AuditLog.deleteMany({});
      return NextResponse.json({
        success: true,
        message: `All ${res.deletedCount} audit logs cleared successfully`,
        data: { deletedCount: res.deletedCount },
      });
    }

    const res = await AuditLog.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Audit log deleted",
      data: res,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
