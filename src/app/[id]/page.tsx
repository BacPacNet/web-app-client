'use client'
import Footer from '@/components/Footer/Footer'
import Modal from '@/components/Timeline/Modal'
import EditProfileModal from '@/components/Timeline/Modals/EditProfileModal'
import ProfileCard from '@/components/Timeline/ProfileCard'
import CommunityProfileContainer from '@/components/communityProfile/CommunityProfileContainer'
import { ModalContentType } from '@/types/global'
import React, { useState } from 'react'
import { useUniStore } from '@/store/store'
import ConnectionsModal from '@/components/Timeline/Modals/ConnectionsModal'
import { userProfileType } from '@/store/userProfileSlice/userProfileType'
import { userType } from '@/store/userSlice/userType'

const Profile = () => {
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
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContentType && modalContent(modalContentType)}
      </Modal>
      <div className="flex justify-center w-full gap-6 mt-20 max-md:flex-col max-md:items-center pb-10  ">
        <ProfileCard
          userProfileData={userProfileData as userProfileType}
          userData={userData as userType}
          setModalContentType={setModalContentType}
          setIsModalOpen={setIsModalOpen}
          isUserProfile={true}
          following={userProfileData?.following?.length || 0}
          followers={userProfileData?.followers?.length || 0}
        />
        <CommunityProfileContainer />
      </div>
      <Footer />
    </>
  )
}

export default Profile
