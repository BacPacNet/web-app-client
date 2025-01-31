import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import avatar from '@assets/avatar.svg'
import aiLogo from '@/assets/chatbot/aiIcon.svg'
import { useUniStore } from '@/store/store'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ChatInput from '@/components/atoms/AI_AssistantInput'
import { useAskToChatbot, useGetThread } from '@/services/chatbot'
import StartAIChat from './StartAIChat'

const dummyChatData = [
  {
    prompt: 'what is the address?',
    response:
      "Nagoya University's address is as follows:\n\n**Furo-cho, Chikusa-ku, Nagoya 464-8601, Japan**【14:10†source】. \n\nIf you need more information or assistance, you can refer to their official website [here](https://www.nagoya-u.ac.jp).",
  },
]
interface ChatbotData {
  prompt: string
  response: string
}

interface Props {
  communityId: string
  chatbotData: ChatbotData[]
  setChatbotData: (chatbotItem: any) => void
}

const AIChat = ({ communityId, chatbotData, setChatbotData }: Props) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null) // Reference for last message
  //  const [chatbotData, setChatbotData] = useState<Array<{ prompt: string; response: string }>>([])
  const { error, isLoading: isThreadLoading, refetch: refetchThread } = useGetThread()
  const [threadId, setThreadId] = useState()
  const { mutate: mutateAskToChatbot, isPending: isAskToChatbotLoading } = useAskToChatbot()
  const { updateChatbotData } = useUniStore()

  const handleAskChatbot = (message: string) => {
    setChatbotData({ prompt: message, response: '' })

    const handleMutationSuccess = (chatBotResponse: any) => {
      updateChatbotData(message, chatBotResponse.response || 'Something went wrong')
    }

    if (chatbotData.length === 0) {
      refetchThread().then((respone: any) => {
        const threadId = respone?.data?.id
        setThreadId(threadId)
        mutateAskToChatbot(
          { threadId, message, communityId },
          {
            onSuccess: handleMutationSuccess,
          }
        )
      })
    } else {
      mutateAskToChatbot(
        { threadId, message, communityId },
        {
          onSuccess: handleMutationSuccess,
        }
      )
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
