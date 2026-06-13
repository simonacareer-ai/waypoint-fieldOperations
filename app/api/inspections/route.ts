import { NextResponse } from "next/server";

const MOCK_INSPECTIONS = [
  {
    id: "insp_001",
    workspaceId: "ws_abu_dhabi",
    installationId: "inst_wt_03",
    inspectorId: "user_simona",
    status: "critical",
    measurements: { batteryPct: 14, temperatureC: 32, vibrationMmS: 8.2 },
    notes: "Battery below threshold.",
    tags: ["battery", "critical"],
    inspectedAt: "2026-01-12T10:30:00.000Z",
    syncState: "synced",
  },
  {
    id: "insp_002",
    workspaceId: "ws_abu_dhabi",
    installationId: "inst_wt_11",
    inspectorId: "user_simona",
    status: "attention",
    measurements: { temperatureC: 38 },
    notes: "Temperature elevated.",
    tags: ["temperature"],
    inspectedAt: "2026-01-12T08:15:00.000Z",
    syncState: "synced",
  },
];

export async function GET() {
  return NextResponse.json({ items: MOCK_INSPECTIONS, total: MOCK_INSPECTIONS.length });
}

export async function POST(request: Request) {
  const body = await request.json();
  const newInspection = {
    id: `insp_${Date.now()}`,
    ...body,
    syncState: "synced",
    createdAt: new Date().toISOString(),
  };
  return NextResponse.json(newInspection, { status: 201 });
}
