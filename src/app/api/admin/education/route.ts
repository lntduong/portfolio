import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const education = await prisma.education.findMany({
            orderBy: { order: 'asc' }
        })
        return NextResponse.json(education)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { degree, school, location, startDate, endDate, description, order } = body

        const education = await prisma.education.create({
            data: {
                degree,
                school,
                location,
                startDate,
                endDate,
                description,
                order: parseInt(order) || 0,
                updatedAt: new Date()
            }
        })
        return NextResponse.json(education)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
    }
}
