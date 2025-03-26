'use client'
import { OTPInput } from 'input-otp'
import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import Button from '@/components/atoms/Buttons'
import SupportingText from '@/components/atoms/SupportingText'
import Title from '@/components/atoms/Title'
import { useHandleLoginEmailVerificationGenerate, useResetPassword, useResetPasswordCodeGenerate, useVerifyResetPasswordOtp } from '@/services/auth'
import React, { useCallback, useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Spinner } from '@/components/spinner/Spinner'
import { Slot } from '@/components/atoms/OTP-Input/OTP_SlotAndCarrot'
import { MdOutlineArrowBack } from 'react-icons/md'
import { showCustomSuccessToast } from '@/components/atoms/CustomToasts/CustomToasts'
import { useRouter } from 'next/navigation'
import useCookie from '@/hooks/useCookie'

const ResetPasswordSendOtp = () => {
  const [countdown, setCountdown] = useState(30)
  const [isCounting, setIsCounting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
    setError,
    clearErrors,
    watch,
  } = useForm({
    defaultValues: {
      password: '',
      verificationOtp: '',
      email: '',
      newPassword: '',
      confirmpassword: '',
    },
  })
  const { mutate: generateResetPasswordOtp } = useResetPasswordCodeGenerate()
  const { mutate: verifyResetPasswordOtp, isSuccess: isVerifyResetPasswordSuccess } = useVerifyResetPasswordOtp()
  const { mutate: ResetPassword, isSuccess: isResetPasswordSuccess, isPending: isResetPasswordLoading } = useResetPassword()
  const [resetToken, setResetPasswordCookieValue] = useCookie('uni_userPassword_reset_token')
  const email = watch('email')
  const verificationOtp = watch('verificationOtp')
  const confirmpassword = watch('confirmpassword')

  const resetPasswordCodeGenerate = () => {
    if (!email) {
      setError('email', { type: 'manual', message: 'Please enter your email!' })
      return
    }

    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i
    if (!emailRegex.test(email)) {
      setError('email', { type: 'manual', message: 'Invalid email format' })
      return
    }

    clearErrors('email')
    const data = { email }

    generateResetPasswordOtp(data)
    handleLoginEmailSendCodeCount()
  }

  const handleLoginEmailSendCodeCount = () => {
    setIsCounting(true)
    setCountdown(30)
  }

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isCounting && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else if (countdown === 0) {
      setIsCounting(false)
    }
    return () => clearTimeout(timer)
  }, [countdown, isCounting])

  const password = watch('password')

  const [passwordStrength, setPasswordStrength] = useState(0)

  const calculateStrength = useCallback((password: string) => {
    if (password.length < 8) return 0

    let score = 0
    if (/[A-Z]/.test(password)) score++
    if (/[a-z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++

    return score
  }, [])

  useEffect(() => {
    setPasswordStrength(password ? calculateStrength(password) : 0)
  }, [password, calculateStrength])

  const handleResetOtpCheck = () => {
    const data = {
      otp: verificationOtp,
      email,
    }

    verifyResetPasswordOtp(data)
  }

  const handleResetPassword = () => {
    const data = {
      email,
      resetToken,
      newPassword: confirmpassword,
    }
    ResetPassword(data)
  }

  const handleCheckEmail = (data: any) => {
    console.log('Data', data)

    if (isVerifyResetPasswordSuccess) {
      setIsVerified(true)
    }
  }

  return (
    <div className="flex   bg-neutral-100 flex-col items-center  pb-48">
      <div className="flex  flex-col items-center  max-width-allowed ">
        <div className="flex   flex-col items-start bg-white  shadow-sm rounded-lg w-11/12 sm:w-[448px]   p-12 mt-16">
          <p onClick={() => router.push('/login')} className="text-2xs text-primary cursor-pointer mb-6 underline">
            Back to Login
          </p>
          {isVerified ? (
            <form className="w-full  flex flex-col gap-8 items-center ">
              <div className="text-start flex flex-col gap-2 w-full">
                <Title>Reset Password</Title>
              </div>
              <div className="w-full flex flex-col gap-8 ">
                <div className="relative w-full flex flex-col">
                  <InputBox
                    label="Password"
                    placeholder="***********"
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: true,
                      minLength: {
                        value: 8,
                        message:
                          'Password must have at least 8 characters, one number, one uppercase letter, one lowercase letter, and one special character (!@#$%^&*).',
                      },
                      pattern: {
                        value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,
                        message:
                          'Password must have at least 8 characters, one number, one uppercase letter, one lowercase letter, and one special character (!@#$%^&*).',
                      },
                    })}
                    err={!!errors.password}
                  />
                  <div className={`absolute  right-0 pr-3 flex items-center text-sm ${errors.password ? 'top-[15%]' : 'top-[20%]'} `}>
                    {/* <PasswordToggleIcon showPassword={showPassword} onClick={(value: any) => setShowPassword(value)} /> */}
                  </div>

                  <div className="flex w-full gap-1 py-2 ">
                    {[1, 2, 3, 4].map((item) => (
                      <span
                        key={item}
                        className={`h-1 w-full  transition-colors ${passwordStrength >= item ? 'bg-green-400' : 'bg-neutral-300'} ${
                          item == 1 ? 'rounded-l-md' : item == 4 ? 'rounded-r-md' : ''
                        } `}
                      ></span>
                    ))}
                  </div>

                  {errors?.password?.message ? (
                    <InputWarningText>{errors.password.message?.toString()}</InputWarningText>
                  ) : (
                    <label className="text-neutral-500 text-xs py-1">
                      Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special (!@#$%^&*).
                    </label>
                  )}
                </div>
                <div className="relative w-full flex flex-col">
                  <InputBox
                    label="Confirm password"
                    placeholder="***********"
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmpassword', { required: true, validate: (value) => value === password || 'Passwords do not match.' })}
                    err={!!errors.confirmpassword}
                  />

                  {errors.confirmpassword && (
                    <InputWarningText>{errors.confirmpassword.message?.toString() || 'Please enter your password.'}</InputWarningText>
                  )}
                </div>
              </div>
              <div onClick={handleSubmit(handleResetPassword)} className="w-full flex flex-col gap-4">
                <Button variant="primary">Set Password</Button>
              </div>
            </form>
          ) : (
            <form className="w-full  flex flex-col gap-8 items-center ">
              <div className="text-start flex flex-col gap-2 w-full">
                <Title>Reset Password</Title>
              </div>
              <div className="w-full flex flex-col gap-8 ">
                <div className="relative w-full flex flex-col ">
                  <InputBox
                    label="Login Email"
                    placeholder="Email Address"
                    type="email"
                    // value={email}
                    {...register('email', {
                      required: true,
                      pattern: {
                        value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                        message: 'Invalid email format',
                      },
                    })}
                    err={!!errors.email}
                  />
                  {errors.email && (
                    <InputWarningText>{errors.email.message ? errors.email.message.toString() : 'please enter your email!'}</InputWarningText>
                  )}
                  <Button
                    disabled={isCounting}
                    onClick={() => resetPasswordCodeGenerate()}
                    type="button"
                    variant="border_primary"
                    className="h-10 mt-4"
                  >
                    Send Code
                  </Button>
                  {isCounting && <p className="text-xs text-neutral-500 text-center">Resend Available after {countdown}s</p>}
                </div>
                {/* otp  */}
                <div className="relative w-full flex flex-col gap-2">
                  <label htmlFor="Email Address" className="font-medium text-neutral-900">
                    Input Verification Code
                  </label>

                  <Controller
                    name="verificationOtp"
                    control={control}
                    rules={{
                      required: 'otp is required!',
                      validate: (value) => value.length === 6 || 'OTP must be 6 digits long!',
                    }}
                    render={({ field }) => (
                      <OTPInput
                        {...field}
                        maxLength={6}
                        containerClassName="group flex items-center has-[:disabled]:opacity-30  "
                        value={field.value}
                        onComplete={() => handleResetOtpCheck()}
                        placeholder="000000"
                        inputMode="numeric"
                        render={({ slots }) => (
                          <div className={`flex gap-2 ${field.value ? 'text-neutral-700' : 'text-neutral-300'} `}>
                            {slots.map((slot, idx) => (
                              <Slot key={idx} {...slot} />
                            ))}
                          </div>
                        )}
                      />
                    )}
                  />
                  {errors.verificationOtp && (
                    <InputWarningText>{errors.verificationOtp.message?.toString() || 'Please enter your otp!'}</InputWarningText>
                  )}
                </div>
              </div>
              <div onClick={handleSubmit(handleCheckEmail)} className="w-full flex flex-col gap-2">
                <Button disabled={false} variant="primary">
                  Reset Password
                </Button>

                {/* {isVerificationSuccess && <p className="text-xs text-green-500 text-center">Login credentials verified.</p>} */}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordSendOtp
