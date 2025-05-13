import { useCreateChatMessage } from '@/services/Messages'
import { useUploadToS3 } from '@/services/upload'
import { useUniStore } from '@/store/store'
import { ChatsArray, LatestMessage, SocketEnums } from '@/types/constants'
import { useQueryClient } from '@tanstack/react-query'
import React, { useEffect, useRef, useState } from 'react'

type props = {
  userProfileId: string
  chatId: string
}

const MessageInputBox = ({ chatId, userProfileId }: props) => {
  const textareaRef: any = useRef(null)
  const { mutate: createNewMessage } = useCreateChatMessage()
  const [image, setImage] = useState<File | null>()
  const queryClient = useQueryClient()
  const { socket } = useUniStore()
  const { mutateAsync: uploadToS3 } = useUploadToS3()

  const handleImageUpload = async (files: File) => {
    if (files) {
      const response = await uploadToS3([files])

      const dataToPush = { imageUrl: response?.data[0].imageUrl, publicId: response?.data[0]?.publicId }

      return dataToPush
    } else {
      console.error('No file selected.')
    }
  }

  const handleNewMessage = async () => {
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
        if (!socket) return
        socket.emit(SocketEnums.SEND_MESSAGE, newMessage)
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
      <textarea ref={textareaRef} className="border-2 border-slate-300 rounded-lg outline-none w-full max-h-[100px] pe-14 overflow-y-clip p-2" />
      <button onClick={() => handleNewMessage()} className="absolute right-5 bottom-8 bg-primary text-white text-xs rounded-md px-2 py-1">
        Send
      </button>
      {/* //image  */}
      <div className="absolute bottom-7 left-6">
        {image ? (
          <img onClick={() => setImage(null)} className=" w-10 h-10 rounded-full" src={URL.createObjectURL(image)} alt="" />
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
            />
            <label htmlFor="message_image">
              <p className="cursor-pointer">Upload</p>
            </label>
          </>
        )}
      </div>
    </div>
  )
}

export default MessageInputBox
