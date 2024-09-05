import { LoginForm, RegisterForm, UserResponseType } from '@/models/auth'
import { useMutation } from '@tanstack/react-query'
import { client } from './api-Client'
import { useUniStore } from '@/store/store'
import useCookie from '@/hooks/useCookie'

const login = async (data: LoginForm): Promise<UserResponseType> => {
  const result = await client<UserResponseType, LoginForm>('auth/login', { data })
  return result
}

const register = async (data: Omit<RegisterForm, 'confirmPassword' | 'tnc'>): Promise<UserResponseType> => {
  const result = await client<UserResponseType, Omit<RegisterForm, 'confirmPassword' | 'tnc'>>('auth/register', { data })
  return result
}

export const useHandleLogin = () => {
  const setUserData = useUniStore((state) => state.setUserData)
  const setUserProfileData = useUniStore((state) => state.setUserProfileData)

  const [, setCookieValue] = useCookie('uni_user_token')
  const [, setRefreshCookieValue] = useCookie('uni_user_refresh_token')

  return useMutation({
    mutationFn: (data: LoginForm) => login(data),
    onSuccess: (response: any) => {
      setUserData(response.user)
      setUserProfileData(response.userProfile)
      // setToken(response.tokens)
      setCookieValue(response.tokens.access.token, response.tokens.access.expires)
      setRefreshCookieValue(response.tokens.refresh.token, response.tokens.refresh.expires)
    },
  })
}

export const useHandleRegister = () => {
  const setUserData = useUniStore((state) => state.setUserData)
  const setUserProfileData = useUniStore((state) => state.setUserProfileData)
  const [_, setCookieValue] = useCookie('uni_user_token')
  const [__, setRefreshCookieValue] = useCookie('uni_user_refresh_token')

  return useMutation({
    mutationFn: (data: Omit<RegisterForm, 'confirmPassword' | 'tnc'>) => register(data),
    onSuccess: (response: any) => {
      setUserData(response.user)
      setUserProfileData(response.userProfile)
      setCookieValue(response.tokens.access.token, response.tokens.access.expires)
      setRefreshCookieValue(response.tokens.refresh.token, response.tokens.refresh.expires)
    },
  })
}
