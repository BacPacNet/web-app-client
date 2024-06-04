'use client'
import Footer from '@/components/Footer/Footer'
import Modal from '@/components/Timeline/Modal'
import ConnectionsModal from '@/components/Timeline/Modals/ConnectionsModal'
import PollModal from '@/components/Timeline/Modals/PollModal'
import ReplyModal from '@/components/Timeline/Modals/ReplyModal'
import Post from '@/components/Timeline/Post'
import GroupInfo from '@/components/communityUniversity/GroupInfo'
import GroupSideBsr from '@/components/communityUniversity/GroupSideBsr'
import HeroSec from '@/components/communityUniversity/HeroSec'
import { ModalContentType } from '@/types/global'
import React, { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

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
const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContentType, setModalContentType] = useState<ModalContentType>()

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

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {modalContentType && modalContent(modalContentType)}
      </Modal>

      <div className="flex flex-col items-center w-full gap-6 mt-10  pb-10">
        <HeroSec />
        <div className="flex justify-center w-11/12 max-sm:w-full max-md:w-11/12  max-xl:w-full max-md:flex-col px-16 max-sm:px-4">
          <GroupSideBsr />
          <div className="w-full flex flex-col ps-4 max-md:ps-0 max-md:pt-10 gap-2">
            <GroupInfo />
            <div className="flex gap-2 text-sm pb-2 items-center font-medium">
              <p className="text-neutral-500">Sort By: Recent</p>
              <IoIosArrowDown color="#737373" />
            </div>
            <div className="border-2 border-neutral-300 rounded-md">
              <Post
                user="Kathryn Murphy"
                university="Nagoya University"
                year="2nd Yr. Graduate"
                text="Law Debate Club will have its first debate starting next week Feb 19, 2024! Any participants interested send me a DM."
                date="9:31 PM · Feb 11, 2024"
                avatar="/timeline/avatar.png"
                likes={50}
                comments={3}
                reposts={2}
                shares={1}
                userComments={comments}
                setModalContentType={setModalContentType}
                setIsModalOpen={setIsModalOpen}
                isUniversity={true}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Page
