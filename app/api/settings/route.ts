import { NextResponse } from "next/server";

const mockSettings = {
  id: "settings_001",
  userId: "user_simona",
  themeMode: "light",
  autoSync: true,
  syncOnWifiOnly: false,
  notificationsEnabled: true,
  reducedMotion: false,
};

export async function GET() {
  return NextResponse.json(mockSettings);
}

export async function PATCH(request: Request) {
  const body = await request.json();
  return NextResponse.json({ ...mockSettings, ...body, updatedAt: new Date().toISOString() });
}
