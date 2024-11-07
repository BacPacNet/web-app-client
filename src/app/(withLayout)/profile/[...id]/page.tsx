'use client'
import Spinner from '@/components/atoms/spinner'
import PostContainer from '@/components/organisms/PostsContainer'
import { UserProfileCard } from '@/components/organisms/ProfileCard'
import Modal from '@/components/Timeline/Modal'
import ConnectionsModal from '@/components/Timeline/Modals/ConnectionsModal'
import EditProfileModal from '@/components/Timeline/Modals/EditProfileModal'
import ProfileCard from '@/components/Timeline/ProfileCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { useCheckSelfProfile } from '@/lib/utils'
import { useGetUserData } from '@/services/user'
import { PostType } from '@/types/constants'
import { ModalContentType } from '@/types/global'
import React, { useState } from 'react'

export default function Profile({ params }: { params: { id: string } }) {
  const userId = params.id[0]
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContentType, setModalContentType] = useState<ModalContentType>()
  const isSelfProfile = useCheckSelfProfile(userId)

  const { data: userProfileData, isLoading: isUserProfileDataLoading } = useGetUserData(userId)
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
  const { dob, profile, firstName, lastName, email } = userProfileData || {}
  const { bio, university_name, followers, following, study_year, major, degree, phone_number, country } = profile || {}
  return (
    <div className="h-with-navbar py-4">
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContentType && modalContent(modalContentType)}
      </Modal>
      {isUserProfileDataLoading || !userProfileData ? (
        <Skeleton className="w-full h-60 bg-slate-300" />
      ) : (
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
          avatarUrl={profile?.profile_dp?.imageUrl || ''}
          isVerifiedUniversity={true}
          country={country || ''}
          setModalContentType={setModalContentType}
          setIsModalOpen={setIsModalOpen}
          isSelfProfile={isSelfProfile}
        />
      )}
      <PostContainer userId={userId} type={PostType.Profile} />
    </div>
  )
}
