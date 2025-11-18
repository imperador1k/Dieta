import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which paths require authentication
const protectedPaths = [
  '/',
  '/meals',
  '/plan',
  '/log',
  '/profile',
  '/progress',
  '/gallery',
];

// Define which paths are public (don't require authentication)
const publicPaths = [
  '/auth/login',
  '/auth/signup',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public paths
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }
  
  // Check if path requires authentication
  const isProtectedPath = protectedPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );
  
  if (isProtectedPath) {
    // In a real implementation, you would check the user's auth status here
    // For now, we'll allow all requests to proceed
    // This is a placeholder implementation
    console.log('Checking auth for protected path:', pathname);
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};