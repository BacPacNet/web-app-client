'use client'
import React, { useEffect, useState } from 'react'
import logo from '@/assets/Logo Circle.svg'
import InputBox from '@/components/atoms/Input/InputBox'
import { AiOutlineEye } from 'react-icons/ai'
import { AiOutlineEyeInvisible } from 'react-icons/ai'
import Title from '@/components/atoms/Title'
import SupportingText from '@/components/atoms/SupportingText'
import LoginButtons from '@/components/atoms/LoginButtons'
import { useForm } from 'react-hook-form'
import { LoginForm } from '@/models/auth'
import InputWarningText from '@/components/atoms/InputWarningText'
import { useHandleLogin } from '@/services/auth'
import { useRouter } from 'next/navigation'

const LoginBox = () => {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
  } = useForm<LoginForm>()

  const { mutate: mutateLogin, isSuccess } = useHandleLogin()

  const onSubmit = async (data: LoginForm) => {
    await mutateLogin(data)
  }

  useEffect(() => {
    if (isSuccess) {
      router.push(`/timeline`)
    }
  }, [isSuccess])

  return (
    <div className="flex flex-col w-1/3 max-lg:w-1/2 max-md:w-2/3 max-sm:w-11/12">
      <div className="flex flex-col gap-8 border border-neutral-300  py-9 px-6 rounded-xl bg-white drop-shadow-md">
        <img className="w-14 h-14" src={logo.src} alt="lgog" />
        <div>
          <Title>Login to your account</Title>
          <SupportingText>Enter your details to access your account</SupportingText>
        </div>
        <form className="flex flex-col gap-5" onSubmit={handleSubmitLogin(onSubmit)}>
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
            />
            {loginErrors.email && (
              <InputWarningText>{loginErrors.email.message ? loginErrors.email.message : 'Please enter your email!'}</InputWarningText>
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
            />
            <div className={`absolute  right-0 pr-3 flex items-center text-sm ${loginErrors.password ? 'top-1/3' : 'top-[40%]'} `}>
              {showPassword ? (
                <AiOutlineEyeInvisible className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
              ) : (
                <AiOutlineEye className="h-5 w-5 text-gray-700 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
              )}
            </div>
            {loginErrors.password && <InputWarningText>Please enter your password!</InputWarningText>}
            <label className="text-neutral-500 text-xs">Forgot Password?</label>
          </div>

          <div className="flex gap-2 items-center">
            <input className="w-4 h-4 border-neutral-300" type="checkbox" />
            <p className="text-neutral-900 text-sm">Remember device for 30 days</p>
          </div>
          <LoginButtons variant="primary">Log in</LoginButtons>
        </form>
      </div>
      <button className="mt-4 mx-auto">
        <p>
          No account yet? <span className="text-primary-500">Create an account</span>
        </p>
      </button>
    </div>
  )
}

export default LoginBox
