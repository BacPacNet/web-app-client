import { useState, useEffect } from 'react'

const useCookie = (cookieName: string): [string, (value: string, expirationDate: string) => void, () => void] => {
  const [cookieValue, setCookieValue] = useState<string>('')

  useEffect(() => {
    const cookie = document.cookie.split('; ').find((row) => row.startsWith(`${cookieName}=`))

    setCookieValue(cookie ? cookie.split('=')[1] : '')
  }, [cookieName])

  const setCookie = (value: string, expirationDate: string): void => {
    document.cookie = `${cookieName}=${value}; expires=${new Date(expirationDate).toUTCString()}; path=/`
  }

  const deleteCookie = (): void => {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
  }

  return [cookieValue, setCookie, deleteCookie]
}

export default useCookie
