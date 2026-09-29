import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAllBackupData } from "@/services/backupExportImportService";

export async function GET() {
  try {
    await connectToDatabase();
    const data = await getAllBackupData();
    const fileName = `Nithi_Collection_Database_Backup_${new Date()
      .toISOString()
      .split("T")[0]}.json`;

    return new NextResponse(JSON.stringify(data, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("JSON Export Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
