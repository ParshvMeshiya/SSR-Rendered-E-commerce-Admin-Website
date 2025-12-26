import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;

  const isAuthPage =
    request.nextUrl.pathname === '/' ||
    request.nextUrl.pathname === '/register';

  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/dashboard');

  // Not logged in → trying to access protected page
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Logged in → trying to access login/register
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/register', '/dashboard/:path*'],
};