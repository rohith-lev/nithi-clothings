import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import StorageSetting from "@/lib/models/StorageSetting";

export async function GET() {
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
  try {
    await connectToDatabase();
    const body = await request.json();
    const updated = await StorageSetting.findOneAndUpdate(
      { id: "storage_config_main" },
      { $set: body },
      { upsert: true, new: true, setDefaultsOnInsert: true }
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
