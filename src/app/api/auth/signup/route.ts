import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    id: "signup",
  });
}

export async function POST(request: Request) {
  const res = await request.json();
  return NextResponse.json({ res });
}
