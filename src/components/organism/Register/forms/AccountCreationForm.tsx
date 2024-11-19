'use client'
import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import Button from '@/components/atoms/Buttons'
import SupportingText from '@/components/atoms/SupportingText'
import Title from '@/components/atoms/Title'
import React, { useCallback, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { AiOutlineEye } from 'react-icons/ai'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import googleIcon from '@/assets/Social icon.svg'
import Image from 'next/image'
import { Spinner } from '@/components/spinner/Spinner'
import { useRouter } from 'next/navigation'

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
  } = useFormContext()

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
    <div className="w-1/2 flex flex-col gap-8 items-center">
      <div className="text-center px-3">
        <Title>Join Our Community</Title>
        <SupportingText>Enter your credentials to create an account</SupportingText>
      </div>
      <div className="w-10/12 flex flex-col gap-2 ">
        <div className="w-full flex flex-col">
          <InputBox
            placeholder="Email Address"
            type="email"
            {...register('email', {
              required: true,
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                message: 'Invalid email format',
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
            placeholder="Username"
            type="text"
            {...register('userName', {
              required: true,
            })}
            err={!!registerFormErrors.userName}
          />
          {registerFormErrors.userName && (
            <InputWarningText>
              {registerFormErrors.userName?.message ? registerFormErrors.userName.message.toString() : 'Please enter your userName!'}
            </InputWarningText>
          )}
        </div>
        <div className="relative w-full flex flex-col gap-2">
          <InputBox
            placeholder="Create password"
            type={showPassword ? 'text' : 'password'}
            {...register('password', {
              required: true,
              minLength: {
                value: 8,
                message: 'Password must have at least 8 characters',
              },
            })}
            err={!!registerFormErrors.password}
          />
          <div className={`absolute  right-0 pr-3 flex items-center text-sm ${registerFormErrors.password ? 'top-[20%]' : 'top-[30%]'} `}>
            {showPassword ? (
              <AiOutlineEyeInvisible className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
            ) : (
              <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
            )}
          </div>
          {password?.length ? (
            <div className="flex w-full gap-1 ">
              {[1, 2, 3, 4].map((item) => (
                <span
                  key={item}
                  className={`h-1 w-full  transition-colors ${passwordStrength >= item ? 'bg-green-400' : 'bg-neutral-300'} ${
                    item == 1 ? 'rounded-l-md' : item == 4 ? 'rounded-r-md' : ''
                  } `}
                ></span>
              ))}
            </div>
          ) : (
            ''
          )}
          {registerFormErrors?.password?.message ? (
            <InputWarningText>{registerFormErrors.password.message?.toString()}</InputWarningText>
          ) : (
            registerFormErrors.password && <InputWarningText>Please enter your password!</InputWarningText>
          )}
        </div>
        <div className="relative w-full flex flex-col gap-2">
          <InputBox
            placeholder="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmpassword', { required: true, validate: (value) => value === password || 'Passwords do not match' })}
            err={!!registerFormErrors.confirmpassword}
          />
          <div className={`absolute  right-0 pr-3 flex items-center text-sm ${registerFormErrors.confirmpassword ? 'top-[15%]' : 'top-[20%]'} `}>
            {showConfirmPassword ? (
              <AiOutlineEyeInvisible className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
            ) : (
              <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowConfirmPassword(!showConfirmPassword)} />
            )}
          </div>
          {registerFormErrors.confirmpassword && <InputWarningText>{registerFormErrors.confirmpassword.message?.toString()}</InputWarningText>}

          <label className="text-neutral-500 text-xs">Must be at least 8 characters</label>
        </div>
      </div>
      <div className="w-10/12 flex flex-col gap-2">
        <Button disabled={isPending} variant="primary">
          {isPending ? <Spinner /> : ' Create an account'}
        </Button>
        <Button type="button" variant="border" className="flex items-center justify-center gap-2">
          <Image src={googleIcon} alt="go" /> Sign up with Google
        </Button>
      </div>
      <div className="mt-4 mx-auto">
        <p>
          Already have an account?{' '}
          <span onClick={() => router.push('/login')} className="text-primary-500 cursor-pointer">
            {' '}
            Log in
          </span>
        </p>
      </div>
    </div>
  )
}

export default AccountCreationForm
