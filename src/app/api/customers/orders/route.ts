import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { getCustomerUser, escapeRegex } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const custAuth = getCustomerUser(request);
  if (!custAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Please sign in to view your orders." },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();

    const queryFilters: Record<string, unknown>[] = [];

    if (custAuth.customerId) {
      queryFilters.push({ customerId: custAuth.customerId });
    }

    if (custAuth.phone) {
      const cleanPhoneDigits = custAuth.phone.replace(/[^0-9]/g, "").slice(-10);
      if (cleanPhoneDigits) {
        queryFilters.push({ customerPhone: new RegExp(`${escapeRegex(cleanPhoneDigits)}$`) });
      }
    }

    if (custAuth.email) {
      queryFilters.push({ customerEmail: custAuth.email.toLowerCase() });
    }

    if (queryFilters.length === 0) {
      return NextResponse.json({ success: true, data: [] });
    }

    const orders = await Order.find({ $or: queryFilters })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error: any) {
    console.error("Customer orders fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders." },
      { status: 500 }
    );
  }
}
