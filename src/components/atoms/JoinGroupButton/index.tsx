import React from 'react'
import Buttons from '@/components/atoms/Buttons'
import { status } from '@/types/CommuityGroup'

interface Props {
  isPrivate: boolean
  isVerified: boolean
  isPending: boolean
  userStatus: status
  onClick: () => void
}

const JoinGroupButton: React.FC<Props> = ({ isPrivate, isVerified, isPending, onClick, userStatus }) => {
  if (isPrivate) {
    if (!isVerified) {
      return (
        <Buttons variant="disable" size="extra_small_paddind_2" disabled>
          Verified Users Only
        </Buttons>
      )
    }

    return (
      <Buttons disabled={userStatus === status.pending} size="extra_small_paddind_2" onClick={onClick}>
        {userStatus === status.pending ? 'Request Pending' : 'Request Access'}
      </Buttons>
    )
  }

  return (
    <Buttons disabled={isPending} size="extra_small_paddind_2" onClick={onClick}>
      Join Group
    </Buttons>
  )
}

export default JoinGroupButton
