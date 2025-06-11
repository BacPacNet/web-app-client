import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import { useUniStore } from '@/store/store'
import useCookie from '@/hooks/useCookie'
import { showCustomDangerToast, showCustomSuccessToast, showToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { useRouter } from 'next/navigation'
import { useModal } from '@/context/ModalContext'
import { AxiosError } from 'axios'

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
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: any) => editProfile(data, userProfileData?._id || ''),
    onSuccess: (response: any) => {
      showCustomSuccessToast('Profile Updated Successfully')
      setUserProfileData(response.data)
      queryClient.invalidateQueries({ queryKey: ['getRefetchUserData'] })
    },
    onError: (error: AxiosError<{ message: string }>) => {
      showCustomDangerToast(error.response?.data?.message || 'An error occurred')
    },
  })
}

export const useAddUniversityEmail = (redirect: boolean = false) => {
  // const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  const { setUserData, setUserProfileData } = useUniStore()
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  const router = useRouter()
  const { closeModal } = useModal()
  return useMutation({
    mutationFn: (data: any) => addUniversityEmail(data, cookieValue),
    onSuccess: (response: any, variables) => {
      setUserProfileData(response)
      closeModal()
      showCustomSuccessToast('email verified successfully')
      //  if (redirect) {
      //    const community = response.userProfile.email.find((community: any) => community.UniversityName == variables.universityName)
      //    if (community) {
      //      router.push(`/community/${community.communityId}`)
      //      queryClient.invalidateQueries({ queryKey: ['useGetSubscribedCommunties'] })
      //    }
      //  }

      //  if (!response.user.status.isAlreadyJoined && response.user.status.isUniversityCommunity) {
      //    setUserData(response.user.updatedUser)
      //    return queryClient.invalidateQueries({ queryKey: ['useGetSubscribedCommunties'] })
      //  }
    },
    onError: (error: any) => {
      console.log(error)
    },
  })
}
