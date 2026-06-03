'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RouteLoader() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)

    const timer = setTimeout(() => {
      setLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [pathname])

  if (!loading) return null

  return <div className="fixed top-0 left-0 w-full h-1 bg-primary-500 animate-pulse z-50" />
}
