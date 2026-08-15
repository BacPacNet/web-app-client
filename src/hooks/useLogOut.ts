import { usePathname, useRouter } from 'next/navigation'
import { useUniStore } from '@/store/store'
import useCookie from './useCookie'
import { useQueryClient } from '@tanstack/react-query'
import {
  ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE,
  ADMIN_DASHBOARD_REFRESH_TOKEN_COOKIE,
  ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE,
} from '@/utils/adminDashboard'

export const useLogout = () => {
  const router = useRouter()
  const pathname = usePathname()
  const [, , deleteCookie] = useCookie('uni_user_token')
  const [, , deleteRefreshCookie] = useCookie('uni_user_refresh_token')
  const [, , deleteSelectedCommunityGroupCommunityId] = useCookie('selectedCommunityGroupCommunityId')
  const [, , deleteAdminDashboardAccessToken] = useCookie(ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE)
  const [, , deleteAdminDashboardRefreshToken] = useCookie(ADMIN_DASHBOARD_REFRESH_TOKEN_COOKIE)
  const [, , deleteAdminDashboardSelectedUniversity] = useCookie(ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE)
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    await queryClient.cancelQueries()
    queryClient.clear()
    deleteCookie()
    deleteRefreshCookie()
    deleteSelectedCommunityGroupCommunityId()
    deleteAdminDashboardAccessToken()
    deleteAdminDashboardRefreshToken()
    deleteAdminDashboardSelectedUniversity()
    useUniStore.getState().reset()
    try {
      localStorage.removeItem('store')
      localStorage.removeItem('selectedCommunityGroupCommunityId')
      sessionStorage.removeItem('selectedCommunityGroupCommunityId')
    } catch {
      // ignore
    }

    if (pathname.startsWith('/automation')) {
      router.replace('/automation/login')
      return
    }

    router.replace('/login')
  }

  return { handleLogout }
}
