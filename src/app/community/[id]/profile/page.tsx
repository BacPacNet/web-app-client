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

// const sampleUser = {
//   name: 'Kathryn Murphy',
//   bio: 'Junior student major at Law, Nagoya University',
//   university: '3rd Year, Undergraduate, Law',
//   department: 'Junior student major at Law',
//   location: 'London, United Kingdom',
//   email: 'kathrynmurphy@gmail.com',
//   phone: '+44-3028-3239',
//   dateOfBirth: 'April 3rd, 2002',
//   followers: 21,
//   following: 63,
// }

const Profile = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContentType, setModalContentType] = useState<ModalContentType>()
  const [activeTab, setActiveTab] = useState<string>('Profile')
  const { userData, userProfileData, userFollowingData } = useUniStore()

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

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
      <Navbar activeTab={activeTab} onTabClick={handleTabClick} />
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
