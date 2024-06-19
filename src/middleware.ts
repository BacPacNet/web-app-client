import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/community', '/communityuniversity']
export default function middleware(req: NextRequest) {
  const user = req.cookies.get('uni_user_token')
  if (
    !user?.value &&
    (protectedRoutes.includes(req?.nextUrl?.pathname) || protectedRoutes.some((route) => req?.nextUrl?.pathname.startsWith(route)))
  ) {
    const absoluteUrl = new URL('/login', req.nextUrl.origin)
    return NextResponse.redirect(absoluteUrl.toString())
  }
  return NextResponse.next()
}
