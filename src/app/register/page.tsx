'use client'
import FormContainer from '@/components/organism/Register/formContainer/FormContainer'
import React, { useEffect, useRef, useState } from 'react'
import ProgressBar from 'react-customizable-progressbar'
import useCookie from '@/hooks/useCookie'
import { useRouter, useSearchParams } from 'next/navigation'
import Spinner from '@/components/atoms/spinner'
import RedirectFromRegister from '@/components/organism/Register/redirect-screen'

const progressBarData = [
  { title: 'Select Universities', des: 'Choose universities to explore' },
  { title: 'Account Creation', des: 'Login Information' },
  { title: 'Profile Setup', des: 'User Information' },
  { title: 'User Verification', des: 'Sync personal email' },
]

const Register = () => {
  const [step, setStep] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [, setUserType] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cookieValue, setCookieValue] = useCookie('register_data')
  const hasSyncedStepFromCookie = useRef(false)

  // Extract referCode from query parameters
  const referralCode = searchParams.get('referralCode')

  useEffect(() => {
    if (typeof window === 'undefined') return

    let registerData: Record<string, unknown> | null = null
    if (cookieValue) {
      try {
        registerData = JSON.parse(cookieValue)
      } catch {
        registerData = null
      }
    } else {
      const match = document.cookie.match(/(?:^|; )register_data=([^;]*)/)
      if (match?.[1]) {
        try {
          registerData = JSON.parse(decodeURIComponent(match[1]))
        } catch {
          registerData = null
        }
      }
    }

    let shouldUpdateCookie = false

    if (referralCode) {
      if (registerData) {
        if (registerData.referCode !== referralCode) {
          registerData = { ...registerData, referralCode }
          shouldUpdateCookie = true
        }
      } else {
        registerData = { referralCode }
        shouldUpdateCookie = true
      }
    }

    if (shouldUpdateCookie && registerData) {
      const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toUTCString()
      setCookieValue(JSON.stringify(registerData), expirationDate)
    }

    if (!hasSyncedStepFromCookie.current) {
      if (registerData) {
        setStep((registerData.step as number) ?? 0)
      }
      hasSyncedStepFromCookie.current = true
    }

    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookieValue, referralCode])

  const handlePrev = () => {
    if (step === 0) return
    setStep((prev) => Math.max(0, prev - 1))
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  // Final screen after the 4-step flow (0..3)
  if (step === 4) {
    return <RedirectFromRegister />
  }

  if (loading)
    return (
      <div className="h-with-navbar-space flex justify-center items-center">
        <Spinner />
      </div>
    )
  return (
    <div className="flex w-full  bg-neutral-100 flex-col items-center  pb-48">
      <div className="flex  flex-col items-center  max-width-allowed w-full">
        <div className="flex   flex-col items-start bg-white   rounded-lg w-11/12 sm:w-[500px] p-8 mt-4 shadow-[0px_6px_15px_-2px_rgba(16,24,40,0.08),0px_6px_15px_-2px_rgba(16,24,40,0.08)]">
          {!loading && (
            <p onClick={() => router.push('/')} className="text-2xs text-primary cursor-pointer mb-6 underline">
              Back to Home
            </p>
          )}

          <>
            <div className={`relative flex gap-6 justify-start items-center mb-6 w-full sm:w-[300px] h-[72px]`}>
              <div className="w-16 h-16"></div>
              <div className="absolute -left-5">
                <ProgressBar
                  radius={32}
                  progress={Math.min(step + 1, 4)}
                  key={step}
                  strokeWidth={8}
                  strokeColor="#6744FF"
                  trackStrokeColor="#F3F2FF"
                  strokeLinecap="square"
                  trackStrokeWidth={8}
                  steps={4}
                >
                  <div className="text-neutral-700 font-semibold text-2xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {Math.min(step + 1, 4)} of 4{' '}
                  </div>
                </ProgressBar>
              </div>
              <div>
                <p className="text-sm text-neutral-700 font-medium">{progressBarData[Math.min(step, 3)].title}</p>
                <p className="text-neutral-500 text-xs">{progressBarData[Math.min(step, 3)].des}</p>
              </div>
            </div>
            <FormContainer handlePrev={() => handlePrev()} step={step} setStep={setStep} />
          </>
        </div>
      </div>
    </div>
  )
}

export default Register
