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

export async function PUT(req, { params }) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const Model = await getCommunityModel();
        const { id } = await params;
        const { managerId } = await req.json();

        if (!managerId) {
            return NextResponse.json({ error: "Manager ID is required" }, { status: 400 });
        }

        const community = await Model.findById(id);
        if (!community) {
            return NextResponse.json({ error: "Community not found" }, { status: 404 });
        }

        if (community.leaderId !== session.user.id) {
            return NextResponse.json({ error: "Only the community leader can add managers" }, { status: 403 });
        }

        if (community.managers.includes(managerId)) {
            return NextResponse.json({ error: "User is already a manager" }, { status: 400 });
        }

        const updated = await Model.findByIdAndUpdate(id, {
            $push: { managers: managerId }
        }, { new: true });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to add manager" }, { status: 500 });
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
        const { managerId } = await req.json();

        if (!managerId) {
            return NextResponse.json({ error: "Manager ID is required" }, { status: 400 });
        }

        const community = await Model.findById(id);
        if (!community) {
            return NextResponse.json({ error: "Community not found" }, { status: 404 });
        }

        if (community.leaderId !== session.user.id) {
            return NextResponse.json({ error: "Only the community leader can remove managers" }, { status: 403 });
        }

        const updatedManagers = community.managers.filter(m => m !== managerId);

        const updated = await Model.findByIdAndUpdate(id, {
            managers: updatedManagers
        }, { new: true });

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: "Failed to remove manager" }, { status: 500 });
    }
}
