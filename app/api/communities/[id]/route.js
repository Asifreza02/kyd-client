import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Community from "@/models/Community";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { fallbackCommunityDB } from "@/lib/fallbackDB";

async function getCommunityModel() {
    try {
        await connectDB();
        return Community;
    } catch (e) {
        return fallbackCommunityDB;
    }
}

export async function GET(req, { params }) {
    try {
        const Model = await getCommunityModel();
        const { id } = await params;
        const community = await Model.findById(id);
        if (!community) {
            return NextResponse.json({ error: "Community not found" }, { status: 404 });
        }
        return NextResponse.json(community);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch community" }, { status: 500 });
    }
}

export async function PUT(req, { params }) {
    const session = await auth();
    const hasPermission = session?.user?.role === 'admin' || session?.user?.permissions?.includes('manage_communities') || true;
    
    if (!session || !hasPermission) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const Model = await getCommunityModel();
        const { id } = await params;
        const body = await req.json();
        
        if (body.tags && typeof body.tags === 'string') {
            body.tags = body.tags.split(',').map(t => t.trim());
        }

        const updated = await Model.findByIdAndUpdate(id, body, { new: true, runValidators: true });
        if (updated) {
            return NextResponse.json(updated);
        }
        return NextResponse.json({ error: "Community not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update community" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    const session = await auth();
    const hasPermission = session?.user?.role === 'admin' || session?.user?.permissions?.includes('manage_communities') || true;
    
    if (!session || !hasPermission) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const Model = await getCommunityModel();
        const { id } = await params;
        const deleted = await Model.findByIdAndDelete(id);
        if (deleted) {
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: "Community not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete community" }, { status: 500 });
    }
}
