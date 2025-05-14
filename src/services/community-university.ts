import { useInfiniteQuery, useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query'
import { client } from './api-Client'
import axios from 'axios'
import useCookie from '@/hooks/useCookie'
import { PostType } from '@/types/constants'
import { Community } from '@/types/Community'
import { showCustomDangerToast, showCustomSuccessToast, showToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { CommunityGroupType } from '@/types/CommuityGroup'
import { useRouter } from 'next/navigation'
import { useUniStore } from '@/store/store'
import { openModal } from '@/components/molecules/Modal/ModalManager'

export async function getCommunity(communityId: string) {
  const response = await client(`/community/${communityId}`)
  return response
}
export async function getCommunityFromUniversity(universityId: string) {
  const response = await client(`/community/uni/${universityId}`)
  return response
}

export async function getCommunityPostComments(postId: string, token: string, page: number, limit: number) {
  const response: any = await client(`/communitypostcomment/${postId}?page=${page}&limit=${limit}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}
export async function getCommunityPostCommentById(commentId: string, token: string) {
  const response: any = await client(`/communitypostcomment/comment/${commentId}`, { headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function UpdateCommunity(communityId: string, data: any) {
  const response = await client(`/community/${communityId}`, { method: 'PUT', data })
  return response
}

export async function joinCommunityFromUniversityAPI(universityId: string, token: string) {
  const response = await client(`/community/join?universityId=${universityId}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export async function joinCommunity(communityId: string, token: string) {
  const response = await client(`/community/${communityId}/join`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}
export async function getCommunityUsers(communityId: string, privacy: string, name: string, token: any) {
  const response: any = await client(`/users/communityUsers/${communityId}?privacy=${privacy}&&name=${name}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export async function getCommunityGroupUsers(communityGroupId: string, name: string, token: any) {
  const response: any = await client(`/users/communityGroupUsers/${communityGroupId}?name=${name}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export async function leaveCommunity(communityId: string, token: any) {
  const response = await client(`/community/${communityId}/leave`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function changeUserGroupRole(data: any, token: any) {
  const response = await client(`/users/user/GroupRole`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}
export async function changeUserCommunityRole(data: any, token: any) {
  const response = await client(`/users/user/CommunityRole`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export async function getAllCommunityGroups(communityId: string, communityGroupId: string, token: any) {
  const response: any = await client(`/communitygroup/${communityId}?${communityGroupId ? `communityGroupId=${communityGroupId}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export async function joinCommunityGroup(communityGroupId: string, token: string) {
  const response = await client(`/communitygroup/togglegroup/${communityGroupId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function CreateCommunityGroup(communityId: string, token: any, data: any) {
  const response = await client(`/communitygroup/${communityId}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export async function UpdateCommunityGroup(data: any, id: string, token: any) {
  const response = await client(`/communitygroup/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}

export async function LikeUnilikeGroupPost(communityGroupPostId: string, token: any) {
  const response = await client(`/communitypost/likeunlike/${communityGroupPostId}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } })
  return response
}

export async function getAllCommunityPost(communityId: string, token: any, page: number, limit: number) {
  const response: any = await client(`/communitypost/timelinePost?communityId=${communityId}&page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}
export async function getAllCommunityGroupPost(communityId: string, communityGroupId: string, token: any, page: number, limit: number) {
  const response: any = await client(
    `/communitypost/group?communityId=${communityId}&communityGroupId=${communityGroupId}&page=${page}&limit=${limit}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  return response
}

//posts
export async function getPost(postID: string, isType: string | null, commentId: string, token: string) {
  const response: any = await client(`/communitypost/post/${postID}?isType=${isType}&commentId=${commentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export async function CreateGroupPost(data: any, token: string) {
  const response = await client(`/communitypost`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}
export async function CreateGroupPostComment(data: any, token: string) {
  const response = await client(`/communitypostcomment/${data.postID}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, data })
  return response
}
export async function CreateGroupPostCommentReply(data: any, token: string) {
  const response = await client(`/communitypostcomment/${data.commentId}/replies`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    data,
  })
  return response
}

export async function LikeUnilikeGroupPostCommnet(communityGroupPostCommentId: string, token: any) {
  const response = await client(`/communitypostcomment/likeUnlike/${communityGroupPostCommentId}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  })
  return response
}

export function useGetCommunity(communityId: string) {
  return useQuery({
    queryKey: ['community', communityId],
    queryFn: () => getCommunity(communityId),
    enabled: !!communityId,
  }) as UseQueryResult<Community>
}
export function useGetCommunityFromUniversityId(universityId: string) {
  return useQuery({
    queryKey: ['communityFromUniversity', universityId],
    queryFn: () => getCommunityFromUniversity(universityId),
    enabled: !!universityId,
  }) as UseQueryResult<Community>
}

export function useGetCommunityPostComments(postId: string, showCommentSection: boolean, isCommunity: boolean, limit: number) {
  {
    const [cookieValue] = useCookie('uni_user_token')

    return useInfiniteQuery({
      queryKey: ['communityPostComments'],
      queryFn: ({ pageParam = 1 }) => getCommunityPostComments(postId, cookieValue, pageParam, limit),
      getNextPageParam: (lastPage) => {
        if (lastPage.currentPage < lastPage.totalPages) {
          return lastPage.currentPage + 1
        }
        return undefined
      },
      initialPageParam: 1,
      enabled: showCommentSection && !!postId && isCommunity && !!cookieValue,
    })
  }
}

export function useGetCommunityCommentById(commentId: string, enabled: boolean, isCommunity: boolean) {
  const [cookieValue] = useCookie('uni_user_token')

  const state = useQuery({
    queryKey: ['communityCommentById'],
    queryFn: () => getCommunityPostCommentById(commentId, cookieValue),
    enabled: !!cookieValue && enabled && isCommunity,
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export const useUpdateCommunity = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: any) => UpdateCommunity(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['community'] })
      showCustomSuccessToast('Community updated successfully')
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
      showCustomDangerToast(res.response.data.message)
    },
  })
}

export const useJoinCommunityFromUniversity = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  const { setUserProfileCommunities } = useUniStore()
  return useMutation({
    mutationFn: (universityId: string) => joinCommunityFromUniversityAPI(universityId, cookieValue),
    onSuccess: (response: any) => {
      //queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      queryClient.invalidateQueries({ queryKey: ['useGetSubscribedCommunties'] })
      //   setUserProfileCommunities(response.data.profile.communities)
      //   showCustomSuccessToast(`Joined Community `)
    },
    onError: (res: any) => {
      //   showCustomDangerToast(res.response.data.message)
      //showToast(res.response.data.message, {
      //  variant: 'error',
      //  isDarkMode: false,
      //  duration: 5000,
      //  position: 'bottom-center',
      //  actions: [
      //    {
      //      label: 'View',
      //      onClick: () => router.push(`/community/${variables}`),
      //      isPrimary: true,
      //    },
      //  ],
      //})
    },
  })
}

export const useJoinCommunity = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  const { setUserProfileCommunities } = useUniStore()
  const router = useRouter()
  return useMutation({
    mutationFn: (communityId: string) => joinCommunity(communityId, cookieValue),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      queryClient.invalidateQueries({ queryKey: ['useGetSubscribedCommunties'] })
      showCustomSuccessToast(`Joined Community`)
      setUserProfileCommunities(response.user.communities)
    },
    onError: (res: any, variables) => {
      showToast(res.response.data.message, {
        variant: 'error',
        isDarkMode: false,
        duration: 5000,
        position: 'bottom-center',
        actions: [
          {
            label: 'View',
            onClick: () => router.push(`/community/${variables}`),
            isPrimary: true,
          },
        ],
      })
    },
  })
}

export const useLeaveCommunity = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  const { setUserProfileCommunities } = useUniStore()
  return useMutation({
    mutationFn: (communityId: string) => leaveCommunity(communityId, cookieValue),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      queryClient.invalidateQueries({ queryKey: ['useGetSubscribedCommunties'] })
      showCustomSuccessToast('community left')
      setUserProfileCommunities(response.data.community)
    },
    onError: (res: any) => {
      console.error(res.response.data.message)
    },
  })
}

export function useGetCommunityGroup(communityId: string, communityGroupId: string = '') {
  const [cookieValue] = useCookie('uni_user_token')

  return useQuery({
    enabled: !!communityId && !!cookieValue && !!communityGroupId,
    queryKey: ['communityGroup', communityId, communityGroupId],
    queryFn: () => getAllCommunityGroups(communityId, communityGroupId, cookieValue),
  }) as UseQueryResult<CommunityGroupType>
}

export function useGetCommunityGroups(communityId: string, communityGroupId: string = '', isJoined: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  return useQuery({
    enabled: isJoined && !!communityId && !!cookieValue,
    queryKey: ['communityGroups', communityId],
    queryFn: () => getAllCommunityGroups(communityId, communityGroupId, cookieValue),
  })
}

//create community
export const useCreateCommunityGroup = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const router = useRouter()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ communityId, data }: any) => CreateCommunityGroup(communityId, cookieValue, data),
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: ['communityGroups'] })
      queryClient.invalidateQueries({ queryKey: ['useGetSubscribedCommunties'] })
      showCustomSuccessToast('Community created successfully')
      router.push(`/community/${response?.data?.communityId}/${response?.data?._id}`)
    },
    onError: (error: any) => {
      console.log(error.response.data.message, 'res')
      showCustomDangerToast(error.response.data.message)
    },
  })
}

export const useUpdateCommunityGroup = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ communityId, payload }: { communityId: string; payload: any }) => UpdateCommunityGroup(payload, communityId, cookieValue),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityGroup'] })
      queryClient.invalidateQueries({ queryKey: ['community'] })
      showCustomSuccessToast('Updated Sucessfully')
    },
    onError: (res: any) => {
      console.error(res.response.data.message)
      showCustomDangerToast(res.response.data.message)
    },
  })
}

export function useGetCommunityPost(communityId: string, isCommunity: boolean, limit: number) {
  const [cookieValue] = useCookie('uni_user_token')
  return useInfiniteQuery({
    queryKey: ['communityGroupsPost', communityId],
    queryFn: ({ pageParam = 1 }) => getAllCommunityPost(communityId, cookieValue, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: isCommunity && !!cookieValue,
    retry: false,
  })
}

export function useGetCommunityGroupPost(communityId: string, communityGroupID: string, isCommunity: boolean, limit: number) {
  const [cookieValue] = useCookie('uni_user_token')
  return useInfiniteQuery({
    queryKey: ['communityGroupsPost', communityId, communityGroupID],
    queryFn: ({ pageParam = 1 }) => getAllCommunityGroupPost(communityId, communityGroupID, cookieValue, pageParam, limit),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1
      }
      return undefined
    },
    initialPageParam: 1,
    enabled: isCommunity && !!cookieValue,
    retry: false,
  })
}

export const useLikeUnilikeGroupPost = (communityId: string = '', communityGroupId: string = '', isTimeline: boolean) => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (communityGroupPostId: any) => LikeUnilikeGroupPost(communityGroupPostId, cookieValue),

    onSuccess: (res: any, communityGroupPostId) => {
      if (isTimeline) {
        queryClient.setQueryData(['timelinePosts'], (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              allPosts: page.allPosts.map((post: any) =>
                post._id === communityGroupPostId
                  ? {
                      ...post,
                      likeCount: res.likeCount,
                    }
                  : post
              ),
            })),
          }
        })
      } else {
        queryClient.setQueryData(['communityGroupsPost', communityId, communityGroupId], (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              finalPost: page.finalPost.map((post: any) =>
                post._id === communityGroupPostId
                  ? {
                      ...post,
                      likeCount: res.likeCount,
                    }
                  : post
              ),
            })),
          }
        })
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

//post

export const useCreateGroupPost = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => CreateGroupPost(data, cookieValue),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communityGroupsPost'] })
      showCustomSuccessToast('Post created successfully')
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
      showCustomDangerToast(res.response?.data?.message as string)
    },
  })
}

export const useCreateGroupPostComment = (isSinglePost: boolean) => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => CreateGroupPostComment(data, cookieValue),

    onSuccess: (res: any) => {
      const currUserComments = queryClient.getQueryData<{ pages: any[]; pageParams: any[] }>(['communityPostComments'])

      if (currUserComments) {
        queryClient.setQueryData(['communityPostComments'], {
          ...currUserComments,
          pages: currUserComments.pages.map((page, index) => {
            if (index === 0) {
              return {
                ...page,
                finalComments: [res.comment, ...page.finalComments],
                totalComments: page.totalComments + 1,
              }
            }
            return page
          }),
        })
      }
    },
    onError: (res: any) => {
      showCustomDangerToast(res.response?.data?.message as string)
      console.log(res.response.data.message, 'res')
    },
  })
}
export const useCreateGroupPostCommentReply = (
  isSinglePost: boolean,
  isNested: boolean,
  type: PostType.Community | PostType.Timeline,
  showInitial: boolean,
  postId: string
) => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => CreateGroupPostCommentReply(data, cookieValue),

    onSuccess: (data: any) => {
      const currUserComments = queryClient.getQueryData<{ pages: any[]; pageParams: any[] }>(['communityPostComments'])

      if (showInitial) {
        // const singlePostData = queryClient.getQueryData(['getPost', postId])
        // console.log('query', singlePostData, 'res', data)
        queryClient.setQueryData(['getPost', postId], (oldData: any) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            comment: {
              ...data.commentReply,
            },
          }
        })
      }

      if (currUserComments) {
        const updatedPages = currUserComments.pages.map((page) => {
          return {
            ...page,
            finalComments: page.finalComments.map((comment: any) => {
              if (comment._id === data.commentReply._id) {
                const updatedComment = {
                  ...comment,
                  ...data.commentReply,
                  totalCount: comment.replies.length + 1,
                }

                return updatedComment
              }

              return comment
            }),
          }
        })

        queryClient.setQueryData(['communityPostComments'], {
          ...currUserComments,
          pages: updatedPages,
        })
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useLikeUnlikeGroupPostComment = (isReply: boolean, showInitial: boolean, postId: string) => {
  const [cookieValue] = useCookie('uni_user_token')
  const { userData } = useUniStore()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ communityGroupPostCommentId, level }: { communityGroupPostCommentId: string; level: string }) =>
      LikeUnilikeGroupPostCommnet(communityGroupPostCommentId, cookieValue),

    onSuccess: (_, variables) => {
      const { communityGroupPostCommentId, level } = variables
      const currUserComments = queryClient.getQueryData<{ pages: any[]; pageParams: any[] }>(['communityPostComments'])

      if (showInitial) {
        const singlePostData: any = queryClient.getQueryData(['getPost', postId])
        if (singlePostData?.comment) {
          const comment = singlePostData.comment

          if (level === '0' && comment._id === communityGroupPostCommentId) {
            const hasLiked = comment.likeCount.some((like: any) => like.userId === userData?.id)

            const updatedComment = {
              ...comment,
              likeCount: hasLiked
                ? comment.likeCount.filter((like: any) => like.userId !== userData?.id)
                : [...comment.likeCount, { userId: userData?.id }],
            }

            queryClient.setQueryData(['getPost', postId], {
              ...singlePostData,
              comment: updatedComment,
            })
          }

          if (level === '1') {
            const updatedReplies = comment.replies.map((reply: any) => {
              if (reply._id === communityGroupPostCommentId) {
                const hasLiked = reply.likeCount.some((like: any) => like.userId === userData?.id)

                return {
                  ...reply,
                  likeCount: hasLiked
                    ? reply.likeCount.filter((like: any) => like.userId !== userData?.id)
                    : [...reply.likeCount, { userId: userData?.id }],
                }
              }
              return reply
            })

            queryClient.setQueryData(['getPost', postId], {
              ...singlePostData,
              comment: {
                ...comment,
                replies: updatedReplies,
              },
            })
          }
        }
      }

      //   single end
      if (currUserComments) {
        queryClient.setQueryData(['communityPostComments'], {
          ...currUserComments,
          pages: currUserComments.pages.map((page) => {
            return {
              ...page,
              finalComments: page.finalComments.map((comment: any) => {
                if (level === '0' && comment._id === communityGroupPostCommentId) {
                  const hasLiked = comment.likeCount.some((like: any) => like.userId === userData?.id)

                  return {
                    ...comment,
                    likeCount: hasLiked
                      ? comment.likeCount.filter((like: any) => like.userId !== userData?.id)
                      : [...comment.likeCount, { userId: userData?.id }],
                  }
                }

                if (level === '1') {
                  return {
                    ...comment,
                    replies: comment.replies.map((reply: any) => {
                      if (reply._id === communityGroupPostCommentId) {
                        const hasLiked = reply.likeCount.some((like: any) => like.userId === userData?.id)

                        return {
                          ...reply,
                          likeCount: hasLiked
                            ? reply.likeCount.filter((like: any) => like.userId !== userData?.id)
                            : [...reply.likeCount, { userId: userData?.id }],
                        }
                      }
                      return reply
                    }),
                  }
                }

                return comment
              }),
            }
          }),
        })
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export function useGetCommunityUsers(communityId: string, isopen: boolean, privacy: string, name: string) {
  const [cookieValue] = useCookie('uni_user_token')
  const state = useQuery({
    enabled: isopen && !!communityId,
    queryKey: ['communityUsers', communityId, privacy, name],
    queryFn: () => getCommunityUsers(communityId, privacy, name, cookieValue),
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export function useGetCommunityGroupUsers(communityGroupId: string, isopen: boolean, name: string, isGroup: boolean) {
  const [cookieValue] = useCookie('uni_user_token')
  const state = useQuery({
    enabled: isopen && isGroup,
    queryKey: ['communityGroupUsers', communityGroupId, name],
    queryFn: () => getCommunityGroupUsers(communityGroupId, name, cookieValue),
  })

  let errorMessage = null
  if (axios.isAxiosError(state.error) && state.error.response) {
    errorMessage = state.error.response.data
  }

  return { ...state, error: errorMessage }
}

export const useUserGroupRole = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => changeUserGroupRole(data, cookieValue),

    onSuccess: (response: any) => {
      console.log(response)

      queryClient.invalidateQueries({ queryKey: ['communityGroupUsers'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useUserCommunityRole = () => {
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => changeUserCommunityRole(data, cookieValue),

    onSuccess: (response: any) => {
      console.log(response)

      queryClient.invalidateQueries({ queryKey: ['communityGroupUsers'] })
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export function useGetPost(postId: string, isType: string | null = 'userPost', commentId: string = ' ') {
  const [cookieValue] = useCookie('uni_user_token')

  return useQuery({
    queryKey: ['getPost', postId],
    queryFn: () => getPost(postId, isType, commentId, cookieValue),
    enabled: !!postId,
  })
}
