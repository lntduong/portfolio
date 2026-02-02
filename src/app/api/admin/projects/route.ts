import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { order: 'asc' }
        })
        return NextResponse.json(projects)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { title, slug, description, content, techStack, imageUrl, images, demoUrl, githubUrl, featured, order } = body

        // Transform comma-separated strings to arrays if needed, or assume frontend sends arrays
        // For simplicity, we assume frontend sends matching types or we handle it here

        const project = await prisma.project.create({
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
        console.error("Project Create Error:", error)
        return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
    }
}
