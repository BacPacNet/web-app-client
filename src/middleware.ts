import { NextRequest, NextResponse } from 'next/server'
import { hasAdminDashboardUniversitySelected, isAdminDashboardAuthenticated, isAuthenticated } from './utils/Authentication'

const protectedRoutes = [
  '/community',
  '/timeline',
  '/profile',
  '/:id',
  '/messages',
  '/notifications',
  // '/ai-assistant',
  '/setting',
  '/connections',
  '/post',
  '/rewards',
]
export default function middleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname
  const isAdminRoute = pathName.startsWith('/admin-dashboard')
  const isAdminLoginRoute = pathName === '/admin-dashboard/login'
  const isAdminSelectUniversityRoute = pathName === '/admin-dashboard/select-university'

  if (isAdminRoute) {
    if (isAdminLoginRoute && isAdminDashboardAuthenticated(req)) {
      const absoluteUrl = new URL('/admin-dashboard/select-university', req.nextUrl.origin)
      return NextResponse.redirect(absoluteUrl.toString())
    }

    if (!isAdminLoginRoute && !isAdminDashboardAuthenticated(req)) {
      const absoluteUrl = new URL('/admin-dashboard/login', req.nextUrl.origin)
      return NextResponse.redirect(absoluteUrl.toString())
    }

    const requiresSelectedUniversity = !isAdminLoginRoute && !isAdminSelectUniversityRoute
    if (requiresSelectedUniversity && !hasAdminDashboardUniversitySelected(req)) {
      const absoluteUrl = new URL('/admin-dashboard/select-university', req.nextUrl.origin)
      return NextResponse.redirect(absoluteUrl.toString())
    }
  }

  // Redirect authenticated users from root path to timeline
  if (pathName === '/' && isAuthenticated(req)) {
    const absoluteUrl = new URL('/timeline', req.nextUrl.origin)
    return NextResponse.redirect(absoluteUrl.toString())
  }

  if (pathName === '/login' && isAuthenticated(req)) {
    const absoluteUrl = new URL('/timeline', req.nextUrl.origin)
    return NextResponse.redirect(absoluteUrl.toString())
  }

  if (!isAuthenticated(req) && protectedRoutes.some((route) => pathName.startsWith(route))) {
    const absoluteUrl = new URL('/login', req.nextUrl.origin)
    return NextResponse.redirect(absoluteUrl.toString())
  }
  return NextResponse.next()
}
