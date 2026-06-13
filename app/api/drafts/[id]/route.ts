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
    step: "step-2",
    status: "attention",
    measurements: {},
    notes: "",
    tags: [],
    attachmentIds: [],
    syncState: "local-only",
    lastSavedAt: new Date().toISOString(),
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({ id, deleted: true });
}
