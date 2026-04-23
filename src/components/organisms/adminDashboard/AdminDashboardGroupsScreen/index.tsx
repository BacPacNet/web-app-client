'use client'

import placeholder from '@assets/Logo Circle.svg'
import MultiSelectDropdown from '@/components/atoms/MultiSelectDropdown'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import UserSearchInput from '@/components/atoms/UserSearchBox'
import { useModal } from '@/context/ModalContext'
import useCookie from '@/hooks/useCookie'
import { useAdminDashboardFilteredGroups } from '@/services/admin-dashboard-auth'
import { subCategories } from '@/types/CommuityGroup'
import { ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE, parseAdminDashboardSelectedUniversity } from '@/utils/adminDashboard'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import AdminDashboardGroupMembersModal from '../AdminDashboardGroupMembersModal'
import AdminDashboardShell from '../AdminDashboardShell'
import Buttons from '@/components/atoms/Buttons'
import { FiPlus } from 'react-icons/fi'

const groupTypeOptions = ['Private', 'Public', 'Official', 'Casual']

const groupSortOptions = ['latest', 'oldest', 'alphabetAsc', 'alphabetDesc', 'userCountAsc', 'userCountDesc']

const filterCategories = Object.keys(subCategories).filter((category) => category !== 'Others')

export default function AdminDashboardGroupsScreen() {
  const { openModal } = useModal()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string[]>([])
  const [selectedSort, setSelectedSort] = useState('userCountDesc')
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>(filterCategories[0] || '')
  const [selectedFilterValues, setSelectedFilterValues] = useState<string[]>([])
  const [failedGroupLogoIds, setFailedGroupLogoIds] = useState<Record<string, boolean>>({})
  const [selectedUniversityCookie] = useCookie(ADMIN_DASHBOARD_SELECTED_UNIVERSITY_COOKIE)

  const selectedUniversity = useMemo(() => {
    if (!selectedUniversityCookie) return null
    return parseAdminDashboardSelectedUniversity(selectedUniversityCookie)
  }, [selectedUniversityCookie])

  const selectedFilters = useMemo(
    () => (selectedFilterCategory && selectedFilterValues.length ? { [selectedFilterCategory]: selectedFilterValues } : {}),
    [selectedFilterCategory, selectedFilterValues]
  )

  const { data, isLoading, isError } = useAdminDashboardFilteredGroups(
    selectedUniversity?._id || '',
    searchTerm,
    selectedType,
    selectedFilters,
    selectedSort
  )

  const groups = useMemo(() => data?.communityGroups || [], [data])
  const selectedCategoryOptions = useMemo(() => {
    if (!selectedFilterCategory) return []
    return subCategories[selectedFilterCategory as keyof typeof subCategories] || []
  }, [selectedFilterCategory])

  const handleOpenMembersModal = (groupId: string, groupTitle: string) => {
    openModal(<AdminDashboardGroupMembersModal groupId={groupId} groupTitle={groupTitle} />, 'h-[70vh] w-[350px] sm:w-[720px] hideScrollbar')
  }

  return (
    <AdminDashboardShell title="Groups">
      <div className="flex h-[72vh] flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="min-w-[280px] flex-1">
              <UserSearchInput value={searchTerm} onChange={setSearchTerm} placeholder="Searching All Groups" />
            </div>
            <Buttons
              variant="primary"
              size="medium"
              leftIcon={<FiPlus size={16} />}
              onClick={() => router.push('/admin-dashboard/groups/import?communityId=' + data?._id)}
            >
              Add Group
            </Buttons>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
            <div className="w-full max-w-[360px]">
              <MultiSelectDropdown
                options={groupTypeOptions}
                value={selectedType}
                onChange={setSelectedType}
                placeholder="Group Access & Type"
                err={false}
                search
              />
            </div>

            <div className="flex flex-1 gap-3 ">
              <SelectDropdown
                options={groupSortOptions}
                value={selectedSort}
                onChange={setSelectedSort}
                placeholder="Sort"
                icon="single"
                err={false}
                isAllowedToRemove={false}
              />

              <SelectDropdown
                options={filterCategories}
                value={selectedFilterCategory}
                onChange={(value) => {
                  setSelectedFilterCategory(value)
                  setSelectedFilterValues([])
                }}
                placeholder="Filter Category"
                icon="single"
                err={false}
                isAllowedToRemove={false}
              />
            </div>
          </div>
          <div>
            <MultiSelectDropdown
              options={selectedCategoryOptions}
              value={selectedFilterValues}
              onChange={setSelectedFilterValues}
              placeholder="Category Filters"
              err={false}
              search
            />
          </div>
        </div>

        {!selectedUniversity?._id && (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
            Select a university to view and manage its groups.
          </div>
        )}

        {selectedUniversity?._id && (
          <div className="flex-1 overflow-y-auto rounded-xl border border-neutral-200">
            <div className="grid grid-cols-5 gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              <p>Group Name</p>
              <p>Type</p>
              <p>Access</p>
              <p>Members</p>
              <p>Description</p>
            </div>

            {isLoading && <p className="px-4 py-6 text-sm text-neutral-500">Loading groups...</p>}

            {!isLoading && isError && <p className="px-4 py-6 text-sm text-red-500">Failed to load groups.</p>}

            {!isLoading && !isError && groups.length === 0 && <p className="px-4 py-6 text-sm text-neutral-500">No groups found.</p>}

            {!isLoading &&
              !isError &&
              groups.map((group) => (
                <div
                  key={group._id}
                  className="grid grid-cols-5 gap-3 border-b border-neutral-100 px-4 py-3 text-sm text-neutral-700 last:border-none"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src={
                        failedGroupLogoIds[group._id]
                          ? placeholder
                          : typeof group.communityGroupLogoUrl === 'string'
                          ? group.communityGroupLogoUrl || placeholder
                          : group.communityGroupLogoUrl?.imageUrl || placeholder
                      }
                      alt={group.title || 'Group logo'}
                      width={32}
                      height={32}
                      className="h-8 w-8 rounded-full object-cover"
                      onError={() => {
                        setFailedGroupLogoIds((prev) => {
                          if (prev[group._id]) return prev
                          return { ...prev, [group._id]: true }
                        })
                      }}
                    />
                    <p className="break-all font-medium text-neutral-900">{group.title || '-'}</p>
                  </div>
                  <p className="capitalize">{group.communityGroupType || '-'}</p>
                  <p>{group.communityGroupAccess || '-'}</p>
                  <button
                    type="button"
                    className="w-fit text-left font-medium text-primary-600 underline underline-offset-2"
                    onClick={() => handleOpenMembersModal(group._id, group.title || 'Group')}
                  >
                    {group.memberCount ?? 0}
                  </button>
                  <p className="line-clamp-2">{group.description || '-'}</p>
                </div>
              ))}
          </div>
        )}
      </div>
    </AdminDashboardShell>
  )
}
