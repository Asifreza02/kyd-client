import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import faqData from "@/lib/faqData.json";

export async function POST(req) {
    try {
        const { message, history } = await req.json();

        if (!message) {
            return NextResponse.json(
                { error: "Message prompt is required" },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not defined. Please set it in your environment variables." },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        const systemInstruction = `You are the official AI Assistant for "Know Your Dept (KYD)", a comprehensive university department portal.
Your primary role is to assist students, teachers, and guests with accurate information about department notes, PYQs (previous year questions), faculty profiles, upcoming events, student communities, and academic policies.

Use the following FAQ Knowledge Base as your authoritative source of truth:
${JSON.stringify(faqData, null, 2)}

Instructions:
1. Provide concise, friendly, and structured responses (use markdown lists, bold text, and line breaks where helpful).
2. If a query directly matches or relates to the FAQ knowledge base, summarize or present the information clearly.
3. If asked about faculty, include their full name, title, office location, research domain, and email if available in the database.
4. If asked about notes or PYQs, guide the user on how to access them in the platform based on the FAQ data.
5. If the user asks a general academic question not directly in the FAQ, answer helpfully while maintaining your identity as the KYD AI Assistant.
6. If you cannot answer a specific administrative question, direct the user to contact support at support@jisuniversity.edu.`;

        // List of candidate models in case of high demand 503 or model deprecation
        const candidateModels = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-2.0-flash-exp"];
        let text = null;
        let lastError = null;

        let contents = [];
        if (Array.isArray(history) && history.length > 0) {
            history.forEach(item => {
                if (item.sender === 'user') {
                    contents.push({ role: 'user', parts: [{ text: item.text }] });
                } else if (item.sender === 'bot') {
                    contents.push({ role: 'model', parts: [{ text: item.text }] });
                }
            });
        }
        contents.push({ role: 'user', parts: [{ text: message }] });

        for (const modelName of candidateModels) {
            try {
                const model = genAI.getGenerativeModel({
                    model: modelName,
                    systemInstruction: systemInstruction,
                });

                const result = await model.generateContent({ contents });
                const response = await result.response;
                text = response.text();
                if (text) break;
            } catch (err) {
                console.warn(`Gemini model ${modelName} failed, trying fallback:`, err.message);
                lastError = err;
            }
        }

        if (!text) {
            throw lastError || new Error("All Gemini models failed to respond");
        }

        return NextResponse.json({ response: text });
    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json(
            { error: "Failed to process request", details: error.message },
            { status: 500 }
        );
    }
}
