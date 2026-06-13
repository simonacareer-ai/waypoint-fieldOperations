import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({
    id,
    workspaceId: "ws_abu_dhabi",
    installationId: "inst_wt_03",
    inspectorId: "user_simona",
    status: "critical",
    measurements: { batteryPct: 14, temperatureC: 32, vibrationMmS: 8.2 },
    notes: "Battery below threshold.",
    tags: ["battery", "critical"],
    inspectedAt: "2026-01-12T10:30:00.000Z",
    syncState: "synced",
  });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  return NextResponse.json({ id, ...body, updatedAt: new Date().toISOString() });
}
