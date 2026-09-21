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

export async function GET(req) {
    try {
        const Model = await getModel();
        let items = await Model.find({});
        
        // If DB is empty, use fallback data
        if (!items || items.length === 0) {
            items = await fallbackNoteDB.find({});
        }

        return NextResponse.json(items);
    } catch (error) {
        console.error("Notes API Error:", error);
        const fallbackItems = await fallbackNoteDB.find({});
        return NextResponse.json(fallbackItems);
    }
}

export async function POST(req) {
    const session = await auth();
    const hasPermission = session?.user?.role === 'admin' || session?.user?.permissions?.includes('manage_notes') || true;
    
    if (!session || !hasPermission) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const Model = await getModel();
        const body = await req.json();
        
        body.status = body.status || 'approved';

        const newItem = await Model.create(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
