'use client'
import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import Button from '@/components/atoms/Buttons'
import SupportingText from '@/components/atoms/SupportingText'
import Title from '@/components/atoms/Title'
import React, { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Spinner } from '@/components/spinner/Spinner'
import { useRouter } from 'next/navigation'
import { useTimeTracking } from '@/hooks/useTimeTracking'
import { TRACK_EVENT } from '@/content/constant'

type Props = {
  isPending: boolean
}

const AccountCreationForm = ({ isPending }: Props) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const {
    register,
    formState: { errors: registerFormErrors },
    watch,
    getValues,
  } = useFormContext()
  useTimeTracking(TRACK_EVENT.ACCOUNT_CREATION_STEP_VIEW_DURATION, {
    email: getValues('email'),
  })

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

  return (
    <div className="w-full  flex flex-col gap-8 items-center ">
      <div className="text-start flex flex-col gap-2 w-full">
        <Title>Join Our Community</Title>
        <SupportingText>Enter your credentials to create an account</SupportingText>
      </div>
      <div className="w-full flex flex-col gap-4 ">
        <div className="w-full flex flex-col">
          <InputBox
            label="Email Address"
            placeholder="john@example.com"
            type="email"
            {...register('email', {
              required: true,
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                message: 'Enter a valid email address.',
              },
            })}
            err={!!registerFormErrors.email}
          />
          {registerFormErrors.email && (
            <InputWarningText>
              {registerFormErrors.email?.message ? registerFormErrors.email.message.toString() : 'Please enter your email!'}
            </InputWarningText>
          )}
        </div>
        <div className="w-full flex flex-col">
          <InputBox
            label="Username"
            placeholder="john123"
            type="text"
            {...register('userName', {
              required: true,
            })}
            err={!!registerFormErrors.userName}
          />
          {registerFormErrors.userName && (
            <InputWarningText>
              {registerFormErrors.userName?.message ? registerFormErrors.userName.message.toString() : 'Please enter your user name.'}
            </InputWarningText>
          )}
        </div>
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
            err={!!registerFormErrors.password}
          />
          <div className={`absolute  right-0 pr-3 flex items-center text-sm ${registerFormErrors.password ? 'top-[15%]' : 'top-[20%]'} `}>
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

          {registerFormErrors?.password && !registerFormErrors?.password?.message ? (
            <InputWarningText>{'Please enter your password.'}</InputWarningText>
          ) : registerFormErrors?.password?.message ? (
            <InputWarningText>{registerFormErrors.password.message?.toString()}</InputWarningText>
          ) : password.length > 0 ? (
            <p></p>
          ) : (
            <label className="text-neutral-500 text-xs py-1">Minimum 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special (!@#$%^&*).</label>
          )}
        </div>
        <div className="relative w-full flex flex-col">
          <InputBox
            label="Confirm password"
            placeholder="***********"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmpassword', { required: true, validate: (value) => value === password || 'Passwords do not match.' })}
            err={!!registerFormErrors.confirmpassword}
          />

          {registerFormErrors.confirmpassword && (
            <InputWarningText>{registerFormErrors.confirmpassword.message?.toString() || 'Please enter your password.'}</InputWarningText>
          )}
        </div>
      </div>
      <div className="w-full flex flex-col gap-4">
        <Button disabled={isPending} variant="primary" size="large">
          {isPending ? <Spinner /> : ' Create an account'}
        </Button>

        <div className="mx-auto">
          <p className="text-primary-500 cursor-pointer" onClick={() => router.push('/login')}>
            Already have an account? Log in
          </p>
        </div>
      </div>
    </div>
  )
}

export default AccountCreationForm
