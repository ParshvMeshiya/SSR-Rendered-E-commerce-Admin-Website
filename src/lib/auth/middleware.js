import { NextResponse } from 'next/server';
import { verifyToken } from './jwt';
export async function authenticate(request) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        isAuthenticated: false,
        error: 'No token provided',
      };
    }
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);

    if (!decoded) {
      return {
        isAuthenticated: false,
        error: 'Invalid or expired token',
      };
    }

    return {
      isAuthenticated: true,
      user: decoded,
    };
  } catch (error) {
    return {
      isAuthenticated: false,
      error: 'Authentication failed',
    };
  }
}
export function requireAdmin(user) {
  if (!user || user.role !== 'admin') {
    return false;
  }
  return true;
}
export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  );
}
export function forbiddenResponse(message = 'Forbidden') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 403 }
  );
}