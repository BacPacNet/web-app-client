'use client'

import AddAdminAccountModal from '@/components/molecules/AdminDashboard/AddAdminAccountModal'
import AdminAccountsTable from '@/components/molecules/AdminDashboard/AdminAccountsTable'
import AdminUserSearchBar from '@/components/molecules/AdminDashboard/AdminUserSearchBar'
import Buttons from '@/components/atoms/Buttons'
import { useModal } from '@/context/ModalContext'
import { useCommunityAdminAccounts } from '@/services/communityAdminAccounts'
import { useUniStore } from '@/store/store'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { FiUserPlus } from 'react-icons/fi'

export default function AdminAccountsPage() {
  const router = useRouter()
  const { openModal } = useModal()
  const { communityId } = useUniStore()

  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading, isError } = useCommunityAdminAccounts(searchTerm, Boolean(communityId))

  const admins = useMemo(() => data?.admins || [], [data])
  const existingAdminIds = useMemo(() => admins.map((admin) => admin._id), [admins])

  const handleAddAdmin = () => {
    openModal(<AddAdminAccountModal existingAdminIds={existingAdminIds} />, 'w-[350px] sm:w-[560px] hideScrollbar h-max', false)
  }

  return (
    <div className="p-8">
      <div className="flex flex-col">
        <h1 className="text-2xl font-poppins font-bols text-[#111827]">Admin Accounts</h1>

        <div className="flex items-center justify-between pt-6 gap-2">
          <p className="text-xs text-[#6B7280]">Manage who has admin rights for your university.</p>
          <Buttons variant="primary" size="extra_small" leftIcon={<FiUserPlus size={16} />} onClick={handleAddAdmin}>
            Add Admin
          </Buttons>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-6">
        <AdminUserSearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Search by name or email..." />

        {!communityId ? (
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
            University information is required to view admin accounts.
          </div>
        ) : (
          <AdminAccountsTable admins={admins} isLoading={isLoading} isError={isError} onViewProfile={(userId) => router.push(`/profile/${userId}`)} />
        )}
      </div>
    </div>
  )
}
