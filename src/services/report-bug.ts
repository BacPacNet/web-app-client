import { useMutation } from '@tanstack/react-query'
import { client } from './api-Client'
import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { MESSAGES } from '@/content/constant'
import { CreateBugReport } from '@/types/ReportBug'

const reportBugAPI = async (data: FormData) => {
  const response = await client(`/report-bug`, {
    method: 'POST',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    isFormData: true,
  })
  return response
}

export const useCreateReportBug = () => {
  return useMutation({
    mutationFn: (data: FormData) => reportBugAPI(data),
    onSuccess: (response: any) => {
      showCustomSuccessToast(response.message)
    },
    onError: (error: any) => {
      showCustomDangerToast(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG)
    },
  })
}
