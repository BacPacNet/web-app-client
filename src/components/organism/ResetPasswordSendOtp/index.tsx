'use client'
import React, { useEffect } from 'react'
import logo from '@/assets/unibuzz_logo.svg'
import InputBox from '@/components/atoms/Input/InputBox'
import Title from '@/components/atoms/Title'
import Button from '@/components/atoms/Buttons'
import { useForm } from 'react-hook-form'
import { LoginForm } from '@/models/auth'
import InputWarningText from '@/components/atoms/InputWarningText'
import { useHandleLogin } from '@/services/auth'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/spinner/Spinner'
import SubTitle from '@/components/atoms/SubTitle'

const ResetPasswordSendOtp = () => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>({ defaultValues: { email: '' } })

  const { mutate: login, error, isPending } = useHandleLogin()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const emailValue = localStorage.getItem('registeredEmail')
      if (emailValue) setValue('email', emailValue)
    }
  }, [setValue])

  const onSubmit = (data: LoginForm) => login(data)

  return (
    <div className="flex flex-col w-full sm:w-[475px] mx-auto px-4 lg:px-0">
      <div className="flex flex-col gap-8 p-8 rounded-lg bg-white shadow-lg">
        <img className="w-[119px] h-[27px]" src={logo.src} alt="logo" />
        <SubTitle>Reset Password</SubTitle>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}></form>
      </div>
    </div>
  )
}

export default ResetPasswordSendOtp
