import { useQuery } from '@tanstack/react-query'
import { client } from './api-Client'
import useCookie from '@/hooks/useCookie'
import { useUniStore } from '@/store/store'
import axios from 'axios'
import { RecommendationResponse, GroupRecommendationResponse } from '@/types/Recommendation'

// Types for recommendation data

/**
 * Fetch recommendation data from the external API
 * @param userId - The user ID to get recommendations for
 * @returns Promise with recommendation data
 */
export async function getRecommendations(userId: string): Promise<RecommendationResponse> {
  const response: RecommendationResponse = await client(`https://7jbzzcbvub.execute-api.ap-south-1.amazonaws.com/dev/data?user_id=${userId}`, {
    method: 'GET',
    customBaseUrl: true,
    headers: {
      'x-api-key': process.env.RECOMMENDATION_API_KEY || '',
    },
  })
  return response
}

/**
 * Fetch group recommendation data from the external API
 * @param userId - The user ID to get group recommendations for
 * @returns Promise with group recommendation data
 */
export async function getGroupRecommendations(userId: string): Promise<GroupRecommendationResponse> {
  const response: GroupRecommendationResponse = await client(`https://to80y9n4nl.execute-api.ap-south-1.amazonaws.com/dev/data?user_id=${userId}`, {
    method: 'GET',
    customBaseUrl: true,
    headers: {
      'x-api-key': process.env.RECOMMENDATION_API_KEY || '',
    },
  })
  return response
}

/**
 * React Query hook for fetching recommendations using the authenticated user's ID
 * @param enabled - Whether the query should be enabled
 * @returns Query result with recommendation data
 */
export function useGetUserRecommendations(enabled: boolean = true) {
  const [cookieValue] = useCookie('uni_user_token')
  const { userData } = useUniStore()

  const userId = userData?.id

  const state = useQuery({
    queryKey: ['user_recommendations', userId],
    queryFn: () => getRecommendations(userId!),
    enabled: !!userId && !!cookieValue && enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

/**
 * React Query hook for fetching group recommendations using the authenticated user's ID
 * @param enabled - Whether the query should be enabled
 * @returns Query result with group recommendation data
 */
export function useGetGroupRecommendations(enabled: boolean = true) {
  const [cookieValue] = useCookie('uni_user_token')
  const { userData } = useUniStore()

  const userId = userData?.id

  const state = useQuery({
    queryKey: ['group_recommendations', userId],
    queryFn: () => getGroupRecommendations(userId!),
    enabled: !!userId && !!cookieValue && enabled,
    staleTime: 0,
    gcTime: 0,
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}
