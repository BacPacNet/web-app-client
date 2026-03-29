import { useMutation } from '@tanstack/react-query'
import { client } from './api-Client'

export async function createCaptchaAPI(data: any) {
  const response = await client(`/captcha/submit`, { method: 'POST', data })
  return response
}

export const useSubmitCaptcha = () => {
  return useMutation({
    mutationFn: (data: any) => createCaptchaAPI(data),
  })
}
