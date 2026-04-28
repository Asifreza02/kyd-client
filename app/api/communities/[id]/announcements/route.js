import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Community from "@/models/Community";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, { params }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();
        
        const community = await Community.findById(id);
        if (!community) {
            return NextResponse.json({ error: "Community not found" }, { status: 404 });
        }

        // Check if user is lead or manager
        const isLeader = community.leaderId === session.user.id;
        const isManager = community.managers?.includes(session.user.id);
        const isAdmin = session.user.role === 'admin';

        if (!isLeader && !isManager && !isAdmin) {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        // Add announcement
        community.announcements.push({
            title: body.title,
            content: body.content,
            author: session.user.name || community.lead,
            date: new Date()
        });

        await community.save();
        return NextResponse.json(community);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to post announcement" }, { status: 500 });
    }
}
