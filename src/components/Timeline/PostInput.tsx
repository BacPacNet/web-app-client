'use client'
/* eslint-disable @next/next/no-img-element */
// components/PostInput.tsx
import React, { useState } from 'react'
import { MdOutlineImage } from 'react-icons/md'
import { MdGifBox } from 'react-icons/md'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import { LuList } from 'react-icons/lu'
import { ModalContentType } from '@/types/global'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import EmojiPicker from 'emoji-picker-react'
interface PostInputProps {
  setModalContentType: React.Dispatch<React.SetStateAction<ModalContentType>>
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const PostInput: React.FC<PostInputProps> = ({ setIsModalOpen, setModalContentType }) => {
  const [inputValue, setInputValue] = useState('')

  const handleEmojiClick = (emojiData: any) => {
    setInputValue((prevValue) => prevValue + emojiData.emoji)
  }

  return (
    <div className="flex flex-col gap-3 border-2 border-gray-dark rounded-lg justify-center items-center py-6 lg:max-w-[696px] sm:max-w-md xs:max-w-sm xs:mx-4 sm:mx-0">
      <div className="flex gap-4">
        <img src="/timeline/avatar.png" alt="User" className="w-10 h-10 sm:w-14 sm:h-14 rounded-full" />
        <div className="flex flex-col gap-3">
          <div className="w-auto border border-gray-light rounded-full py-1 sm:py-2 pr-5 flex">
            <input
              type="text"
              placeholder="Post on your timeline..."
              className="flex-grow mx-1 sm:mx-4 p-2 border-none focus:outline-none lg:min-w-[450px] text-xs sm:text-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button className="text-white bg-primary px-3 my-[2px] sm:px-3 sm:py-2 rounded-full text-sm">Post</button>
          </div>
          <div className="flex items-center gap-2">
            <MdOutlineImage size={24} color="#737373" />
            <MdGifBox size={24} color="#737373" />
            {/* EMOJI Icon */}
            <Popover>
              <PopoverTrigger>
                <HiOutlineEmojiHappy size={24} color="#737373" />
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-none shadow-lg shadow-gray-light">
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
        </div>
      </div>
    </div>
  )
}

export default PostInput
