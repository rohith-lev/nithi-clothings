import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ComboOffer from "@/lib/models/ComboOffer";

export async function GET() {
  try {
    await connectToDatabase();
    const combos = await ComboOffer.find().lean();
    return NextResponse.json({ success: true, data: combos });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const id = body.id || `combo-${Date.now()}`;
    const combo = await ComboOffer.findOneAndUpdate({ id }, { $set: { ...body, id } }, { upsert: true, new: true });
    return NextResponse.json({ success: true, data: combo });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
