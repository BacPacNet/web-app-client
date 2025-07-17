import { useRouter } from 'next/navigation'
import { useUniStore } from '@/store/store'
import useCookie from './useCookie'

export const useLogout = () => {
  const router = useRouter()
  const [, , deleteCookie] = useCookie('uni_user_token')
  const [, , deleteRefreshCookie] = useCookie('uni_user_refresh_token')

  const handleLogout = () => {
    deleteCookie()
    deleteRefreshCookie()
    useUniStore.getState().reset()
    router.push('/login')
  }

  return { handleLogout }
}
