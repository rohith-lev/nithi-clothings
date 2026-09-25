import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CODRule, CODAdvanceRule } from "@/lib/models/CODRule";

export async function GET() {
  try {
    await connectToDatabase();
    const rules = await CODRule.find().lean();
    const advanceRules = await CODAdvanceRule.find().lean();
    return NextResponse.json({ success: true, data: { codRules: rules, advanceRules } });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    if (body.type === "advance") {
      const id = body.id || `cod-adv-${Date.now()}`;
      const rule = await CODAdvanceRule.findOneAndUpdate({ id }, { $set: { ...body, id } }, { upsert: true, new: true });
      return NextResponse.json({ success: true, data: rule });
    } else {
      const id = body.id || `cod-${Date.now()}`;
      const rule = await CODRule.findOneAndUpdate({ id }, { $set: { ...body, id } }, { upsert: true, new: true });
      return NextResponse.json({ success: true, data: rule });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
