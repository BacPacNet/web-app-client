import { useMutation } from '@tanstack/react-query'
import { client } from './api-Client'
import { MESSAGES } from '@/content/constant'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import useCookie from '@/hooks/useCookie'

export interface S3UploadItem {
  imageUrl: string | null
  publicId: string | null
}

export interface S3UploadResponse {
  success: boolean
  data: S3UploadItem[]
}

async function uploadtoS3(files: File[], cookieValue: string): Promise<S3UploadResponse> {
  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  const response: S3UploadResponse = await client(`/upload`, {
    method: 'POST',
    data: formData,
    headers: {
      Authorization: `Bearer ${cookieValue}`,
      'Content-Type': 'multipart/form-data',
    },
    isFormData: true,
  })

  return response
}

export const useUploadToS3 = () => {
  const [cookieValue] = useCookie('uni_user_token')

  return useMutation<S3UploadResponse, Error, File[]>({
    mutationFn: async (files) => await uploadtoS3(files, cookieValue),
    onSuccess: () => {
      // Optionally show success toast
    },
    onError: (error: any) => {
      showCustomDangerToast(error?.response?.data?.message || MESSAGES.SOMETHING_WENT_WRONG)
    },
  })
}
