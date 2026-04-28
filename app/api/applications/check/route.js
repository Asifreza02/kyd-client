import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Application from "@/models/Application";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { fallbackApplicationDB } from "@/lib/fallbackDB";

async function getApplicationModel() {
    try {
        await connectDB();
        return Application;
    } catch (e) {
        return fallbackApplicationDB;
    }
}

export async function GET(req) {
    const session = await auth();
    
    if (!session?.user) {
        return NextResponse.json({ isMember: false, error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const communityId = searchParams.get('communityId');

    if (!communityId) {
        return NextResponse.json({ error: "communityId is required" }, { status: 400 });
    }

    try {
        const Model = await getApplicationModel();
        const userId = session.user.id || session.user.email;
        const application = await Model.findOne({ 
            communityId, 
            userId, 
            status: 'approved' 
        });
        
        return NextResponse.json({ isMember: !!application });
    } catch (error) {
        console.error("Membership check error:", error);
        return NextResponse.json({ error: "Failed to check membership" }, { status: 500 });
    }
}
