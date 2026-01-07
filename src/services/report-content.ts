import { useMutation } from '@tanstack/react-query'
import { client } from './api-Client'
import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { MESSAGES } from '@/content/constant'
import useCookie from '@/hooks/useCookie'

export async function reportContentAPI(token: string, data: any) {
  const response = await client(`/report-content`, { headers: { Authorization: `Bearer ${token}` }, method: 'POST', data })
  return response
}

export const useCreateReportContent = () => {
  const [cookieValue] = useCookie('uni_user_token')
  return useMutation({
    mutationFn: (data: any) => reportContentAPI(cookieValue, data),
    onSuccess: (response: any) => {
      showCustomSuccessToast(response.message)
    },
    onError: (error: any) => {
      showCustomDangerToast(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG)
    },
  })
}
