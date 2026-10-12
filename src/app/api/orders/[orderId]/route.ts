import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/lib/models/Order";
import { requireAdmin, escapeRegex } from "@/lib/auth";

const VALID_ORDER_STATUSES = new Set([
  "Pending",
  "Confirmed",
  "Processing",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Returned",
]);

const VALID_PAYMENT_STATUSES = new Set(["Pending", "Paid", "Failed", "Refunded"]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { orderId } = await params;
    const cleanOrderId = (orderId || "").trim();
    const order = await Order.findOne({
      $or: [
        { orderId: cleanOrderId },
        { orderId: new RegExp(`^${escapeRegex(cleanOrderId)}$`, "i") },
        ...(cleanOrderId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: cleanOrderId }] : []),
      ],
    }).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { orderId } = await params;
    const cleanOrderId = (orderId || "").trim();
    const body = await request.json().catch(() => ({}));
    const { orderStatus, paymentStatus, notes, courierName, trackingId, dispatchDate } = body;

    const updateFields: Record<string, unknown> = {};

    if (courierName !== undefined) {
      updateFields.courierName = typeof courierName === "string" ? courierName.slice(0, 100).replace(/[<>]/g, "").trim() : "";
    }

    if (trackingId !== undefined) {
      updateFields.trackingId = typeof trackingId === "string" ? trackingId.slice(0, 100).replace(/[<>]/g, "").trim() : "";
    }

    if (dispatchDate !== undefined) {
      updateFields.dispatchDate = typeof dispatchDate === "string" ? dispatchDate.slice(0, 50).trim() : "";
    }

    if (orderStatus !== undefined) {
      if (!VALID_ORDER_STATUSES.has(orderStatus)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid order status. Allowed values: ${Array.from(VALID_ORDER_STATUSES).join(", ")}`,
          },
          { status: 400 }
        );
      }
      updateFields.orderStatus = orderStatus;
    }

    if (paymentStatus !== undefined) {
      if (!VALID_PAYMENT_STATUSES.has(paymentStatus)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid payment status. Allowed values: ${Array.from(VALID_PAYMENT_STATUSES).join(", ")}`,
          },
          { status: 400 }
        );
      }
      updateFields.paymentStatus = paymentStatus;
    }

    if (notes !== undefined) {
      updateFields.notes = typeof notes === "string" ? notes.slice(0, 500).replace(/[<>]/g, "") : "";
    }

    const updated = await Order.findOneAndUpdate(
      {
        $or: [
          { orderId: cleanOrderId },
          { orderId: new RegExp(`^${escapeRegex(cleanOrderId)}$`, "i") },
          ...(cleanOrderId.match(/^[0-9a-fA-F]{24}$/) ? [{ _id: cleanOrderId }] : []),
        ],
      },
      { $set: updateFields },
      { returnDocument: "after", new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Order status updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
