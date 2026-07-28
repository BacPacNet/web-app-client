'use client'

import AdminPageHeader from '@/components/molecules/AdminDashboard/AdminPageHeader'
import ContactInfoTab from '@/components/molecules/AdminDashboard/ContactInfoTab'
import FromTheUniversityTab from '@/components/molecules/AdminDashboard/FromTheUniversityTab'
import UniversityOverviewTab from '@/components/molecules/AdminDashboard/UniversityOverviewTab'
import UniversityProfileTab from '@/components/molecules/AdminDashboard/UniversityProfileTab'
import UniversityTabNav, { UniversityTabId } from '@/components/molecules/AdminDashboard/UniversityTabNav'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { useUniversityById, useUpdateUniversityProfile } from '@/services/universitySearch'
import { useUniStore } from '@/store/store'
import { UniversityAdminTabProps } from '@/types/University'
import { useState } from 'react'

export default function AdminUniversityPage() {
  const [activeTab, setActiveTab] = useState<UniversityTabId>('university-profile')
  const { university_id: universityId, universityName } = useUniStore()
  const { data: university, isLoading: isUniversityLoading } = useUniversityById(universityId)
  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateUniversityProfile(universityId)
  const sharedTabProps: UniversityAdminTabProps = {
    university,
    isUniversityLoading,
    universityId,
    universityName,
    onUpdateProfile: (data: Parameters<typeof updateProfile>[0], options?: Parameters<typeof updateProfile>[1]) =>
      updateProfile(data, {
        ...options,
        onSuccess: (...args) => {
          if ('long_description' in data) {
            showCustomSuccessToast('University overview updated successfully')
          }
          options?.onSuccess?.(...args)
        },
      }),
    isUpdatingProfile,
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'university-profile':
        return <UniversityProfileTab {...sharedTabProps} />
      case 'from-the-university':
        return <FromTheUniversityTab />
      case 'university-overview':
        return <UniversityOverviewTab {...sharedTabProps} />
      case 'contact-info':
        return <ContactInfoTab {...sharedTabProps} />
      default:
        return null
    }
  }

  return (
    <div className="p-8">
      <AdminPageHeader title="University" />

      <div className="mt-6 flex flex-col gap-6">
        <UniversityTabNav activeTab={activeTab} onTabChange={setActiveTab} />
        {renderTabContent()}
      </div>
    </div>
  )
}
