import type { UpdateUniversityProfilePayload } from '@/services/universitySearch'
import type { UseMutateFunction } from '@tanstack/react-query'

export type UniversityInfo = {
  _id: string
  name: string
  UniversityName?: string
  address: string
  city: string
  email: string
  long_description: string
  office_hours: string
  phone: string
  ranking: string
  short_overview: string
  total_students: string
  tuitionFee: string
  campus: string
  country: string
  country_code: string
  domains: string[]
  logo: string
  state_province?: string | null
  web_pages: string[] | string
  __v: number
}

export type UniversityAdminTabProps = {
  className?: string
  university?: UniversityInfo
  isUniversityLoading: boolean
  universityId: string
  universityName: string
  onUpdateProfile: UseMutateFunction<unknown, Error, UpdateUniversityProfilePayload, unknown>
  isUpdatingProfile: boolean
}
