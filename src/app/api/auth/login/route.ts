import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { key } = body

        if (key === process.env.ADMIN_SECRET_KEY) {
            // Valid key
            const cookieStore = await cookies()
            cookieStore.set("admin-token", "authenticated", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 60 * 60 * 24 * 7, // 1 week
            })

            return NextResponse.json({ success: true })
        }

        return NextResponse.json({ error: "Invalid secret key" }, { status: 401 })
    } catch (error) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
