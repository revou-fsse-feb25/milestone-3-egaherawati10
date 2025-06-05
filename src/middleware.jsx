import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow public paths
  if (pathname.startsWith("/login") || pathname === "/") {
    if (token) {
      // Redirect authenticated users away from login page
      const redirectTo = token.role === "admin" ? "/dashboard" : "/profile";
      return NextResponse.redirect(new URL(redirectTo, req.url));
    }
    return NextResponse.next();
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  // Protect profile routes
  if (pathname.startsWith("/profile")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.role !== "user") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

// Specify paths where middleware runs
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/login"],
};
