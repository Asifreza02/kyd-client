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
        // If it has status, maybe filter? For now just return all.
        // Frontend will filter pending vs approved based on role.
        const items = await Model.find({});
        if (Model !== fallbackPYQDB) {
            if (items.sort) items.sort((a, b) => b.createdAt - a.createdAt);
        }
        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
    }
}

export async function POST(req) {
    const session = await auth();
    // Temporarily bypass authentication for testing
    const hasPermission = session?.user?.role === 'admin' || session?.user?.permissions?.includes('manage_pyqs') || true;
    
    if (!session || !hasPermission) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const Model = await getModel();
        const body = await req.json();
        
        const newItem = await Model.create(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
