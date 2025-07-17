'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  pageview,
  event,
  trackUserRegistration,
  trackUserLogin,
  trackPostCreation,
  trackCommunityJoin,
  trackSearch,
  trackButtonClick,
  trackPageView,
} from '@/utils/analytics'

export const useGoogleAnalytics = (): {
  trackEvent: typeof event
  trackUserRegistration: typeof trackUserRegistration
  trackUserLogin: typeof trackUserLogin
  trackPostCreation: typeof trackPostCreation
  trackCommunityJoin: typeof trackCommunityJoin
  trackSearch: typeof trackSearch
  trackButtonClick: typeof trackButtonClick
  trackPageView: typeof trackPageView
  trackCustomPageView: (pageName: string) => void
  trackFormSubmission: (formName: string, success: boolean) => void
  trackFileUpload: (fileType: string, fileSize: number) => void
  trackVideoPlay: (videoTitle: string) => void
  trackShare: (contentType: string, platform: string) => void
  trackError: (errorType: string, errorMessage: string) => void
} => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views automatically
  useEffect(() => {
    if (pathname) {
      const url = pathname + searchParams.toString()
      pageview(url)
    }
  }, [pathname, searchParams])

  return {
    // Basic event tracking
    trackEvent: event,

    // Pre-defined tracking functions
    trackUserRegistration,
    trackUserLogin,
    trackPostCreation,
    trackCommunityJoin,
    trackSearch,
    trackButtonClick,
    trackPageView,

    // Custom page view tracking
    trackCustomPageView: (pageName: string) => {
      trackPageView(pageName)
    },

    // Enhanced tracking functions
    trackFormSubmission: (formName: string, success: boolean) => {
      event({
        action: 'form_submission',
        category: 'engagement',
        label: `${formName}_${success ? 'success' : 'error'}`,
      })
    },

    trackFileUpload: (fileType: string, fileSize: number) => {
      event({
        action: 'file_upload',
        category: 'engagement',
        label: fileType,
        value: fileSize,
      })
    },

    trackVideoPlay: (videoTitle: string) => {
      event({
        action: 'video_play',
        category: 'engagement',
        label: videoTitle,
      })
    },

    trackShare: (contentType: string, platform: string) => {
      event({
        action: 'share',
        category: 'engagement',
        label: `${contentType}_${platform}`,
      })
    },

    trackError: (errorType: string, errorMessage: string) => {
      event({
        action: 'error',
        category: 'error',
        label: `${errorType}_${errorMessage}`,
      })
    },
  }
}
