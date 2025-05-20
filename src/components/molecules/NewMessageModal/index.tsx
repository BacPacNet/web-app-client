'use client'
import { Spinner } from '@/components/spinner/Spinner'
import { useCreateChatMessage, useCreateUserChat } from '@/services/Messages'
import { useUniStore } from '@/store/store'
import React, { useRef, useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { HiOutlineEmojiHappy } from 'react-icons/hi'

import { validateImageFiles } from '@/lib/utils'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import Image from 'next/image'
import { MdCancel } from 'react-icons/md'
import { GoFileMedia } from 'react-icons/go'
import { useRouter } from 'next/navigation'
import avatar from '@assets/avatar.svg'
import { useModal } from '@/context/ModalContext'

const NewMessageModal = ({ userIdToStartChatWith, avatarUrl, name }: { userIdToStartChatWith: string; avatarUrl: string; name: string }) => {
  const { mutateAsync: mutateCreateUserChat, isPending: userChatPending } = useCreateUserChat()
  const { mutateAsync: createNewMessage, isPending } = useCreateChatMessage()
  const { userProfileData } = useUniStore()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const valueRef = useRef<string>('')
  const [images, setImages] = useState<File[]>([])
  const router = useRouter()
  const { closeModal } = useModal()
  const [isImageUploading, setIsImageUploading] = useState(false)

  const handleIndividualUserClick = async (message: string) => {
    const createChatResponse: any = await mutateCreateUserChat({ userId: userIdToStartChatWith })

    // const data = {
    //   content: message,
    //   chatId: createChatResponse._id,
    //   UserProfileId: userProfileData?._id,
    // }

    let fileLink
    let data
    if (images) {
      setIsImageUploading(true)
      //   fileLink = await processImages(images)

      data = {
        content: message,
        chatId: createChatResponse._id,
        UserProfileId: userProfileData?._id,

        media: fileLink ? [fileLink] : '',
      }
    } else {
      data = {
        content: message,
        chatId: createChatResponse._id,
        UserProfileId: userProfileData?._id,
      }
    }
    await createNewMessage(data)
    setIsImageUploading(false)
    closeModal()
    router.replace(`/messages?id=${createChatResponse._id}`)
  }

  const handleSubmit = (e: React.FormEvent | KeyboardEvent) => {
    e.preventDefault()
    if (e instanceof KeyboardEvent && (e.key !== 'Enter' || e.shiftKey)) {
      return
    }
    if ((textareaRef.current && textareaRef.current.value.trim() !== '') || images.length) {
      handleIndividualUserClick(textareaRef.current?.value || '')
      if (textareaRef.current) {
        textareaRef.current.value = ''
        // textareaRef.current.style.height = 'auto'
      }
    } else {
      showCustomDangerToast('Please enter message!')
    }
  }
  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea) {
      valueRef.current = textareaRef.current.value
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 80) + 'px'
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
      const validation = validateImageFiles(fileArray)
      if (!validation.isValid) {
        showCustomDangerToast(validation.message)
        return
      }
      setImages((prevImages) => [...prevImages, ...fileArray])
    }
  }

  const handleImageRemove = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index))
  }

  return (
    <div className="rounded-2xl bg-white w-full pt-2">
      <div className="flex items-center gap-3 py-2">
        <Image src={avatarUrl || avatar} width={24} height={24} objectFit="cover" className="rounded-full w-6 h-6" alt="avatar.png" />
        <p className=" text-sm text-neutral-400">{'Messaging to ' + name}</p>
      </div>
      <div className="border-[1px] border-neutral-300 w-full rounded-lg">
        <div className="flex gap-3 px-4 py-2">
          <textarea
            ref={textareaRef}
            className={`w-full border-none resize-none focus:outline-none overflow-y-auto  ${images?.length ? 'h-16' : 'h-16'} `}
            placeholder="What’s on your mind?"
            onInput={handleInput}
          ></textarea>
        </div>
        {/* Display selected images */}
        <div className="flex flex-wrap gap-2 px-4">
          {images.map((image, index) => (
            <div key={index} className="relative">
              <Image width={64} height={64} src={URL.createObjectURL(image)} alt={`Selected ${index}`} className="w-16 h-16 object-cover rounded" />
              {/* Remove image button */}
              <div onClick={() => handleImageRemove(index)} className="absolute -top-1 -right-1 cursor-pointer text-sm">
                <MdCancel size={24} className="text-destructive-600 bg-white rounded-full" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between px-4 py-2">
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

            {/* <label htmlFor="postGof">
                <MdOutlineGifBox size={24} className="text-neutral-400" />
              </label> */}
            <label htmlFor="userMessageImage" className="cursor-pointer inline-block">
              <input id="userMessageImage" type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleImageChange(e)} />
              <GoFileMedia size={24} className="text-neutral-400" />
            </label>
          </div>
          <div className="flex">
            <button
              onClick={handleSubmit}
              className={`
                    bg-primary-500 text-white text-xs
                    rounded-lg px-3 py-1`}
            >
              {isPending || userChatPending ? <Spinner /> : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewMessageModal
