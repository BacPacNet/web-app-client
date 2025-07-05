import { useMutation } from '@tanstack/react-query'
import { client } from './api-Client'
import { MESSAGES } from '@/content/constant'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import useCookie from '@/hooks/useCookie'
import { UploadContextType } from '@/types/Uploads'

export interface S3UploadItem {
  imageUrl: string | null
  publicId: string | null
}

export interface S3UploadResponse {
  success: boolean
  data: S3UploadItem[]
}

export interface S3UploadRequest {
  files: File[]
  context: UploadContextType
}

async function uploadtoS3(uploadPayload: S3UploadRequest, cookieValue: string): Promise<S3UploadResponse> {
  const formData = new FormData()
  const { files, context } = uploadPayload
  files.forEach((file) => formData.append('files', file))
  formData.append('context', context)

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

  return useMutation<S3UploadResponse, Error, S3UploadRequest>({
    mutationFn: async (uploadPayload) => await uploadtoS3(uploadPayload, cookieValue),
    onSuccess: () => {
      // Optionally show success toast
    },
    onError: (error: any) => {
      console.log(error)
      // Handle specific 413 error for file size too large
      if (error?.response?.status === 413) {
        showCustomDangerToast('File size is too large. Please upload files smaller than 5MB.')
      } else {
        showCustomDangerToast(error?.response?.data?.message || 'File size is too large. Please upload files smaller than 5MB.')
      }
    },
  })
}
