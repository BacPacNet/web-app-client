import SubText from '@/components/atoms/SubText'
import Title from '@/components/atoms/Title'
import Image from 'next/image'
import placeholder from '@/assets/Logo Circle.svg'
import React from 'react'
import Buttons from '@/components/atoms/Buttons'
import { useLeaveCommunity } from '@/services/community-university'
import { useModal } from '@/context/ModalContext'

interface LeavingCommunityCardProps {
  universityName: string
  logo: React.ReactNode // Allows either an <img> or an icon component
  setIsUserJoinedCommunity?: (value: boolean) => void
  setIsMember?: (value: boolean) => void
  communityId?: string
}

const LeavingCommunityCard: React.FC<LeavingCommunityCardProps> = ({ universityName, logo, setIsUserJoinedCommunity, communityId }) => {
  const { mutate: leaveCommunity, isPending: isLeaveLoading } = useLeaveCommunity()
  const { closeModal } = useModal()

  const onLeave = () => {
    if (setIsUserJoinedCommunity && communityId) {
      leaveCommunity(communityId, {
        onSuccess: () => {
          setIsUserJoinedCommunity(false)
          closeModal()
        },
      })
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 ">
      <Title>Leaving Community</Title>
      <SubText>
        If you leave your university community, you’ll be removed from all its groups. If you rejoin the community later, you’ll need to join the
        groups again manually.
      </SubText>

      <div className="flex justify-start items-center gap-2 mt-2 w-full">
        <Image
          width={40}
          height={40}
          className="w-[40px] h-[40px] object-contain rounded-full shadow-logo p-1"
          src={logo || placeholder}
          alt={universityName}
          //  onError={() => setLogoSrc(universityLogoPlaceholder)}
        />
        {/*<Image src={logo || placeholder} width={36} height={36} alt={''} />*/}
        <span className="text-neutral-700 font-medium">{universityName}</span>
      </div>
      <Buttons disabled={isLeaveLoading} onClick={onLeave}>
        Leave Anyways
      </Buttons>
    </div>
  )
}

export default LeavingCommunityCard
