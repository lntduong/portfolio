import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { position, company, location, startDate, endDate, description, techStack, order } = body

        const experience = await prisma.experience.update({
            where: { id },
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
        return NextResponse.json({ error: "Failed to update entry" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.experience.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
    }
}
