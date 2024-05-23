/* eslint-disable @next/next/no-img-element */
// components/PostInput.tsx
import React from 'react'
import { MdOutlineImage } from 'react-icons/md'
import { MdGifBox } from 'react-icons/md'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import { LuList } from 'react-icons/lu'

const PostInput: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 border-2 border-gray-dark rounded-lg px-10 py-6">
      <div className=" flex gap-4">
        <img src="/timeline/avatar.png" alt="User" className=" w-14 h-14 rounded-full" />
        <div className="flex flex-col gap-3">
          <div className="w-auto border border-gray-light rounded-full py-2 pr-5 flex">
            <input
              type="text"
              placeholder="Post on your timeline..."
              className="flex-grow mx-4 p-2 border-none focus:outline-none min-w-[450px] text-sm"
            />
            <button className="text-white bg-primary px-3 py-2 rounded-full text-sm">Post</button>
          </div>
          <div className="flex items-center gap-2">
            <MdOutlineImage size={24} color="#737373" />
            <MdGifBox size={24} color="#737373" />
            <HiOutlineEmojiHappy size={24} color="#737373" />
            <LuList size={24} color="#737373" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostInput
