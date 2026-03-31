'use client'
import { useState, useEffect, useCallback } from 'react'

const COOKIE_CHANGE_EVENT = 'uni-cookie-change'

const readCookieValue = (cookieName: string): string => {
  if (typeof document === 'undefined') return ''
  const cookie = document.cookie.split('; ').find((row) => row.startsWith(`${cookieName}=`))
  return cookie ? cookie.split('=')[1] : ''
}

const useCookie = (cookieName: string): [string, (value: string, expirationDate: string) => void, () => void] => {
  // Keep initial value deterministic for SSR hydration safety.
  const [cookieValue, setCookieValue] = useState<string>('')

  useEffect(() => {
    const syncCookieValue = () => {
      setCookieValue(readCookieValue(cookieName))
    }

    const handleCookieChange = (event: Event) => {
      const detail = (event as CustomEvent<{ cookieName?: string }>).detail
      if (!detail?.cookieName || detail.cookieName === cookieName) {
        syncCookieValue()
      }
    }

    // Initial sync for safety when this hook mounts later than cookie writes.
    syncCookieValue()

    window.addEventListener(COOKIE_CHANGE_EVENT, handleCookieChange)
    window.addEventListener('focus', syncCookieValue)
    document.addEventListener('visibilitychange', syncCookieValue)

    return () => {
      window.removeEventListener(COOKIE_CHANGE_EVENT, handleCookieChange)
      window.removeEventListener('focus', syncCookieValue)
      document.removeEventListener('visibilitychange', syncCookieValue)
    }
  }, [cookieName])

  const setCookie = useCallback(
    (value: string, expirationDate: string): void => {
      document.cookie = `${cookieName}=${value}; expires=${new Date(expirationDate).toUTCString()}; path=/`
      setCookieValue(value)
      window.dispatchEvent(new CustomEvent(COOKIE_CHANGE_EVENT, { detail: { cookieName } }))
    },
    [cookieName]
  )

  const deleteCookie = useCallback((): void => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    setCookieValue('')
    window.dispatchEvent(new CustomEvent(COOKIE_CHANGE_EVENT, { detail: { cookieName } }))
  }, [cookieName])

  return [cookieValue, setCookie, deleteCookie]
}

export default useCookie
