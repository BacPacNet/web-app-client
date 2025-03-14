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
  const { mutate: mutateLogin, error, isPending, isError } = useHandleLogin()

  const onSubmit = async (data: LoginForm) => {
    mutateLogin(data)
  }

  useEffect(() => {
    const loginEmail: any = localStorage.getItem('registeredEmail')

    setValue('email', loginEmail)
  }, [])
  return (
    <div className="w-1/2 flex flex-col gap-8 items-center ">
      <div>
        <Title>Congratulations</Title>
        <SupportingText className="text-center">Enter your details to access your account</SupportingText>
      </div>
      <div className="w-10/12 xl:w-10/12 flex flex-col gap-5 ">
        <div className="relative w-full flex flex-col gap-2">
          <InputBox
            label="Email Address"
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
          <InputBox
            label="Password"
            placeholder="**********"
            type={showPassword ? 'text' : 'password'}
            {...registerLogin('password', { required: true })}
            err={!!FinalLoginFormErrors.password}
          />

          {FinalLoginFormErrors.password && <InputWarningText>Please enter your password!</InputWarningText>}
          <label className="text-neutral-500 text-xs">Forgot Password?</label>
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
