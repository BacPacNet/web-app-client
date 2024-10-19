'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import { MdOutlineGifBox } from 'react-icons/md'
import { GoFileMedia } from 'react-icons/go'
import { VscSettings } from 'react-icons/vsc'
import { replaceImage } from '@/services/uploadImage'
import { ChatsArray, LatestMessage, SocketEnums } from '@/types/constants'
import { useUniStore } from '@/store/store'
import { useQueryClient } from '@tanstack/react-query'
import { useCreateChatMessage } from '@/services/Messages'

type Props = {
  userProfileId: string
  chatId: string
  isRequestNotAccepted: boolean
}

const UserMessageInput = ({ chatId, userProfileId, isRequestNotAccepted }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const valueRef = useRef<string>('')
  const [images, setImages] = useState<File[]>([])
  const { mutate: createNewMessage } = useCreateChatMessage()
  const queryClient = useQueryClient()
  const { socket } = useUniStore()

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

  const handleNewMessage = async (message: string) => {
    let fileLink
    let data
    if (images) {
      fileLink = await processImages(images)
      console.log('imgLink', fileLink)

      data = {
        content: message,
        chatId,
        UserProfileId: userProfileId,

        media: fileLink ? [fileLink] : '',
      }
    } else {
      data = {
        content: message,
        chatId,
        UserProfileId: userProfileId,
      }
    }

    createNewMessage(data, {
      onSuccess: (newMessage) => {
        queryClient.setQueryData(['chatMessages', chatId], (oldMessages: LatestMessage[]) => {
          return [...(oldMessages || []), newMessage]
        })

        const chatData: ChatsArray | undefined = queryClient.getQueryData(['userChats'])
        if (chatData) {
          const updatedChatData = chatData.map((chat) =>
            chat._id === chatId
              ? {
                  ...chat,
                  latestMessage: newMessage,
                }
              : chat
          )

          updatedChatData.sort((a, b) => {
            const dateA = a.latestMessage?.createdAt ? new Date(a.latestMessage.createdAt).getTime() : 0
            const dateB = b.latestMessage?.createdAt ? new Date(b.latestMessage.createdAt).getTime() : 0
            return dateB - dateA
          })

          queryClient.setQueryData(['userChats'], updatedChatData)
        }

        message = ''
        if (!socket) return
        socket.emit(SocketEnums.SEND_MESSAGE, newMessage)
      },
    })
  }

  const handleSubmit = (e: React.FormEvent | KeyboardEvent) => {
    e.preventDefault()
    if (e instanceof KeyboardEvent && (e.key !== 'Enter' || e.shiftKey)) {
      return
    }
    if (textareaRef.current) {
      console.log(textareaRef.current.value)
      handleNewMessage(textareaRef.current.value)
      textareaRef.current.value = ''
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        return
      } else {
        e.preventDefault()
        handleSubmit(e)
      }
    }
  }

  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener('keydown', handleKeyDown)
      }
    }
  }, [])
  return (
    <div className="rounded-2xl bg-white   px-1 w-full">
      <div className="border-2 border-neutral-300 w-full rounded-lg p-2 mb-10">
        <div className="flex gap-3 h-20">
          <textarea
            ref={textareaRef}
            className="w-full p-2 border-none resize-none focus:outline-none max-h-32 overflow-y-auto"
            placeholder="What’s on your mind?"
            rows={1}
            onInput={handleInput}
          ></textarea>
        </div>
        <div className="flex items-center mt-10 justify-between p-2">
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
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={isRequestNotAccepted}
              className={`${
                isRequestNotAccepted ? 'border border-neutral-200 text-neutral-300' : 'bg-primary-500 text-white'
              }   rounded-lg px-3 py-2 w-[69px] mt-5 `}
            >
              Post
            </button>
          </div>
        </div>
      </div>

      {/* Display selected images */}
      <div className="flex flex-wrap gap-2 mt-2 pb-2">
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

export default UserMessageInput
