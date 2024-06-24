import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from './utils/Authentication'

const protectedRoutes = ['/community', '/communityuniversity']
export default function middleware(req: NextRequest) {
  if (!isAuthenticated(req) && protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    const absoluteUrl = new URL('/login', req.nextUrl.origin)
    return NextResponse.redirect(absoluteUrl.toString())
  }
  return NextResponse.next()
}
