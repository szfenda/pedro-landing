import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Sprawdź czy to protected route
  if (request.nextUrl.pathname.startsWith('/dashboard') ||
      request.nextUrl.pathname.startsWith('/billing') ||
      request.nextUrl.pathname.startsWith('/register-business') ||
      request.nextUrl.pathname.startsWith('/no-business') ||
      request.nextUrl.pathname.startsWith('/resolver')) {
    
    // TODO: Implement proper auth token checking
    // For now, we'll let the client-side auth handle redirects
    // In production, you should verify the auth token here
    
    // const token = request.cookies.get('auth-token')
    // if (!token) {
    //   return NextResponse.redirect(new URL('/auth', request.url))
    // }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/billing/:path*', 
    '/register-business/:path*',
    '/no-business/:path*',
    '/resolver/:path*'
  ]
}