import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { escapeRegex, checkRateLimit, getClientIp } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`order-track:${ip}`, 30, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many tracking lookups. Please wait a minute." },
      { status: 429 }
    );
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const queryId = searchParams.get("id") || searchParams.get("trackId") || searchParams.get("orderId");

    if (!queryId || typeof queryId !== "string" || !queryId.trim()) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid Order ID or Courier Tracking ID." },
        { status: 400 }
      );
    }

    const cleanId = queryId.trim();

    // Prevent insecure phone-number-only searches!
    const isPurePhoneNumber =
      /^[0-9+ -]{7,15}$/.test(cleanId) &&
      !cleanId.toUpperCase().startsWith("ORD-") &&
      !cleanId.toUpperCase().startsWith("NC") &&
      !cleanId.toLowerCase().includes("order");

    if (isPurePhoneNumber) {
      return NextResponse.json(
        {
          success: false,
          error: "Phone-number lookups are restricted for privacy. Please sign in to your account or enter your specific Order ID / Tracking Number.",
        },
        { status: 400 }
      );
    }

    // Generate potential order ID & tracking ID query candidates
    const candidates = new Set<string>();
    candidates.add(cleanId);

    // 1. Strip common prefixes like "Order #", "Order", "#", "Consignment:", "Track:", etc.
    const stripped = cleanId
      .replace(/^(order|consignment|track|tracking|id|ref|no|#|\s|:)+/gi, "")
      .trim();
    if (stripped) {
      candidates.add(stripped);
    }

    // 2. Extract any standard ORD-XXXXXX pattern (e.g. "Order #ORD-090600" -> "ORD-090600")
    const ordMatch = cleanId.match(/ORD-?[0-9]+/i);
    if (ordMatch) {
      const rawMatch = ordMatch[0].toUpperCase();
      const formatted = rawMatch.startsWith("ORD-")
        ? rawMatch
        : `ORD-${rawMatch.replace(/^ORD/, "")}`;
      candidates.add(formatted);
      candidates.add(rawMatch);
    }

    // 3. If query contains 4-8 digits, check ORD- prefix (e.g. "090600" -> "ORD-090600")
    const digitsMatch = cleanId.match(/\b\d{4,8}\b/);
    if (digitsMatch) {
      candidates.add(`ORD-${digitsMatch[0]}`);
    }

    const orConditions: any[] = [];
    for (const cand of candidates) {
      const safe = escapeRegex(cand);
      orConditions.push({ orderId: new RegExp(`^${safe}$`, "i") });
      orConditions.push({ trackingId: new RegExp(`^${safe}$`, "i") });
    }

    const order = await Order.findOne({ $or: orConditions }).lean();

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: `No consignment found for "${cleanId}". Please check your Reference or Tracking number.`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.orderId,
        customerName: order.customerName,
        customerPhone: order.customerPhone ? `${order.customerPhone.slice(0, 3)}****${order.customerPhone.slice(-3)}` : "",
        orderStatus: order.orderStatus,
        status: order.orderStatus,
        courierName: order.courierName || "",
        trackingId: order.trackingId || "",
        dispatchDate: order.dispatchDate || "",
        shippingAddress: order.shippingAddress,
        shippingState: order.shippingState,
        createdAt: order.createdAt,
        items: (order.items || []).map((it: any) => ({
          productId: it.productId,
          productName: it.productName,
          size: it.selectedSize || "Free Size",
          color: it.selectedColor || "Standard",
          quantity: it.quantity,
          price: it.price,
          image: it.image || "",
        })),
        subtotal: order.subtotal,
        shippingFee: order.shippingFee,
        discount: order.discount,
        total: order.total,
        paymentMethod: order.paymentMethod,
      },
    });
  } catch (error: any) {
    console.error("Tracking lookup error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to lookup tracking details." },
      { status: 500 }
    );
  }
}
