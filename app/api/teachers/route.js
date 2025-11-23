import { connectDB } from "@/lib/dbConnect";
import Teacher from "@/models/Teachers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const teachers = await Teacher.find({});
    return NextResponse.json(teachers);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
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
