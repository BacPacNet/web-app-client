'use client'
import React, { useState } from 'react'
import Navbar from '@/components/Timeline/Navbar'
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
import Recommendations from '@/components/Timeline/Recommendations'
import { useUniStore } from '@/store/store'
import { useParams } from 'next/navigation'
import { useGetUserPosts } from '@/services/community-timeline'
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
  const params = useParams()
  const { userData, userProfileData, userFollowingData } = useUniStore()
  const [modalContentType, setModalContentType] = useState<ModalContentType>()
  const { isLoading, data: TimelinePosts, error } = useGetUserPosts()
  const timelinePosts = TimelinePosts?.timelinePosts
  console.log(timelinePosts)

  console.log(isLoading, TimelinePosts, error)
  console.log(params)

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

  return (
    <main>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContentType && modalContent(modalContentType)}
      </Modal>
      <Navbar />
      <div className="flex justify-center items-center lg:items-start gap-7 mt-16 flex-col lg:flex-row xs:px-4 sm:px-0">
        <div className="flex flex-col gap-6">
          <ProfileCard
            userProfileData={userProfileData}
            userData={userData}
            setModalContentType={setModalContentType}
            setIsModalOpen={setIsModalOpen}
            isUserProfile={true}
            following={userFollowingData?.followingCount}
            followers={userFollowingData?.followerCount}
          />
          <Recommendations people={recommendations} />
        </div>
        <div className="flex flex-col justify-center items-stretch gap-5 max-w-[696px]">
          <PostInput setModalContentType={setModalContentType} setIsModalOpen={setIsModalOpen} type="Timeline" />
          <Dropdown options={options} defaultOption="Recent" />
          {isLoading && Array.from({ length: 2 }).map((_, index) => <PostSkeleton key={index} />)}
          {!isLoading &&
            timelinePosts?.map((post: any) => {
              return (
                <Post
                  key={post._id}
                  user="Joshua Welman"
                  university={post.userId}
                  year="2nd Yr. Graduate"
                  text={post.content}
                  date={post.createdAt}
                  avatar="/timeline/avatar.png"
                  likes={post.likeCount}
                  comments={0}
                  reposts={2}
                  shares={1}
                  userComments={comments}
                  setModalContentType={setModalContentType}
                  setIsModalOpen={setIsModalOpen}
                />
              )
            })}
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Timeline
