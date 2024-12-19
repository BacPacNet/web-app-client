import Buttons from '@/components/atoms/Buttons'
import { useLeaveCommunity } from '@/services/community-university'
import React from 'react'
import { RiErrorWarningLine } from 'react-icons/ri'
import { closeModal } from '../Modal/ModalManager'
import { Spinner } from '@/components/spinner/Spinner'
import { useLeaveCommunityGroup } from '@/services/community-group'

type Props = {
  communityID?: string
  setIsUserJoinedCommunity?: (value: boolean) => void
  setIsUserJoinedCommunityGroup?: (value: boolean) => void
  communityGroupID?: string
}

const CommunityLeaveModal = ({ communityID, setIsUserJoinedCommunity, communityGroupID, setIsUserJoinedCommunityGroup }: Props) => {
  const { mutate: leaveCommunity, isPending: isLeaveLoading } = useLeaveCommunity()
  const { mutate: leaveCommunityGroup, isPending: isLeaveCommunityPending } = useLeaveCommunityGroup()
  const handleLeaveCommunity = () => {
    if (communityGroupID && setIsUserJoinedCommunityGroup) {
      leaveCommunityGroup(communityGroupID, {
        onSuccess: () => {
          setIsUserJoinedCommunityGroup(false)
          closeModal()
        },
      })
    }
    if (setIsUserJoinedCommunity && communityID) {
      leaveCommunity(communityID, {
        onSuccess: () => {
          setIsUserJoinedCommunity(false)
          closeModal()
        },
      })
    }
  }
  return (
    <div className="flex flex-col items-center justify-center gap-2 ">
      <RiErrorWarningLine size={180} className="" />
      <h3 className="text-base font-semibold font-poppins text-center">
        Are you sure you want to leave {communityID ? 'community?' : 'community group?'}
      </h3>
      <div className="flex items-center gap-4 w-full px-5">
        <Buttons onClick={() => closeModal()} className="w-11/12" size="extra_small">
          No
        </Buttons>
        <Buttons onClick={() => handleLeaveCommunity()} className="w-11/12" size="extra_small" variant="danger">
          {isLeaveLoading || isLeaveCommunityPending ? <Spinner /> : 'Yes'}
        </Buttons>
      </div>
    </div>
  )
}

export default CommunityLeaveModal
