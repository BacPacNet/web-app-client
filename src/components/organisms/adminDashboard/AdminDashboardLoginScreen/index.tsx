'use client'

import NotFound from '@/app/not-found'
import Buttons from '@/components/atoms/Buttons'
import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import { withInputLengthRules } from '@/components/atoms/Input/withInputLengthRules'
import { Spinner } from '@/components/spinner/Spinner'
import useCookie from '@/hooks/useCookie'
import { LoginForm } from '@/models/auth'
import { useAdminDashboardLogin } from '@/services/admin-dashboard-auth'
import { ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE, ADMIN_DASHBOARD_REFRESH_TOKEN_COOKIE } from '@/utils/adminDashboard'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function AdminDashboardLoginScreen() {
  const router = useRouter()
  const [isDenied, setIsDenied] = useState(false)
  const [, setAccessToken] = useCookie(ADMIN_DASHBOARD_ACCESS_TOKEN_COOKIE)
  const [, setRefreshToken] = useCookie(ADMIN_DASHBOARD_REFRESH_TOKEN_COOKIE)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>({ defaultValues: { email: '', password: '' } })
  const { mutate, isPending } = useAdminDashboardLogin()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const emailValue = localStorage.getItem('registeredEmail')
    if (emailValue) {
      setValue('email', emailValue)
    }
  }, [setValue])

  const onSubmit = (data: LoginForm) => {
    setIsDenied(false)

    mutate(data, {
      onSuccess: (response) => {
        setAccessToken(response.tokens.access.token, response.tokens.access.expires)
        setRefreshToken(response.tokens.refresh.token, response.tokens.refresh.expires)
        router.replace('/admin-dashboard/select-university')
      },
      onError: (error: any) => {
        const status = error?.response?.status

        if (status === 403 || status === 404) {
          setIsDenied(true)
        }
      },
    })
  }

  if (isDenied) {
    return <NotFound />
  }

  return (
    <div className="min-h-screen bg-surface-neutral-100 px-4 py-8 md:px-6">
      <div className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg md:p-8">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">Admin Dashboard</p>
          <h1 className="mt-2 text-2xl font-semibold text-neutral-900">Login / Authentication</h1>
        </div>

        <form className="mx-auto flex max-w-md flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <InputBox
              label="Email Address"
              placeholder="john.dowry@example.com"
              type="email"
              {...register(
                'email',
                withInputLengthRules('email', {
                  required: 'Please enter your email!',
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/i,
                    message: 'Invalid email format',
                  },
                })
              )}
              err={!!errors.email}
            />
            {errors.email && <InputWarningText>{errors.email.message}</InputWarningText>}
          </div>

          <div className="flex flex-col gap-2">
            <InputBox
              label="Password"
              placeholder="*********"
              type="password"
              {...register('password', withInputLengthRules('password', { required: 'Please enter your password!' }))}
              err={!!errors.password}
            />
            {errors.password && <InputWarningText>{errors.password.message}</InputWarningText>}
          </div>

          <Buttons type="submit" variant="primary" size="large" disabled={isPending}>
            {isPending ? <Spinner /> : 'Continue'}
          </Buttons>
        </form>
      </div>
    </div>
  )
}
