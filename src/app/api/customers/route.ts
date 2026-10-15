import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Customer from "@/lib/models/Customer";
import { requireAdmin, escapeRegex } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const filter: Record<string, unknown> = {};
    if (search) {
      const safeSearch = escapeRegex(search.trim());
      if (safeSearch) {
        const regex = new RegExp(safeSearch, "i");
        filter.$or = [{ name: regex }, { phone: regex }, { email: regex }, { customerId: regex }];
      }
    }

    const customers = await Customer.find(filter).sort({ registrationDate: -1 }).limit(500).lean();
    return NextResponse.json({ success: true, data: customers });
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
    const customerId = searchParams.get("customerId") || searchParams.get("id") || body.customerId || body.id;

    if (all || customerId === "all") {
      const res = await Customer.deleteMany({});
      return NextResponse.json({
        success: true,
        message: `All ${res.deletedCount} customers purged successfully`,
        data: { deletedCount: res.deletedCount },
      });
    }

    if (!customerId) {
      return NextResponse.json(
        { success: false, error: "Customer ID is required" },
        { status: 400 }
      );
    }

    const cleanId = String(customerId).trim();
    const deleted = await Customer.findOneAndDelete({
      $or: [
        { customerId: cleanId },
        { customerId: new RegExp(`^${escapeRegex(cleanId)}$`, "i") },
        ...(cleanId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: cleanId }] : []),
      ],
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Customer ${deleted.name || deleted.customerId} deleted successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
