'use client'

import AdminLiveUpdateNotice from '@/components/molecules/AdminDashboard/AdminLiveUpdateNotice'
import AdminSectionHeader from '@/components/molecules/AdminDashboard/AdminSectionHeader'
import ContactInfoField from '@/components/molecules/AdminDashboard/ContactInfoField'
import Loading from '@/components/atoms/Loading'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { UpdateUniversityProfilePayload } from '@/services/universitySearch'
import { UniversityAdminTabProps } from '@/types/University'

import { BsClockFill } from 'react-icons/bs'
import { FaPhoneAlt, FaUsers } from 'react-icons/fa'
import { IoIosLink } from 'react-icons/io'
import { MdEmail } from 'react-icons/md'
import { PiBuildingsFill } from 'react-icons/pi'
function getWebPageLink(webPages: string | string[] | undefined): string {
  if (!webPages) return ''
  if (Array.isArray(webPages)) return webPages[0] || ''
  return webPages
}

export default function ContactInfoTab({
  className = '',
  university,
  isUniversityLoading,
  universityId,
  universityName,
  onUpdateProfile,
  isUpdatingProfile,
}: UniversityAdminTabProps) {
  const handleFieldSave = (field: keyof UpdateUniversityProfilePayload, value: string) => {
    const payload: UpdateUniversityProfilePayload = field === 'web_pages' ? { web_pages: value } : { [field]: value }

    onUpdateProfile(payload, {
      onSuccess: () => showCustomSuccessToast('Contact information updated successfully'),
    })
  }

  if (!universityId || !universityName) {
    return (
      <div className={className}>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
          University information is required to manage contact details.
        </div>
      </div>
    )
  }

  if (isUniversityLoading) return <Loading />

  return (
    <div className={className}>
      <div className="flex flex-col gap-6">
        <AdminLiveUpdateNotice />

        <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <AdminSectionHeader
            title="Contact Information"
            description="Edit the contact details shown in the 'Contact Info' section at the bottom of the University page."
          />

          <div className="flex flex-col gap-3">
            <ContactInfoField
              icon={MdEmail}
              label="Email"
              value={university?.email || ''}
              inputType="email"
              onSave={(value) => handleFieldSave('email', value)}
              isSaving={isUpdatingProfile}
            />
            <ContactInfoField
              icon={FaPhoneAlt}
              label="Phone"
              value={university?.phone || ''}
              onSave={(value) => handleFieldSave('phone', value)}
              isSaving={isUpdatingProfile}
            />
            <ContactInfoField
              icon={PiBuildingsFill}
              label="Address"
              value={university?.address || ''}
              onSave={(value) => handleFieldSave('address', value)}
              isSaving={isUpdatingProfile}
            />
            <ContactInfoField
              icon={IoIosLink}
              label="Link"
              value={getWebPageLink(university?.web_pages)}
              inputType="url"
              onSave={(value) => handleFieldSave('web_pages', value)}
              isSaving={isUpdatingProfile}
            />
            <ContactInfoField
              icon={FaUsers}
              label="Total Students"
              value={university?.total_students || ''}
              onSave={(value) => handleFieldSave('total_students', value)}
              isSaving={isUpdatingProfile}
            />
            <ContactInfoField
              icon={BsClockFill}
              label="Office Hours"
              value={university?.office_hours || ''}
              onSave={(value) => handleFieldSave('office_hours', value)}
              isSaving={isUpdatingProfile}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
