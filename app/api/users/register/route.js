import { NextResponse } from "next/server";
import { registerUser } from "@/lib/users";

export async function POST(req) {
    try {
        const { name, rollNumber, password } = await req.json();

        if (!name || !rollNumber || !password) {
            return NextResponse.json(
                { error: "Name, roll number, and password are required." },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters." },
                { status: 400 }
            );
        }

        const result = registerUser({ name, rollNumber, password });

        if (result.error) {
            return NextResponse.json({ error: result.error }, { status: 409 });
        }

        return NextResponse.json(
            { message: "Registration successful! You can now sign in.", user: { id: result.user.id, name: result.user.name, rollNumber: result.user.rollNumber } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json({ error: "Registration failed." }, { status: 500 });
    }
}
