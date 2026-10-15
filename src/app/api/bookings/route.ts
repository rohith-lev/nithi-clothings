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

export async function DELETE(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));

    const all = searchParams.get("all") === "true" || body.all === true;
    const bookingId = searchParams.get("bookingId") || searchParams.get("id") || body.bookingId || body.id;

    if (all || bookingId === "all") {
      const res = await Booking.deleteMany({});
      return NextResponse.json({
        success: true,
        message: `All ${res.deletedCount} bookings purged successfully`,
        data: { deletedCount: res.deletedCount },
      });
    }

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const cleanId = String(bookingId).trim();
    const deleted = await Booking.findOneAndDelete({
      $or: [
        { bookingId: cleanId },
        { bookingId: new RegExp(`^${cleanId}$`, "i") },
        ...(cleanId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: cleanId }] : []),
      ],
    });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Booking #${deleted.bookingId} deleted successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
