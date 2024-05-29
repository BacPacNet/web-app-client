/* eslint-disable @next/next/no-img-element */
'use client'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { ModalContentType } from '@/types/global'
import EmojiPicker from 'emoji-picker-react'
import React, { useState } from 'react'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import { LuList } from 'react-icons/lu'
import { MdGifBox, MdOutlineImage } from 'react-icons/md'

interface MessageProps {
  name: string
  comment: string
  avatarUrl?: string
  userAvatarUrl?: string
  replyingTo?: string
  setModalContentType: React.Dispatch<React.SetStateAction<ModalContentType>>
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ReplyModal: React.FC<MessageProps> = ({ name, comment, avatarUrl, userAvatarUrl, replyingTo, setIsModalOpen, setModalContentType }) => {
  const [inputValue, setInputValue] = useState('')

  const handleEmojiClick = (emojiData: any) => {
    setInputValue((prevValue) => prevValue + emojiData.emoji)
  }

  return (
    <div className="flex flex-col space-y-2 min-w-[590px] px-7">
      <div className="flex items-center gap-4 border-b border-gray-1 pb-5">
        {avatarUrl && <img src={avatarUrl} alt={name} className="w-16 h-16 rounded-full" />}
        <div className="flex-1 ">
          <p className="font-semibold text-base text-gray-dark">{name}</p>
          <p className="text-base text-[#525252]">{comment}</p>
          {replyingTo && (
            <div className="bg-gray-100 rounded-lg pt-2">
              <span className="text-gray-1 text-xs">Replying to {replyingTo}</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4 py-5">
        {userAvatarUrl && <img src={userAvatarUrl} alt={name} className="w-16 h-16 rounded-full" />}
        <input
          type="text"
          placeholder="Post your reply"
          className="w-full h-12 rounded-lg text-xl focus:outline-none"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <MdOutlineImage size={24} color="#737373" />
          <MdGifBox size={24} color="#737373" />
          {/* EMOJI Icon */}
          <Popover>
            <PopoverTrigger>
              <HiOutlineEmojiHappy size={24} color="#737373" />
            </PopoverTrigger>
            <PopoverContent className="relative top-14 right-48 w-auto p-0 border-none shadow-lg shadow-gray-light">
              <div>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            </PopoverContent>
          </Popover>
          <LuList
            size={24}
            color="#737373"
            onClick={() => {
              setModalContentType('PollModal')
              setIsModalOpen(true)
            }}
          />
        </div>
        <button className="text-white bg-primary px-3 py-2 rounded-full text-sm">Reply</button>
      </div>
    </div>
  )
}

export default ReplyModal
