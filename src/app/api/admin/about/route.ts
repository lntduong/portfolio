import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const abouts = await prisma.about.findMany({
            orderBy: { order: 'asc' }
        })
        return NextResponse.json(abouts)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { key, title, content, order } = body

        const about = await prisma.about.create({
            data: {
                key,
                title,
                content,
                order: parseInt(order) || 0,
                updatedAt: new Date()
            }
        })
        return NextResponse.json(about)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
    }
}
