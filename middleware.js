import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/" || pathname === "/register";
  const isAdminRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/products") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/settings");

  if (!token && isAdminRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (token && isAdminRoute) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/register",
    "/dashboard/:path*",
    "/products/:path*",
    "/orders/:path*",
    "/settings",
  ],
};
