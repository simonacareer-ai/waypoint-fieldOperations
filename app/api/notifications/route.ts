import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    {
      id: "notif_001",
      type: "critical",
      title: "Critical: WT-03 Battery Low",
      body: "Wind Turbine 03 battery is at 14%. Immediate inspection recommended.",
      read: false,
      createdAt: "2026-01-12T09:00:00.000Z",
    },
    {
      id: "notif_002",
      type: "sync",
      title: "Sync Complete",
      body: "3 inspections have been synced successfully.",
      read: true,
      createdAt: "2026-01-12T08:30:00.000Z",
    },
  ]);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  return NextResponse.json({ ...body, updatedAt: new Date().toISOString() });
}
