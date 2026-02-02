import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()
        const { title, slug, description, content, techStack, imageUrl, images, demoUrl, githubUrl, featured, order } = body

        const project = await prisma.project.update({
            where: { id },
            data: {
                title,
                slug,
                description,
                content,
                techStack: Array.isArray(techStack) ? techStack : [],
                imageUrl,
                images: Array.isArray(images) ? images : [],
                demoUrl,
                githubUrl,
                featured: !!featured,
                order: parseInt(order) || 0,
                updatedAt: new Date()
            }
        })
        return NextResponse.json(project)
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
        await prisma.project.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
    }
}
