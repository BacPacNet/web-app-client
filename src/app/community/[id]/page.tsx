'use client'
import Footer from '@/components/Footer/Footer'
import Modal from '@/components/Timeline/Modal'
import ConnectionsModal from '@/components/Timeline/Modals/ConnectionsModal'
import PollModal from '@/components/Timeline/Modals/PollModal'
import ReplyModal from '@/components/Timeline/Modals/ReplyModal'
import Post from '@/components/Timeline/Post'
import PostInput from '@/components/Timeline/PostInput'
import GroupInfo from '@/components/communityUniversity/GroupInfo'
import GroupSideBsr from '@/components/communityUniversity/GroupSideBsr'
import HeroSec from '@/components/communityUniversity/HeroSec'
import { useGetCommunity, useGetCommunityGroupPost, useGetCommunityGroups } from '@/services/community-university'
import { useUniStore } from '@/store/store'
import { ModalContentType } from '@/types/global'
import { PostInputType } from '@/types/constants'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import Navbar from '@/components/Timeline/Navbar'

const roberta = {
  avatarUrl: '/timeline/avatar2.png',
  userAvatarUrl: '/timeline/avatar.png',
  name: 'Roberta Green',
  comment: 'Sorry that was a strange thing to ask.',
  replyingTo: 'Johnny Nitro and Kathryn Murphy',
}
const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContentType, setModalContentType] = useState<ModalContentType>()
  const [currUserGroupRole, setCurrUserGroupRole] = useState('')
  const { id } = useParams<{ id: string }>()
  const { data } = useGetCommunity(id)
  const { userData, userProfileData } = useUniStore()

  const [isJoined, setIsJoined] = useState(false)
  const { data: communityGroups } = useGetCommunityGroups(id, isJoined)
  const [currSelectedGroup, setCurrSelectedGroup] = useState(communityGroups?.groups[0])
  const [isJoinedInGroup, setIsJoinedInGroup] = useState(false)
  const { data: communityGroupPost } = useGetCommunityGroupPost(currSelectedGroup?._id, isJoinedInGroup)

  const modalContent = (modalContentType: string) => {
    switch (modalContentType) {
      case 'ConnectionsModal':
        return <ConnectionsModal />
      case 'PollModal':
        return <PollModal />
      case 'ReplyModal':
        return <ReplyModal {...roberta} setModalContentType={setModalContentType} setIsModalOpen={setIsModalOpen} />
      default:
        return null
    }
  }

  useEffect(() => {
    const findGroupRole = (communities: any) => {
      return communities?.some((community: any) => {
        return community.communityGroups.some((group: any) => {
          if (group.communityGroupId === currSelectedGroup?._id) {
            setCurrUserGroupRole(group.role)
            return true
          }
          return false
        })
      })
    }

    if (!findGroupRole(userData.userVerifiedCommunities)) {
      findGroupRole(userData.userUnVerifiedCommunities)
    }
  }, [currSelectedGroup, userData])
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContentType && modalContent(modalContentType)}
      </Modal>
      <Navbar />
      <div className="flex flex-col items-center w-full gap-6 mt-10  pb-10">
        <HeroSec data={data} isJoined={isJoined} setIsJoined={setIsJoined} />
        <div className="flex justify-center w-11/12 max-sm:w-full max-md:w-11/12  max-xl:w-full max-md:flex-col px-16 max-sm:px-4">
          <GroupSideBsr
            data={communityGroups}
            isJoined={isJoined}
            currSelectedGroup={currSelectedGroup}
            setCurrSelectedGroup={setCurrSelectedGroup}
          />
          <div className="w-full flex flex-col ps-4 max-md:ps-0 max-md:pt-10 gap-2">
            <GroupInfo
              data={currSelectedGroup}
              isJoinedinCommunity={isJoined}
              setIsJoinedInGroup={setIsJoinedInGroup}
              isJoinedInGroup={isJoinedInGroup}
            />
            <div className="flex gap-2 text-sm pb-2 items-center font-medium">
              <p className="text-neutral-500">Sort By: Recent</p>
              <IoIosArrowDown color="#737373" />
            </div>
            <div className="flex flex-col gap-4">
              {!isJoinedInGroup ? (
                <div>JOin</div>
              ) : (
                <div>
                  <div>
                    {currUserGroupRole === 'Admin' || currUserGroupRole === 'Moderator' ? (
                      <PostInput
                        profileDp={userProfileData?.profile_dp?.imageUrl}
                        idToPost={currSelectedGroup._id}
                        setModalContentType={setModalContentType}
                        setIsModalOpen={setIsModalOpen}
                        type={PostInputType.Community}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                  {communityGroupPost?.communityPosts.map((item: any) => (
                    <div key={item._id} className="border-2 border-neutral-300 rounded-md w-[73%] max-xl:w-10/12 mt-6">
                      <Post
                        user={item?.user_id?.firstName + ' ' + item?.user_id?.lastName}
                        adminId={item.user_id._id}
                        university={item?.user_id?.university_name}
                        year={item?.user_id?.study_year + ' Yr. ' + ' ' + item?.user_id?.degree}
                        text={item.content}
                        date={item?.createdAt}
                        avatar={item?.user_id?.profile_dp?.imageUrl}
                        likes={item.likeCount}
                        comments={item.comments.length}
                        postID={item._id}
                        reposts={2}
                        shares={1}
                        userComments={item.comments}
                        setModalContentType={setModalContentType}
                        setIsModalOpen={setIsModalOpen}
                        isUniversity={true}
                        profileDp={userProfileData?.profile_dp?.imageUrl}
                        media={item?.imageUrl}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Page
