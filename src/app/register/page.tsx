'use client'
import FormContainer from '@/components/organism/Register/formContainer/FormContainer'
import RegisterSIdebar from '@/components/organism/Register/sidebar/RegisterSIdebar'
import React, { useEffect, useState } from 'react'
import Loading from './loading'
import { userTypeEnum } from '@/types/RegisterForm'
import { IoIosArrowBack } from 'react-icons/io'
import ProgressBar from 'react-customizable-progressbar'
import useDeviceType from '@/hooks/useDeviceType'
import useCookie from '@/hooks/useCookie'
import { useRouter } from 'next/navigation'

const progressBarData = [
  { title: 'Account Creation', des: 'Login Information' },
  { title: 'Profile Setup', des: 'User Information' },
  { title: 'User Verification', des: 'Sync personal and university email' },
  { title: 'Almost There', des: 'Do you have a referral code?' },
  { title: 'Finalize Account', des: 'Login to your newly made account' },
]

const Register = () => {
  const [step, setStep] = useState<number>(0)
  const [subStep, setSubStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState('')
  const { isTablet, isMobile } = useDeviceType()
  const router = useRouter()
  const [cookieValue, setCookieValue] = useCookie('register_data')
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const registerData = cookieValue ? JSON.parse(cookieValue) : null

      if (registerData) {
        setStep(registerData.step || 0)
        setSubStep(registerData.subStep || 0)
      }
      setLoading(false)
    }
  }, [cookieValue])

  const handlePrev = () => {
    if (step == 0) {
      return
    } else if (step === 1 && subStep === 1) {
      return setSubStep(0)
    } else if (step === 2 && subStep === 0 && userType !== userTypeEnum.Applicant) {
      setStep(step - 1)
      return setSubStep(1)
    } else if (step === 2 && subStep === 1) {
      setSubStep(0)
    } else if (step === 3) {
      setStep(step - 1)
      if (userType == userTypeEnum.Applicant) {
        setSubStep(0)
      } else if (userType == userTypeEnum.Student || userType == userTypeEnum.Faculty) {
        setSubStep(1)
      }
    } else {
      setStep(step - 1)
      setSubStep(0)
    }
  }

  return (
    <div className="flex  h-screen bg-white flex-col items-center  ">
      <div className="flex  flex-col items-center  max-width-allowed">
        <div className="flex   flex-col items-center w-[358px] md:w-[392px]  lg:py-0 py-8 mt-16">
          {!loading && (
            <p onClick={() => router.push('/')} className="text-2xs text-primary cursor-pointer mb-6 underline">
              Back to Home
            </p>
          )}
          {loading ? (
            <Loading />
          ) : (
            <>
              <div className={`flex gap-6 justify-center items-center mb-6 w-[300px] h-[72px]`}>
                <ProgressBar
                  radius={32}
                  progress={step == 4 ? 4 : step + 1}
                  key={step}
                  strokeWidth={8}
                  strokeColor="#6744FF"
                  trackStrokeColor="#F3F2FF"
                  strokeLinecap="square"
                  trackStrokeWidth={8}
                  steps={4}
                >
                  <div className="text-neutral-700 font-semibold text-2xs absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {step == 4 ? 4 : step + 1}/4{' '}
                  </div>
                </ProgressBar>
                <div>
                  <p className="text-sm text-neutral-700 font-medium">{progressBarData[step].title}</p>
                  <p className="text-neutral-500 text-xs">{progressBarData[step].des}</p>
                </div>
              </div>
              <FormContainer
                handlePrev={() => handlePrev()}
                step={step}
                setStep={setStep}
                subStep={subStep}
                setSubStep={setSubStep}
                setUserType={setUserType}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Register
