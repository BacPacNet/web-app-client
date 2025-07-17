import { useMutation } from '@tanstack/react-query'
import { client } from './api-Client'
import { MESSAGES } from '@/content/constant'
import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'

interface data {
  email?: string
  firstName: string
  lastName: string
  message: string
  university?: string
}

async function contact(data: data) {
  const response: { isRegistered: boolean } = await client(`/contact`, { method: 'POST', data })
  return response
}

export const useSendContactMessage = () => {
  return useMutation({
    mutationFn: (data: data) => contact(data),
    onSuccess: () => {
      showCustomSuccessToast('Your form has been submitted. We will get back to you as soon as we can!')
    },
    onError: (error: any) => {
      showCustomDangerToast(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG)
    },
  })
}
