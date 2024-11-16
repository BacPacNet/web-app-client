import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import { useUniStore } from '@/store/store'
import useCookie from '@/hooks/useCookie'

const editProfile = async (data: any, id: string) => {
  const res = await client(`/userprofile/${id}`, { method: 'PUT', data })
  return res
}
const addUniversityEmail = async (data: any, token: string) => {
  const res = await client(`/userprofile/addUniversityEmail`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, data })
  return res
}

export const useEditProfile = () => {
  const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  const { userProfileData } = useUniStore()
  return useMutation({
    mutationFn: (data: any) => editProfile(data, userProfileData._id || ''),
    onSuccess: (response: any) => {
      setUserProfileData(response.updatedUserProfile)
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useAddUniversityEmail = () => {
  // const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  const { setUserData, setUserProfileData } = useUniStore()
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => addUniversityEmail(data, cookieValue),
    onSuccess: (response: any) => {
      setUserProfileData(response.userProfile)
      if (!response.user.status.isAlreadyJoined && response.user.status.isUniversityCommunity) {
        setUserData(response.user.updatedUser)
        return queryClient.invalidateQueries({ queryKey: ['useGetSubscribedCommunties'] })
      }

      if (response.user.isAlreadyJoined) {
        return console.log('already Joined')
      }
      if (!response.user.isUniversityCommunity) {
        return console.log('No community')
      }
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}
