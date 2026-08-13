export type Audience = 'faculty' | 'student'

const FACULTY_PREFIX = '/faculty'
const AUDIENCE_STORAGE_KEY = 'selectedAudience'

export function getAudienceFromPath(pathname: string): Audience {
  return pathname === FACULTY_PREFIX || pathname.startsWith(`${FACULTY_PREFIX}/`) ? 'faculty' : 'student'
}

export function getStoredAudience(): Audience {
  if (typeof window === 'undefined') return 'student'
  return localStorage.getItem(AUDIENCE_STORAGE_KEY) === 'faculty' ? 'faculty' : 'student'
}

export function setStoredAudience(audience: Audience) {
  if (typeof window === 'undefined') return
  localStorage.setItem(AUDIENCE_STORAGE_KEY, audience)
}

export function getHomePathForAudience(audience: Audience): string {
  return audience === 'faculty' ? '/for-university' : '/'
}

export function withAudience(pathname: string, audience: Audience): string {
  const currentAudience = getAudienceFromPath(pathname)
  if (currentAudience === audience) return pathname

  if (audience === 'faculty') {
    if (pathname === '/') return FACULTY_PREFIX
    return `${FACULTY_PREFIX}${pathname}`
  }

  if (pathname === FACULTY_PREFIX) return '/'
  if (pathname.startsWith(`${FACULTY_PREFIX}/`)) {
    const studentPath = pathname.slice(FACULTY_PREFIX.length)
    return studentPath || '/'
  }

  return pathname
}
