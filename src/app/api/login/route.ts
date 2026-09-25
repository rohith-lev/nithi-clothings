import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@nithicollection.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "adminpassword123";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const user = {
        id: "adm-1",
        name: "Nithi (Founder & Owner)",
        email: ADMIN_EMAIL,
        role: "Super Admin",
        avatar:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
        twoFactorEnabled: true,
      };
      const token = signToken(user);
      return NextResponse.json({ success: true, token, user });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }
  } catch (e) {
    return NextResponse.json(
      { success: false, error: (e as Error).message },
      { status: 500 }
    );
  }
}
