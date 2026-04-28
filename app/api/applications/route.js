import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Application from "@/models/Application";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { fallbackApplicationDB, fallbackCommunityDB } from "@/lib/fallbackDB";
import Community from "@/models/Community";
async function getApplicationModel() {
    try {
        await connectDB();
        return Application;
    } catch (e) {
        return fallbackApplicationDB;
    }
}

async function getCommunityModel() {
    try {
        await connectDB();
        return Community;
    } catch (e) {
        return fallbackCommunityDB;
    }
}

export async function GET(req) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const communityId = searchParams.get('communityId');
    
    try {
        const Model = await getApplicationModel();
        
        let applications = [];
        if (communityId) {
            const CommModel = await getCommunityModel();
            const community = await CommModel.findById(communityId);
            
            if (!community) {
                return NextResponse.json({ error: "Community not found" }, { status: 404 });
            }
            
            const isLeader = community.leaderId === session.user.id;
            const isManager = community.managers?.includes(session.user.id);
            const isAdmin = session.user.role === 'admin';
            
            if (!isLeader && !isManager && !isAdmin) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
            }
            
            if (Model === fallbackApplicationDB) {
                applications = (await Model.find()).filter(a => a.communityId === communityId);
            } else {
                applications = await Model.find({ communityId }).sort({ createdAt: -1 });
            }
        } else if (session.user.role === 'admin') {
            if (Model !== fallbackApplicationDB) {
                applications = await Model.find({}).populate('communityId', 'name lead').sort({ createdAt: -1 });
            } else {
                applications = await Model.find({});
            }
        } else {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        
        return NextResponse.json(applications);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}

export async function POST(req) {
    const session = await auth();
    // Use test session data if unauthenticated for testing purpose
    const userId = session?.user?.id || 'test_user_1';
    const userName = session?.user?.name || 'Test User';
    const rollNumber = session?.user?.rollNumber || 'TEST1234';

    try {
        const Model = await getApplicationModel();
        const body = await req.json();
        
        // Check if application already exists for this user and community
        const existingApp = await Model.findOne({ 
            communityId: body.communityId, 
            userId: userId 
        });

        if (existingApp) {
            return NextResponse.json({ error: "You have already applied to this community." }, { status: 400 });
        }

        const newApp = await Model.create({
            ...body,
            userId,
            userName,
            rollNumber
        });
        return NextResponse.json(newApp, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to submit application" }, { status: 500 });
    }
}

export async function PUT(req) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const Model = await getApplicationModel();
        const CommModel = await getCommunityModel();
        const { id, status } = await req.json();
        
        if (!['pending', 'approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: "Invalid status" }, { status: 400 });
        }

        const app = await Model.findById(id);
        if (!app) {
            return NextResponse.json({ error: "Application not found" }, { status: 404 });
        }

        const communityIdToFind = typeof app.communityId === 'object' ? app.communityId._id : app.communityId;
        const community = await CommModel.findById(communityIdToFind);
        if (!community) {
            return NextResponse.json({ error: "Community not found" }, { status: 404 });
        }

        const isLeader = community.leaderId === session.user.id;
        const isManager = community.managers?.includes(session.user.id);
        
        if (!isLeader && !isManager) {
            return NextResponse.json({ error: "Unauthorized to approve/reject" }, { status: 403 });
        }

        const updated = await Model.findByIdAndUpdate(id, { status }, { new: true });
        
        if (status === 'approved') {
            if (!community.members.includes(app.userId)) {
                await CommModel.findByIdAndUpdate(communityIdToFind, {
                    $push: { members: app.userId },
                    $inc: { memberCount: 1 }
                });
            }
        }
        
        if (updated) {
            return NextResponse.json(updated);
        }
        return NextResponse.json({ error: "Application not found" }, { status: 404 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
    }
}
