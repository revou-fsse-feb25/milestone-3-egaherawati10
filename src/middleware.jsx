import { NextResponse } from 'next/server';

export function middleware(request) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token');

    console.log(`[Middleware] Accessing: ${pathname}`);

    const isLoggedIn = !!token;

    // Redirect logged-in users to dashboard
    if (pathname === '/login' && isLoggedIn) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Redirect unauth users away from dashboard
    if (pathname.startsWith('/dashboard') && !isLoggedIn) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// Apply middleware to login and dashboard routes
export const config = {
    matcher: ['/login', '/dashboard/:path*']
};