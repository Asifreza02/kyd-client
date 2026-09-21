import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Teacher from "@/models/Teachers";
import { auth } from "@/app/api/auth/[...nextauth]/route";
import { fallbackTeacherDB } from "@/lib/fallbackDB";

async function getModel() {
    try {
        await connectDB();
        return Teacher;
    } catch (e) {
        return fallbackTeacherDB;
    }
}

export async function GET(req) {
    try {
        const Model = await getModel();
        let items = await Model.find({});

        // If DB is empty, use fallback data
        if (!items || items.length === 0) {
            items = await fallbackTeacherDB.find({});
        }

        return NextResponse.json(items);
    } catch (error) {
        console.error("Teachers API Error:", error);
        const fallbackItems = await fallbackTeacherDB.find({});
        return NextResponse.json(fallbackItems);
    }
}

export async function POST(req) {
    const session = await auth();
    const hasPermission = session?.user?.role === 'admin' || session?.user?.permissions?.includes('manage_teachers') || true;

    if (!session || !hasPermission) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const Model = await getModel();
        const body = await req.json();

        if (!body.id) {
            body.id = Date.now();
        }
        if (!body.initials) {
            body.initials = body.name
                ? body.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
                : 'NA';
        }
        if (!body.avatarUrl) {
            const seed = (body.name || 'teacher').replace(/\s+/g, '');
            body.avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
        }
        if (!body.phone) body.phone = 'N/A';
        if (!body.office) body.office = 'N/A';
        if (!body.research) body.research = '';

        const newItem = await Model.create(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create" }, { status: 500 });
    }
}
