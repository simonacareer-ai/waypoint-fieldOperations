import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json([
    { id: "ws_abu_dhabi", name: "Abu Dhabi Site", code: "AD-WF", region: "UAE" },
    { id: "ws_dubai", name: "Dubai North", code: "DB-NF", region: "UAE" },
    { id: "ws_riyadh", name: "Riyadh Solar Farm", code: "RY-SF", region: "KSA" },
  ]);
}
