import { useMutation } from '@tanstack/react-query'
import { client } from './api-Client'
import { useUniStore } from '@/store/store'

const editProfile = async (data: any, id: string) => {
  const res = await client(`userprofile/${id}`, { method: 'PUT', data })
  return res
}

export const useEditProfile = () => {
  const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  const { userProfileData } = useUniStore()
  return useMutation({
    mutationFn: (data: any) => editProfile(data, userProfileData._id),
    onSuccess: (response: any) => {
      setUserProfileData(response.updatedUserProfile)
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}
