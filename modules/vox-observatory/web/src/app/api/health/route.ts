import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    status: "active",
    message: "Vox Observatory está ativo",
    uptime: process.uptime(),
  });
}
