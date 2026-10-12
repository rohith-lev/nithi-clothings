import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { signToken, checkRateLimit, getClientIp } from "@/lib/auth";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@nithicollection.com").toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "adminpassword123";

/**
 * Timing-safe string comparison to prevent timing-based side-channel attacks on credentials.
 */
function safeCompare(a: string, b: string): boolean {
  try {
    const bufA = Buffer.from(a, "utf-8");
    const bufB = Buffer.from(b, "utf-8");
    if (bufA.length !== bufB.length) {
      // Perform a dummy comparison to preserve constant execution time
      crypto.timingSafeEqual(bufA, bufA);
      return false;
    }
    return crypto.timingSafeEqual(bufA, bufB);
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);

  // Rate Limiting: 5 attempts per 5 minutes per IP
  const rateLimit = checkRateLimit(`login:${ip}`, 5, 5 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: `Too many failed login attempts. Please wait ${rateLimit.resetInSec} seconds before trying again.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": rateLimit.resetInSec.toString(),
        },
      }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
    const rawPassword = typeof body.password === "string" ? body.password : "";

    if (!rawEmail || !rawPassword) {
      return NextResponse.json(
        { success: false, error: "Email and password are required." },
        { status: 400 }
      );
    }

    const DEMO_ACCOUNTS: Record<string, { id: string; name: string; email: string; role: string; avatar: string; twoFactorEnabled: boolean }> = {
      "admin@nithicollection.com": {
        id: "adm-1",
        name: "Nithi (Founder & Owner)",
        email: "admin@nithicollection.com",
        role: "Super Admin",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
        twoFactorEnabled: true,
      },
      "admin@nithi.com": {
        id: "adm-1",
        name: "Nithi (Founder & Owner)",
        email: "admin@nithicollection.com",
        role: "Super Admin",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
        twoFactorEnabled: true,
      },
      "admin": {
        id: "adm-1",
        name: "Nithi (Founder & Owner)",
        email: "admin@nithicollection.com",
        role: "Super Admin",
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
        twoFactorEnabled: true,
      },
      "manager@nithicollection.com": {
        id: "adm-2",
        name: "Ramesh Kumar",
        email: "manager@nithicollection.com",
        role: "Store Manager",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
        twoFactorEnabled: false,
      },
      "inventory@nithicollection.com": {
        id: "adm-3",
        name: "Sundar Raj",
        email: "inventory@nithicollection.com",
        role: "Inventory Admin",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        twoFactorEnabled: false,
      },
    };

    const targetUser = DEMO_ACCOUNTS[rawEmail];
    const isMasterPassword = safeCompare(rawPassword, ADMIN_PASSWORD);
    const isStandardDemoPass = rawPassword === "password" || rawPassword === "admin" || rawPassword === "admin123" || rawPassword === "adminpassword123";

    if (targetUser && (isMasterPassword || isStandardDemoPass || process.env.NODE_ENV !== "production")) {
      const user = {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        avatar: targetUser.avatar,
        twoFactorEnabled: targetUser.twoFactorEnabled,
      };

      const token = signToken(user);

      const response = NextResponse.json({ success: true, token, user });

      // Set secure cookie
      response.cookies.set({
        name: "nithi_admin_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return response;
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password credentials.",
          attemptsRemaining: rateLimit.remaining,
        },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Authentication failed. Please try again." },
      { status: 500 }
    );
  }
}
