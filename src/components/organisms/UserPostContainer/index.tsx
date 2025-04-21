'use client'
import React, { useRef, useState } from 'react'
import { GoFileMedia } from 'react-icons/go'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import { MdOutlineGifBox } from 'react-icons/md'
import avatar from '@assets/avatar.svg'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { CommunityPostData, CommunityPostType, PostInputData, PostInputType, UserPostType } from '@/types/constants'
import { useCreateGroupPost } from '@/services/community-university'
import { useCreateUserPost } from '@/services/community-timeline'
import { replaceImage } from '@/services/uploadImage'
import { useUniStore } from '@/store/store'
import { Skeleton } from '@/components/ui/Skeleton'
import SelectDropdown from '@/components/atoms/SelectDropdown/SelectDropdown'
import { RxCrossCircled } from 'react-icons/rx'
import { Spinner } from '@/components/spinner/Spinner'
import { showToast } from '@/components/atoms/CustomToasts/CustomToasts'

type props = {
  communityID?: string
  communityGroupID?: string
  type: PostInputType.Community | PostInputType.Timeline
}

export const UserPostContainer = ({ communityID, communityGroupID, type }: props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const valueRef = useRef<string | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [postAccessType, setPostAccessType] = useState<CommunityPostType | UserPostType>(UserPostType.PUBLIC)
  const { mutate: CreateGroupPost, isPending } = useCreateGroupPost()
  const { mutate: CreateTimelinePost, isPending: userPostPending } = useCreateUserPost()
  const { userProfileData } = useUniStore()

  const communityPostTypeKey = Object.values(CommunityPostType)
  const userPostTypeKey = Object.values(UserPostType)
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
      imageUrl: result?.imageUrl || null,
      publicId: result?.publicId || null,
    }))
  }

  const handleGroupPost = async (inputValue: string) => {
    if (images.length) {
      const imagedata = await processImages(images)
      const data: PostInputData = {
        content: inputValue,
        imageUrl: imagedata,
        ...(type == PostInputType.Timeline ? { PostType: postAccessType } : { communityPostsType: postAccessType }),
      }

      //if type is community , add communityId field to data
      if (type === PostInputType.Community) {
        const communityData: CommunityPostData = {
          ...data,
          communityId: communityID,
          ...(communityGroupID && communityGroupID?.length > 0 && { communiyGroupId: communityGroupID }),
          isPostVerified: false,
        }
        CreateGroupPost(communityData)
      } else if (type === PostInputType.Timeline) {
        CreateTimelinePost(data)
      }
    } else {
      const data: PostInputData = {
        content: inputValue,
        ...(type == PostInputType.Timeline ? { PostType: postAccessType } : { communityPostsType: postAccessType }),
      }
      if (type === PostInputType.Community) {
        const communityData: CommunityPostData = {
          ...data,
          communityId: communityID,
          ...(communityGroupID && communityGroupID?.length > 0 && { communiyGroupId: communityGroupID }),
          isPostVerified: false,
        }
        CreateGroupPost(communityData)
      } else if (type === PostInputType.Timeline) {
        CreateTimelinePost(data)
      }
    }
    if (textareaRef.current) {
      textareaRef.current.value = ''
    }
    setImages([])
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // You can do something with the value here, like an API call
    if (!textareaRef.current?.value && !images.length) {
      return showToast('Enter in Input box to post', { variant: 'warning' })
    }
    return handleGroupPost(valueRef.current as string)
  }

  return (
    <div className="rounded-2xl bg-white shadow-card mt-4 p-4">
      <div className="flex gap-3 items-center">
        <div style={{ boxShadow: '0px 8px 40px rgba(0, 0, 0, 0.10)' }} className="flex-none rounded-full w-[45px] h-[45px]">
          {userProfileData ? (
            <Image
              width={45}
              height={45}
              objectFit="cover"
              className="object-cover rounded-full h-[inherit]"
              src={userProfileData?.profile_dp?.imageUrl || avatar}
              alt="avatar.png"
            />
          ) : (
            <Skeleton className="w-[56px] h-[56px] rounded-full bg-slate-300" />
          )}
        </div>
        <textarea
          ref={textareaRef}
          className="w-full p-2 border-none resize-none focus:outline-none max-h-40 overflow-y-auto font-sans font-normal"
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
          <div className="w-28 max-sm:w-20">
            {type == PostInputType.Community ? (
              <SelectDropdown
                options={communityPostTypeKey}
                value={postAccessType}
                onChange={(e: any) => setPostAccessType(e)}
                placeholder=""
                icon={'single'}
                // search={true}
                err={false}
                showIcon={true}
                isAllowedToRemove={false}
              />
            ) : (
              <SelectDropdown
                options={userPostTypeKey}
                value={postAccessType}
                onChange={(e: any) => setPostAccessType(e)}
                placeholder=""
                icon={'single'}
                // search={true}
                err={false}
                showIcon={true}
                isAllowedToRemove={false}
              />
            )}
          </div>
        </div>
        <div>
          <button onClick={handleSubmit} className="text-xs bg-primary-500 text-white rounded-lg px-4 py-1">
            {isPending || userPostPending ? <Spinner /> : 'Post'}
          </button>
        </div>
      </div>
      {/* Display selected images */}
      <div className="flex flex-wrap gap-4 ">
        {images.map((image, index) => (
          <div key={index} className="relative w-fit">
            <img src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="w-24 h-24 object-cover rounded" />
            {/* Remove image button */}
            <div onClick={() => handleImageRemove(index)} className="absolute top-1 right-1 cursor-pointer text-sm">
              <RxCrossCircled />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default UserPostContainer
