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

    // Security & Business Rule: Do not show tracking info when payment is pending or failed
    const isPaymentPending =
      order.paymentStatus === "Pending" ||
      order.paymentStatus === "Failed" ||
      order.orderStatus === "Payment Pending" ||
      (order.paymentMethod === "Online" && order.paymentStatus !== "Paid" && order.paymentStatus !== "Completed");

    if (isPaymentPending) {
      return NextResponse.json({
        success: true,
        data: {
          orderId: order.orderId,
          orderStatus: "Payment Pending",
          status: "Payment Pending",
          paymentStatus: order.paymentStatus || "Pending",
          paymentPending: true,
          trackingId: "",
          courierName: "",
          message: "Payment verification is pending. Consignment tracking information is securely hidden until payment verification is completed.",
          createdAt: order.createdAt,
          total: order.total,
          paymentMethod: order.paymentMethod,
        },
      });
    }

    // Ensure unique tracking ID exists for verified orders
    let activeTrackingId = order.trackingId;
    if (!activeTrackingId) {
      activeTrackingId = `NC-TRK-${(order.orderId || "").replace(/[^0-9]/g, "") || Date.now().toString().slice(-6)}`;
      await Order.updateOne({ _id: (order as any)._id }, { $set: { trackingId: activeTrackingId } }).catch(() => {});
    }

    const FALLBACK_IMG = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&h=1000&fit=crop&auto=format";

    const maskedName = order.customerName
      ? order.customerName.replace(/^(.{2})(.*)(.{1}\s+[A-Za-z]+)$/, (_: any, a: string, b: string, c: string) => `${a}${"*".repeat(b.length)}${c}`)
      : "";

    const maskedAddress = [
      order.shippingCity || "",
      order.shippingState || "",
      order.shippingPincode ? `- ${order.shippingPincode}` : "",
    ].filter(Boolean).join(" ");

    return NextResponse.json({
      success: true,
      data: {
        orderId: order.orderId,
        customerName: maskedName || (order.customerName ? `${order.customerName.slice(0, 2)}***` : "Customer"),
        customerPhone: order.customerPhone ? `${order.customerPhone.slice(0, 3)}****${order.customerPhone.slice(-3)}` : "",
        orderStatus: order.orderStatus,
        status: order.orderStatus,
        courierName: order.courierName || "Express Courier Logistics",
        trackingId: activeTrackingId,
        dispatchDate: order.dispatchDate || "",
        shippingAddress: maskedAddress || "Address Protected for Privacy",
        shippingState: order.shippingState,
        createdAt: order.createdAt,
        paymentPending: false,
        items: (order.items || []).map((it: any) => {
          let safeImg = it.image;
          if (!safeImg || typeof safeImg !== "string" || safeImg.includes("photo-1594938298603-c8148c4b4e75")) {
            safeImg = FALLBACK_IMG;
          }
          let safeName = it.productName || it.name;
          if (!safeName || safeName.toLowerCase().includes("garment")) {
            if (it.productId === "prod-nighty-1") {
              safeName = "Pure Cotton Daily Wear Nighty";
            } else if (it.productId === "p018") {
              safeName = "Yellow Floral Cotton Nighty";
            } else if (it.productId === "p020") {
              safeName = "Classic Print Designer Kurti";
            } else if (it.productId === "p7965") {
              safeName = "Emerald Green Full Open Nighty";
            } else {
              safeName = "Pure Cotton Handcrafted Product";
            }
          }
          return {
            productId: it.productId,
            productName: safeName,
            size: it.selectedSize || "Free Size",
            color: it.selectedColor || "Standard",
            quantity: it.quantity,
            price: it.price,
            image: safeImg,
          };
        }),
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
