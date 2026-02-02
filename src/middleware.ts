import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Only protect /admin routes
    if (pathname.startsWith('/admin')) {
        const isAuthenticated = request.cookies.has('admin-token')
        const isLoginPage = pathname === '/admin/login'

        // If not authenticated and trying to access admin pages (except login)
        if (!isAuthenticated && !isLoginPage) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // If authenticated and trying to access login page
        if (isAuthenticated && isLoginPage) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
