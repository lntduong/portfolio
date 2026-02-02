import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"

const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    subject: z.string().optional(),
    message: z.string().min(10),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const validation = contactSchema.safeParse(body)

        if (!validation.success) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 })
        }

        const { name, email, subject, message } = validation.data

        const contact = await prisma.contact.create({
            data: {
                name,
                email,
                subject: subject || null,
                message,
            }
        })

        return NextResponse.json({ success: true, id: contact.id })
    } catch (error) {
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
    }
}
