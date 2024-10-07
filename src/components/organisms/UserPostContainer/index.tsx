'use client'
import React, { ChangeEvent, useRef, useState } from 'react'
import { GoFileMedia } from 'react-icons/go'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import { MdOutlineGifBox } from 'react-icons/md'
import { VscSettings } from 'react-icons/vsc'
import avatar from '@assets/avatar.svg'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { CommunityPostData, PostInputData, PostInputType } from '@/types/constants'
import { useCreateGroupPost } from '@/services/community-university'
import { useCreateUserPost } from '@/services/community-timeline'
import { replaceImage } from '@/services/uploadImage'

type props = {
  communityID?: string
  communityGroupID?: string
  type: PostInputType.Community | PostInputType.Timeline
}

function UserPostContainer({ communityID, communityGroupID, type }: props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const valueRef = useRef<string>('')
  const [images, setImages] = useState<File[]>([])
  const { mutate: CreateGroupPost, isPending } = useCreateGroupPost()
  const { mutate: CreateTimelinePost } = useCreateUserPost()

  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea) {
      valueRef.current = textareaRef.current.value
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }
  // Handle emoji click
  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart
      const text = textareaRef.current.value
      const newText = text.slice(0, cursorPosition) + emoji + text.slice(cursorPosition)

      // Update the textarea value
      textareaRef.current.value = newText
      valueRef.current = newText // Update ref value
      handleInput() // Call input handler to update the ref value

      // Move the cursor to the right of the inserted emoji
      textareaRef.current.selectionStart = textareaRef.current.selectionEnd = cursorPosition + emoji.length

      // Refocus the textarea after emoji insertion
      textareaRef.current.focus()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const fileArray = Array.from(files)
      setImages((prevImages) => [...prevImages, ...fileArray]) // Store the actual files
    }
  }

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  const processImages = async (imagesData: File[]) => {
    const promises = imagesData.map((image) => replaceImage(image, ''))
    const results = await Promise.all(promises)
    return results.map((result) => ({
      imageUrl: result?.imageUrl,
      publicId: result?.publicId,
    }))
  }

  const handleGroupPost = async (inputValue: string) => {
    if (images.length) {
      const imagedata = await processImages(images)
      const data: PostInputData = {
        content: inputValue,
        imageUrl: imagedata,
      }

      //if type is community , add communityId field to data
      if (type === PostInputType.Community) {
        const communityData: CommunityPostData = {
          ...data,
          communityId: communityID,
          ...(communityGroupID && communityGroupID?.length > 0 && { communiyGroupId: communityGroupID }),
        }
        CreateGroupPost(communityData)
      } else if (type === PostInputType.Timeline) {
        CreateTimelinePost(data)
      }
    } else {
      const data: PostInputData = {
        content: inputValue,
      }
      if (type === PostInputType.Community) {
        const communityData: CommunityPostData = {
          ...data,
          communityId: communityID,
          ...(communityGroupID && communityGroupID?.length > 0 && { communiyGroupId: communityGroupID }),
        }
        CreateGroupPost(communityData)
      } else if (type === PostInputType.Timeline) {
        CreateTimelinePost(data)
      }
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // You can do something with the value here, like an API call
    handleGroupPost(valueRef.current)
  }
  return (
    <div className="rounded-2xl bg-white shadow-card mt-8 p-6">
      <div className="flex gap-3 items-center">
        <div
          style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }}
          className="flex items-center justify-center bg-white rounded-full w-[56px] h-[56px]"
        >
          <Image src={avatar} alt="avatar.png" />
        </div>
        <textarea
          ref={textareaRef}
          className="w-full p-2 border-none resize-none focus:outline-none max-h-40 overflow-y-auto"
          placeholder="What’s on your mind?"
          rows={1}
          onInput={handleInput}
        ></textarea>
      </div>
      <div className="flex items-center mt-10 justify-between">
        <div className="flex gap-6 items-center ">
          <Popover>
            <PopoverTrigger>
              <HiOutlineEmojiHappy size={24} className="text-neutral-400" />
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 border-none shadow-lg shadow-gray-light">
              <div>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            </PopoverContent>
          </Popover>

          <label htmlFor="postGof">
            <MdOutlineGifBox size={24} className="text-neutral-400" />
          </label>
          <label htmlFor="postImage" className="cursor-pointer inline-block">
            <input id="postImage" type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageChange(e)} />
            <GoFileMedia size={24} className="text-neutral-400" />
          </label>
          <label htmlFor="postPool">
            <VscSettings size={24} className="text-neutral-400" />
          </label>
        </div>
        <div>
          <button onClick={handleSubmit} className="bg-primary-500 text-white rounded-lg px-3 py-2 w-[69px]">
            Post
          </button>
        </div>
      </div>
      {/* Display selected images */}
      <div className="flex flex-wrap gap-2 mt-4">
        {images.map((image, index) => (
          <div key={index} className="relative">
            <img src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="w-24 h-24 object-cover rounded" />
            {/* Remove image button */}
            <button
              type="button"
              className="absolute top-0 right-0 bg-red-500 opacity-75 px-1 rounded-sm text-white text-2xs"
              onClick={() => handleImageRemove(index)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserPostContainer
