import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { order: 'asc' }
        })
        return NextResponse.json(skills)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, category, level, icon, order } = body

        const skill = await prisma.skill.create({
            data: {
                name,
                category,
                level: parseInt(level) || 80,
                icon,
                order: parseInt(order) || 0,
            }
        })
        return NextResponse.json(skill)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
    }
}
