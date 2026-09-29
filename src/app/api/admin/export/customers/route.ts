import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { generateCustomersOnlyExcel } from "@/services/backupExportImportService";

export async function GET() {
  try {
    await connectToDatabase();
    const excelBuffer = await generateCustomersOnlyExcel();
    const fileName = `Nithi_Collection_Customer_Details_${new Date()
      .toISOString()
      .split("T")[0]}.xlsx`;

    return new NextResponse(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Customer Export Error:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
