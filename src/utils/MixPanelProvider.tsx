'use client'
import { useEffect } from 'react'
import mixpanel from 'mixpanel-browser'

const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN
const isDevelopment = process.env.NODE_ENV === 'development'

interface MixPanelProviderProps {
  children: React.ReactNode
}

const initMixpanel = (): void => {
  if (!MIXPANEL_TOKEN) {
    if (isDevelopment) {
      console.warn('Mixpanel token is missing. Analytics will not be initialized.')
    }
    return
  }

  try {
    mixpanel.init(MIXPANEL_TOKEN, {
      debug: isDevelopment,
      track_pageview: true,
    })
  } catch (error) {
    if (isDevelopment) {
      console.error('Failed to initialize Mixpanel:', error)
    }
  }
}

export default function MixPanelProvider({ children }: MixPanelProviderProps) {
  useEffect(() => {
    initMixpanel()
  }, [])

  return children
}
