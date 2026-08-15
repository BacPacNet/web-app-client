'use client'

import AdminLiveUpdateNotice from '@/components/molecules/AdminDashboard/AdminLiveUpdateNotice'
import UniversityOverviewEditor from '@/components/molecules/AdminDashboard/UniversityOverviewEditor'
import Loading from '@/components/atoms/Loading'
import { UniversityAdminTabProps } from '@/types/University'
import { useEffect, useState } from 'react'
export default function UniversityOverviewTab({
  className = '',
  university,
  isUniversityLoading,
  universityId,
  universityName,
  onUpdateProfile,
  isUpdatingProfile,
}: UniversityAdminTabProps) {
  const [overview, setOverview] = useState('')
  const [savedOverview, setSavedOverview] = useState('')

  useEffect(() => {
    const description = (university?.long_description as string) ?? ''
    setOverview(description)
    setSavedOverview(description)
  }, [university?.long_description])

  const hasChanges = overview !== savedOverview

  const handleSave = () => {
    onUpdateProfile(
      { long_description: overview },
      {
        onSuccess: () => setSavedOverview(overview),
      }
    )
  }

  if (!universityId || !universityName) {
    return (
      <div className={className}>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
          University information is required to manage the overview.
        </div>
      </div>
    )
  }

  if (isUniversityLoading) return <Loading />

  return (
    <div className={className}>
      <div className="flex flex-col gap-6">
        <AdminLiveUpdateNotice />

        <UniversityOverviewEditor
          value={overview}
          onChange={setOverview}
          onSave={handleSave}
          isSaving={isUpdatingProfile}
          isSaveDisabled={!hasChanges}
        />
      </div>
    </div>
  )
}
