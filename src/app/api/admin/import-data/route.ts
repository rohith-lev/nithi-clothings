import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { validateImportData, executeSafeImport } from "@/services/backupExportImportService";
import { requireAdmin } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { errorResponse } = requireAdmin(request);
  if (errorResponse) return errorResponse;

  try {
    await connectToDatabase();
    const body = await request.json().catch(() => ({}));
    const { action, records, collection, mode } = body;

    if (!Array.isArray(records)) {
      return NextResponse.json(
        { success: false, error: "Invalid records format. Array of items is required." },
        { status: 400 }
      );
    }

    if (records.length > 5000) {
      return NextResponse.json(
        { success: false, error: "Batch limit exceeded. Maximum 5000 records per import." },
        { status: 400 }
      );
    }

    const safeCollection = typeof collection === "string" ? collection.replace(/[^a-zA-Z0-9_]/g, "") : "products";
    const safeMode = mode === "overwrite" ? "overwrite" : "add_new";

    if (action === "validate") {
      const validationResult = validateImportData(records, safeCollection);
      return NextResponse.json({ success: true, validation: validationResult });
    } else if (action === "execute") {
      const importResult = await executeSafeImport(records, safeCollection, safeMode);
      return NextResponse.json({ success: true, result: importResult });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action parameter. Must be "validate" or "execute".' },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
