import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { requireAdmin, checkRateLimit, getClientIp } from "@/lib/auth";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
};

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

/**
 * Validate image buffer magic bytes / signature for real image formats.
 */
function isValidImageBuffer(buffer: Buffer): { valid: boolean; ext: string } {
  if (buffer.length < 8) return { valid: false, ext: "" };

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { valid: true, ext: ".jpg" };
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return { valid: true, ext: ".png" };
  }

  // WEBP: RIFF....WEBP
  if (
    buffer.slice(0, 4).toString("ascii") === "RIFF" &&
    buffer.slice(8, 12).toString("ascii") === "WEBP"
  ) {
    return { valid: true, ext: ".webp" };
  }

  // AVIF: ....ftypavif
  if (buffer.slice(4, 12).toString("ascii") === "ftypavif") {
    return { valid: true, ext: ".avif" };
  }

  return { valid: false, ext: "" };
}

export async function POST(request: NextRequest) {
  // Authentication check
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  // Rate Limiting: 30 uploads per minute
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(`upload:${ip}`, 30, 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { success: false, error: "Upload rate limit exceeded. Please wait a minute." },
      { status: 429 }
    );
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const files = formData.getAll("images") as (File | string)[];

      for (const item of files) {
        if (typeof item === "object" && item !== null && "arrayBuffer" in item) {
          const file = item as File;

          // Validate size
          if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
              {
                success: false,
                error: `File "${file.name}" exceeds maximum allowed size of 5MB.`,
              },
              { status: 400 }
            );
          }

          const rawExt = path.extname(file.name || "").toLowerCase();
          if (rawExt && !ALLOWED_EXTENSIONS.has(rawExt)) {
            return NextResponse.json(
              {
                success: false,
                error: `Invalid file format "${rawExt}". Only JPG, PNG, WebP, and AVIF images are permitted.`,
              },
              { status: 400 }
            );
          }

          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Verify magic bytes
          const headerCheck = isValidImageBuffer(buffer);
          if (!headerCheck.valid) {
            return NextResponse.json(
              {
                success: false,
                error: `File "${file.name}" is not a valid image format.`,
              },
              { status: 400 }
            );
          }

          const safeExt = headerCheck.ext;
          const randomId = crypto.randomBytes(16).toString("hex");
          const filename = `img-${Date.now()}-${randomId}${safeExt}`;
          const filePath = path.join(uploadDir, filename);

          // Ensure no path traversal
          if (!filePath.startsWith(uploadDir)) {
            return NextResponse.json(
              { success: false, error: "Invalid file path destination." },
              { status: 400 }
            );
          }

          fs.writeFileSync(filePath, buffer);
          uploadedUrls.push(`/uploads/${filename}`);
        } else if (typeof item === "string" && item.startsWith("data:image/")) {
          // Base64 string submitted via FormData
          const match = item.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
          if (match) {
            const mimeSubtype = match[1].toLowerCase();
            const allowedMime = `image/${mimeSubtype}`;
            const ext = ALLOWED_MIME_TYPES[allowedMime];

            if (!ext) {
              continue;
            }

            const buffer = Buffer.from(match[2], "base64");
            if (buffer.length > MAX_FILE_SIZE) continue;

            const headerCheck = isValidImageBuffer(buffer);
            if (!headerCheck.valid) continue;

            const randomId = crypto.randomBytes(16).toString("hex");
            const filename = `img-${Date.now()}-${randomId}${headerCheck.ext}`;
            const filePath = path.join(uploadDir, filename);

            if (filePath.startsWith(uploadDir)) {
              fs.writeFileSync(filePath, buffer);
              uploadedUrls.push(`/uploads/${filename}`);
            }
          }
        }
      }
    } else {
      // JSON body with array of base64 strings or images
      const body = await request.json().catch(() => ({}));
      const images: string[] = Array.isArray(body.images)
        ? body.images
        : [body.image].filter(Boolean);

      for (const img of images) {
        if (typeof img === "string" && img.startsWith("data:image/")) {
          const match = img.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
          if (match) {
            const mimeSubtype = match[1].toLowerCase();
            const allowedMime = `image/${mimeSubtype}`;
            const ext = ALLOWED_MIME_TYPES[allowedMime];

            if (!ext) continue;

            const buffer = Buffer.from(match[2], "base64");
            if (buffer.length > MAX_FILE_SIZE) continue;

            const headerCheck = isValidImageBuffer(buffer);
            if (!headerCheck.valid) continue;

            const randomId = crypto.randomBytes(16).toString("hex");
            const filename = `img-${Date.now()}-${randomId}${headerCheck.ext}`;
            const filePath = path.join(uploadDir, filename);

            if (filePath.startsWith(uploadDir)) {
              fs.writeFileSync(filePath, buffer);
              uploadedUrls.push(`/uploads/${filename}`);
            }
          }
        }
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "No valid image files provided. Supported formats: JPG, PNG, WebP, AVIF (Max 5MB).",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      message: `${uploadedUrls.length} image(s) uploaded successfully.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Upload processing failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}
