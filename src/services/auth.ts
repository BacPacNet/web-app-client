import { LoginForm, RegisterForm, UserResponseType } from '@/models/auth'
import { useMutation } from '@tanstack/react-query'
import { client } from './api-Client'
import { useUniStore } from '@/store/store'
import useCookie from '@/hooks/useCookie'
import { useRouter } from 'next/navigation'
import { showCustomDangerToast, showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { MESSAGES } from '@/content/constant'

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
async function resetPasswordCodeGenerate(data: { email: string }) {
  const response: any = await client(`/auth/send-reset-password-otp?email=${data.email}`, { method: 'POST', data })
  return response
}
async function verifyResetPasswordOtp(data: { email: string }) {
  const response: any = await client(`/auth/verify-reset-password-otp`, { method: 'POST', data })
  return response
}
async function resetPassword(data: any) {
  const response: any = await client(`/auth/reset-password`, { method: 'POST', data })
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
  const router = useRouter()
  const [, setCookieValue] = useCookie('uni_user_token')
  const [, setRefreshCookieValue] = useCookie('uni_user_refresh_token')

  return useMutation({
    mutationFn: (data: LoginForm) => login(data),
    onSuccess: (response: UserResponseType, data) => {
      router.push('/timeline')
      setUserData(response.user)
      setUserProfileData(response.userProfile)
      setCookieValue(response.tokens.access.token, response.tokens.access.expires)
      setRefreshCookieValue(response.tokens.refresh.token, response.tokens.refresh.expires)
    },
    onError: (error: any) => {
      console.log(error)
      showCustomDangerToast(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG)
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

export const useResetPasswordCodeGenerate = () => {
  return useMutation({
    mutationFn: (data: { email: string }) => resetPasswordCodeGenerate(data),
    onSuccess: () => {
      showCustomSuccessToast('OTP sent successfully')
    },
    onError: (error: any) => {
      showCustomDangerToast(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG)
    },
  })
}
export const useResetPassword = () => {
  return useMutation({
    mutationFn: (data: any) => resetPassword(data),
    onSuccess: () => {
      showCustomSuccessToast('Password has been reset')
    },
    onError: (error: any) => {
      showCustomDangerToast(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG)
    },
  })
}
export const useVerifyResetPasswordOtp = () => {
  const [__, setResetPasswordCookieValue] = useCookie('uni_userPassword_reset_token')
  return useMutation({
    mutationFn: (data: { email: string }) => verifyResetPasswordOtp(data),
    onSuccess: (res: any) => {
      const expirationDate = new Date(Date.now() + 300 * 1000).toUTCString()
      setResetPasswordCookieValue(res.resetToken, expirationDate)
      showCustomSuccessToast('OTP Verified successfully')
    },
    onError: (error: any) => {
      showCustomDangerToast(error.response.data.message || MESSAGES.SOMETHING_WENT_WRONG)
    },
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
