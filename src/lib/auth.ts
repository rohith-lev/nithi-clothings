import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET =
  process.env.JWT_SECRET || "super_secret_nithi_key_2026";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Extract and verify JWT from Authorization header.
 * Returns user payload or a fallback admin user (dev mode, same as original Express middleware).
 */
export function getAuthUser(request: NextRequest): AuthUser {
  const authHeader = request.headers.get("authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // Same fallback as original Express middleware
    return { id: "adm-local", role: "Super Admin", name: "Nithi (Owner)", email: "" };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch {
    return { id: "adm-local", role: "Super Admin", name: "Nithi (Owner)", email: "" };
  }
}

/**
 * Sign a JWT token with the given user payload (48h expiry).
 */
export function
  signToken(user: object): string {
  return jwt.sign(user, JWT_SECRET, { expiresIn: "48h" });
}
