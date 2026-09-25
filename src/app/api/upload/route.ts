import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
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
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const rawExt = path.extname(file.name || "") || ".jpg";
          const ext = rawExt.startsWith(".") ? rawExt : `.${rawExt}`;
          const filename = `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`;
          const filePath = path.join(uploadDir, filename);

          fs.writeFileSync(filePath, buffer);
          uploadedUrls.push(`/uploads/${filename}`);
        } else if (typeof item === "string" && item.startsWith("data:image/")) {
          // Base64 string submitted via FormData
          const match = item.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
          if (match) {
            const ext = `.${match[1].replace("+xml", "") || "jpg"}`;
            const buffer = Buffer.from(match[2], "base64");
            const filename = `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`;
            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);
            uploadedUrls.push(`/uploads/${filename}`);
          }
        }
      }
    } else {
      // JSON body with array of base64 strings or images
      const body = await request.json();
      const images: string[] = Array.isArray(body.images) ? body.images : [body.image].filter(Boolean);

      for (const img of images) {
        if (typeof img === "string" && img.startsWith("data:image/")) {
          const match = img.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
          if (match) {
            const ext = `.${match[1].replace("+xml", "") || "jpg"}`;
            const buffer = Buffer.from(match[2], "base64");
            const filename = `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}${ext}`;
            const filePath = path.join(uploadDir, filename);
            fs.writeFileSync(filePath, buffer);
            uploadedUrls.push(`/uploads/${filename}`);
          }
        }
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid image files or data provided" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
      message: `${uploadedUrls.length} file(s) saved successfully`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Upload failed: " + (error as Error).message },
      { status: 500 }
    );
  }
}

