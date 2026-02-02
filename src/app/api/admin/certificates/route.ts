import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
    try {
        const certificates = await prisma.certificate.findMany({
            orderBy: { order: 'asc' }
        })
        return NextResponse.json(certificates)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, issuer, date, url, order } = body

        const certificate = await prisma.certificate.create({
            data: {
                name,
                issuer,
                date,
                url,
                order: parseInt(order) || 0,
                updatedAt: new Date()
            }
        })
        return NextResponse.json(certificate)
    } catch (error) {
        return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
    }
}
