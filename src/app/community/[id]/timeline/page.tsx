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

// SAMPLE DATA FOR TESTING

// const samplePost = {
//   user: {
//     name: 'Joshua Welman',
//     university: 'Nagoya University',
//     department: '2nd Yr. Graduate',
//     location: '',
//     email: '',
//     phone: '',
//     dateOfBirth: '',
//     followers: 0,
//     following: 0,
//   },
//   content: 'Can someone help me with this chemistry equation? Here\'s the link to the google drive: //https:www.bukochem.com/homework/A1-35',
//   dateTime: 'Feb 11, 2024 - Post from Bukio\'s Chemistry Lab at Nagoya University',
//   likes: 50,
//   comments: [
//     {
//       user: {
//         name: 'Johnny Nitro',
//         university: '',
//         department: '',
//         location: '',
//         email: '',
//         phone: '',
//         dateOfBirth: '',
//         followers: 0,
//         following: 0,
//       },
//       content: 'Yeah give me a second I\'ll try to solve it and send the solution over your DMs.',
//       likes: 4,
//     },
//   ],
//   reposts: 2,
// };
// const sampleUser = {
//   name: 'Kathryn Murphy',
//   bio: 'Junior student major at Law, Nagoya University',
//   university: '3rd Year, Undergraduate, Law',
//   department: 'Department of Liberal Arts',
//   location: 'London, United Kingdom',
//   email: 'kathrynmurphy@gmail.com',
//   phone: '+44-3028-3239',
//   dateOfBirth: 'April 3rd, 2002',
//   followers: 21,
//   following: 63,
// }
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
  const [activeTab, setActiveTab] = useState<string>('Timeline')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { userData, userProfileData, userFollowingData } = useUniStore()
  const [modalContentType, setModalContentType] = useState<ModalContentType>()
  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

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
  // useEffect(() => {
  // }, [modalContentType])

  return (
    <main>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContentType && modalContent(modalContentType)}
      </Modal>
      <Navbar activeTab={activeTab} onTabClick={handleTabClick} />
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
          <PostInput setModalContentType={setModalContentType} setIsModalOpen={setIsModalOpen} />
          <Dropdown options={options} defaultOption="Recent" />
          <Post
            user="Joshua Welman"
            university="Nagoya University"
            year="2nd Yr. Graduate"
            text="Can someone help me with this chemistry equation? Here’s the link to the google drive:"
            link="https://www.butkochem.com/homework/A1-35"
            date="9:31 PM · Feb 11, 2024"
            avatar="/timeline/avatar.png"
            likes={50}
            comments={3}
            reposts={2}
            shares={1}
            userComments={comments}
            setModalContentType={setModalContentType}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      </div>
      <Footer />
    </main>
  )
}

export default Timeline
