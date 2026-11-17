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

    const FALLBACK_IMG = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop&auto=format";

    // Enrich and sanitize order items (replace dead unsplash URLs and generic fallback names)
    const sanitizedOrders = orders.map((o: any) => ({
      ...o,
      items: (o.items || []).map((it: any) => {
        let safeImg = it.image;
        if (!safeImg || typeof safeImg !== "string" || safeImg.includes("photo-1594938298603-c8148c4b4e75")) {
          safeImg = FALLBACK_IMG;
        }

        let safeName = it.productName || it.name;
        if (!safeName || safeName === "Nighty Garment") {
          if (it.productId === "prod-nighty-1") {
            safeName = "Pure Cotton Daily Wear Nighty";
          } else if (it.productId === "p018") {
            safeName = "Yellow Floral Cotton Nighty";
          } else if (it.productId === "p020") {
            safeName = "Classic Print Designer Kurti";
          } else if (it.productId === "p7965") {
            safeName = "Emerald Green Full Open Nighty";
          } else {
            safeName = "Pure Cotton Handcrafted Garment";
          }
        }

        return {
          ...it,
          productName: safeName,
          image: safeImg,
        };
      }),
    }));

    return NextResponse.json({
      success: true,
      data: sanitizedOrders,
    });
  } catch (error: any) {
    console.error("Customer orders fetch error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch orders." },
      { status: 500 }
    );
  }
}
