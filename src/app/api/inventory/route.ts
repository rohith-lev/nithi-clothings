import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import InventoryTransaction from "@/lib/models/InventoryTransaction";

export async function GET() {
  try {
    await connectToDatabase();
    const transactions = await InventoryTransaction.find().sort({ createdAt: -1 }).limit(100).lean();
    return NextResponse.json({ success: true, data: transactions });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
