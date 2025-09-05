import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

// Force Node.js runtime
export const runtime = "nodejs";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value;
  const pathname = request.nextUrl.pathname;

  // Skip middleware for API routes
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Protected routes
  const protectedRoutes = [
    "/dashboard",
    "/catches",
    "/spots",
    "/events",
    "/collection",
  ];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Auth pages
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // Handle protected routes
  if (isProtectedRoute) {
    if (!token) {
      console.log("Middleware: No token found, redirecting to login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const payload = verifyToken(token);
    if (!payload) {
      console.log("Middleware: Invalid token, redirecting to login");
      console.log("Token:", token?.substring(0, 50) + "...");
      const response = NextResponse.redirect(new URL("/login", request.url));
      // Clear cookie with same settings as login route
      response.cookies.set("auth-token", "", {
        httpOnly: false,
        secure: false,
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
      return response;
    }
  }

  // Redirect authenticated users away from auth pages
  if (token && isAuthPage) {
    const payload = verifyToken(token);
    if (payload) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/catches/:path*",
    "/spots/:path*",
    "/events/:path*",
    "/collection/:path*",
    "/login",
    "/signup",
  ],
};
