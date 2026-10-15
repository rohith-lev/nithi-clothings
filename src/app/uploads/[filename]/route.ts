import { NextRequest, NextResponse } from "next/server";
import { getMediaBuffer } from "@/lib/mediaStorage";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await context.params;
    if (!filename) {
      return new NextResponse("Filename is required", { status: 400 });
    }

    const media = await getMediaBuffer(filename);
    if (!media) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // Convert raw buffer from DB into HTTP response with compatible image MIME type
    return new NextResponse(new Uint8Array(media.data), {
      status: 200,
      headers: {
        "Content-Type": media.contentType,
        "Content-Length": media.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("[uploads/[filename]] Failed to serve image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
