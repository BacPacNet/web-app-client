import useCookie from '@/hooks/useCookie'
import { useMutation, useQuery } from '@tanstack/react-query'
import { client } from './api-Client'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { ServerResponse } from '@/models/common/api-client'

// Types for the new API
interface ChatbotRequest {
  userId: string
  communityId?: string
  collegeID?: string
  prompt: string
  threadId?: string
}

interface ChatbotResponse {
  response: string
  threadId: string
  isNewThread: boolean
  inserted_id: string
}

const generateResponse = async (requestData: ChatbotRequest): Promise<ChatbotResponse> => {
  const env = process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
  const response = await fetch(`https://38l5g2xzuk.execute-api.ap-south-1.amazonaws.com/${env}/chatbot`, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.NEXT_PUBLIC_AI_CHATBOT_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export const useAskToChatbot = () => {
  // const [cookieValue] = useCookie('uni_user_token')

  return useMutation({
    mutationKey: ['askToChatbot'],
    mutationFn: ({ userId, communityId, collegeID, prompt, threadId }: ChatbotRequest) => {
      const requestData: ChatbotRequest = {
        userId,
        prompt,
        ...(communityId && { communityId }),
        ...(collegeID && { collegeID }),
        ...(threadId && { threadId }),
      }

      return generateResponse(requestData)
    },
    onError: (error: any) => {
      console.error('Chatbot API Error:', error)
      const errorMessage = error.message || 'Failed to get response from chatbot'
      showCustomDangerToast(errorMessage)
    },
  })
}

// Legacy functions - keeping for backward compatibility but they may need updates
const getChatbotThread = async (cookieValue: string) => {
  const response = await client(`/chatbot/thread`, {
    headers: { Authorization: `Bearer ${cookieValue}` },
  })
  return response
}

export const useGetThread = () => {
  const [cookieValue] = useCookie('uni_user_token')
  return useQuery({
    queryKey: ['chatbotThread'],
    queryFn: () => getChatbotThread(cookieValue),
    enabled: false,
  }) as ServerResponse<any>
}

const getAssistantAvailability = async (cookieValue: string, communityId: string) => {
  const response = await client(`/chatbot/check-assistant?communityId=${communityId}`, {
    headers: { Authorization: `Bearer ${cookieValue}` },
  })
  return response
}

export const useCheckAssistantAvailable = (communityId: string) => {
  const [cookieValue] = useCookie('uni_user_token')
  return useQuery<any>({
    queryKey: ['getAssistantAvailiblity'],
    queryFn: () => getAssistantAvailability(cookieValue, communityId),
    enabled: Boolean(cookieValue) && Boolean(communityId),
  })
}
