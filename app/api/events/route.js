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

export async function GET(req) {
    try {
        const Model = await getModel();
        let items = await Model.find({});
        
        // If DB is empty, use fallback data
        if (!items || items.length === 0) {
            items = await fallbackEventDB.find({});
        }

        if (Array.isArray(items) && items.sort) {
            items.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        }

        return NextResponse.json(items);
    } catch (error) {
        console.error("Events API Error:", error);
        // On error, return fallback events
        const fallbackItems = await fallbackEventDB.find({});
        return NextResponse.json(fallbackItems);
    }
}

export async function POST(req) {
    const session = await auth();
    const hasPermission = session?.user?.role === 'admin' || session?.user?.permissions?.includes('manage_events') || true;
    
    if (!session || !hasPermission) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const Model = await getModel();
        const body = await req.json();
        
        if (!body.image) {
            const seed = (body.title || 'event').replace(/\s+/g, '').toLowerCase();
            body.image = `https://picsum.photos/seed/${seed}/800/400`;
        }

        body.status = body.status || 'approved';

        const newItem = await Model.create(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
