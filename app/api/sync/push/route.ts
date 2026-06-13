import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const results = (body.items || []).map((item: { entityType: string; entityId: string }) => ({
    entityType: item.entityType,
    entityId: item.entityId,
    status: "synced",
    serverId: `server_${item.entityId}`,
  }));

  return NextResponse.json({ results });
}
