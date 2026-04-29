import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const correct = process.env.ADMIN_PASSWORD ?? "proton@123";
  if (password === correct) {
    return NextResponse.json({ success: true });
  }
  return NextResponse.json({ success: false, error: "Wrong password" }, { status: 401 });
}
