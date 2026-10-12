import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/lib/models/Booking";
import { requireAdmin, checkRateLimit, getClientIp } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const bookings = await Booking.find().sort({ createdAt: -1 }).limit(200).lean();
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`booking:${ip}`, 10, 5 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many booking requests. Please wait a few minutes." },
      { status: 429 }
    );
  }

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const bookingId = body.bookingId || `BK-${Date.now().toString().slice(-6)}`;
    const newBooking = new Booking({ ...body, bookingId });
    await newBooking.save();
    return NextResponse.json({ success: true, data: newBooking });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
