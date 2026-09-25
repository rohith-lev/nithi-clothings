import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getStorageStats } from "@/services/storageMonitor";

export async function GET() {
  try {
    await connectToDatabase();
    const stats = await getStorageStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
