import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from './utils/Authentication'

const protectedRoutes = [
  '/community',
  '/timeline',
  '/profile',
  '/:id',
  '/messages',
  '/notifications',
  '/ai-assistant',
  '/setting',
  '/connections',
  '/post',
]
export default function middleware(req: NextRequest) {
  const pathName = req.nextUrl.pathname

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
