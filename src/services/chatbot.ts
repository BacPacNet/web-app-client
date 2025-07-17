import useCookie from '@/hooks/useCookie'
import { useMutation, useQuery } from '@tanstack/react-query'
import { client } from './api-Client'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { ServerResponse } from '@/models/common/api-client'

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

const generateResponse = async (threadId: string, message: string, communityId: string, cookieValue: string) => {
  const response = await client(`/chatbot/message?communityId=${communityId}`, {
    headers: { Authorization: `Bearer ${cookieValue}` },
    data: { threadId, message },
  })
  return response
}

export const useAskToChatbot = () => {
  const [cookieValue] = useCookie('uni_user_token')
  return useMutation({
    mutationKey: ['askToChatbot'],
    mutationFn: ({ threadId, message, communityId }: any) => generateResponse(threadId, message, communityId, cookieValue),
    //onSuccess: (response: any) => {
    //    showCustomSuccessToast(response.response.data.message)
    //    queryClient.invalidateQueries({ queryKey: ['endorsementAI'] })
    //},
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
      showCustomDangerToast(res.response.data.message)
    },
  })
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
