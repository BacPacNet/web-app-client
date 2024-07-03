import { NextRequest } from 'next/server'

export const isAuthenticated = (req: NextRequest): boolean => {
  const user = req.cookies.get('uni_user_token')
  return !!user?.value
}
