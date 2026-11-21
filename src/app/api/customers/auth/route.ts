import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongodb";
import Customer from "@/lib/models/Customer";
import { signToken, checkRateLimit, getClientIp } from "@/lib/auth";
import { sendPasswordResetOtpEmail } from "@/services/notificationService";

function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, "nithi_collections_salt_2026", 1000, 64, "sha512").toString("hex");
}

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
    const action = typeof body.action === "string" ? body.action.trim() : "";

    // ── 1. ACTION: FORGOT PASSWORD (Send 6-Digit OTP via Email) ───────────────
    if (action === "forgot-password") {
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
      const identifier = typeof body.identifier === "string" ? body.identifier.trim() : email;

      if (!identifier) {
        return NextResponse.json(
          { success: false, error: "Please enter your registered email address or phone number." },
          { status: 400 }
        );
      }

      const isEmail = identifier.includes("@");
      const cleanPhone = !isEmail ? identifier.replace(/[^0-9]/g, "").slice(-10) : "";
      const cleanEmail = isEmail ? identifier.toLowerCase() : "";

      const customer = await Customer.findOne(
        cleanEmail ? { email: cleanEmail } : { phone: new RegExp(`${cleanPhone}$`) }
      );

      if (!customer) {
        return NextResponse.json(
          { success: false, error: "No account found with this email or phone number." },
          { status: 404 }
        );
      }

      const targetEmail = customer.email || cleanEmail;
      if (!targetEmail) {
        return NextResponse.json(
          { success: false, error: "No email address registered for this account. Please contact support." },
          { status: 400 }
        );
      }

      // Generate secure 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      customer.resetOtp = otp;
      customer.resetOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry
      await customer.save();

      // Dispatch OTP Email
      await sendPasswordResetOtpEmail({
        email: targetEmail,
        name: customer.name || "Valued Customer",
        otp,
      });

      return NextResponse.json({
        success: true,
        message: `A 6-digit verification OTP has been sent to ${targetEmail}.`,
        email: targetEmail,
      });
    }

    // ── 2. ACTION: RESET PASSWORD (Verify OTP & Update Password) ─────────────
    if (action === "reset-password") {
      const identifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
      const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : identifier;
      const otp = typeof body.otp === "string" ? body.otp.trim() : "";
      const newPassword = typeof body.newPassword === "string" ? body.newPassword : "";

      if (!otp || otp.length !== 6) {
        return NextResponse.json(
          { success: false, error: "Please enter the valid 6-digit verification OTP sent to your email." },
          { status: 400 }
        );
      }

      if (!newPassword || newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: "New password must be at least 6 characters long." },
          { status: 400 }
        );
      }

      const isEmail = email.includes("@");
      const cleanPhone = !isEmail ? email.replace(/[^0-9]/g, "").slice(-10) : "";
      const cleanEmail = isEmail ? email.toLowerCase() : "";

      const customer = await Customer.findOne(
        cleanEmail ? { email: cleanEmail } : { phone: new RegExp(`${cleanPhone}$`) }
      );

      if (!customer) {
        return NextResponse.json(
          { success: false, error: "Account not found." },
          { status: 404 }
        );
      }

      if (!customer.resetOtp || customer.resetOtp !== otp) {
        return NextResponse.json(
          { success: false, error: "Invalid OTP code. Please check your email or request a new OTP." },
          { status: 400 }
        );
      }

      if (customer.resetOtpExpires && new Date(customer.resetOtpExpires) < new Date()) {
        return NextResponse.json(
          { success: false, error: "Verification OTP has expired. Please request a new one." },
          { status: 400 }
        );
      }

      // Update password hash and clear OTP
      customer.passwordHash = hashPassword(newPassword);
      customer.resetOtp = "";
      customer.resetOtpExpires = undefined;
      await customer.save();

      return NextResponse.json({
        success: true,
        message: "Password reset successfully! You can now sign in with your new password.",
      });
    }

    // ── 3. STANDARD SIGN-IN (Email and/or Phone + Password) ──────────────────
    const rawIdentifier = typeof body.identifier === "string" ? body.identifier.trim() : "";
    const rawPhone = typeof body.phone === "string" ? body.phone.trim() : "";
    const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
    const rawName = typeof body.name === "string" ? body.name.trim().slice(0, 100) : "";
    const rawPassword = typeof body.password === "string" ? body.password : "";

    const cleanPhone = (rawPhone || (!rawIdentifier.includes("@") ? rawIdentifier : "")).replace(/[^0-9]/g, "").slice(-10);
    const cleanEmail = (rawEmail || (rawIdentifier.includes("@") ? rawIdentifier : "")).toLowerCase().slice(0, 120);

    if (!cleanPhone && !cleanEmail) {
      return NextResponse.json(
        { success: false, error: "Please enter your mobile number or email address." },
        { status: 400 }
      );
    }

    if (cleanPhone && cleanPhone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // Lookup existing customer (prefer phone, then email)
    let customer = null;
    if (cleanPhone) {
      customer = await Customer.findOne({ phone: new RegExp(`${cleanPhone}$`) });
    }
    if (!customer && cleanEmail) {
      customer = await Customer.findOne({ email: cleanEmail });
    }

    if (customer && customer.passwordHash && rawPassword) {
      // Validate password if user has password set
      const incomingHash = hashPassword(rawPassword);
      if (incomingHash !== customer.passwordHash) {
        return NextResponse.json(
          { success: false, error: "Incorrect password. Please try again or click Forgot Password." },
          { status: 401 }
        );
      }
    } else if (customer && !customer.passwordHash && rawPassword) {
      // First time password setup
      customer.passwordHash = hashPassword(rawPassword);
      await customer.save();
    }

    if (!customer) {
      const customerId = `CUST-${cleanPhone || Date.now().toString().slice(-8)}`;
      const name = rawName || (cleanEmail ? cleanEmail.split("@")[0] : `Customer ${cleanPhone.slice(-4)}`);
      customer = new Customer({
        customerId,
        name,
        phone: cleanPhone || "",
        email: cleanEmail || "",
        state: "Tamil Nadu",
        passwordHash: rawPassword ? hashPassword(rawPassword) : "",
      });
      await customer.save();
    } else {
      let needsSave = false;
      if (rawName && (!customer.name || customer.name.startsWith("Customer "))) {
        customer.name = rawName;
        needsSave = true;
      }
      if (cleanPhone && !customer.phone) {
        customer.phone = cleanPhone;
        needsSave = true;
      }
      if (cleanEmail && !customer.email) {
        customer.email = cleanEmail;
        needsSave = true;
      }
      if (needsSave) {
        await customer.save();
      }
    }

    const tokenPayload = {
      customerId: customer.customerId,
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      role: "Customer",
    };

    const token = signToken(tokenPayload, "30d");

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
      { success: false, error: error.message || "Failed to process customer authentication." },
      { status: 500 }
    );
  }
}
