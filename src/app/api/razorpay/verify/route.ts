import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing required payment verification parameters (orderId, paymentId, signature)." },
        { status: 400 }
      );
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_secret) {
      return NextResponse.json(
        { success: false, error: "Payment gateway secret is not configured on server." },
        { status: 500 }
      );
    }

    // Perform timing-safe HMAC SHA256 cryptographic verification
    const generatedSignature = crypto
      .createHmac("sha256", key_secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const bufA = Buffer.from(razorpay_signature, "utf-8");
    const bufB = Buffer.from(generatedSignature, "utf-8");

    if (bufA.length !== bufB.length || !crypto.timingSafeEqual(bufA, bufB)) {
      return NextResponse.json(
        { success: false, error: "Payment verification failed: Signature mismatch." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      message: "Payment successfully verified.",
    });
  } catch (error: any) {
    console.error("Razorpay verification error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Payment verification failed." },
      { status: 500 }
    );
  }
}
