'use client'

import AdminDashboardSidebar from '@/components/organisms/AdminDashboard/AdminSidebar'
import Spinner from '@/components/atoms/spinner'
import useCookie from '@/hooks/useCookie'
import { useIsUserCommunityAdmin } from '@/services/user'
import { useUniStore } from '@/store/store'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [cookieValue] = useCookie('uni_user_token')
  const { setUserCommunityAdmin } = useUniStore()
  const { data, isSuccess, isLoading } = useIsUserCommunityAdmin()

  useEffect(() => {
    setUserCommunityAdmin(data ?? null)
  }, [data, setUserCommunityAdmin])

  useEffect(() => {
    // if (!cookieValue) {
    //   router.replace('/timeline')
    //   return
    // }

    if (!isSuccess) return

    if (data?.isCommunityAdmin === false) {
      router.replace('/timeline')
    }
  }, [cookieValue, isSuccess, data?.isCommunityAdmin, router])

  if (!cookieValue || isLoading || (isSuccess && data?.isCommunityAdmin === false)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex items-start bg-surface-neutral-100">
      <AdminDashboardSidebar />
      <main className="max-w-[1280px] flex-1">{children}</main>
    </div>
  )
}
