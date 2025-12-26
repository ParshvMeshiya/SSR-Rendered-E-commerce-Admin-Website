// src/lib/auth/middleware.js
import { NextResponse } from 'next/server';
import { verifyToken } from './jwt';

/**
 * Middleware to authenticate API requests
 */
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

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
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

/**
 * Middleware to check if user is admin
 */
export function requireAdmin(user) {
  if (!user || user.role !== 'admin') {
    return false;
  }
  return true;
}

/**
 * Create error response
 */
export function unauthorizedResponse(message = 'Unauthorized') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 401 }
  );
}

/**
 * Create forbidden response
 */
export function forbiddenResponse(message = 'Forbidden') {
  return NextResponse.json(
    { success: false, error: message },
    { status: 403 }
  );
}