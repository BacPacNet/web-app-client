'use client'

import AdminDeactivateAccountModal from '@/components/molecules/AdminDashboard/AdminDeactivateAccountModal'

type Props = {
  userId: string
  facultyName: string
  avatarUrl?: string
  initials: string
  avatarColorClass: string
  occupation?: string | null
  affiliation?: string | null
  onSuccess?: () => void
}

export default function DeactivateFacultyAccountModal({
  userId,
  facultyName,
  avatarUrl,
  initials,
  avatarColorClass,
  occupation,
  affiliation,
  onSuccess,
}: Props) {
  return (
    <AdminDeactivateAccountModal
      userId={userId}
      userName={facultyName}
      avatarUrl={avatarUrl}
      initials={initials}
      avatarColorClass={avatarColorClass}
      detailOne={occupation}
      detailTwo={affiliation}
      onSuccess={onSuccess}
    />
  )
}
