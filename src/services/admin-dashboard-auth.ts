import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { MESSAGES } from '@/content/constant'
import useDebounce from '@/hooks/useDebounce'
import useCookie from '@/hooks/useCookie'
import { LoginForm, UserResponseType } from '@/models/auth'
import { ProfileConnection } from '@/types/Connections'
import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import { ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE } from '@/utils/adminDashboard'
import { client } from './api-Client'

const adminDashboardLogin = async (data: LoginForm): Promise<UserResponseType> => {
  const result = await client<UserResponseType, LoginForm>('/auth/dashboard-login', { data })
  return result
}

export const useAdminDashboardLogin = () => {
  return useMutation({
    mutationFn: (data: LoginForm) => adminDashboardLogin(data),
    onError: (error: any) => {
      const status = error?.response?.status

      if (status === 403 || status === 404) {
        return
      }

      showCustomDangerToast(error?.response?.data?.message || MESSAGES.SOMETHING_WENT_WRONG)
    },
  })
}

export type AdminDashboardStatsResponse = {
  totalUsers: number
  totalStudentUsers: number
  totalFacultyUsers: number
  totalGroups: number
  totalOfficialGroups: number
  totalCasualGroups: number
}

const getAdminDashboardStats = async (universityName: string, token: string): Promise<AdminDashboardStatsResponse> => {
  const endpoint = `/university/${encodeURIComponent(universityName)}/dashboard-stats`
  const result = await client<AdminDashboardStatsResponse, never>(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  })

  return result
}

export const useAdminDashboardStats = (universityName: string) => {
  const [accessToken] = useCookie(ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE)

  return useQuery({
    queryKey: ['admin-dashboard-stats', universityName],
    queryFn: () => getAdminDashboardStats(universityName, accessToken),
    enabled: Boolean(universityName && accessToken),
  })
}

type AdminDashboardUsersParams = {
  page: number
  limit: number
  searchTerm: string
  universityName: string
  role: string
  studyYear: string[]
  major: string[]
  occupation: string[]
  affiliation: string[]
}

const getAdminDashboardUsers = async (params: AdminDashboardUsersParams, token: string): Promise<ProfileConnection> => {
  const queryParams = new URLSearchParams()

  queryParams.append('page', String(params.page))
  queryParams.append('limit', String(params.limit))
  if (params.searchTerm) queryParams.append('name', params.searchTerm)
  if (params.universityName) queryParams.append('universityName', params.universityName)
  if (params.role) queryParams.append('role', params.role)
  if (params.studyYear.length) queryParams.append('studyYear', params.studyYear.join(','))
  if (params.major.length) queryParams.append('major', params.major.join(','))
  if (params.occupation.length) queryParams.append('occupation', params.occupation.join(','))
  if (params.affiliation.length) queryParams.append('affiliation', params.affiliation.join(','))

  return client<ProfileConnection, never>(`/users/connections?${queryParams.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const useAdminDashboardUsers = (
  universityName: string,
  searchTerm: string,
  role: string,
  studyYear: string[],
  major: string[],
  occupation: string[],
  affiliation: string[],
  limit: number = 20
) => {
  const [accessToken] = useCookie(ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  return useInfiniteQuery({
    queryKey: ['admin-dashboard-users', universityName, debouncedSearchTerm, role, studyYear, major, occupation, affiliation, limit],
    queryFn: ({ pageParam = 1 }) =>
      getAdminDashboardUsers(
        {
          page: pageParam,
          limit,
          searchTerm: debouncedSearchTerm,
          universityName,
          role,
          studyYear,
          major,
          occupation,
          affiliation,
        },
        accessToken
      ),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: Boolean(universityName && accessToken),
  })
}

type AdminDashboardFilteredGroupsParams = {
  searchTerm: string
  selectedType: string[]
  selectedFilters: Record<string, string[]>
  sort: string
}

type AdminDashboardFilteredGroupsResponse = {
  _id?: string
  name?: string
  communityGroups: {
    _id: string
    title: string
    memberCount: number
    communityGroupType: string
    communityGroupAccess?: string
    communityGroupLogoUrl?: string | { imageUrl?: string }
    description?: string
  }[]
}

type AdminDashboardGroupMembersParams = {
  communityGroupId: string
  userStatus: string
  page: number
  limit: number
}

type AdminDashboardGroupMember = {
  _id: string
  firstName: string
  lastName: string
  profileImageUrl?: string
  year?: string
  major?: string
  occupation?: string
  affiliation?: string
  role?: string
}

type AdminDashboardGroupMembersResponse = {
  data?: AdminDashboardGroupMember[]
  members?: AdminDashboardGroupMember[]
  page?: number
  currentPage?: number
  totalPages?: number
}

export type AdminDashboardCreateGroupsPayload = {
  title: string
  adminId?: string
  memberList?: string[] | string
  description?: string
  communityGroupAccess: string
  communityGroupType: string
  communityGroupLabel: string
  communityGroupCategory?: Record<string, string[]> | null
  communityGroupLogoUrl?: string
  communityGroupLogoCoverUrl?: string
}

export type AdminDashboardBulkRegisterUsersPayload = {
  userType: 'student' | 'faculty'
  uniqueId: string
  email: string
  password: string
  universityEmail: string
  universityName: string
  universityId: string
  firstName: string
  lastName: string
  birthday?: string
  major?: string
  year?: string
  occupation?: string
  affiliation?: string
}

const getAdminDashboardFilteredGroups = async (
  communityId: string,
  token: string,
  data: AdminDashboardFilteredGroupsParams
): Promise<AdminDashboardFilteredGroupsResponse> => {
  if (!communityId) {
    throw new Error('communityId is required')
  }

  return client<AdminDashboardFilteredGroupsResponse, AdminDashboardFilteredGroupsParams>(`/community/super-admin/filtered/${communityId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
}

const getAdminDashboardGroupMembers = async (
  params: AdminDashboardGroupMembersParams,
  token: string
): Promise<AdminDashboardGroupMembersResponse> => {
  const queryParams = new URLSearchParams()
  queryParams.append('communityGroupId', params.communityGroupId)
  queryParams.append('userStatus', params.userStatus)
  queryParams.append('page', String(params.page))
  queryParams.append('limit', String(params.limit))

  return client<AdminDashboardGroupMembersResponse, never>(`/communitygroup/super-admin/members?${queryParams.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

const createAdminDashboardGroups = async (communityId: string, token: string, data: AdminDashboardCreateGroupsPayload[]): Promise<any> => {
  if (!communityId) {
    throw new Error('communityId is required')
  }

  return client<any, AdminDashboardCreateGroupsPayload[]>(`/communitygroup/super-admin/${communityId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
}

const validateAdminDashboardGroupUniqueIds = async (communityId: string, token: string, data: AdminDashboardCreateGroupsPayload[]): Promise<any> => {
  if (!communityId) {
    throw new Error('communityId is required')
  }

  return client<any, AdminDashboardCreateGroupsPayload[]>(`/communitygroup/super-admin/${communityId}/validate-unique-ids`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
}

const bulkRegisterAdminDashboardUsers = async (token: string, data: AdminDashboardBulkRegisterUsersPayload[]): Promise<any> => {
  return client<any, AdminDashboardBulkRegisterUsersPayload[]>('/auth/super-admin/bulk-register-users', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
}

export const useAdminDashboardFilteredGroups = (
  communityId: string,
  searchTerm: string,
  selectedType: string[],
  selectedFilters: Record<string, string[]>,
  sort: string = 'latest'
) => {
  const [accessToken] = useCookie(ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  return useQuery({
    queryKey: ['admin-dashboard-groups', communityId, debouncedSearchTerm, selectedType, selectedFilters, sort],
    queryFn: () =>
      getAdminDashboardFilteredGroups(communityId, accessToken, {
        searchTerm: debouncedSearchTerm,
        selectedType,
        selectedFilters,
        sort,
      }),
    enabled: Boolean(communityId && accessToken),
  })
}

export const useAdminDashboardGroupMembers = (communityGroupId: string, userStatus: string, limit: number = 20) => {
  const [accessToken] = useCookie(ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE)

  return useInfiniteQuery({
    queryKey: ['admin-dashboard-group-members', communityGroupId, userStatus, limit],
    queryFn: ({ pageParam = 1 }) =>
      getAdminDashboardGroupMembers(
        {
          communityGroupId,
          userStatus,
          page: pageParam,
          limit,
        },
        accessToken
      ),
    getNextPageParam: (lastPage) => {
      const currentPage = lastPage.currentPage ?? lastPage.page ?? 1
      if (lastPage.totalPages && currentPage < lastPage.totalPages) {
        return currentPage + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: Boolean(communityGroupId && accessToken),
  })
}

export const useAdminDashboardCreateGroups = (communityId: string) => {
  const [accessToken] = useCookie(ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE)

  return useMutation({
    mutationFn: (data: AdminDashboardCreateGroupsPayload[]) => createAdminDashboardGroups(communityId, accessToken, data),
    onError: (error: any) => {
      showCustomDangerToast(error?.response?.data?.message || MESSAGES.SOMETHING_WENT_WRONG)
    },
  })
}

export const useAdminDashboardValidateUniqueIds = (communityId: string) => {
  const [accessToken] = useCookie(ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE)

  return useMutation({
    mutationFn: (data: AdminDashboardCreateGroupsPayload[]) => validateAdminDashboardGroupUniqueIds(communityId, accessToken, data),
    onError: (error: any) => {
      showCustomDangerToast(error?.response?.data?.message || MESSAGES.SOMETHING_WENT_WRONG)
    },
  })
}

export const useAdminDashboardBulkRegisterUsers = () => {
  const [accessToken] = useCookie(ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE)

  return useMutation({
    mutationFn: (data: AdminDashboardBulkRegisterUsersPayload[]) => bulkRegisterAdminDashboardUsers(accessToken, data),
    onError: (error: any) => {
      showCustomDangerToast(error?.response?.data?.message || MESSAGES.SOMETHING_WENT_WRONG)
    },
  })
}
