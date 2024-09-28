'use client'
import React, { useState } from 'react'
import ProfileCard from '@/components/Timeline/ProfileCard'
import PostInput from '@/components/Timeline/PostInput'
import Dropdown from '@/components/Timeline/DropDown'
import Post from '@/components/Timeline/Post'
import Footer from '@/components/Footer/Footer'
import Modal from '@/components/Timeline/Modal'
import ConnectionsModal from '@/components/Timeline/Modals/ConnectionsModal'
import PollModal from '@/components/Timeline/Modals/PollModal'
import EditProfileModal from '@/components/Timeline/Modals/EditProfileModal'
import ReplyModal from '@/components/Timeline/Modals/ReplyModal'
import { ModalContentType } from '@/types/global'
import { PostInputType, PostType, singlePostEnum } from '@/types/constants'
import Recommendations from '@/components/Timeline/Recommendations'
import { useUniStore } from '@/store/store'
import { useGetTimelinePosts } from '@/services/community-timeline'
import PostSkeleton from '@/components/Timeline/PostSkeleton'
interface User {
  name: string
  bio: string
  university: string
  department: string
  location: string
  email: string
  phone: string
  dateOfBirth: string
  followers: number
  following: number
}
interface Post {
  user: User
  content: string
  dateTime: string
  likes: number
  comments: Comment[]
  reposts: number
}
interface Comment {
  user: User
  content: string
  likes: number
}

const options = ['Recent', 'Popular', 'Most Liked']

const roberta = {
  avatarUrl: '/timeline/avatar2.png',
  userAvatarUrl: '/timeline/avatar.png',
  name: 'Roberta Green',
  comment: 'Sorry that was a strange thing to ask.',
  replyingTo: 'Johnny Nitro and Kathryn Murphy',
}
const recommendations = [
  {
    name: 'Roberta Green',
    university: 'Nagoya University',
    affilation: '2nd Yr. Undergraduate, Psychology',
    avatar: '/timeline/avatar.png',
  },
  {
    name: 'Roberta Green',
    university: 'Nagoya University',
    affilation: '2nd Yr. Undergraduate, Psychology',
    avatar: '/timeline/avatar2.png',
  },
]

const Timeline = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { userData, userProfileData } = useUniStore()
  const [modalContentType, setModalContentType] = useState<ModalContentType>()
  const { isLoading, data: TimelinePosts, error } = useGetTimelinePosts(true)
  const timelinePosts = TimelinePosts?.timelinePosts

  const modalContent = (modalContentType: string) => {
    switch (modalContentType) {
      case 'ConnectionsModal':
        return <ConnectionsModal />
      case 'PollModal':
        return <PollModal />
      case 'EditProfileModal':
        return <EditProfileModal />
      case 'ReplyModal':
        return <ReplyModal {...roberta} setModalContentType={setModalContentType} setIsModalOpen={setIsModalOpen} />
      default:
        return null
    }
  }

  const PostsContainer = () => {
    if (isLoading) {
      return Array.from({ length: 2 }).map((_, index) => <PostSkeleton key={index} />)
    }
    if (error) {
      return <div>Something Went Wrong!</div>
    }
    return timelinePosts?.map((post: any) => {
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
    <main>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContentType && modalContent(modalContentType)}
      </Modal>
      <div className="flex justify-center items-center lg:items-start gap-7 mt-16 flex-col lg:flex-row xs:px-4 sm:px-0">
        <div className="flex flex-col gap-6">
          <ProfileCard
            userProfileData={userProfileData}
            userData={userData}
            setModalContentType={setModalContentType}
            setIsModalOpen={setIsModalOpen}
            isUserProfile={true}
            following={userProfileData?.following?.length}
            followers={userProfileData?.followers?.length}
          />
          <Recommendations people={recommendations} />
        </div>
        <div className="flex flex-col justify-center items-stretch gap-5 max-w-[696px]">
          <PostInput setModalContentType={setModalContentType} setIsModalOpen={setIsModalOpen} type={PostInputType.Timeline} />
          <Dropdown options={options} defaultOption="Recent" />
          <PostsContainer />
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Timeline
