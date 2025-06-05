import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const isAuthenticated = !!token;
    const userRole = token?.role;

    console.log(`[Middleware] ${pathname} - Auth: ${isAuthenticated}, Role: ${userRole}`);

    // Redirect authenticated users away from login
    if (pathname === '/login' && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Protect dashboard route
    if (pathname.startsWith('/dashboard') && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Admin-only routes
    if (pathname.startsWith('/dashboard/admin')) {
        if (!isAuthenticated || userRole !== 'admin') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    }

    // User-only routes
    if (pathname.startsWith('/dashboard/user')) {
        if (!isAuthenticated || userRole !== 'user') {
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }
    }

    return NextResponse.next();
}

// Apply middleware to login and dashboard routes
export const config = {
    matcher: ['/login', '/dashboard/:path*']
};
