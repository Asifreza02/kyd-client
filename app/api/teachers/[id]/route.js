import { connectDB } from "@/lib/dbConnect";
import Teacher from "@/models/Teachers";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const teacher = await Teacher.findOne({ id: id });
        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }
        return NextResponse.json(teacher);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const body = await request.json();
        const teacher = await Teacher.findOneAndUpdate({ id: id }, body, {
            new: true,
            runValidators: true,
        });
        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }
        return NextResponse.json(teacher);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    try {
        await connectDB();
        const { id } = await params;
        const teacher = await Teacher.findOneAndDelete({ id: id });
        if (!teacher) {
            return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Teacher deleted successfully" });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
