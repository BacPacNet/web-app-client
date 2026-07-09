'use client'

import { useLogout } from '@/hooks/useLogOut'
import { SESSION_EXPIRED_EVENT } from '@/services/api-Client'
import { useEffect, useRef } from 'react'

export default function SessionExpiryHandler() {
  const { handleLogout } = useLogout()
  const isHandlingLogoutRef = useRef(false)

  useEffect(() => {
    const handleSessionExpired = async () => {
      if (isHandlingLogoutRef.current) return
      isHandlingLogoutRef.current = true
      await handleLogout()
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired)
    }
  }, [handleLogout])

  return null
}
