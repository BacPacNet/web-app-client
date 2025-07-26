import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import avatar from '@assets/avatar.svg'
import aiLogo from '@/assets/chatbot/aiIcon.svg'
import { useUniStore } from '@/store/store'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ChatInput from '@/components/atoms/AI_AssistantInput'
import { useAskToChatbot } from '@/services/chatbot'
import StartAIChat from './StartAIChat'

interface ChatbotData {
  prompt: string
  response: string
}

interface Props {
  communityId: string
  chatbotData: ChatbotData[]
  setChatbotData: (chatbotItem: any) => void
}

const AIChat = ({ chatbotData, setChatbotData }: Props) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null) // Reference for last message
  const [threadId, setThreadId] = useState()
  const { mutate: mutateAskToChatbot, isPending: isAskToChatbotLoading } = useAskToChatbot()
  const { updateChatbotData, userData } = useUniStore()

  const handleAskChatbot = (message: string) => {
    setChatbotData({ prompt: message, response: '' })

    const handleMutationSuccess = (chatBotResponse: any) => {
      // Update threadId if a new thread is created
      if (chatBotResponse.threadId && chatBotResponse.isNewThread) {
        setThreadId(chatBotResponse.threadId)
      }

      // Update chatbot data with the response
      updateChatbotData(message, chatBotResponse.response || 'Something went wrong')
    }

    const handleMutationError = (error: any) => {
      // Update chatbot data with error message
      const errorMessage = error?.response?.data?.message || error?.message || 'Sorry, I encountered an error. Please try again.'
      updateChatbotData(message, errorMessage)
    }

    const userId = userData?.id
    if (!userId) {
      // Handle case when user is not authenticated
      updateChatbotData(message, 'Please log in to use the chatbot.')
      return
    }

    // Only include threadId in payload if it exists
    const basePayload = threadId ? { userId, prompt: message, threadId } : { userId, prompt: message }

    if (chatbotData.length === 0) {
      // For first message, don't pass threadId
      mutateAskToChatbot(
        { userId, prompt: message },
        {
          onSuccess: handleMutationSuccess,
          onError: handleMutationError,
        }
      )
    } else {
      // For subsequent messages, pass threadId if it exists
      mutateAskToChatbot(basePayload, {
        onSuccess: handleMutationSuccess,
        onError: handleMutationError,
      })
    }
  }

  // Auto-scroll to the bottom when chatbotData changes
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [chatbotData])

  return (
    <>
      {chatbotData.length === 0 ? (
        <StartAIChat />
      ) : (
        <div className="w-full flex h-full overflow-y-auto px-4 mb-2">
          <div className="flex flex-col gap-4  ">
            {chatbotData?.map((item: any, idx: any) => (
              <ChatCard key={idx} data={item} lastMessageRef={idx === chatbotData.length - 1 ? lastMessageRef : null} />
            ))}
          </div>
        </div>
      )}

      <div className="w-full flex justify-center relative">
        <ChatInput onSend={(message) => handleAskChatbot(message)} />
      </div>
    </>
  )
}

export default AIChat

const ChatCard = ({ data, lastMessageRef }: any) => {
  const { userProfileData } = useUniStore()
  return (
    <>
      <div ref={lastMessageRef} className="flex flex-col gap-2 chatbot-container">
        <div className="flex gap-3 items-start mt-5">
          <Image
            width={40}
            height={40}
            objectFit="cover"
            className="w-[40px] h-[40px] rounded-full"
            src={userProfileData?.profile_dp?.imageUrl || avatar}
            alt="profile.png"
          />
          <p className={`max-w-[80%] py-2 px-3 rounded-xl text-xs bg-neutral-100 text-neutral-700`}>{data?.prompt}</p>
        </div>
        {data?.response ? (
          <div className="flex gap-3 items-start mt-5">
            <Image width={40} height={40} objectFit="cover" className="w-[40px] h-[40px] rounded-full" src={aiLogo} alt="profile.png" />
            <p className={`max-w-[80%] text-neutral-700 py-2 px-3 rounded-xl text-xs bg-neutral-100`}>
              <Markdown remarkPlugins={[remarkGfm]}>{data?.response}</Markdown>
            </p>
          </div>
        ) : (
          <div className="flex gap-3 items-center mt-5">
            <Image width={40} height={40} objectFit="cover" className="w-[40px] h-[40px] rounded-full" src={aiLogo} alt="profile.png" />
            <div className="flex gap-1 justify-center">
              <span className="circle animate-loader"></span>
              <span className="circle animate-loader animation-delay-200"></span>
              <span className="circle animate-loader animation-delay-400"></span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
