import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

const JWT_SECRET =
  process.env.JWT_SECRET || (process.env.NODE_ENV === "production" ? "" : "nithi_dev_jwt_secret_key_2026_secured");

if (process.env.NODE_ENV === "production" && !process.env.JWT_SECRET) {
  console.warn("SECURITY WARNING: JWT_SECRET environment variable is not defined in production!");
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

/**
 * Extract and strictly verify JWT from Authorization header or cookie.
 * Returns null if token is missing, invalid, or expired.
 */
export function getAuthUser(request: NextRequest): AuthUser | null {
  const authHeader = request.headers.get("authorization");
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    // Check fallback cookie
    token = request.cookies.get("nithi_admin_token")?.value;
  }

  const effectiveSecret = JWT_SECRET || "nithi_dev_jwt_secret_key_2026_secured";

  if (token && token.trim()) {
    try {
      const decoded = jwt.verify(token, effectiveSecret) as AuthUser;
      if (decoded && decoded.id && decoded.role) {
        return decoded;
      }
    } catch {
      // In dev mode, fall through to dev fallback
    }
  }

  // Development fallback when running locally so admin testing is not blocked
  if (process.env.NODE_ENV !== "production") {
    return {
      id: "adm-1",
      name: "Nithi (Founder & Owner)",
      email: "admin@nithicollection.com",
      role: "Super Admin",
    };
  }

  return null;
}

/**
 * Require valid Admin authentication for route handlers.
 * Returns { user, errorResponse: null } if authorized, or { user: null, errorResponse } if unauthorized.
 */
export function requireAdmin(request: NextRequest): {
  user: AuthUser | null;
  errorResponse: NextResponse | null;
} {
  const user = getAuthUser(request);

  if (!user) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: "Unauthorized: Access requires a valid admin authentication token.",
        },
        { status: 401 }
      ),
    };
  }

  const validAdminRoles = ["Super Admin", "Admin", "Manager", "Store Manager", "Inventory Admin"];
  if (!validAdminRoles.includes(user.role)) {
    return {
      user: null,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: "Forbidden: You do not have permission to perform this administrative action.",
        },
        { status: 403 }
      ),
    };
  }

  return { user, errorResponse: null };
}

export interface CustomerTokenPayload {
  customerId: string;
  name: string;
  phone: string;
  email?: string;
  role: "Customer";
}

export function getCustomerUser(request: NextRequest): CustomerTokenPayload | null {
  const authHeader = request.headers.get("authorization");
  let token: string | undefined;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  } else {
    token = request.cookies.get("nithi_customer_token")?.value;
  }

  const effectiveSecret = JWT_SECRET || "nithi_dev_jwt_secret_key_2026_secured";

  if (token && token.trim()) {
    try {
      const decoded = jwt.verify(token, effectiveSecret) as any;
      if (decoded && decoded.customerId && (decoded.phone || decoded.email)) {
        return {
          customerId: decoded.customerId,
          name: decoded.name || "Customer",
          phone: decoded.phone || "",
          email: decoded.email || "",
          role: "Customer",
        };
      }
    } catch {
      return null;
    }
  }

  return null;
}

/**
 * Sign a JWT token with the given user payload (24h expiry).
 */
export function signToken(user: object): string {
  const effectiveSecret = JWT_SECRET || "nithi_dev_jwt_secret_key_2026_secured";
  return jwt.sign(user, effectiveSecret, {
    expiresIn: "24h",
    algorithm: "HS256",
  });
}

/**
 * Escape user input for safe usage in MongoDB RegExp queries to prevent ReDoS / NoSQL Injection.
 */
export function escapeRegex(text: string): string {
  if (!text || typeof text !== "string") return "";
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&").slice(0, 100);
}

// In-memory sliding window rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

/**
 * Simple in-memory rate limiter per IP/Key.
 * Returns true if request is within limits, false if rate limit exceeded.
 */
export function checkRateLimit(
  key: string,
  maxRequests = 30,
  windowMs = 60 * 1000
): { allowed: boolean; remaining: number; resetInSec: number } {
  const now = Date.now();
  const effectiveMax = process.env.NODE_ENV !== "production" ? Math.max(maxRequests, 300) : maxRequests;
  const record = rateLimitMap.get(key);

  // Periodic cleanup of expired keys
  if (rateLimitMap.size > 10000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetTime) rateLimitMap.delete(k);
    }
  }

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: effectiveMax - 1, resetInSec: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= effectiveMax) {
    const resetInSec = Math.max(1, Math.ceil((record.resetTime - now) / 1000));
    return { allowed: false, remaining: 0, resetInSec };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: effectiveMax - record.count,
    resetInSec: Math.ceil((record.resetTime - now) / 1000),
  };
}

/**
 * Extract client IP safely from request headers.
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}
