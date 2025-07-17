// hooks/useAuthGuard.ts WIP
import { useEffect } from 'react'
import { useUniStore } from '@/store/store'
import { useLogout } from '@/hooks/useLogOut'
import useCookie from './useCookie'

export function useAuthGuard() {
  const { userData } = useUniStore()
  const { handleLogout } = useLogout()
  const [token] = useCookie('uni_user_token')

  useEffect(() => {
    if (!userData && token) {
      handleLogout()
    }
  }, [userData, handleLogout])
}
