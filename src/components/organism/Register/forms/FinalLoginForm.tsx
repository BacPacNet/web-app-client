'use client'
import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import Button from '@/components/atoms/Buttons'
import SupportingText from '@/components/atoms/SupportingText'
import Title from '@/components/atoms/Title'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
import logo from '@/assets/Logo Circle.svg'
import { AiOutlineEye } from 'react-icons/ai'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import { useHandleLogin } from '@/services/auth'
import { LoginForm } from '@/models/auth'
import { Spinner } from '@/components/spinner/Spinner'

const FinalLoginForm = ({ email }: { email: string }) => {
  const [showPassword, setShowPassword] = useState(false)
  const {
    register: registerLogin,
    formState: { errors: FinalLoginFormErrors },
    handleSubmit,
    setValue,
  } = useForm<LoginForm>()
  const { mutate: mutateLogin, error, isPending, isError } = useHandleLogin(true)

  const onSubmit = async (data: LoginForm) => {
    mutateLogin(data)
  }

  useEffect(() => {
    setValue('email', email)
  }, [])
  return (
    <div className="w-1/2 flex flex-col gap-8 items-center ">
      <Image src={logo.src} alt="lgog" width={54} height={54} />
      <div>
        <Title>Congratulations</Title>
        <SupportingText className="text-center">Enter your details to access your account</SupportingText>
      </div>
      <div className="w-10/12 xl:w-10/12 flex flex-col gap-5 ">
        <div className="relative w-full flex flex-col gap-2">
          <label htmlFor="Email Address" className="font-medium text-neutral-900">
            Email Address
          </label>

          <InputBox
            placeholder="john.dowry@example.com"
            type="email"
            {...registerLogin('email', {
              required: true,
              pattern: {
                value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                message: 'Invalid email format',
              },
            })}
            err={!!FinalLoginFormErrors.email}
          />
          {FinalLoginFormErrors.email && (
            <InputWarningText>
              {FinalLoginFormErrors.email.message ? FinalLoginFormErrors.email.message.toString() : 'Please enter your email!'}
            </InputWarningText>
          )}
        </div>
        <div className="relative w-full flex flex-col gap-2">
          <label htmlFor="Email Address" className="font-medium text-neutral-900">
            Password
          </label>
          <InputBox
            placeholder="*******************"
            type={showPassword ? 'text' : 'password'}
            {...registerLogin('password', { required: true })}
            err={!!FinalLoginFormErrors.password}
          />
          <div className={`absolute  right-0 pr-3 flex items-center text-sm ${FinalLoginFormErrors.password ? 'top-1/3' : 'top-[40%]'} `}>
            {showPassword ? (
              <AiOutlineEyeInvisible className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
            ) : (
              <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
            )}
          </div>
          {FinalLoginFormErrors.password && <InputWarningText>Please enter your password!</InputWarningText>}
          <label className="text-neutral-500 text-xs">Forgot Password?</label>
        </div>
        <div className="flex gap-2 items-center">
          <input className="w-4 h-4 border-neutral-300" type="checkbox" />
          <p className="text-neutral-900 text-sm">Remember device for 30 days</p>
        </div>
        {/* <Button className="mt-5" variant="primary">
          Log in
        </Button> */}
        <Button onClick={handleSubmit(onSubmit)} className="mt-5" disabled={isPending} variant="primary">
          {isPending ? <Spinner /> : 'Log in'}
        </Button>
      </div>
    </div>
  )
}

export default FinalLoginForm
