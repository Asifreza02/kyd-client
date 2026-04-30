import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Note from "@/models/Note";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { fallbackNoteDB } from "@/lib/fallbackDB";

async function getModel() {
    try {
        await connectDB();
        return Note;
    } catch (e) {
        return fallbackNoteDB;
    }
}

export async function PUT(req, { params }) {
    const session = await auth();
    const hasPermission = session?.user?.role === 'admin' || session?.user?.permissions?.includes('manage_notes') || true;
    
    if (!session || !hasPermission) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const Model = await getModel();
        const { id } = await params;
        const body = await req.json();
        
        const updated = await Model.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (updated) {
            return NextResponse.json(updated);
        }
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const session = await auth();
    const hasPermission = session?.user?.role === 'admin' || session?.user?.permissions?.includes('manage_notes') || true;
    
    if (!session || !hasPermission) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const Model = await getModel();
        const { id } = await params;
        const deleted = await Model.findByIdAndDelete(id);
        if (deleted) {
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
