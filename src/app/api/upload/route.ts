import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { requireAdmin, checkRateLimit, getClientIp } from "@/lib/auth";
import { saveMediaBuffer, detectImageFormat } from "@/lib/mediaStorage";

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
function isValidImageBuffer(buffer: Buffer): { valid: boolean; ext: string; mime: string } {
  if (buffer.length < 8) return { valid: false, ext: "", mime: "" };

  const { mime, ext } = detectImageFormat(buffer);
  if (mime) {
    return { valid: true, ext, mime };
  }

  return { valid: false, ext: "", mime: "" };
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

          // Persist raw binary buffer to MongoDB Atlas
          const saved = await saveMediaBuffer(buffer, file.name, headerCheck.mime);
          uploadedUrls.push(saved.url);
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

            const saved = await saveMediaBuffer(buffer, undefined, headerCheck.mime);
            uploadedUrls.push(saved.url);
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

            const saved = await saveMediaBuffer(buffer, undefined, headerCheck.mime);
            uploadedUrls.push(saved.url);
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
      url: uploadedUrls[0],
      message: `${uploadedUrls.length} image(s) uploaded successfully.`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Upload processing failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}
