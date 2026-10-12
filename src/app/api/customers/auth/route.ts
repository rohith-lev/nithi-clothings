import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Customer from "@/lib/models/Customer";
import { signToken, checkRateLimit, getClientIp } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`cust-auth:${ip}`, 30, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many sign-in attempts. Please wait a moment." },
      { status: 429 }
    );
  }

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const rawIdentifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
    const rawName = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";

    if (!rawIdentifier) {
      return NextResponse.json(
        { success: false, error: "Please enter your mobile number or email address." },
        { status: 400 }
      );
    }

    const isEmail = rawIdentifier.includes("@");
    const cleanPhone = !isEmail ? rawIdentifier.replace(/[^0-9]/g, "").slice(-10) : "";
    const cleanEmail = isEmail ? rawIdentifier.toLowerCase().slice(0, 120) : "";

    if (!isEmail && cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // Lookup existing customer
    let customer = await Customer.findOne(
      isEmail ? { email: cleanEmail } : { phone: new RegExp(`${cleanPhone}$`) }
    );

    if (!customer) {
      const customerId = `CUST-${cleanPhone || Date.now().toString().slice(-8)}`;
      const name = rawName || (isEmail ? cleanEmail.split("@")[0] : `Customer ${cleanPhone.slice(-4)}`);
      customer = new Customer({
        customerId,
        name,
        phone: cleanPhone || "",
        email: cleanEmail || "",
        state: "Tamil Nadu",
      });
      await customer.save();
    } else if (rawName && (!customer.name || customer.name.startsWith("Customer "))) {
      customer.name = rawName;
      await customer.save();
    }

    const tokenPayload = {
      customerId: customer.customerId,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      role: "Customer",
    };

    const token = signToken(tokenPayload);

    const response = NextResponse.json({
      success: true,
      token,
      customer: {
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
        createdAt: customer.createdAt,
      },
      message: "Customer signed in successfully.",
    });

    response.cookies.set("nithi_customer_token", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Customer auth error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to sign in." },
      { status: 500 }
    );
  }
}
