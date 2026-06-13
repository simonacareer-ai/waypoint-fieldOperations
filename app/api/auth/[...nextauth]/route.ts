import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "auth endpoint placeholder" });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({
    user: {
      id: "user_simona",
      name: "Simona D.",
      email: "simona@waypoint.io",
      role: "technician",
    },
    token: "mock-jwt-token",
  });
}
