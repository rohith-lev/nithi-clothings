import crypto from "crypto";
import fs from "fs";
import path from "path";
import { connectToDatabase } from "./mongodb";
import Media from "./models/Media";

export interface SaveMediaResult {
  filename: string;
  url: string;
  contentType: string;
  size: number;
}

export interface GetMediaResult {
  data: Buffer;
  contentType: string;
  size: number;
}

/**
 * Detect image mime type and extension from buffer magic bytes
 */
export function detectImageFormat(buffer: Buffer, fallbackMime?: string): { mime: string; ext: string } {
  if (buffer.length >= 8) {
    // JPEG: FF D8 FF
    if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
      return { mime: "image/jpeg", ext: ".jpg" };
    }

    // PNG: 89 50 4E 47 0D 0A 1A 0A
    if (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    ) {
      return { mime: "image/png", ext: ".png" };
    }

    // WEBP: RIFF....WEBP
    if (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    ) {
      return { mime: "image/webp", ext: ".webp" };
    }

    // GIF: GIF87a or GIF89a
    if (
      buffer.subarray(0, 3).toString("ascii") === "GIF"
    ) {
      return { mime: "image/gif", ext: ".gif" };
    }

    // AVIF: ....ftypavif or ....ftypavis
    if (
      buffer.subarray(4, 12).toString("ascii") === "ftypavif" ||
      buffer.subarray(4, 12).toString("ascii") === "ftypavis"
    ) {
      return { mime: "image/avif", ext: ".avif" };
    }
  }

  // Fallback to explicitly provided MIME type
  if (fallbackMime) {
    const cleaned = fallbackMime.toLowerCase().trim();
    if (cleaned.includes("png")) return { mime: "image/png", ext: ".png" };
    if (cleaned.includes("jpeg") || cleaned.includes("jpg")) return { mime: "image/jpeg", ext: ".jpg" };
    if (cleaned.includes("webp")) return { mime: "image/webp", ext: ".webp" };
    if (cleaned.includes("gif")) return { mime: "image/gif", ext: ".gif" };
    if (cleaned.includes("avif")) return { mime: "image/avif", ext: ".avif" };
  }

  return { mime: "image/jpeg", ext: ".jpg" };
}

/**
 * Saves an image buffer to MongoDB Atlas Media collection.
 * Optionally attempts to sync to local disk in development.
 */
export async function saveMediaBuffer(
  buffer: Buffer,
  originalFilename?: string,
  explicitMime?: string
): Promise<SaveMediaResult> {
  await connectToDatabase();

  const { mime, ext } = detectImageFormat(buffer, explicitMime);

  // Generate safe unique filename
  let filename = originalFilename
    ? path.basename(originalFilename).replace(/[^a-zA-Z0-9._-]/g, "_")
    : "";

  if (!filename || filename.startsWith("blob:") || filename.includes("__LOCAL_")) {
    const randomHex = crypto.randomBytes(12).toString("hex");
    filename = `img-${Date.now()}-${randomHex}${ext}`;
  } else {
    // If filename has no extension or mismatched extension, ensure correct one
    const currentExt = path.extname(filename).toLowerCase();
    if (!currentExt) {
      filename = `${filename}${ext}`;
    }
  }

  // Store raw binary buffer in MongoDB Atlas Media collection
  await Media.findOneAndUpdate(
    { filename },
    {
      filename,
      contentType: mime,
      data: buffer,
      size: buffer.length,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Best effort sync to local public/uploads for local development convenience
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const diskPath = path.join(uploadDir, filename);
    fs.writeFileSync(diskPath, buffer);
  } catch {
    // Silently ignore in read-only serverless environments (Vercel)
  }

  return {
    filename,
    url: `/uploads/${filename}`,
    contentType: mime,
    size: buffer.length,
  };
}

/**
 * Retrieves raw image buffer from MongoDB Atlas.
 * Falls back to disk and auto-imports if found locally.
 */
export async function getMediaBuffer(filename: string): Promise<GetMediaResult | null> {
  const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, "");
  if (!safeFilename) return null;

  try {
    await connectToDatabase();
    const media = await Media.findOne({ filename: safeFilename }).lean();

    if (media && media.data) {
      const buffer = Buffer.isBuffer(media.data) ? media.data : Buffer.from(media.data);
      return {
        data: buffer,
        contentType: media.contentType || "image/jpeg",
        size: media.size || buffer.length,
      };
    }
  } catch (dbErr) {
    console.error(`[mediaStorage] Error querying media "${safeFilename}":`, dbErr);
  }

  // Fallback: check if file is on local disk (legacy uploads)
  try {
    const diskPath = path.join(process.cwd(), "public", "uploads", safeFilename);
    if (fs.existsSync(diskPath)) {
      const fileBuffer = fs.readFileSync(diskPath);
      const { mime } = detectImageFormat(fileBuffer);

      // Asynchronously backfill into MongoDB Atlas
      Media.findOneAndUpdate(
        { filename: safeFilename },
        {
          filename: safeFilename,
          contentType: mime,
          data: fileBuffer,
          size: fileBuffer.length,
        },
        { upsert: true }
      ).catch((err) => console.error(`[mediaStorage] Auto-sync to Atlas failed for ${safeFilename}:`, err));

      return {
        data: fileBuffer,
        contentType: mime,
        size: fileBuffer.length,
      };
    }
  } catch {
    // Local file doesn't exist
  }

  return null;
}

/**
 * Migration helper: Imports all images in public/uploads to MongoDB Atlas
 */
export async function migrateLocalUploadsToAtlas(): Promise<{ migrated: number; total: number; errors: number }> {
  await connectToDatabase();

  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    return { migrated: 0, total: 0, errors: 0 };
  }

  const files = fs.readdirSync(uploadDir);
  let migrated = 0;
  let errors = 0;

  for (const file of files) {
    try {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);
      if (!stats.isFile()) continue;

      const buffer = fs.readFileSync(filePath);
      const { mime } = detectImageFormat(buffer);

      await Media.findOneAndUpdate(
        { filename: file },
        {
          filename: file,
          contentType: mime,
          data: buffer,
          size: buffer.length,
        },
        { upsert: true }
      );
      migrated++;
    } catch (err) {
      console.error(`[migrateLocalUploads] Error importing ${file}:`, err);
      errors++;
    }
  }

  return { migrated, total: files.length, errors };
}
