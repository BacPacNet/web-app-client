'use client'
import Footer from '@/components/Footer/Footer'
import Navbar from '@/components/Timeline/Navbar'
import Modal from '@/components/Timeline/Modal'
import EditProfileModal from '@/components/Timeline/Modals/EditProfileModal'
import ProfileCard from '@/components/Timeline/ProfileCard'
import CommunityProfileContainer from '@/components/communityProfile/CommunityProfileContainer'
import { ModalContentType } from '@/types/global'
import React, { useState } from 'react'
import { useUniStore } from '@/store/store'

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContentType, setModalContentType] = useState<ModalContentType>()
  const { userData, userProfileData, userFollowingData } = useUniStore()

  const modalContent = (modalContentType: string) => {
    switch (modalContentType) {
      case 'EditProfileModal':
        return <EditProfileModal />
      default:
        return null
    }
  }
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContentType && modalContent(modalContentType)}
      </Modal>
      <Navbar />
      <div className="flex justify-center w-full gap-6 mt-20 max-md:flex-col max-md:items-center pb-10  ">
        <ProfileCard
          userProfileData={userProfileData}
          userData={userData}
          setModalContentType={setModalContentType}
          setIsModalOpen={setIsModalOpen}
          isUserProfile={true}
          following={userFollowingData?.followingCount}
          followers={userFollowingData?.followerCount}
        />
        <CommunityProfileContainer />
      </div>
      <Footer />
    </>
  )
}

export default Profile
