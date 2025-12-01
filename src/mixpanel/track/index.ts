import mixpanel from 'mixpanel-browser'

export const trackEvent = (event: string, data: any) => {
  mixpanel.track(event, data)
}
