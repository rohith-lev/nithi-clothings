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
  const { user, errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));

    const all = searchParams.get("all") === "true" || body.all === true;
    const id = searchParams.get("id") || body.id;

    if (all || id === "all") {
      const confirmToken = searchParams.get("confirm") || body.confirm;
      if (confirmToken !== "CONFIRM_CLEAR_AUDIT_LOGS" || user?.role !== "Super Admin") {
        return NextResponse.json(
          {
            success: false,
            error: "Clearing all audit logs requires Super Admin privileges and explicit confirmation (confirm: 'CONFIRM_CLEAR_AUDIT_LOGS').",
          },
          { status: 403 }
        );
      }
      const res = await AuditLog.deleteMany({});
      return NextResponse.json({
        success: true,
        message: `All ${res.deletedCount} audit logs cleared successfully`,
        data: { deletedCount: res.deletedCount },
      });
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Audit log ID is required" },
        { status: 400 }
      );
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
