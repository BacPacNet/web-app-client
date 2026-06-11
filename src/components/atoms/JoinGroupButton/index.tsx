import React from 'react'
import Buttons from '@/components/atoms/Buttons'
import { status } from '@/types/CommuityGroup'

interface Props {
  isPrivate: boolean
  isUniversityWide?: boolean
  isApplicant?: boolean
  isVerified: boolean
  isPending: boolean
  userStatus: status
  onClick: () => void
  isRequestRequiredToJoinGroup: boolean
}

const JoinGroupButton: React.FC<Props> = ({
  isPrivate,
  isUniversityWide,
  isApplicant,
  isVerified,
  isPending,
  onClick,
  userStatus,
  isRequestRequiredToJoinGroup,
}) => {
  if (isUniversityWide && isApplicant) {
    return (
      <Buttons variant="disable" size="medium" disabled>
        University Members Only
      </Buttons>
    )
  }

  if (isRequestRequiredToJoinGroup) {
    if (isUniversityWide && !isVerified) {
      return (
        <Buttons variant="disable" size="medium" disabled>
          University Members Only
        </Buttons>
      )
    }

    return (
      <Buttons disabled={userStatus === status.pending} size="medium" onClick={onClick}>
        {userStatus === status.pending ? 'Request Pending' : 'Request Access'}
      </Buttons>
    )
  }

  return (
    <Buttons disabled={isPending} size="medium" onClick={onClick}>
      Join Group
    </Buttons>
  )
}

export default JoinGroupButton
