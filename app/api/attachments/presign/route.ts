import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { fileName } = body;

  return NextResponse.json({
    uploadUrl: `https://storage.example.com/presigned/${fileName}`,
    fileUrl: `https://storage.example.com/attachments/${fileName}`,
  });
}
