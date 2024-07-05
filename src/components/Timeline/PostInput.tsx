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
import { useCreateGroupPost } from '@/services/community-university'
import { replaceImage } from '@/services/uploadImage'
interface PostInputProps {
  setModalContentType: React.Dispatch<React.SetStateAction<ModalContentType>>
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  idToPost?: string
  profileDp?: string
}

const PostInput: React.FC<PostInputProps> = ({ setIsModalOpen, setModalContentType, idToPost, profileDp }) => {
  const [inputValue, setInputValue] = useState('')
  const [ImageValue, setImageValue] = useState<any>()
  const { mutate: CreateGroupPost } = useCreateGroupPost()

  const handleEmojiClick = (emojiData: any) => {
    setInputValue((prevValue) => prevValue + emojiData.emoji)
  }

  const handleGroupPost = async () => {
    if (inputValue.length <= 1) {
      return console.log('Please type something to post!')
    }

    if (ImageValue) {
      // setProfileImage(files[0]);
      const imagedata: any = await replaceImage(ImageValue, '')

      const data = {
        communityId: idToPost,
        content: inputValue,
        imageUrl: { imageUrl: imagedata?.imageUrl, publicId: imagedata?.publicId },
      }
      CreateGroupPost(data)
    } else {
      const data = {
        communityId: idToPost,
        content: inputValue,
      }
      CreateGroupPost(data)
    }
  }

  return (
    <div className="flex flex-col gap-3 border-2 border-gray-dark rounded-lg justify-center items-center py-6 lg:max-w-[696px] sm:max-w-md xs:max-w-sm xs:mx-4 sm:mx-0">
      <div className="flex gap-4">
        <img src={profileDp} alt="User" className="w-10 h-10 sm:w-14 sm:h-14 rounded-full" />
        <div className="flex flex-col gap-3">
          <div className="w-auto border border-gray-light rounded-full py-1 sm:py-2 pr-5 flex">
            <input
              type="text"
              placeholder="Post on your timeline..."
              className="flex-grow mx-1 sm:mx-4 p-2 border-none focus:outline-none lg:min-w-[450px] text-xs sm:text-sm"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={() => handleGroupPost()} className="text-white bg-primary px-3 my-[2px] sm:px-3 sm:py-2 rounded-full text-sm">
              Post
            </button>
          </div>
          {ImageValue && (
            <div className="relative w-11/12">
              <img className="" src={URL.createObjectURL(ImageValue)} alt="" />
              <p onClick={() => setImageValue('')} className="absolute right-0 top-0 w-5 h-5 bg-white rounded-full text-center">
                X
              </p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <div>
              <input style={{ display: 'none' }} type="file" id="postImage" onChange={(e: any) => setImageValue(e.target.files[0])} />
              <label htmlFor="postImage">
                <MdOutlineImage size={24} color="#737373" />
              </label>
            </div>
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
