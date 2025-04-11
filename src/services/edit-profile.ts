import { useMutation, useQueryClient } from '@tanstack/react-query'
import { client } from './api-Client'
import { useUniStore } from '@/store/store'
import useCookie from '@/hooks/useCookie'
import { showCustomSuccessToast, showToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { useRouter } from 'next/navigation'
import { closeModal } from '@/components/molecules/Modal/ModalManager'

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
      setUserProfileData(response.updatedUserProfile)
      queryClient.invalidateQueries({ queryKey: ['getRefetchUserData'] })
    },
    onError: (res: any) => {
      showCustomSuccessToast('Failed to update profile')
      console.log(res.response.data.message, 'res')
    },
  })
}

export const useAddUniversityEmail = (redirect: boolean = false) => {
  // const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  const { setUserData, setUserProfileData } = useUniStore()
  const [cookieValue] = useCookie('uni_user_token')
  const queryClient = useQueryClient()
  const router = useRouter()
  return useMutation({
    mutationFn: (data: any) => addUniversityEmail(data, cookieValue),
    onSuccess: (response: any, variables) => {
      setUserProfileData(response)
      closeModal()
      if (redirect) {
        const community = response.userProfile.email.find((community: any) => community.UniversityName == variables.universityName)
        if (community) {
          router.push(`/community/${community.communityId}`)
          queryClient.invalidateQueries({ queryKey: ['useGetSubscribedCommunties'] })
        }
      }

      if (!response.user.status.isAlreadyJoined && response.user.status.isUniversityCommunity) {
        setUserData(response.user.updatedUser)
        return queryClient.invalidateQueries({ queryKey: ['useGetSubscribedCommunties'] })
      }

      if (response.user.isAlreadyJoined) {
        return showToast('Already Joined', {
          variant: 'warning',
          isDarkMode: false,
        })
      }
      if (!response.user.isUniversityCommunity) {
        return showToast('No Community', {
          variant: 'warning',
          isDarkMode: false,
        })
      }
    },
    onError: (res: any) => {
      return showToast(res.response.data.message, {
        variant: 'error',
        isDarkMode: false,
      })
    },
  })
}
