'use client'
import FormContainer from '@/components/organism/Register/formContainer/FormContainer'
import RegisterSIdebar from '@/components/organism/Register/sidebar/RegisterSIdebar'
import React, { useEffect, useState } from 'react'
import Loading from './loading'
import { userTypeEnum } from '@/types/RegisterForm'
import { IoIosArrowBack } from 'react-icons/io'
import ProgressBar from 'react-customizable-progressbar'
import useDeviceType from '@/hooks/useDeviceType'

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const registerData = localStorage.getItem('registerData') ? JSON.parse(localStorage.getItem('registerData') || '') : null

      if (registerData) {
        setStep(registerData.step || 0)
        setSubStep(registerData.subStep || 0)
      }
      setLoading(false)
    }
  }, [])

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
    <div className="flex h-screen bg-white flex-col lg:flex-row lg:py-0 py-8">
      {loading ? (
        <Loading />
      ) : (
        <>
          {isTablet || isMobile ? (
            <div className={`flex gap-2 justify-center items-center`}>
              {/*<div onClick={() => handlePrev()} className={`text-[#6744FF] text-2xl text-start cursor-pointer  ${step == 0 && 'hidden'}`}>
                <IoIosArrowBack />
              </div>*/}
              <ProgressBar
                radius={25}
                progress={step == 4 ? 4 : step + 1}
                key={step}
                strokeWidth={6}
                strokeColor="#6744FF"
                trackStrokeColor="#F3F2FF"
                strokeLinecap="square"
                trackStrokeWidth={6}
                steps={4}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">{step == 4 ? 4 : step + 1}/4 </div>
              </ProgressBar>
              <div>
                <p className="text-sm text-neutral-900">{progressBarData[step].title}</p>
                <p className="text-neutral-500 text-xs">{progressBarData[step].des}</p>
              </div>
            </div>
          ) : (
            <RegisterSIdebar step={step} subStep={subStep} onPrev={handlePrev} />
          )}

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
  )
}

export default Register
