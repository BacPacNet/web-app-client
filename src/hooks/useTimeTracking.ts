import { useEffect, useRef } from 'react'
import mixpanel from 'mixpanel-browser'

export const useTimeTracking = (eventName: string, properties: Record<string, any> = {}) => {
  const hasTrackedRef = useRef(false)
  const propsRef = useRef(properties)

  useEffect(() => {
    propsRef.current = properties
  }, [properties])

  useEffect(() => {
    // Begin timing
    mixpanel.time_event(eventName)
    hasTrackedRef.current = false

    const trackTimeSpent = () => {
      if (hasTrackedRef.current) return
      hasTrackedRef.current = true

      mixpanel.track(eventName, propsRef.current)
    }

    // const handleVisibilityChange = () => {
    //   if (document.hidden) trackTimeSpent()
    // }

    window.addEventListener('beforeunload', trackTimeSpent)
    // document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      trackTimeSpent() // Track on unmount
      window.removeEventListener('beforeunload', trackTimeSpent)
      //   document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [eventName])
}
