'use client'
import Post from '@/components/Timeline/Post'
import { useGetPost } from '@/services/community-university'
import { useParams, useSearchParams } from 'next/navigation'
import Modal from '@/components/Timeline/Modal'
import ConnectionsModal from '@/components/Timeline/Modals/ConnectionsModal'
import PollModal from '@/components/Timeline/Modals/PollModal'

import React, { useState } from 'react'
import { ModalContentType } from '@/types/global'
import Navbar from '@/components/Timeline/Navbar'
import { PostType } from '@/types/constants'
import { useUniStore } from '@/store/store'
import PostSkeleton from '@/components/Timeline/PostSkeleton'
const UserPost = () => {
  const { id } = useParams<{ id: string }>()
  const searchParams = useSearchParams()
  const Type = searchParams.get('isType')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContentType, setModalContentType] = useState<ModalContentType>()
  const { data, isLoading } = useGetPost(id, Type)
  const item = data?.post

  const { userProfileData } = useUniStore()
  const modalContent = (modalContentType: string) => {
    switch (modalContentType) {
      case 'ConnectionsModal':
        return <ConnectionsModal />
      case 'PollModal':
        return <PollModal />
      default:
        return null
    }
  }

  return (
    <div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContentType && modalContent(modalContentType)}
      </Modal>
      <Navbar />

      <div className="border-2 border-neutral-300 rounded-md w-3/4 mx-auto  mt-6">
        {isLoading ? (
          <PostSkeleton />
        ) : (
          <Post
            isType={String(Type)}
            isSinglePost={true}
            user={item?.user_id?.firstName + ' ' + item?.user_id?.lastName}
            adminId={item?.user_id?._id}
            university={item?.user_id?.university_name}
            year={item?.user_id?.study_year + ' Yr. ' + ' ' + item?.user_id?.degree}
            text={item?.content}
            date={item?.createdAt}
            avatar={item?.user_id?.profile_dp?.imageUrl}
            likes={item?.likeCount}
            comments={item?.comments.length}
            postID={item?._id}
            reposts={2}
            shares={1}
            userComments={item?.comments}
            setModalContentType={setModalContentType}
            setIsModalOpen={setIsModalOpen}
            isUniversity={true}
            profileDp={userProfileData?.profile_dp?.imageUrl}
            media={item?.imageUrl}
            type={String(Type) == 'userPost' ? PostType.Timeline : PostType.Community}
          />
        )}
      </div>
    </div>
  )
}

export default UserPost
