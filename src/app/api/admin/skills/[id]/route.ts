import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { name, category, level, icon, order } = body

        const skill = await prisma.skill.update({
            where: { id },
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
        return NextResponse.json({ error: "Failed to update entry" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.skill.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
    }
}
