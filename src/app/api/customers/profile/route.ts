import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Customer from "@/lib/models/Customer";
import { getCustomerUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const custAuth = getCustomerUser(request);
  if (!custAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Please sign in to view your profile." },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();
    const customer = await Customer.findOne({ customerId: custAuth.customerId }).lean();
    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        customerId: customer.customerId,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address || "",
        addressLine: customer.addressLine || customer.address || "",
        areaLocality: customer.areaLocality || "",
        city: customer.city || "",
        state: customer.state || "Tamil Nadu",
        pincode: customer.pincode || "",
        totalOrders: customer.totalOrders || 0,
        totalSpent: customer.totalSpent || 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const custAuth = getCustomerUser(request);
  if (!custAuth) {
    return NextResponse.json(
      { success: false, error: "Unauthorized: Please sign in to update your profile." },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));

    const updateFields: Record<string, string> = {};

    if (typeof body.name === "string" && body.name.trim()) {
      updateFields.name = body.name.trim().slice(0, 100);
    }
    if (typeof body.phone === "string" && body.phone.trim()) {
      updateFields.phone = body.phone.replace(/[^0-9+ ]/g, "").slice(0, 20);
    }
    if (typeof body.email === "string") {
      updateFields.email = body.email.trim().toLowerCase().slice(0, 120);
    }
    if (typeof body.addressLine === "string") {
      updateFields.addressLine = body.addressLine.trim().slice(0, 200);
    }
    if (typeof body.areaLocality === "string") {
      updateFields.areaLocality = body.areaLocality.trim().slice(0, 150);
    }
    if (typeof body.city === "string") {
      updateFields.city = body.city.trim().slice(0, 100);
    }
    if (typeof body.state === "string") {
      updateFields.state = body.state.trim().slice(0, 100);
    }
    if (typeof body.pincode === "string") {
      updateFields.pincode = body.pincode.replace(/[^0-9]/g, "").slice(0, 10);
    }

    // Also update composite address
    const fullStreet = [updateFields.addressLine || body.address || "", updateFields.areaLocality || ""]
      .filter(Boolean)
      .join(", ");
    if (fullStreet) {
      updateFields.address = fullStreet;
    }

    const updated = await Customer.findOneAndUpdate(
      { customerId: custAuth.customerId },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Customer not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        customerId: updated.customerId,
        name: updated.name,
        phone: updated.phone,
        email: updated.email,
        address: updated.address || "",
        addressLine: updated.addressLine || updated.address || "",
        areaLocality: updated.areaLocality || "",
        city: updated.city || "",
        state: updated.state || "Tamil Nadu",
        pincode: updated.pincode || "",
      },
      message: "Delivery address and profile saved successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update profile." },
      { status: 500 }
    );
  }
}
