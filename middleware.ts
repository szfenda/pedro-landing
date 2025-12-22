import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Protected routes that require authentication
  const protectedPaths = [
    '/resolver',
    '/no-business', 
    '/register-business',
    '/billing',
    '/dashboard'
  ]
  
  // Check if current path is protected
  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtectedPath) {
    // Check for auth token in cookies
    const authToken = request.cookies.get('__session')?.value || 
                     request.cookies.get('firebase-auth-token')?.value
    
    // If no auth token found, redirect to auth page
    if (!authToken) {
      const authUrl = new URL('/auth', request.url)
      authUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(authUrl)
    }
  }
  
  // Allow public routes and authenticated protected routes
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Protected routes
    '/resolver/:path*',
    '/no-business/:path*', 
    '/register-business/:path*',
    '/billing/:path*',
    '/dashboard/:path*',
    // API routes (optional protection)
    '/api/stripe/:path*'
  ]
}