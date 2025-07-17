// Google Analytics utility functions
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

// Initialize gtag function
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

// Log page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID!, {
      page_location: url,
    })
  }
}

// Log specific events
export const event = ({ action, category, label, value }: { action: string; category: string; label?: string; value?: number }) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// Custom event tracking functions for your app
export const trackUserRegistration = (method: string) => {
  event({
    action: 'user_registration',
    category: 'engagement',
    label: method,
  })
}

export const trackUserLogin = (method: string) => {
  event({
    action: 'user_login',
    category: 'engagement',
    label: method,
  })
}

export const trackPostCreation = (postType: string) => {
  event({
    action: 'post_creation',
    category: 'content',
    label: postType,
  })
}

export const trackCommunityJoin = (communityType: string) => {
  event({
    action: 'community_join',
    category: 'engagement',
    label: communityType,
  })
}

export const trackSearch = (searchTerm: string) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
  })
}

export const trackButtonClick = (buttonName: string, location: string) => {
  event({
    action: 'button_click',
    category: 'engagement',
    label: `${buttonName}_${location}`,
  })
}

export const trackPageView = (pageName: string) => {
  event({
    action: 'page_view',
    category: 'navigation',
    label: pageName,
  })
}
