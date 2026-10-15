import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { CODRule, CODAdvanceRule } from "@/lib/models/CODRule";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_COD_GENERAL = {
  id: "cod-general-default",
  availableStates: ["Tamil Nadu", "Kerala", "Karnataka", "Andhra Pradesh", "Telangana"],
  minQuantity: 1,
  shippingCharge: 70,
  freeShippingThreshold: 2000,
  status: "active",
};

const DEFAULT_COD_ADVANCE_RULES = [
  {
    id: "coda-nighty-3",
    category: "Nighty",
    quantityRange: "3 Pcs",
    minQty: 3,
    maxQty: 3,
    advanceAmount: 100,
    status: "active",
  },
  {
    id: "coda-nighty-4-6",
    category: "Nighty",
    quantityRange: "4 to 6 Pcs",
    minQty: 4,
    maxQty: 6,
    advanceAmount: 130,
    status: "active",
  },
  {
    id: "coda-salwar-2",
    category: "Salwar set",
    quantityRange: "2 Pcs",
    minQty: 2,
    maxQty: 2,
    advanceAmount: 100,
    status: "active",
  },
  {
    id: "coda-salwar-3-5",
    category: "Salwar set",
    quantityRange: "3 to 5 Pcs",
    minQty: 3,
    maxQty: 5,
    advanceAmount: 160,
    status: "active",
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    let rules = await CODRule.find().lean();
    let advanceRules = await CODAdvanceRule.find().lean();

    if (!rules || rules.length === 0) {
      await CODRule.create(DEFAULT_COD_GENERAL);
      rules = await CODRule.find().lean();
    }

    if (!advanceRules || advanceRules.length === 0) {
      await CODAdvanceRule.insertMany(DEFAULT_COD_ADVANCE_RULES);
      advanceRules = await CODAdvanceRule.find().lean();
    }

    return NextResponse.json({ success: true, data: { codRules: rules, advanceRules } });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    if (body.type === "advance") {
      const id = body.id || `cod-adv-${Date.now()}`;
      const rule = await CODAdvanceRule.findOneAndUpdate(
        { id },
        { $set: { ...body, id } },
        { upsert: true, returnDocument: "after" }
      );
      return NextResponse.json({ success: true, data: rule });
    } else {
      const id = body.id || `cod-${Date.now()}`;
      const rule = await CODRule.findOneAndUpdate(
        { id },
        { $set: { ...body, id } },
        { upsert: true, returnDocument: "after" }
      );
      return NextResponse.json({ success: true, data: rule });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id) {
      return NextResponse.json({ success: false, error: "Rule ID is required" }, { status: 400 });
    }

    if (type === "advance") {
      const deleted = await CODAdvanceRule.findOneAndDelete({ id });
      if (!deleted) {
        return NextResponse.json({ success: false, error: "Advance rule not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "COD advance rule removed" });
    } else {
      const deleted = await CODRule.findOneAndDelete({ id });
      if (!deleted) {
        return NextResponse.json({ success: false, error: "COD rule not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "COD rule removed" });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
