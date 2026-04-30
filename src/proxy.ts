import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  // Update session and retrieve user in a single optimized pass
  const { response, user } = await updateSession(request)

  const { pathname } = request.nextUrl

  // Only apply protection logic to routes starting with /portal
  if (pathname.startsWith('/portal')) {
    const isPublicRoute = 
      pathname === '/portal/login' || 
      pathname === '/portal/register' || 
      pathname === '/portal/invite'

    // Redirect unauthenticated users to login
    if (!user && !isPublicRoute) {
      const url = request.nextUrl.clone()
      url.pathname = '/portal/login'
      return NextResponse.redirect(url)
    }

    // Protect /portal/admin routes using the already retrieved user
    if (pathname.startsWith('/portal/admin')) {
      const role = user?.app_metadata?.role || user?.user_metadata?.role

      if (role !== 'admin') {
        const url = request.nextUrl.clone()
        url.pathname = '/portal/dashboard'
        return NextResponse.redirect(url)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - Any static assets (svg, png, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
