import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

// Get ID from URL since params are passed as second arg in App Router
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { key, title, content, order } = body

        const about = await prisma.about.update({
            where: { id },
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
        return NextResponse.json({ error: "Failed to update entry" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.about.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
    }
}
