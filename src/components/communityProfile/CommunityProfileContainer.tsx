'use client'
import React, { useState } from 'react'
import CommunityProfileOption from './CommunityProfileOption'
import CommunityProfileSettings from './CommunityProfileSettings/CommunityProfileSettings'
import { valueType } from './communityProfileOptionEnum'
import Post from '../Timeline/Post'
import { ModalContentType } from '@/types/global'
import Modal from '../Timeline/Modal'
import ConnectionsModal from '../Timeline/Modals/ConnectionsModal'
import PollModal from '../Timeline/Modals/PollModal'
import ReplyModal from '../Timeline/Modals/ReplyModal'
import { PostType, singlePostEnum } from '@/types/constants'
import { useGetUserPosts } from '@/services/community-timeline'
import PostSkeleton from '../Timeline/PostSkeleton'

const comments = [
  {
    id: 1,
    user: 'Johnny Nitro',
    text: "Yeah give me a second I'll try to solve it and send the solution over your DMs.",
    date: '5d',
    avatar: '/timeline/avatar.png',
    likes: 4,
  },
]

const roberta = {
  avatarUrl: '/timeline/avatar2.png',
  userAvatarUrl: '/timeline/avatar.png',
  name: 'Roberta Green',
  comment: 'Sorry that was a strange thing to ask.',
  replyingTo: 'Johnny Nitro and Kathryn Murphy',
}

const CommunityProfileContainer = () => {
  const [selectedOption, setSelectedOption] = useState('Posts')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContentType, setModalContentType] = useState<ModalContentType>()
  const { isLoading, data: UserPosts, error } = useGetUserPosts()
  const userPosts = UserPosts?.userPosts

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

  const PostsContainer = () => {
    if (isLoading) {
      return <PostSkeleton />
    }
    if (error) {
      console.log(error)
      return <div>Something Went Wrong!</div>
    }
    return userPosts?.map((post: any) => {
      return (
        <Post
          key={post._id}
          user={post?.user_id?.firstName + ' ' + post?.user_id?.lastName}
          adminId="null"
          university={post.user_id?.university_name}
          year={post?.user_id?.study_year + ' Yr. ' + ' ' + post?.user_id?.degree}
          text={post.content}
          date={post.createdAt}
          avatar={post?.user_id?.profile_dp?.imageUrl}
          likes={post.likeCount}
          comments={post.comments.length}
          reposts={2}
          shares={1}
          userComments={post.comments}
          setModalContentType={setModalContentType}
          setIsModalOpen={setIsModalOpen}
          postID={post._id}
          type={PostType.Timeline}
          isType={'communityId' in post ? singlePostEnum.CommunityPost : singlePostEnum.userPost}
        />
      )
    })
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContentType && modalContent(modalContentType)}
      </Modal>

      <div className="w-1/2 max-md:w-9/12 max-sm:w-11/12 border-2 rounded-lg border-[#737373] max-h-max lg:max-w-[696px]">
        <CommunityProfileOption selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        {selectedOption == valueType.Posts ? (
          <PostsContainer />
        ) : selectedOption == valueType.Media ? (
          <Post
            isType={'userPost'}
            postID={'123'}
            user="Kathryn Murphy"
            adminId="123"
            university="Nagoya University"
            year="2nd Yr. Graduate"
            text="Beautiful building landscapes in the japanese skyline."
            date="9:31 PM · Feb 11, 2024"
            avatar="/timeline/avatar.png"
            likes={[]}
            comments={3}
            reposts={2}
            shares={1}
            userComments={comments}
            setModalContentType={setModalContentType}
            setIsModalOpen={setIsModalOpen}
            isUserProfile={true}
            media={[]}
            type={PostType.Community}
          />
        ) : selectedOption == valueType.Saved ? (
          <Post
            isType={'userPost'}
            postID={'123'}
            user="Kathryn Murphy"
            adminId="123"
            university="Nagoya University"
            year="2nd Yr. Graduate"
            text="Law Debate Club will have its first debate starting next week Feb 19, 2024! Any participants interested send me a DM."
            date="9:31 PM · Feb 11, 2024"
            avatar="/timeline/avatar.png"
            likes={[]}
            comments={3}
            reposts={2}
            shares={1}
            userComments={comments}
            setModalContentType={setModalContentType}
            setIsModalOpen={setIsModalOpen}
            isUserProfile={true}
            saved={true}
            type={PostType.Community}
          />
        ) : selectedOption == valueType.Settings ? (
          <CommunityProfileSettings />
        ) : (
          <Post
            isType={'userPost'}
            postID={'123'}
            user="Kathryn Murphy"
            adminId="123"
            university="Nagoya University"
            year="2nd Yr. Graduate"
            text="Beautiful building landscapes in the japanese skyline."
            date="9:31 PM · Feb 11, 2024"
            avatar="/timeline/avatar.png"
            likes={[]}
            comments={3}
            reposts={2}
            shares={1}
            userComments={comments}
            setModalContentType={setModalContentType}
            setIsModalOpen={setIsModalOpen}
            isUserProfile={true}
            type={PostType.Community}
          />
        )}
      </div>
    </>
  )
}

export default CommunityProfileContainer
