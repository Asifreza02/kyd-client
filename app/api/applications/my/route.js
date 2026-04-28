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
        return NextResponse.json([], { status: 200 });
    }

    try {
        const Model = await getApplicationModel();
        const userId = session.user.id || session.user.email;
        
        // For Mongoose model, use query filter
        let applications;
        if (Model !== fallbackApplicationDB) {
            applications = await Model.find({ userId, status: 'approved' })
                .populate('communityId', 'name lead category image memberCount description tags');
        } else {
            // For fallback DB, get all then filter
            const all = await Model.find();
            applications = all.filter(app => app.userId === userId && app.status === 'approved');
        }
        
        return NextResponse.json(applications);
    } catch (error) {
        console.error("My applications error:", error);
        return NextResponse.json([], { status: 200 });
    }
}
