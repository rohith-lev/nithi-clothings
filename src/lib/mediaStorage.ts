import crypto from "crypto";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";
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
  const cleanExt = ext || (originalFilename ? path.extname(originalFilename).toLowerCase() : ".jpg");
  const randomHex = crypto.randomBytes(6).toString("hex");
  const rawBase = originalFilename
    ? path.basename(originalFilename, path.extname(originalFilename)).replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30)
    : "img";
  const filename = `${rawBase || "img"}-${Date.now()}-${randomHex}${cleanExt}`;

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
      const binaryData = media.data as unknown as { value?: (asRaw: boolean) => Buffer | string };
      const buffer = Buffer.isBuffer(media.data)
        ? media.data
        : typeof binaryData.value === "function"
          ? Buffer.from(binaryData.value(true))
          : Buffer.from(media.data);
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

/**
 * Delete specific image files from MongoDB Atlas Media collection and local uploads disk
 */
export async function deleteMediaFiles(filenamesOrUrls: string[]): Promise<number> {
  if (!Array.isArray(filenamesOrUrls) || filenamesOrUrls.length === 0) return 0;
  await connectToDatabase();

  const filenames = Array.from(
    new Set(
      filenamesOrUrls
        .map((url) => {
          if (!url || typeof url !== "string") return "";
          const cleaned = url.split("?")[0].split("#")[0];
          return path.basename(cleaned).replace(/[^a-zA-Z0-9._-]/g, "");
        })
        .filter(
          (fn) =>
            fn &&
            fn.length > 0 &&
            (fn.endsWith(".jpg") ||
              fn.endsWith(".jpeg") ||
              fn.endsWith(".png") ||
              fn.endsWith(".webp") ||
              fn.endsWith(".avif") ||
              fn.endsWith(".gif"))
        )
    )
  );

  if (filenames.length === 0) return 0;

  // 1. Delete from MongoDB Media collection
  const delRes = await Media.deleteMany({ filename: { $in: filenames } });

  // 2. Delete from local disk public/uploads
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  filenames.forEach((fn) => {
    try {
      const diskPath = path.join(uploadDir, fn);
      if (fs.existsSync(diskPath)) {
        fs.unlinkSync(diskPath);
      }
    } catch {}
  });

  return delRes.deletedCount || 0;
}

/**
 * Permanently deletes ALL media from MongoDB Atlas Media collection and local disk
 */
export async function deleteAllMedia(): Promise<number> {
  await connectToDatabase();
  const res = await Media.deleteMany({});

  // Drop and recreate empty collection to reclaim physical disk allocation in WiredTiger/Atlas
  try {
    const db = mongoose.connection.db;
    if (db) {
      await db.collection("media").drop();
      await db.createCollection("media");
      await db.collection("media").createIndex({ filename: 1 }, { unique: true });
    }
  } catch (err) {
    console.warn("[mediaStorage] Reclaim disk storage on drop failed:", err);
  }

  // Clean disk uploads
  try {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      for (const file of files) {
        if (!file.startsWith(".")) {
          try {
            fs.unlinkSync(path.join(uploadDir, file));
          } catch {}
        }
      }
    }
  } catch {}

  return res.deletedCount || 0;
}

/**
 * Deletes all media documents from MongoDB Atlas that are no longer referenced by any product
 */
export async function deleteOrphanedMedia(): Promise<number> {
  await connectToDatabase();
  const Product = (await import("./models/Product")).default;
  const products = await Product.find({}).lean();

  const referencedFilenames = new Set<string>();
  const addUrl = (url: unknown) => {
    if (typeof url === "string" && url.trim()) {
      const fn = path.basename(url.split("?")[0].split("#")[0]).replace(/[^a-zA-Z0-9._-]/g, "");
      if (fn) referencedFilenames.add(fn);
    }
  };

  products.forEach((p: any) => {
    addUrl(p.coverImage);
    if (Array.isArray(p.images)) p.images.forEach(addUrl);
    if (Array.isArray(p.colorOptions)) p.colorOptions.forEach((co: any) => addUrl(co?.image));
    if (Array.isArray(p.variants)) p.variants.forEach((v: any) => addUrl(v?.image));
    if (Array.isArray(p.productTypes)) p.productTypes.forEach((pt: any) => addUrl(pt?.image));
    if (p.colorImages && typeof p.colorImages === "object") {
      Object.values(p.colorImages).forEach(addUrl);
    }
  });

  const allMedia = await Media.find({}, { filename: 1 }).lean();
  const orphanedFilenames = allMedia
    .map((m: any) => m.filename)
    .filter((fn: string) => !referencedFilenames.has(fn));

  if (orphanedFilenames.length === 0) return 0;

  const delRes = await Media.deleteMany({ filename: { $in: orphanedFilenames } });

  // Clean local files
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  orphanedFilenames.forEach((fn: string) => {
    try {
      const diskPath = path.join(uploadDir, fn);
      if (fs.existsSync(diskPath)) fs.unlinkSync(diskPath);
    } catch {}
  });

  return delRes.deletedCount || 0;
}
