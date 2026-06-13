import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const installation = {
    id,
    assetId: "WT-03",
    name: "Wind Turbine 03",
    type: "wind-turbine",
    siteName: "Abu Dhabi Wind Cluster",
    status: "critical",
    batteryPct: 14,
    temperatureC: 32,
    signalStrength: "weak",
    vibrationMmS: 8.2,
    tags: ["battery", "vibration"],
    commissionedAt: "2024-03-15T00:00:00.000Z",
    lastInspectedAt: "2026-01-12T10:30:00.000Z",
  };

  return NextResponse.json(installation);
}
