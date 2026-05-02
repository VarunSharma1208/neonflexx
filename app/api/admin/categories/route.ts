import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CategoryTreeModel from "@/lib/models/CategoryTree";

const DEFAULT_TREE: Record<string, Record<string, string[]>> = {
  Strength: {
    "Free Weights": ["Dumbbells", "Barbells", "Kettlebells", "Weight Plates"],
    "Machines": ["Chest Press", "Leg Press", "Shoulder Press", "Lat Pulldown", "Cable Machine", "Multipurpose"],
    "Benches & Racks": ["Flat Bench", "Incline Bench", "Adjustable Bench", "Power Rack", "Squat Rack"],
    "Functional": ["Resistance Bands", "Battle Ropes", "Suspension Trainer", "Pull-up Bar"],
  },
};

export async function GET() {
  try {
    await connectDB();
    const found = await CategoryTreeModel.findOne().lean() as { tree?: Record<string, Record<string, string[]>> } | null;
    const tree = found?.tree ?? DEFAULT_TREE;
    return NextResponse.json({ success: true, data: tree });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const { tree } = await req.json();
    await CategoryTreeModel.findOneAndUpdate(
      {},
      { tree },
      { upsert: true, new: true }
    );
    return NextResponse.json({ success: true, data: tree });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to save categories" }, { status: 500 });
  }
}
