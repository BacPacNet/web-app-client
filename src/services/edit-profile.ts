import { useMutation } from '@tanstack/react-query'
import { client } from './api-Client'
// import { editProfileInputs } from '@/components/Timeline/Modals/EditProfileModal'
import { useUniStore } from '@/store/store'

const editProfile = async (data: any) => {
  const res = await client('userprofile/663a034cb65c15b36f959896', { method: 'PUT', data })
  return res
}

export const useEditProfile = () => {
  const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  return useMutation({
    mutationFn: (data: any) => editProfile(data),
    onSuccess: (response: any) => {
      console.log(response, 'response')

      setUserProfileData(response.updatedUserProfile)
    },
    onError: (res: any) => {
      console.log(res.response.data.message, 'res')
    },
  })
}
