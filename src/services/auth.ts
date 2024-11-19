import { LoginForm, RegisterForm, UserResponseType } from '@/models/auth'
import { useMutation } from '@tanstack/react-query'
import { client } from './api-Client'
import { useUniStore } from '@/store/store'
import useCookie from '@/hooks/useCookie'

interface data {
  email: string
  userName: string
  password: string
  confirmpassword: string
  birthDate: string
  gender: string
  country: string
  firstName: string
  lastName: string
  verificationEmail: string
  verificationOtp: string
  universityEmail: string
  UniversityOtp: string
  UniversityOtpOK: string
  referralCode: string
}

const login = async (data: LoginForm): Promise<UserResponseType> => {
  const result = await client<UserResponseType, LoginForm>('/auth/login', { data })
  return result
}

const register = async (data: Omit<RegisterForm, 'confirmPassword' | 'tnc'>): Promise<UserResponseType> => {
  const result = await client<UserResponseType, Omit<RegisterForm, 'confirmPassword' | 'tnc'>>('auth/register', { data })
  return result
}

async function register_v2(data: data) {
  const response: { isRegistered: boolean } = await client(`/auth/register`, { method: 'POST', data })
  return response
}

async function userNameAndEmailAvailability(data: { email: string; userName: string }) {
  const response: { isAvailable: boolean } = await client(`/users/checkAvailability`, { method: 'POST', data })
  return response
}

async function loginEmailVerificationCodeGenerate(data: { email: string }) {
  const response: any = await client(`/useremailverification`, { method: 'POST', data })
  return response
}
async function loginEmailVerification(data: { email: string; verificationOtp: string }) {
  const response: { isAvailable: boolean } = await client(`/useremailverification`, { method: 'PUT', data })
  return response
}

async function universityEmailVerificationCodeGenerate(data: { email: string }) {
  const response: any = await client(`/universityemailverification`, { method: 'POST', data })
  return response
}
async function universityEmailVerification(data: { universityEmail: string; UniversityOtp: string }) {
  const response: { isAvailable: boolean } = await client(`/universityemailverification`, { method: 'PUT', data })
  return response
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

export const useHandleRegister_v2 = () => {
  return useMutation({
    mutationFn: (data: data) => register_v2(data),
  })
}

export const useHandleUserEmailAndUserNameAvailability = () => {
  return useMutation({
    mutationFn: (data: { email: string; userName: string }) => userNameAndEmailAvailability(data),
  })
}

export const useHandleLoginEmailVerificationGenerate = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => loginEmailVerificationCodeGenerate(data),
  })
}

export const useHandleLoginEmailVerification = () => {
  return useMutation({
    mutationFn: (data: { email: string; verificationOtp: string }) => loginEmailVerification(data),
  })
}
export const useHandleUniversityEmailVerificationGenerate = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => universityEmailVerificationCodeGenerate(data),
  })
}

export const useHandleUniversityEmailVerification = () => {
  return useMutation({
    mutationFn: (data: { universityEmail: string; UniversityOtp: string }) => universityEmailVerification(data),
  })
}
