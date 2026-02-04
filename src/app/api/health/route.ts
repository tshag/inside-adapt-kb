import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "connected",
        api: "running",
      },
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      services: {
        database: "disconnected",
        api: "running",
      },
      error: "Database connection failed",
    }, { status: 503 });
  }
}

export const runtime = "nodejs";
