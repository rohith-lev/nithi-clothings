import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ShippingRule from "@/lib/models/ShippingRule";
import { requireAdmin } from "@/lib/auth";

const DEFAULT_SHIPPING_RULES = [
  {
    id: "ship-tn-nighty-free",
    state: "Tamil Nadu",
    category: "Nighty",
    minQty: 3,
    maxQty: 999,
    minOrderValue: 0,
    shippingType: "FREE",
    charge: 0,
    status: "active",
  },
  {
    id: "ship-tn-salwar-free",
    state: "Tamil Nadu",
    category: "Salwar set",
    minQty: 1,
    maxQty: 999,
    minOrderValue: 0,
    shippingType: "FREE",
    charge: 0,
    status: "active",
  },
  {
    id: "ship-tn-standard",
    state: "Tamil Nadu",
    category: "All Categories",
    minQty: 1,
    maxQty: 2,
    minOrderValue: 0,
    shippingType: "FIXED",
    charge: 70,
    status: "active",
  },
  {
    id: "ship-south4-salwar-free",
    state: "South 4 (AP/TG/KL/KA)",
    category: "Salwar set",
    minQty: 2,
    maxQty: 999,
    minOrderValue: 0,
    shippingType: "FREE",
    charge: 0,
    status: "active",
  },
  {
    id: "ship-south4-standard",
    state: "South 4 (AP/TG/KL/KA)",
    category: "All Categories",
    minQty: 1,
    maxQty: 999,
    minOrderValue: 0,
    shippingType: "FIXED",
    charge: 50,
    status: "active",
  },
  {
    id: "ship-roi-standard",
    state: "Rest of India",
    category: "All Categories",
    minQty: 1,
    maxQty: 999,
    minOrderValue: 0,
    shippingType: "FIXED",
    charge: 70,
    status: "active",
  },
];

export async function GET() {
  try {
    await connectToDatabase();
    let rules = await ShippingRule.find().sort({ createdAt: -1 }).lean();
    if (!rules || rules.length === 0) {
      await ShippingRule.insertMany(DEFAULT_SHIPPING_RULES);
      rules = await ShippingRule.find().sort({ createdAt: -1 }).lean();
    }
    return NextResponse.json({ success: true, data: rules });
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
    const id = body.id || `ship-${Date.now()}`;
    const rule = await ShippingRule.findOneAndUpdate(
      { id },
      { $set: { ...body, id } },
      { upsert: true, returnDocument: "after" }
    );
    return NextResponse.json({ success: true, data: rule });
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
    if (!id) {
      return NextResponse.json({ success: false, error: "Rule ID is required" }, { status: 400 });
    }

    const deleted = await ShippingRule.findOneAndDelete({ id });
    if (!deleted) {
      return NextResponse.json({ success: false, error: "Shipping rule not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Shipping rule removed successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
