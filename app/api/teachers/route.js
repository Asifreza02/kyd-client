import { teachersData } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(teachersData);
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const teacher = await Teacher.create(body);
    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
