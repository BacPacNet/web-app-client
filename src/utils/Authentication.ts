import { NextRequest } from 'next/server'
import { ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE, ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE } from './adminDashboard'

export const isAuthenticated = (req: NextRequest): boolean => {
  const user = req.cookies.get('uni_user_token')
  return !!user?.value
}

export const isAdminDashboardAuthenticated = (req: NextRequest): boolean => {
  const user = req.cookies.get(ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE)
  return !!user?.value
}

export const hasAdminDashboardUniversitySelected = (req: NextRequest): boolean => {
  const selectedUniversity = req.cookies.get(ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE)
  return !!selectedUniversity?.value
}
