import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SettingsModel from "@/lib/models/Settings";
import { DEFAULT_SETTINGS } from "@/lib/settings-defaults";

export async function GET() {
  try {
    await connectDB();
    const found = await SettingsModel.findOne({ _key: "global" }).lean();
    const settings = { ...DEFAULT_SETTINGS, ...(found ?? {}), _key: "global" };
    return NextResponse.json({ success: true, data: settings });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const settings = await SettingsModel.findOneAndUpdate(
      { _key: "global" },
      { ...body, _key: "global" },
      { upsert: true, new: true, runValidators: true, returnDocument: "after" }
    );
    return NextResponse.json({ success: true, data: settings });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to save settings" }, { status: 500 });
  }
}
