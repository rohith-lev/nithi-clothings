import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Customer from "@/lib/models/Customer";
import AuditLog from "@/lib/models/AuditLog";
import { requireAdmin, escapeRegex } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { user, errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const {
      customerId,
      phone,
      title,
      description,
      couponCode,
      value,
      notes,
      creditPointsToAdd,
    } = body;

    const cleanCustomerId = (customerId || "").trim();
    const cleanPhone = (phone || "").trim();

    if (!cleanCustomerId && !cleanPhone) {
      return NextResponse.json(
        { success: false, error: "Please specify either Customer ID or Mobile Number." },
        { status: 400 }
      );
    }

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Gift or Offer Title is required." },
        { status: 400 }
      );
    }

    const query: any = {
      $or: [
        ...(cleanCustomerId ? [{ customerId: cleanCustomerId }, { customerId: new RegExp(`^${escapeRegex(cleanCustomerId)}$`, "i") }] : []),
        ...(cleanPhone ? [{ phone: cleanPhone }] : []),
      ],
    };

    const customer = await Customer.findOne(query);
    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found." },
        { status: 404 }
      );
    }

    const giftId = `GIFT-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const newGift = {
      id: giftId,
      title: title.trim().slice(0, 150),
      description: typeof description === "string" ? description.trim().slice(0, 500) : "",
      couponCode: typeof couponCode === "string" ? couponCode.trim().toUpperCase().slice(0, 50) : "",
      value: typeof value === "number" ? Math.max(0, value) : Number(value) || 0,
      status: "ACTIVE",
      assignedAt: new Date(),
      assignedBy: user?.name || "Super Admin",
      notes: typeof notes === "string" ? notes.trim().slice(0, 500) : "",
    };

    if (!Array.isArray(customer.assignedGifts)) {
      customer.assignedGifts = [];
    }
    customer.assignedGifts.unshift(newGift);

    if (typeof creditPointsToAdd === "number" && creditPointsToAdd > 0) {
      customer.creditPoints = (customer.creditPoints || 0) + creditPointsToAdd;
    }

    await customer.save();

    try {
      await new AuditLog({
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        adminName: user?.name || "Super Admin",
        action: "GIFT_ASSIGNED",
        targetType: "CUSTOMER",
        targetId: customer.customerId,
        targetName: customer.name,
        newValue: `Assigned gift "${newGift.title}" (Code: ${newGift.couponCode || "None"}, Value: ₹${newGift.value})`,
        reason: "Manual Gift / Offer assignment by Admin",
      }).save();
    } catch (e) {
      console.warn("Audit log error:", e);
    }

    return NextResponse.json({
      success: true,
      message: `Gift "${newGift.title}" successfully assigned to ${customer.name}!`,
      data: {
        customer: {
          customerId: customer.customerId,
          name: customer.name,
          phone: customer.phone,
          creditPoints: customer.creditPoints,
          assignedGifts: customer.assignedGifts,
        },
        gift: newGift,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to assign gift: " + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const { user, errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));

    const customerId = (searchParams.get("customerId") || body.customerId || "").trim();
    const giftId = (searchParams.get("giftId") || body.giftId || "").trim();

    if (!customerId || !giftId) {
      return NextResponse.json(
        { success: false, error: "Customer ID and Gift ID are required." },
        { status: 400 }
      );
    }

    const customer = await Customer.findOne({
      $or: [
        { customerId },
        { customerId: new RegExp(`^${escapeRegex(customerId)}$`, "i") },
      ],
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found." },
        { status: 404 }
      );
    }

    const initialCount = customer.assignedGifts ? customer.assignedGifts.length : 0;
    customer.assignedGifts = (customer.assignedGifts || []).filter(
      (g: any) => g.id !== giftId
    );

    if (customer.assignedGifts.length === initialCount) {
      return NextResponse.json(
        { success: false, error: "Gift not found on this customer profile." },
        { status: 404 }
      );
    }

    await customer.save();

    return NextResponse.json({
      success: true,
      message: "Gift successfully revoked.",
      data: { assignedGifts: customer.assignedGifts },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to remove gift: " + (error as Error).message },
      { status: 500 }
    );
  }
}
