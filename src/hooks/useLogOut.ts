import { useRouter } from 'next/navigation'
import { useUniStore } from '@/store/store'
import useCookie from './useCookie'
import { useQueryClient } from '@tanstack/react-query'

export const useLogout = () => {
  const router = useRouter()
  const [, , deleteCookie] = useCookie('uni_user_token')
  const [, , deleteRefreshCookie] = useCookie('uni_user_refresh_token')
  const [, , deleteSelectedCommunityGroupCommunityId] = useCookie('selectedCommunityGroupCommunityId')
  const queryClient = useQueryClient()

  const handleLogout = async () => {
    await queryClient.cancelQueries()
    queryClient.clear()
    deleteCookie()
    deleteRefreshCookie()
    deleteSelectedCommunityGroupCommunityId()
    useUniStore.getState().reset()
    try {
      localStorage.removeItem('store')
      localStorage.removeItem('selectedCommunityGroupCommunityId')
      sessionStorage.removeItem('selectedCommunityGroupCommunityId')
    } catch {
      // ignore
    }
    router.push('/login')
  }

  return { handleLogout }
}
