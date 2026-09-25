import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { validateImportData, executeSafeImport } from "@/services/backupExportImportService";

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const { action, records, collection, mode } = await request.json();

    if (action === "validate") {
      const validationResult = validateImportData(records || [], collection || "products");
      return NextResponse.json({ success: true, validation: validationResult });
    } else if (action === "execute") {
      const importResult = await executeSafeImport(records || [], collection || "products", mode || "add_new");
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
