import { LoginForm, UserResponseType } from '@/models/auth'
import { useMutation } from '@tanstack/react-query'
import { client } from './api-Client'
import { useUniStore } from '@/store/store'
import useCookie from '@/hooks/useCookie'

const login = async (data: LoginForm): Promise<UserResponseType> => {
  const result = await client<UserResponseType, LoginForm>('auth/login', { data })
  return result
}

export const useHandleLogin = () => {
  const setUserData = useUniStore((state) => state.setUserData)
  // const setToken = useUniStore((state) => state.setToken)
  const [_, setCookieValue] = useCookie('uni_user_token')
  const [__, setRefreshCookieValue] = useCookie('uni_user_refresh_token')

  return useMutation({
    mutationFn: (data: LoginForm) => login(data),
    onSuccess: (response) => {
      console.log(response, 'response')
      console.log(_, __)

      setUserData(response.user)
      // setToken(response.tokens)
      setCookieValue(response.tokens.access.token, response.tokens.access.expires)
      setRefreshCookieValue(response.tokens.refresh.token, response.tokens.refresh.expires)
    },
  })
}
