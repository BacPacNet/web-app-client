import Buttons from '@/components/atoms/Buttons'
import { useLeaveCommunity } from '@/services/community-university'
import React from 'react'
import { RiErrorWarningLine } from 'react-icons/ri'
import { Spinner } from '@/components/spinner/Spinner'
import { useLeaveCommunityGroup } from '@/services/community-group'
import { useModal } from '@/context/ModalContext'

type Props = {
  communityID?: string
  setIsUserJoinedCommunity?: (value: boolean) => void
  setIsUserJoinedCommunityGroup?: (value: boolean) => void
  setIsMember?: (value: boolean) => void
  communityGroupID?: string
  applyFilters?: () => void
}

const CommunityLeaveModal = ({
  communityID,
  setIsUserJoinedCommunity,
  communityGroupID,
  setIsUserJoinedCommunityGroup,
  setIsMember,
  applyFilters,
}: Props) => {
  const { mutate: leaveCommunity, isPending: isLeaveLoading } = useLeaveCommunity()
  const { mutate: leaveCommunityGroup, isPending: isLeaveCommunityPending } = useLeaveCommunityGroup()
  const { closeModal } = useModal()

  const handleLeaveCommunity = () => {
    if (communityGroupID && setIsUserJoinedCommunityGroup) {
      leaveCommunityGroup(communityGroupID, {
        onSuccess: () => {
          applyFilters?.()
          setIsUserJoinedCommunityGroup(false)
          if (setIsMember) {
            setIsMember(false)
          }
          closeModal()
        },
      })
    }
    if (setIsUserJoinedCommunity && communityID) {
      leaveCommunity(communityID, {
        onSuccess: () => {
          applyFilters?.()
          setIsUserJoinedCommunity(false)
          closeModal()
        },
      })
    }
  }
  return (
    <div className="flex flex-col items-center justify-center gap-4 ">
      <RiErrorWarningLine size={100} className="" />
      <h3 className="text-sm font-semibold font-poppins text-center">
        Are you sure you want to leave {communityID ? 'community?' : 'community group?'}
      </h3>
      <div className="flex items-center gap-6 w-full px-5">
        <Buttons onClick={() => handleLeaveCommunity()} className="w-11/12" size="large" variant="danger">
          {isLeaveLoading || isLeaveCommunityPending ? <Spinner /> : 'Yes'}
        </Buttons>
        <Buttons onClick={() => closeModal()} className="w-11/12" size="large">
          No
        </Buttons>
      </div>
    </div>
  )
}

export default CommunityLeaveModal
