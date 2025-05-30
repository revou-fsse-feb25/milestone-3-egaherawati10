import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    const isAuthenticated = !!token;

    console.log(`[Middleware] ${pathname} - Authenticated: ${isAuthenticated}`);

    // Redirect to login page if user is not authenticated
    if (pathname === '/login' && isAuthenticated) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauth users away from dashboard
    if (pathname.startsWith('/dashboard') && !isAuthenticated) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Apply middleware to login and dashboard routes
export const config = {
    matcher: ['/login', '/dashboard/:path*']
};