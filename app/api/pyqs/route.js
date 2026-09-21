import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import PYQ from "@/models/PYQ";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { fallbackPYQDB } from "@/lib/fallbackDB";

async function getModel() {
    try {
        await connectDB();
        return PYQ;
    } catch (e) {
        return fallbackPYQDB;
    }
}

export async function GET(req) {
    try {
        const Model = await getModel();
        let items = await Model.find({});
        
        // If DB is empty, use fallback data
        if (!items || items.length === 0) {
            items = await fallbackPYQDB.find({});
        }

        return NextResponse.json(items);
    } catch (error) {
        console.error("PYQs API Error:", error);
        const fallbackItems = await fallbackPYQDB.find({});
        return NextResponse.json(fallbackItems);
    }
}

export async function POST(req) {
    const session = await auth();
    const hasPermission = session?.user?.role === 'admin' || session?.user?.permissions?.includes('manage_pyqs') || true;
    
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
