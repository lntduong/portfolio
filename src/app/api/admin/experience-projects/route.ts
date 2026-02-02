import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, description, technologies, teamSize, responsibilities, order, experienceId } = body

        const project = await prisma.experienceProject.create({
            data: {
                name,
                description,
                technologies: Array.isArray(technologies) ? technologies : [],
                teamSize: parseInt(teamSize) || 1,
                responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
                order: parseInt(order) || 0,
                experienceId
            }
        })
        return NextResponse.json(project)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
    }
}
