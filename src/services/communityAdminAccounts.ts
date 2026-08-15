import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import useDebounce from '@/hooks/useDebounce'
import useCookie from '@/hooks/useCookie'
import { MESSAGES } from '@/content/constant'
import { Profile } from '@/types/Connections'
import { useUniStore } from '@/store/store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'

export type CommunityAdminAccount = {
  _id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  addedAt?: string
  profile?: Profile | null
}

export type CommunityAdminAccountsResponse = {
  admins: CommunityAdminAccount[]
  totalCount: number
}

type RawCommunityAdmin = {
  user?: {
    _id: string
    firstName: string
    lastName: string
    email: string
    createdAt: string
  }
  userProfile?: Profile | null
} & Partial<CommunityAdminAccount>

type RawCommunityAdminAccountsResponse = {
  admins?: RawCommunityAdmin[]
  success?: boolean
}

function normalizeCommunityAdmin(raw: RawCommunityAdmin): CommunityAdminAccount {
  if (raw.user) {
    return {
      _id: raw.user._id,
      firstName: raw.user.firstName,
      lastName: raw.user.lastName,
      email: raw.user.email,
      createdAt: raw.user.createdAt,
      profile: raw.userProfile ?? null,
    }
  }

  return {
    _id: raw._id ?? '',
    firstName: raw.firstName ?? '',
    lastName: raw.lastName ?? '',
    email: raw.email ?? '',
    createdAt: raw.createdAt ?? '',
    addedAt: raw.addedAt,
    profile: raw.profile,
  }
}

export type AddCommunityAdminPayload = {
  userId: string
}

export type RemoveCommunityAdminPayload = {
  userId: string
}

function filterAdmins(admins: CommunityAdminAccount[], searchTerm: string) {
  const term = searchTerm.trim().toLowerCase()
  if (!term) return admins

  return admins.filter((admin) => {
    const fullName = `${admin.firstName} ${admin.lastName}`.toLowerCase()
    const email = (admin.email || admin.profile?.email?.[0]?.UniversityEmail || '').toLowerCase()

    return fullName.includes(term) || email.includes(term)
  })
}

export async function getCommunityAdmins(token: string, communityId: string): Promise<CommunityAdminAccountsResponse> {
  const response = await client<RawCommunityAdminAccountsResponse, never>(`/community/${communityId}/community-admin`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  const admins = (response.admins ?? []).map(normalizeCommunityAdmin)

  return {
    admins,
    totalCount: admins.length,
  }
}

export async function addCommunityAdmin(token: string, communityId: string, data: AddCommunityAdminPayload) {
  return client(`/community/${communityId}/community-admin`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
}

export async function removeCommunityAdmin(token: string, communityId: string, userId: string) {
  return client(`/community/${communityId}/community-admin/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function useCommunityAdminAccounts(searchTerm: string, enabled: boolean = true) {
  const [cookieValue] = useCookie('uni_user_token')
  const communityId = useUniStore((state) => state.communityId)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  return useQuery({
    queryKey: ['communityAdmins', communityId],
    queryFn: () => getCommunityAdmins(cookieValue, communityId),
    enabled: !!cookieValue && !!communityId && enabled,
    select: (data) => ({
      ...data,
      admins: filterAdmins(data.admins, debouncedSearchTerm),
    }),
  })
}

export function useAddCommunityAdmin() {
  const [cookieValue] = useCookie('uni_user_token')
  const communityId = useUniStore((state) => state.communityId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: AddCommunityAdminPayload) => {
      if (!communityId) {
        throw new Error('Community ID is required')
      }

      return addCommunityAdmin(cookieValue, communityId, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityAdmins', communityId] })
      showCustomSuccessToast('Admin added successfully')
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      showCustomDangerToast(error?.response?.data?.message || MESSAGES.SOMETHING_WENT_WRONG)
    },
  })
}

export function useRemoveCommunityAdmin() {
  const [cookieValue] = useCookie('uni_user_token')
  const communityId = useUniStore((state) => state.communityId)
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: RemoveCommunityAdminPayload) => {
      if (!communityId) {
        throw new Error('Community ID is required')
      }

      return removeCommunityAdmin(cookieValue, communityId, data.userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityAdmins', communityId] })
      showCustomSuccessToast('Admin removed successfully')
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      showCustomDangerToast(error?.response?.data?.message || MESSAGES.SOMETHING_WENT_WRONG)
    },
  })
}
