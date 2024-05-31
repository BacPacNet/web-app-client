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

      <div className="w-1/2 max-md:w-9/12 max-sm:w-11/12 border-2 rounded-lg border-[#737373] max-h-max ">
        <CommunityProfileOption selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        {selectedOption == valueType.Posts ? (
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
            isUserProfile={true}
          />
        ) : selectedOption == valueType.Media ? (
          <Post
            user="Kathryn Murphy"
            university="Nagoya University"
            year="2nd Yr. Graduate"
            text="Beautiful building landscapes in the japanese skyline."
            date="9:31 PM · Feb 11, 2024"
            avatar="/timeline/avatar.png"
            likes={50}
            comments={3}
            reposts={2}
            shares={1}
            userComments={comments}
            setModalContentType={setModalContentType}
            setIsModalOpen={setIsModalOpen}
            isUserProfile={true}
            media="https://cdn.pixabay.com/photo/2016/04/07/18/36/architecture-1314416_1280.jpg"
          />
        ) : selectedOption == valueType.Saved ? (
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
            isUserProfile={true}
            saved={true}
          />
        ) : selectedOption == valueType.Settings ? (
          <CommunityProfileSettings />
        ) : (
          <Post
            user="Kathryn Murphy"
            university="Nagoya University"
            year="2nd Yr. Graduate"
            text="Beautiful building landscapes in the japanese skyline."
            date="9:31 PM · Feb 11, 2024"
            avatar="/timeline/avatar.png"
            likes={50}
            comments={3}
            reposts={2}
            shares={1}
            userComments={comments}
            setModalContentType={setModalContentType}
            setIsModalOpen={setIsModalOpen}
            isUserProfile={true}
          />
        )}
      </div>
    </>
  )
}

export default CommunityProfileContainer
