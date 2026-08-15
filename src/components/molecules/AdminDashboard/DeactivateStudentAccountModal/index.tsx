'use client'

import AdminDeactivateAccountModal from '@/components/molecules/AdminDashboard/AdminDeactivateAccountModal'

type Props = {
  userId: string
  studentName: string
  avatarUrl?: string
  initials: string
  avatarColorClass: string
  studyYear?: string | null
  major?: string | null
  onSuccess?: () => void
}

export default function DeactivateStudentAccountModal({
  userId,
  studentName,
  avatarUrl,
  initials,
  avatarColorClass,
  studyYear,
  major,
  onSuccess,
}: Props) {
  return (
    <AdminDeactivateAccountModal
      userId={userId}
      userName={studentName}
      avatarUrl={avatarUrl}
      initials={initials}
      avatarColorClass={avatarColorClass}
      detailOne={studyYear}
      detailTwo={major}
      onSuccess={onSuccess}
    />
  )
}
