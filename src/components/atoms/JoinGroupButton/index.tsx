import React from 'react'
import Buttons from '@/components/atoms/Buttons'

interface Props {
  isPrivate: boolean
  isVerified: boolean
  isPending: boolean
  isJoined: boolean | null
  onClick: () => void
}

const JoinGroupButton: React.FC<Props> = ({ isPrivate, isVerified, isPending, isJoined, onClick }) => {
  if (isJoined) return null

  if (isPrivate) {
    if (!isVerified) {
      return (
        <Buttons variant="disable" size="extra_small_paddind_2" disabled>
          Verified Users Only
        </Buttons>
      )
    }

    return (
      <Buttons disabled={isPending} size="extra_small_paddind_2" onClick={onClick}>
        {isPending ? 'Request Pending' : 'Request Access'}
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
