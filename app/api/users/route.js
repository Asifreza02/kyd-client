import { NextResponse } from "next/server";
import { usersDB, updateUserPermissions, updateUserRole } from "@/lib/users";
import { auth } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
    // Only admins should fetch all users
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    return NextResponse.json(usersDB);
}

export async function PUT(req) {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id, role, permissions } = await req.json();
        
        if (role) {
            updateUserRole(id, role);
        }
        if (permissions) {
            updateUserPermissions(id, permissions);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}
