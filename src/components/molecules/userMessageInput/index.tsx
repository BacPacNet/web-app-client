'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import { GoFileMedia } from 'react-icons/go'
import { ChatsArray, LatestMessage, SocketEnums } from '@/types/constants'
import { useUniStore } from '@/store/store'
import { useQueryClient } from '@tanstack/react-query'
import { useAcceptGroupRequest, useAcceptRequest, useCreateChatMessage } from '@/services/Messages'
import { Spinner } from '@/components/spinner/Spinner'
import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import Image from 'next/image'
import { validateImageFiles } from '@/lib/utils'
import { MdCancel } from 'react-icons/md'
import { useUploadToS3 } from '@/services/upload'

type Props = {
  userProfileId: string
  chatId: string
  isRequestNotAccepted: boolean
  isGroupChat: boolean
  isBlocked: boolean
  setAcceptedId: (value: string) => void
  setCurrTab: (value: string) => void
}

const UserMessageInput = ({ chatId, userProfileId, isRequestNotAccepted, setAcceptedId, setCurrTab, isGroupChat, isBlocked }: Props) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const valueRef = useRef<string>('')
  const [images, setImages] = useState<File[]>([])
  const [isImageUploading, setIsImageUploading] = useState(false)
  const { mutate: createNewMessage, isPending } = useCreateChatMessage()
  const { mutateAsync: acceptRequest, data: chatStatus, isError } = useAcceptRequest()
  const { mutateAsync: acceptGroupRequest, isError: groupErr } = useAcceptGroupRequest()
  const queryClient = useQueryClient()
  const { socket } = useUniStore()
  const { mutateAsync: uploadToS3 } = useUploadToS3()

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

  const handleNewMessage = async (message: string) => {
    if (!message.trim() && !images?.length) return

    setIsImageUploading(true)

    try {
      let mediaData = null

      if (images?.length) {
        const uploaded = await uploadToS3(images)
        mediaData = uploaded.data
      }

      const messagePayload = {
        content: message,
        chatId,
        UserProfileId: userProfileId,
        ...(mediaData && { media: mediaData }),
      }

      createNewMessage(messagePayload, {
        onSuccess: (newMessage) => {
          const chatId = newMessage.chat
          const chats = queryClient.getQueryData(['userChats'])

          if (!Array.isArray(chats)) return

          const updatedChats = chats.map((chat) => {
            if (chat._id === chatId._id) {
              return {
                ...chat,
                latestMessage: newMessage,
                latestMessageTime: new Date(newMessage.createdAt).getTime(),
              }
            }
            return chat
          })

          updatedChats.sort((a, b) => {
            const aTime = a.latestMessageTime > 0 ? a.latestMessageTime : new Date(a.createdAt || 0).getTime()

            const bTime = b.latestMessageTime > 0 ? b.latestMessageTime : new Date(b.createdAt || 0).getTime()

            return bTime - aTime
          })

          queryClient.setQueryData(['userChats'], updatedChats)
          //  chat end

          queryClient.setQueryData(['chatMessages', chatId._id], (oldMessages: LatestMessage[] = []) => {
            if (!oldMessages.length) return [newMessage]
            const lastMsg = oldMessages[oldMessages.length - 1]

            const isDuplicate = oldMessages.findIndex((msg) => msg._id === newMessage._id)

            if (isDuplicate !== -1) {
              const updated = [...oldMessages]
              updated[isDuplicate] = newMessage
              return updated
            }

            const isSameSender = lastMsg.sender.id === newMessage.sender.id
            const isRecent = new Date(newMessage.createdAt).getTime() - new Date(lastMsg.createdAt).getTime() < 60000
            const noMedia = !lastMsg.media?.length && !newMessage.media?.length

            if (isSameSender && isRecent && noMedia) {
              const merged = {
                ...lastMsg,
                content: `${lastMsg.content}\n${newMessage.content}`,
                createdAt: newMessage.createdAt,
              }
              return [...oldMessages.slice(0, -1), merged]
            }

            return [...oldMessages, newMessage]
          })
          socket?.emit(SocketEnums.SEND_MESSAGE, newMessage)
        },
      })

      textareaRef.current && (textareaRef.current.value = '')
    } catch (err) {
      console.error('Message send failed:', err)
    } finally {
      setIsImageUploading(false)
      setImages([])
    }
  }

  const handleSubmit = (e: React.FormEvent | KeyboardEvent) => {
    e.preventDefault()
    if (e instanceof KeyboardEvent && (e.key !== 'Enter' || e.shiftKey)) {
      return
    }
    if ((textareaRef.current && textareaRef.current.value.trim() !== '') || images.length) {
      handleNewMessage(textareaRef.current?.value || '')
      if (textareaRef.current) {
        textareaRef.current.value = ''
        // textareaRef.current.style.height = 'auto'
      }
    } else {
      showCustomDangerToast('Please enter message!')
    }
  }

  const handleAcceptRequestAndSendNewMessage = (e: React.FormEvent | KeyboardEvent) => {
    e.preventDefault()
    if (e instanceof KeyboardEvent && (e.key !== 'Enter' || e.shiftKey)) {
      return
    }
    if ((textareaRef.current && textareaRef.current.value.trim() !== '') || images.length) {
      if (isGroupChat) {
        acceptGroupRequestAndSendNewMessage(textareaRef.current?.value || '')
      } else {
        acceptRequestAndSendNewMessage(textareaRef.current?.value || '')
      }
      if (textareaRef.current) {
        textareaRef.current.value = ''
        textareaRef.current.style.height = 'auto'
      }
    } else {
      showCustomDangerToast('Please enter message!')
    }
  }

  const acceptRequestAndSendNewMessage = async (message: string) => {
    const response: any = await acceptRequest({ chatId })

    if (!response?.isRequestAccepted || isError) {
      console.error('Request not accepted. Unable to proceed.')
      return
    }

    let fileLink
    let data
    if (images) {
      fileLink = await uploadToS3(images)

      data = {
        content: message,
        chatId,
        UserProfileId: userProfileId,

        media: fileLink ? fileLink.data : '',
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
        setCurrTab('Inbox')
        setAcceptedId(chatId)
      },
    })
    if (textareaRef.current) {
      textareaRef.current.value = ''
    }
  }
  const acceptGroupRequestAndSendNewMessage = async (message: string) => {
    try {
      // Accept group request
      const response: any = await acceptGroupRequest({ chatId })
      if (groupErr) {
        showCustomDangerToast('Request not accepted. Unable to proceed.')
        return
      }

      // Upload image if present
      const fileLink = images.length > 0 ? await uploadToS3(images) : null

      // Build message payload
      const newMessagePayload = {
        content: message,
        chatId,
        UserProfileId: userProfileId,
        ...(fileLink?.data && { media: fileLink.data }),
      }

      // Create and send new message
      createNewMessage(newMessagePayload, {
        onSuccess: (newMessage) => {
          // Update message list in cache
          queryClient.setQueryData(['chatMessages', chatId], (oldMessages: LatestMessage[] = []) => [...oldMessages, newMessage])

          // Update latest message in user chats
          const chatData: ChatsArray | undefined = queryClient.getQueryData(['userChats'])
          if (chatData) {
            const updatedChatData = chatData
              .map((chat) => (chat._id === chatId ? { ...chat, latestMessage: newMessage } : chat))
              .sort((a, b) => {
                const dateA = new Date(a.latestMessage?.createdAt || 0).getTime()
                const dateB = new Date(b.latestMessage?.createdAt || 0).getTime()
                return dateB - dateA
              })

            queryClient.setQueryData(['userChats'], updatedChatData)
          }

          // Emit message to socket
          if (socket) {
            socket.emit(SocketEnums.SEND_MESSAGE, newMessage)
          }

          // Reset UI state
          if (textareaRef.current) textareaRef.current.value = ''
          setCurrTab('Inbox')
          setAcceptedId(chatId)
        },
      })
    } catch (error) {
      showCustomSuccessToast('Failed to send message after accepting group request')
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
    <div className="rounded-2xl bg-white w-full pt-2">
      {isBlocked ? (
        <div className="flex items-center justify-center font-poppins text-lg font-semibold">This chat is Blocked</div>
      ) : (
        <div className="border-[1px] border-neutral-300 w-full rounded-lg">
          <div className="flex gap-3 px-4 py-2">
            <textarea
              ref={textareaRef}
              className={`w-full border-none resize-none focus:outline-none overflow-y-auto  ${images?.length ? 'h-16' : 'h-8'} `}
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
                <input
                  id="userMessageImage"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  onChange={(e) => handleImageChange(e)}
                />
                <GoFileMedia size={24} className="text-neutral-400" />
              </label>
            </div>
            <div className="flex">
              {isRequestNotAccepted ? (
                <button
                  onClick={(e) => handleAcceptRequestAndSendNewMessage(e)}
                  className={`
                  bg-primary-500 text-white text-2xs
               rounded-lg px-3 py-2 `}
                >
                  {isPending ? <Spinner /> : 'Accept & Send Message'}
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className={`
                  bg-primary-500 text-white text-xs
                  rounded-lg px-3 py-1`}
                >
                  {isPending || isImageUploading ? <Spinner /> : 'Send'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMessageInput
