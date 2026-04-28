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

export async function DELETE(req, { params }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const Model = await getCommunityModel();
        const { id } = await params;
        const { memberId } = await req.json();

        if (!memberId) {
            return NextResponse.json({ error: "Member ID is required" }, { status: 400 });
        }

        const community = await Model.findById(id);
        if (!community) {
            return NextResponse.json({ error: "Community not found" }, { status: 404 });
        }

        const isLeader = community.leaderId === session.user.id;
        const isManager = community.managers.includes(session.user.id);

        if (!isLeader && !isManager) {
            return NextResponse.json({ error: "Only the community leader or managers can remove members" }, { status: 403 });
        }

        const updatedMembers = community.members.filter(m => m !== memberId);

        const updated = await Model.findByIdAndUpdate(id, {
            members: updatedMembers,
            $inc: { memberCount: -1 } // Decrement member count
        }, { new: true });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to remove member" }, { status: 500 });
    }
}
