import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { name, description, technologies, teamSize, responsibilities, order } = body

        const project = await prisma.experienceProject.update({
            where: { id },
            data: {
                name,
                description,
                technologies: Array.isArray(technologies) ? technologies : [],
                teamSize: parseInt(teamSize) || 1,
                responsibilities: Array.isArray(responsibilities) ? responsibilities : [],
                order: parseInt(order) || 0,
            }
        })
        return NextResponse.json(project)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.experienceProject.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
    }
}
