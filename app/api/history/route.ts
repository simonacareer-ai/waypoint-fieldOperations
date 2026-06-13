import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "25");

  const items = [
    {
      id: "insp_001",
      installationId: "inst_wt_03",
      installationName: "Wind Turbine 03",
      assetId: "WT-03",
      status: "critical",
      inspector: "Simona D.",
      inspectedAt: "2026-01-12T10:30:00.000Z",
      notes: "Battery below threshold.",
    },
    {
      id: "insp_002",
      installationId: "inst_wt_11",
      installationName: "Wind Turbine 11",
      assetId: "WT-11",
      status: "attention",
      inspector: "Simona D.",
      inspectedAt: "2026-01-12T08:15:00.000Z",
      notes: "Temperature elevated.",
    },
  ];

  return NextResponse.json({ items, total: items.length, page, pageSize });
}
