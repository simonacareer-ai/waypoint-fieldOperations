import { NextResponse } from "next/server";

const MOCK_INSTALLATIONS = [
  {
    id: "inst_wt_03",
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
    lastInspectedAt: "2026-01-12T10:30:00.000Z",
  },
  {
    id: "inst_wt_11",
    assetId: "WT-11",
    name: "Wind Turbine 11",
    type: "wind-turbine",
    siteName: "Abu Dhabi Wind Cluster",
    status: "attention",
    batteryPct: 45,
    temperatureC: 38,
    signalStrength: "medium",
    vibrationMmS: 4.1,
    tags: ["temperature"],
    lastInspectedAt: "2026-01-12T08:15:00.000Z",
  },
  {
    id: "inst_ws_04",
    assetId: "WS-04",
    name: "Weather Station 04",
    type: "weather-station",
    siteName: "Abu Dhabi Wind Cluster",
    status: "ok",
    batteryPct: 87,
    temperatureC: 28,
    signalStrength: "strong",
    vibrationMmS: 0.3,
    tags: [],
    lastInspectedAt: "2026-01-11T16:45:00.000Z",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  let items = MOCK_INSTALLATIONS;

  if (status) {
    items = items.filter((i) => i.status === status);
  }
  if (search) {
    items = items.filter(
      (i) =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.assetId.toLowerCase().includes(search.toLowerCase())
    );
  }

  return NextResponse.json({ items, total: items.length });
}
