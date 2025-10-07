'use client'
import SubText from '@/components/atoms/SubText'
import Title from '@/components/atoms/Title'
import Image from 'next/image'
import placeholder from '@/assets/Logo Circle.svg'
import React, { useEffect, useState } from 'react'
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
  const [logoSrc, setLogoSrc] = useState(logo || placeholder)

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

  useEffect(() => {
    setLogoSrc(logo || placeholder)
  }, [logo])

  return (
    <div className="flex flex-col items-center gap-4 ">
      <Title>Leaving Community</Title>
      <SubText className="text-sm">Leaving your university community removes you from all its groups and deletes the ones you created.</SubText>
      <ul className="list-disc flex flex-col items-start w-full px-4 text-neutral-700 font-semibold">
        <li>You&apos;ll need to rejoin your groups.</li>
        <li>Group members will lose access to your groups.</li>
      </ul>

      <div className="flex justify-start items-center gap-2 mt-2 w-full">
        <Image
          width={40}
          height={40}
          className="w-[40px] h-[40px] object-contain rounded-full shadow-logo p-1"
          src={logoSrc}
          alt={universityName}
          onError={() => setLogoSrc(placeholder)}
        />
        {/*<Image src={logo || placeholder} width={36} height={36} alt={''} />*/}
        <span className="text-neutral-700 font-medium">{universityName}</span>
      </div>
      <div className="flex gap-4 w-full">
        <Buttons variant="danger" className="flex-1" size="medium" disabled={isLeaveLoading} onClick={onLeave}>
          Leave
        </Buttons>
        <Buttons variant="shade" className="flex-1" size="medium" onClick={() => closeModal()}>
          Cancel
        </Buttons>
      </div>
    </div>
  )
}

export default LeavingCommunityCard
