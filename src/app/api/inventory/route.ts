import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import InventoryTransaction from "@/lib/models/InventoryTransaction";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const transactions = await InventoryTransaction.find().sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
