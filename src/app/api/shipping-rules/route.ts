import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ShippingRule from "@/lib/models/ShippingRule";

export async function GET() {
  try {
    await connectToDatabase();
    const rules = await ShippingRule.find().lean();
    return NextResponse.json({ success: true, data: rules });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const id = body.id || `ship-${Date.now()}`;
    const rule = await ShippingRule.findOneAndUpdate({ id }, { $set: { ...body, id } }, { upsert: true, new: true });
    return NextResponse.json({ success: true, data: rule });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
