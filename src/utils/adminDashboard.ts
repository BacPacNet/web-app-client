export const ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE = 'admin_dashboard_token'
export const ADMIN_DASHBOARD_REFRESH_TOKEN_COOKIE = 'admin_dashboard_refresh_token'
export const ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE = 'admin_dashboard_selected_university'

export type AdminDashboardSelectedUniversity = {
  _id: string
  name: string
}

export const serializeAdminDashboardSelectedUniversity = (university: AdminDashboardSelectedUniversity): string => {
  return encodeURIComponent(
    JSON.stringify({
      _id: university._id,
      name: university.name,
    })
  )
}

export const parseAdminDashboardSelectedUniversity = (cookieValue: string): AdminDashboardSelectedUniversity | null => {
  try {
    const parsed = JSON.parse(decodeURIComponent(cookieValue))

    if (
      parsed &&
      typeof parsed === 'object' &&
      typeof (parsed as AdminDashboardSelectedUniversity)._id === 'string' &&
      typeof (parsed as AdminDashboardSelectedUniversity).name === 'string'
    ) {
      return {
        _id: (parsed as AdminDashboardSelectedUniversity)._id,
        name: (parsed as AdminDashboardSelectedUniversity).name,
      }
    }
  } catch {
    return null
  }

  return null
}
