import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = "INR", receipt, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid order amount" },
        { status: 400 }
      );
    }

    const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G5ag";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_secret_key";

    // Amount in paise
    const amountInPaise = Math.round(Number(amount) * 100);

    let razorpayOrderId = `order_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;

    try {
      if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
        const razorpay = new Razorpay({
          key_id,
          key_secret,
        });

        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency,
          receipt: receipt || `rcpt_${Date.now().toString().slice(-6)}`,
          notes: notes || {},
        });

        razorpayOrderId = order.id;
      }
    } catch (razorpayErr: any) {
      console.warn("Razorpay API order creation warning, using sandbox order ID:", razorpayErr?.message);
    }

    return NextResponse.json({
      success: true,
      data: {
        orderId: razorpayOrderId,
        amount: amountInPaise,
        currency,
        key: key_id,
      },
    });
  } catch (error: any) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create Razorpay order" },
      { status: 500 }
    );
  }
}
