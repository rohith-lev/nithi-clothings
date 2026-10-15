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
      return NextResponse.json({ success: false, error: "Image not found" }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format");

    // Support base64 format conversion if specifically requested
    if (format === "base64" || format === "json") {
      const base64Data = media.data.toString("base64");
      const dataUri = `data:${media.contentType};base64,${base64Data}`;
      return NextResponse.json({
        success: true,
        filename,
        contentType: media.contentType,
        size: media.size,
        dataUri,
        base64: base64Data,
      });
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
    console.error("[api/images/[filename]] Failed to serve image:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
