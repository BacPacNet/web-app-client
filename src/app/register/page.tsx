'use client'
import FormContainer from '@/components/organism/Register/formContainer/FormContainer'
import RegisterSIdebar from '@/components/organism/Register/sidebar/RegisterSIdebar'
import React, { useEffect, useState } from 'react'
import Loading from './loading'
import { userTypeEnum } from '@/types/RegisterForm'
import { IoIosArrowBack } from 'react-icons/io'
const Register = () => {
  const [step, setStep] = useState<number>(0)
  const [subStep, setSubStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState('')

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
    <div className="flex h-with-navbar bg-white">
      {loading ? (
        <Loading />
      ) : (
        <>
          <RegisterSIdebar step={step} subStep={subStep} onPrev={handlePrev} />
          <FormContainer step={step} setStep={setStep} subStep={subStep} setSubStep={setSubStep} setUserType={setUserType} />
          {/* <div
            onClick={() => handlePrev()}
            className="absolute bg-primary w-10 h-10 flex items-center justify-center z-50 top-1/3 max-xl:left-[31%] left-[32%] max-lg:hidden text-white p-2 rounded-full text-center cursor-pointer"
          >
            <IoIosArrowBack />
          </div> */}
          <div
            onClick={() => handlePrev()}
            className="absolute lg:hidden z-20 top-20 left-2  text-neutral-600  flex items-center  text-start cursor-pointer"
          >
            <IoIosArrowBack />
            back
          </div>
        </>
      )}
    </div>
  )
}

export default Register
