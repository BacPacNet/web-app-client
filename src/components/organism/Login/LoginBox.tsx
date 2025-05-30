'use client'
import React, { useEffect, useState } from 'react'
import InputBox from '@/components/atoms/Input/InputBox'
import Title from '@/components/atoms/Title'
import Button from '@/components/atoms/Buttons'
import { useForm } from 'react-hook-form'
import { LoginForm } from '@/models/auth'
import InputWarningText from '@/components/atoms/InputWarningText'
import { useHandleLogin } from '@/services/auth'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/spinner/Spinner'

const LoginBox = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>({ defaultValues: { email: '' } })

  const { mutateAsync: login, isPending } = useHandleLogin()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const emailValue = localStorage.getItem('registeredEmail')
      if (emailValue) setValue('email', emailValue)
    }
  }, [])

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true)
      await login(data)
      router.push('/timeline')
    } catch (error) {
      console.error('Login error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  //  useEffect(() => {
  //    if (userData) {
  //      router.push('/timeline')
  //    }
  //  }, [router, userData])

  return (
    <div className="flex flex-col w-11/12 sm:w-[448px] mx-auto">
      <div className="flex flex-col gap-8 p-12 rounded-lg bg-white shadow-lg">
        <p onClick={() => router.push('/')} className="text-2xs text-primary cursor-pointer  underline">
          Back to Home
        </p>
        {/* <img className="w-[119px] h-[27px]" src={logo.src} alt="logo" />  */}
        <Title>Login to your account</Title>
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <InputBox
              label="Email Address"
              placeholder="john.dowry@example.com"
              type="email"
              {...register('email', {
                required: 'Please enter your email!',
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                  message: 'Invalid email format',
                },
              })}
              err={!!errors.email}
            />
            {errors.email && <InputWarningText>{errors.email.message}</InputWarningText>}
          </div>
          <div className="flex flex-col gap-2">
            <InputBox
              label="Password"
              placeholder="*********"
              type="password"
              {...register('password', { required: 'Please enter your password!' })}
              err={!!errors.password}
            />
            {errors.password && <InputWarningText>{errors.password.message}</InputWarningText>}
          </div>
          <div className="flex flex-col gap-4">
            <Button disabled={isPending || isLoading} variant="primary" size="large">
              {isPending || isLoading ? <Spinner /> : 'Log in'}
            </Button>
            <Button type="button" onClick={() => router.push('/forget-password')} disabled={isPending} variant="border" size="large">
              Forgot Password
            </Button>
            <p className="mt-4 mx-auto text-primary-500 font-normal cursor-pointer" onClick={() => router.push('/register')}>
              No account yet? Sign up.
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginBox
