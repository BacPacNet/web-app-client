import useCookie from '@/hooks/useCookie'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { client } from './api-Client'
import { EventPost } from '@/types/eventPosts'

export async function deleteEventPost(postId: string, token: string) {
  const response: any = await client(`/eventpost/${postId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
  return response.data
}

// Create an event post
export async function createEventPost(eventData: EventPost, token: string) {
  const response: any = await client('/eventpost', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, data: eventData })
  return response.data
}

// Hook to create an event post
export const useCreateEventPost = () => {
  const [cookieValue] = useCookie('auth_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (eventData: EventPost) => createEventPost(eventData, cookieValue || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventPosts'] })
    },
    onError: (error: any) => {
      console.error('Error creating event post:', error.response?.data?.message)
    },
  })
}

export async function getAllEventPosts(token: string) {
  const response: any = await client('/eventpost', { method: 'GET', headers: { Authorization: `Bearer ${token}` } })
  return response.data
}

export const useFetchEventPosts = () => {
  const [cookieValue] = useCookie('uni_user_token')

  return useQuery({
    queryKey: ['eventPosts'],
    queryFn: () => getAllEventPosts(cookieValue),
  })
}

export async function getEventByCommunityId(token: string, communityId: string) {
  const response: any = await client(`/eventpost/${communityId}`, { method: 'GET', headers: { Authorization: `Bearer ${token}` } })
  return response.data
}

// Fetch a single event post by communityId
export const useFetchEventByCommunityId = (communityId: string) => {
  const [cookieValue] = useCookie('uni_user_token')

  return useQuery({
    queryKey: ['eventPosts', communityId],
    queryFn: () => getEventByCommunityId(cookieValue, communityId),
    enabled: !!communityId,
  })
}

// Hook to delete an event post
export const useDeleteEventPost = () => {
  const [cookieValue] = useCookie('uni_user_token') // Use your cookie name
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (postId: string) => deleteEventPost(postId, cookieValue || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventPosts'] }) // Invalidate cached event posts
    },
    onError: (error: any) => {
      console.error('Error deleting event post:', error.response?.data?.message)
    },
  })
}

// Update an event post
export async function updateEventPost(postId: string, updates: Record<string, any>, token: string) {
  const response: any = await client(`/eventpost/${postId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data: updates })
  return response.data
}

// Hook to update an event post
export const useUpdateEventPost = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ postId, updates }: { postId: string; updates: Record<string, any> }) => updateEventPost(postId, updates, cookieValue || ''),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eventPosts'] })
    },
    onError: (error: any) => {
      console.error('Error updating event post:', error.response?.data?.message)
    },
  })
}

export async function getFilterEventPosts(token: string, filters: Record<string, any>) {
  const response: any = await client(`/eventpost/filter`, { method: 'GET', headers: { Authorization: `Bearer ${token}` }, params: filters })
  return response.data
}

// Filter event posts
export const useFilterEventPosts = (filters: Record<string, any>) => {
  const [cookieValue] = useCookie('uni_user_token')

  return useQuery({
    queryKey: ['eventPosts', filters],
    queryFn: () => getFilterEventPosts(cookieValue, filters),
    enabled: !!filters,
  })
}
