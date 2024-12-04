'use client'
import ModalWrapper from '@/components/molecules/ModalWrapper'
import PostContainer from '@/components/organisms/PostsContainer'
import { UserProfileCard } from '@/components/organisms/ProfileCard'
import TimelinePostContainer from '@/components/organisms/TimelinePostContainer'
import Modal from '@/components/Timeline/Modal'
import ConnectionsModal from '@/components/Timeline/Modals/ConnectionsModal'
import EditProfileModal from '@/components/Timeline/Modals/EditProfileModal'
import ProfileCard from '@/components/Timeline/ProfileCard'
import { useUniStore } from '@/store/store'
import { PostType } from '@/types/constants'
import { ModalContentType } from '@/types/global'
import React, { useState } from 'react'

export default function Profile() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContentType, setModalContentType] = useState<ModalContentType>()
  const { userData, userProfileData } = useUniStore()
  const modalContent = (modalContentType: string) => {
    switch (modalContentType) {
      case 'EditProfileModal':
        return <EditProfileModal />
      case 'ConnectionsModal':
        return <ConnectionsModal />
      default:
        return null
    }
  }
  const { bio, university_name, university_id, followers, following, study_year, major, phone_number, dob, degree, country } = userProfileData
  const { firstName, lastName, email } = userData
  return (
    <div className="h-with-navbar py-4">
      {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContentType && modalContent(modalContentType)}
      </Modal> */}
      <ModalWrapper setModal={setIsModalOpen} isShown={isModalOpen} smallHeight={true}>
        {modalContentType && modalContent(modalContentType)}
      </ModalWrapper>
      <UserProfileCard
        name={`${firstName} ${lastName}`}
        isPremium={true}
        description={bio || ''}
        university={university_name || 'Lorem University'}
        isVerified={true}
        following={followers?.length || 0}
        followers={following?.length || 0}
        year={study_year || ''}
        degree={degree || ''}
        major={major || ''}
        email={email || ''}
        phone={phone_number || '0000'}
        location={'Bangalore'}
        birthday={dob || ''}
        avatarUrl={userProfileData?.profile_dp?.imageUrl || ''}
        isVerifiedUniversity={true}
        country={country || ''}
        setModalContentType={setModalContentType}
        setIsModalOpen={setIsModalOpen}
        universityLogo={(university_id as any)?.logos?.[0] || ''}
      />
      <TimelinePostContainer />
    </div>
  )
}
