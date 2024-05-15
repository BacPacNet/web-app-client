import { LoginForm, UserResponseType } from '@/models/auth'
import { useMutation } from '@tanstack/react-query'
import { client } from './api-Client'

const login = async (data: LoginForm): Promise<UserResponseType> => {
  const result = await client<UserResponseType, LoginForm>('auth/login', { data })
  return result
}

export const useHandleLogin = () =>
  useMutation({
    mutationFn: (data: LoginForm) => login(data),
    onSuccess: (response) => {
      console.log(response, 'response')
    },
  })
