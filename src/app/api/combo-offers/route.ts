import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import ComboOffer from "@/lib/models/ComboOffer";
import { requireAdmin, escapeRegex } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    const filter: any = {};
    if (activeOnly) {
      filter.status = "active";
    }

    const combos = await ComboOffer.find(filter).sort({ createdAt: -1 }).lean();

    if (activeOnly) {
      const now = new Date();
      const validCombos = combos.filter((c: any) => {
        if (c.status !== "active") return false;
        if (c.startDate) {
          const start = new Date(c.startDate);
          if (!isNaN(start.getTime()) && now < start) return false;
        }
        if (c.endDate) {
          const end = new Date(c.endDate);
          // If endDate is just YYYY-MM-DD, treat end as end of that day (23:59:59)
          if (!isNaN(end.getTime())) {
            const endThreshold = c.endDate.includes("T") || c.endDate.includes(":")
              ? end
              : new Date(new Date(c.endDate).setHours(23, 59, 59, 999));
            if (now > endThreshold) return false;
          }
        }
        return true;
      });
      return NextResponse.json({ success: true, data: validCombos });
    }

    return NextResponse.json({ success: true, data: combos });
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
    const id = body.id || `combo-${Date.now()}`;

    const combo = await ComboOffer.findOneAndUpdate(
      { id },
      {
        $set: {
          ...body,
          id,
          updatedAt: new Date(),
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );
    return NextResponse.json({ success: true, data: combo });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (id) {
      const safeId = escapeRegex(id.trim());
      const orClauses: any[] = [{ id: safeId }, { id }];
      if (mongoose.Types.ObjectId.isValid(id)) {
        orClauses.push({ _id: id });
      }
      await ComboOffer.deleteMany({ $or: orClauses });
    }
    return NextResponse.json({ success: true, message: "Combo offer deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
