import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const experience = await prisma.experience.findMany({
            orderBy: { order: 'asc' },
            include: {
                projects: {
                    orderBy: { order: 'asc' }
                }
            }
        })
        return NextResponse.json(experience)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { position, company, location, startDate, endDate, description, techStack, order } = body

        // Create base experience
        const experience = await prisma.experience.create({
            data: {
                position,
                company,
                location,
                startDate,
                endDate,
                description,
                techStack: Array.isArray(techStack) ? techStack : [],
                order: parseInt(order) || 0,
                updatedAt: new Date()
            }
        })
        return NextResponse.json(experience)
    } catch (error) {
        console.error("Experience Create Error:", error)
        return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
    }
}
