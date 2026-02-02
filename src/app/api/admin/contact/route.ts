import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const contacts = await prisma.contact.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(contacts)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
    }
}

// Pass ID if needed to mark specific one read
export async function POST(request: Request) {
    // Public contact submission usually, but this is admin route. 
    // We keep public submission in /api/contact, this is Admin management.
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
