'use client'

import { GoogleAnalytics } from '@next/third-parties/google'

interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID: string
}

export default function GoogleAnalyticsComponent({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID is not provided')
    return null
  }

  return <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />
}
