import { useCreateChatMessage } from '@/services/Messages'
import { useUploadToS3 } from '@/services/upload'
import { useUniStore } from '@/store/store'
import { ChatsArray, LatestMessage, SocketEnums } from '@/types/constants'
import { UPLOAD_CONTEXT } from '@/types/Uploads'
import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

type props = {
  userProfileId: string
  chatId: string
}

const MessageInputBox = ({ chatId, userProfileId }: props) => {
  const textareaRef: any = useRef(null)
  const { mutate: createNewMessage, isPending } = useCreateChatMessage()
  const [image, setImage] = useState<File | null>()
  const [isSending, setIsSending] = useState(false)
  const queryClient = useQueryClient()
  const { socket } = useUniStore()
  const { mutateAsync: uploadToS3 } = useUploadToS3()

  const handleImageUpload = async (files: File) => {
    if (files) {
      const uploadPayload = {
        files: [files],
        context: UPLOAD_CONTEXT.MESSAGE,
      }
      const response = await uploadToS3(uploadPayload)

      const dataToPush = { imageUrl: response?.data[0].imageUrl, publicId: response?.data[0]?.publicId }

      return dataToPush
    } else {
      console.error('No file selected.')
    }
  }

  const handleNewMessage = async () => {
    if (!textareaRef.current.value.trim() && !image) return

    setIsSending(true)
    let fileLink
    let data
    if (image) {
      fileLink = await handleImageUpload(image)
      data = {
        content: textareaRef.current.value,
        chatId,
        UserProfileId: userProfileId,

        media: fileLink ? [fileLink] : '',
      }
    } else {
      data = {
        content: textareaRef.current.value,
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

          queryClient.setQueryData(['userChats'], updatedChatData)
        }

        textareaRef.current.value = ''
        setImage(null)
        setIsSending(false)
        if (!socket) return
        socket.emit(SocketEnums.SEND_MESSAGE, newMessage)
      },
      onError: () => {
        setIsSending(false)
      },
    })
  }

  useEffect(() => {
    const textarea = textareaRef.current

    const adjustHeight = () => {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }

    if (textarea) {
      adjustHeight()
      textarea.addEventListener('input', adjustHeight)

      return () => {
        textarea.removeEventListener('input', adjustHeight)
      }
    }
  }, [])
  return (
    <div className="px-2 py-4 w-full relative">
      <motion.textarea
        ref={textareaRef}
        className="border-2 border-slate-300 rounded-lg outline-none w-full max-h-[100px] pe-14 overflow-y-clip p-2"
        whileFocus={{
          borderColor: '#3b82f6',
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
        }}
        transition={{ duration: 0.2 }}
        disabled={isSending || isPending}
      />
      <motion.button
        onClick={() => handleNewMessage()}
        className={`absolute right-5 bottom-8 text-white text-xs rounded-md px-2 py-1 ${
          isSending || isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary'
        }`}
        whileHover={!isSending && !isPending ? { scale: 1.05 } : {}}
        whileTap={!isSending && !isPending ? { scale: 0.95 } : {}}
        transition={{ duration: 0.1 }}
        disabled={isSending || isPending}
      >
        {isSending || isPending ? (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
          />
        ) : (
          'Send'
        )}
      </motion.button>
      {/* //image  */}
      <div className="absolute bottom-7 left-6">
        {image ? (
          <motion.img
            onClick={() => setImage(null)}
            className=" w-10 h-10 rounded-full"
            src={URL.createObjectURL(image)}
            alt=""
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.1 }}
          />
        ) : (
          <>
            <input
              style={{ display: 'none' }}
              type="file"
              id="message_image"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setImage(e.target.files[0])
                } else {
                  console.error('No file selected.')
                }
              }}
              disabled={isSending || isPending}
            />
            <motion.label
              htmlFor="message_image"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className={isSending || isPending ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
            >
              <p>Upload</p>
            </motion.label>
          </>
        )}
      </div>
    </div>
  )
}

export default MessageInputBox
