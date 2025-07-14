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
import { generateFileId, validateImageFiles, validateUploadedFiles } from '@/lib/utils'
import { useUploadToS3 } from '@/services/upload'
import { FileWithId, UPLOAD_CONTEXT } from '@/types/Uploads'
import MediaPreview from '../MediaPreview'
import { TbFileUpload } from 'react-icons/tb'
import Buttons from '@/components/atoms/Buttons'

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
  const [files, setFiles] = useState<FileWithId[]>([])
  const [isImageUploading, setIsImageUploading] = useState(false)
  const { mutate: createNewMessage, isPending } = useCreateChatMessage()
  const { mutateAsync: acceptRequest, data: chatStatus, isError } = useAcceptRequest()
  const { mutateAsync: acceptGroupRequest, isError: groupErr } = useAcceptGroupRequest()
  const queryClient = useQueryClient()
  const { socket } = useUniStore()
  const { mutateAsync: uploadToS3 } = useUploadToS3()

  const MAX_HEIGHT = 300

  const handleInput = () => {
    const textarea = textareaRef.current
    if (textarea) {
      valueRef.current = textareaRef.current.value
      textarea.style.height = 'auto'
      const newHeight = Math.min(textarea.scrollHeight, MAX_HEIGHT)
      textarea.style.height = `${newHeight}px`
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

  const handleNewMessage = async (message: string) => {
    if (!message.trim() && !files?.length) return

    setIsImageUploading(true)

    try {
      let mediaData = null

      if (files?.length) {
        const uploadPayload = {
          files: files.map((f) => f.file),
          context: UPLOAD_CONTEXT.MESSAGE,
        }
        const uploaded = await uploadToS3(uploadPayload)
        mediaData = uploaded.data
      }

      const messagePayload = {
        content: message.trim(),
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
      if (textareaRef.current) {
        textareaRef.current.value = ''
        textareaRef.current.style.height = 'auto'
      }
    } catch (err) {
      console.error('Message send failed:', err)
    } finally {
      setIsImageUploading(false)
      setFiles([])
    }
  }

  const handleSubmit = (e: React.FormEvent | KeyboardEvent) => {
    e.preventDefault()
    if (e instanceof KeyboardEvent && (e.key !== 'Enter' || e.shiftKey)) {
      return
    }
    if ((textareaRef.current && textareaRef.current.value.trim() !== '') || files.length) {
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
    if ((textareaRef.current && textareaRef.current.value.trim() !== '') || files.length) {
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
    if (files) {
      const uploadPayload = {
        files: files.map((f) => f.file),
        context: UPLOAD_CONTEXT.MESSAGE,
      }
      fileLink = await uploadToS3(uploadPayload)

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

      const uploadPayload = {
        files: files.map((f) => f.file),
        context: UPLOAD_CONTEXT.MESSAGE,
      }
      // Upload image if present
      const fileLink = files.length > 0 ? await uploadToS3(uploadPayload) : null

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

  const handleFileRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const handleOpenPDF = (file: File) => {
    const fileURL = URL.createObjectURL(file)
    window.open(fileURL, '_blank')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = e.target.files ? Array.from(e.target.files) : []
    const validation = validateUploadedFiles(newFiles)
    if (!validation.isValid) {
      showCustomDangerToast(validation.message)
      return
    }

    const mappedFiles: FileWithId[] = newFiles.map((file) => ({
      id: generateFileId(file),
      file,
    }))

    const totalFiles = files.length + mappedFiles.length
    if (totalFiles > 4) {
      showCustomDangerToast('You can upload a maximum of 4 files.')
      return
    }

    setFiles((prev) => [...prev, ...mappedFiles])
    e.target.value = ''
  }

  return (
    <div className="rounded-lg bg-white w-full pt-2">
      {isBlocked ? (
        <div className="flex items-center justify-center font-poppins text-lg font-semibold">This chat is Blocked</div>
      ) : (
        <div className="border border-neutral-300 w-full rounded-lg">
          {/* Text Input */}
          <div className="flex gap-3 px-4 py-2">
            <textarea
              ref={textareaRef}
              className={`w-full border-none resize-none focus:outline-none overflow-y-auto`}
              placeholder="What's on your mind?"
              onInput={handleInput}
            />
          </div>

          {/* Media Preview */}
          <div className="flex flex-wrap gap-2 px-4">
            <MediaPreview files={files} onRemove={handleFileRemove} onOpenPDF={handleOpenPDF} />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex gap-3 items-center">
              {/* Emoji Picker */}
              <Popover>
                <PopoverTrigger>
                  <HiOutlineEmojiHappy size={24} className="text-neutral-400" />
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 border-none shadow-lg shadow-gray-light">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </PopoverContent>
              </Popover>

              {/* Image Upload */}
              <label htmlFor="chatImageUpload" className="cursor-pointer">
                <input
                  id="chatImageUpload"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <GoFileMedia size={24} className="text-neutral-400" />
              </label>

              {/* Document Upload */}
              <label htmlFor="chatFileUpload" className="cursor-pointer">
                <input
                  id="chatFileUpload"
                  type="file"
                  multiple
                  accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <TbFileUpload size={24} className="text-neutral-400" />
              </label>
            </div>

            {/* Send / Accept & Send Button */}
            <div>
              {isRequestNotAccepted ? (
                <button onClick={handleAcceptRequestAndSendNewMessage} className="bg-primary-500 text-white text-2xs rounded-lg px-3 py-2">
                  {isPending ? <Spinner /> : 'Accept & Send Message'}
                </button>
              ) : (
                <Buttons onClick={handleSubmit} variant="primary" size="medium">
                  {isPending || isImageUploading ? <Spinner /> : 'Send'}
                </Buttons>
                //<button onClick={handleSubmit} className="bg-primary-500 text-white text-xs rounded-lg px-3 py-1">
                //  {isPending || isImageUploading ? <Spinner /> : 'Send'}
                //</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMessageInput
