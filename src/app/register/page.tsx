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

const REGISTER_COOKIE_EXPIRY_MS = 30 * 60 * 1000

const parseRegisterData = (value: string): Record<string, unknown> | null => {
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

const Register = () => {
  const [step, setStep] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [skipUniversityStep, setSkipUniversityStep] = useState(false)
  const [, setUserType] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cookieValue, setCookieValue] = useCookie('register_data')
  const hasSyncedStepFromCookie = useRef(false)

  const referralCode = searchParams.get('referralCode')
  const universityId = searchParams.get('universityId')

  useEffect(() => {
    if (typeof window === 'undefined') return

    let registerData: Record<string, unknown> | null = null
    if (cookieValue) {
      registerData = parseRegisterData(cookieValue)
    } else {
      const match = document.cookie.match(/(?:^|; )register_data=([^;]*)/)
      if (match?.[1]) {
        registerData = parseRegisterData(decodeURIComponent(match[1]))
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

    if (universityId) {
      const selectedUniversityIds = Array.isArray(registerData?.selectedUniversityIds) ? (registerData.selectedUniversityIds as string[]) : []
      const alreadyOnlyThisUniversity = selectedUniversityIds.length === 1 && selectedUniversityIds[0] === universityId
      const currentStep = typeof registerData?.step === 'number' ? registerData.step : 0

      if (
        !registerData ||
        !alreadyOnlyThisUniversity ||
        registerData.universityId !== universityId ||
        !registerData.skippedUniversityStep ||
        currentStep < 1
      ) {
        registerData = {
          ...(registerData || {}),
          selectedUniversityIds: [universityId],
          universityId,
          skippedUniversityStep: true,
          step: Math.max(currentStep, 1),
        }
        shouldUpdateCookie = true
      }
    }

    if (shouldUpdateCookie && registerData) {
      const expirationDate = new Date(Date.now() + REGISTER_COOKIE_EXPIRY_MS).toUTCString()
      setCookieValue(JSON.stringify(registerData), expirationDate)
    }

    setSkipUniversityStep(Boolean(universityId) || Boolean(registerData?.skippedUniversityStep))

    if (!hasSyncedStepFromCookie.current) {
      if (registerData) {
        setStep((registerData.step as number) ?? 0)
      }
      hasSyncedStepFromCookie.current = true
    }

    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookieValue, referralCode, universityId])

  const handlePrev = () => {
    if (step === 0) return
    if (skipUniversityStep && step === 1) return
    setStep((prev) => Math.max(skipUniversityStep ? 1 : 0, prev - 1))
  }

  useEffect(() => {
    if (skipUniversityStep && step === 0) {
      setStep(1)
    }
  }, [skipUniversityStep, step])

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

  const totalSteps = skipUniversityStep ? 3 : 4
  const displayedStep = skipUniversityStep ? Math.min(step, 3) : Math.min(step + 1, 4)
  const progressIndex = Math.min(step, 3)

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
                  progress={displayedStep}
                  key={`${skipUniversityStep ? 'skip' : 'full'}-${step}`}
                  strokeWidth={8}
                  strokeColor="#6744FF"
                  trackStrokeColor="#F3F2FF"
                  strokeLinecap="square"
                  trackStrokeWidth={8}
                  steps={totalSteps}
                >
                  <div className="text-neutral-700 font-semibold text-2xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {displayedStep} of {totalSteps}{' '}
                  </div>
                </ProgressBar>
              </div>
              <div>
                <p className="text-sm text-neutral-700 font-medium">{progressBarData[progressIndex].title}</p>
                <p className="text-neutral-500 text-xs">{progressBarData[progressIndex].des}</p>
              </div>
            </div>
            <FormContainer handlePrev={() => handlePrev()} step={step} setStep={setStep} skipUniversityStep={skipUniversityStep} />
          </>
        </div>
      </div>
    </div>
  )
}

export default Register
