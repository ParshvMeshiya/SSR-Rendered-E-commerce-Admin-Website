import { NextResponse } from "next/server";
export function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("role")?.value;
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
  if (token && role !== "admin" && isAdminRoute) {
    return NextResponse.redirect(new URL("/", request.url));
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
    "/settings/:path*",
  ],
};
