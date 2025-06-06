import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  // const isAuthenticated = !!token;
  const role = token?.role;

  const url = req.nextUrl;

  const authPage = url.pathname.startsWith("/login") || url.pathname.startsWith("/register");
  const protectedPage = url.pathname.startsWith("/dashboard") || url.pathname.startsWith("/checkout");

  if (isAuthenticated && authPage) {
    // Redirect to homepage if customer
    const redirectTarget = role === "admin" ? "/dashboard" : "/";
    return NextResponse.redirect(new URL(redirectTarget, req.url));
  }

  if (!isAuthenticated && protectedPage) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Block customers from accessing admin dashboard
  if (isAuthenticated && url.pathname.startsWith("/dashboard") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/profile", "/checkout"],
};
