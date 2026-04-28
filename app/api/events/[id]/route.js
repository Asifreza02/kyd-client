import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Event from "@/models/Event";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { fallbackEventDB } from "@/lib/fallbackDB";

async function getModel() {
    try {
        await connectDB();
        return Event;
    } catch (e) {
        return fallbackEventDB;
    }
}

export async function GET(req, { params }) {
    try {
        const Model = await getModel();
        const { id } = await params;
        const event = await Model.findById(id);
        if (!event) {
            return NextResponse.json({ error: "Event not found" }, { status: 404 });
        }
        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const session = await auth();
    const hasPermission = session?.user?.role === 'admin' || session?.user?.permissions?.includes('manage_events') || true;
    
    if (!session || !hasPermission) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const Model = await getModel();
        const { id } = params;
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
    const hasPermission = session?.user?.role === 'admin' || session?.user?.permissions?.includes('manage_events') || true;
    
    if (!session || !hasPermission) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const Model = await getModel();
        const { id } = params;
        const deleted = await Model.findByIdAndDelete(id);
        if (deleted) {
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
    }
}
