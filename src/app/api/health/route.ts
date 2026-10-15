import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  const start = Date.now();
  let dbStatus = "disconnected";
  let dbError: string | null = null;

  try {
    await connectToDatabase();
    dbStatus = mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  } catch (err: any) {
    dbStatus = "error";
    dbError = err?.message || "Unknown DB error";
  }

  const latencyMs = Date.now() - start;

  return NextResponse.json({
    status: dbStatus === "connected" ? "ok" : "degraded",
    time: new Date().toISOString(),
    database: dbStatus,
    latencyMs,
    ...(dbError ? { dbError } : {}),
  }, {
    status: dbStatus === "connected" ? 200 : 503,
  });
}
