import useCookie from '@/hooks/useCookie'
import { useUniStore } from '@/store/store'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'

const getEndorsementAI = async (communityId: string, cookieValue: string) => {
  const response: EndorsementAIResponse = await client(`/endorsementAI/${communityId}`, {
    headers: { Authorization: `Bearer ${cookieValue}` },
  })
  return response
}

export const useGetEndorsementAI = (communityId: string) => {
  const [cookieValue] = useCookie('uni_user_token')
  return useQuery({
    queryKey: ['endorsementAI'],
    queryFn: () => getEndorsementAI(communityId, cookieValue),
    enabled: !!cookieValue && !!communityId,
  })
}

const getEndorsementAIOfUser = async (communityId: string, cookieValue: string) => {
  const response: EndorsementAIResponse = await client(`/endorsementAI/${communityId}?checkUserEndorse=true`, {
    headers: { Authorization: `Bearer ${cookieValue}` },
  })
  return response
}

export const useGetEndorsementAIOfUser = (communityId: string) => {
  const [cookieValue] = useCookie('uni_user_token')
  return useQuery({
    queryKey: ['endorsementAIOfUser'],
    queryFn: () => getEndorsementAIOfUser(communityId, cookieValue),
    enabled: !!cookieValue && !!communityId,
  })
}

const createEndorsementAI = async (communityId: string, cookieValue: string) => {
  const response = await client(`/endorsementAI`, {
    headers: { Authorization: `Bearer ${cookieValue}` },
    data: { communityId },
  })
  return response
}

export const useCreateEndorsementAI = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationKey: ['createEndorsementAI'],
    mutationFn: (communityId: string) => createEndorsementAI(communityId, cookieValue),
    onSuccess: (response: any) => {
      showCustomSuccessToast(response.response.data.message)
      queryClient.invalidateQueries({ queryKey: ['endorsementAI'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
      showCustomDangerToast(res.response.data.message)
    },
  })
}
