import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import StorageSetting from "@/lib/models/StorageSetting";
import { requireAdmin } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    let settings = await StorageSetting.findOne({ id: "storage_config_main" }).lean();
    if (!settings) {
      const newSettings = new StorageSetting({ id: "storage_config_main" });
      await newSettings.save();
      settings = newSettings.toObject();
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const updated = await StorageSetting.findOneAndUpdate(
      { id: "storage_config_main" },
      { $set: body },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
    return NextResponse.json({
      success: true,
      data: updated,
      message: "Storage settings saved",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
