import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { degree, school, location, startDate, endDate, description, order } = body

        const education = await prisma.education.update({
            where: { id },
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
        return NextResponse.json({ error: "Failed to update entry" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.education.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
    }
}
