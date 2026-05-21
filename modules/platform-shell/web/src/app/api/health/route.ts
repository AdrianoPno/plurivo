import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "active",
    message: "Platform Shell está ativa",
    uptime: process.uptime(),
  });
}
