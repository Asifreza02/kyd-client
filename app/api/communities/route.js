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
        console.warn("MongoDB connection failed, using fallback DB");
        return fallbackCommunityDB;
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const showAll = searchParams.get('all') === 'true';

        const Model = await getCommunityModel();
        let communities = await Model.find({});

        // If DB is empty, use fallback communities
        if (!communities || communities.length === 0) {
            communities = await fallbackCommunityDB.find({});
        }

        // Filter approved unless showAll is true
        if (!showAll) {
            communities = communities.filter(c => !c.status || c.status === 'approved');
        }

        return NextResponse.json(communities);
    } catch (error) {
        console.error("GET communities error:", error);
        const fallbackItems = await fallbackCommunityDB.find({});
        return NextResponse.json(fallbackItems);
    }
}

export async function POST(req) {
    const session = await auth();

    if (!session) {
        return NextResponse.json({ error: "You must be logged in to create a community." }, { status: 401 });
    }

    try {
        const Model = await getCommunityModel();
        const body = await req.json();

        if (body.tags && typeof body.tags === 'string') {
            body.tags = body.tags.split(',').map(t => t.trim()).filter(Boolean);
        }

        body.leaderId = session.user.id;
        body.lead = session.user.name;
        body.status = 'pending';
        body.managers = [];
        body.members = [session.user.id];
        body.memberCount = 1;

        if (!body.image) {
            const seed = body.name.replace(/\s+/g, '').toLowerCase();
            body.image = `https://picsum.photos/seed/${seed}/600/400`;
        }

        const newCommunity = await Model.create(body);
        return NextResponse.json(newCommunity, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create community" }, { status: 500 });
    }
}
