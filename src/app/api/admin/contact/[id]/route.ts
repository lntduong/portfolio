import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { read } = body

        const contact = await prisma.contact.update({
            where: { id },
            data: { read: !!read }
        })
        return NextResponse.json(contact)
    } catch (error) {
        return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await prisma.contact.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
    }
}
