'use client'
import FormContainer from '@/components/organism/Register/formContainer/FormContainer'
import RegisterSIdebar from '@/components/organism/Register/sidebar/RegisterSIdebar'
import React, { useEffect, useState } from 'react'
import Loading from './loading'
import { useForm } from 'react-hook-form'
import { userTypeEnum } from '@/types/RegisterForm'

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
    if (step === 1 && subStep === 1) {
      return setSubStep(0)
    }
    if (step === 2 && subStep === 1) {
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
    <div className="flex h-screen bg-white">
      {loading ? (
        <Loading />
      ) : (
        <>
          <RegisterSIdebar step={step} subStep={subStep} />
          <FormContainer step={step} setStep={setStep} subStep={subStep} setSubStep={setSubStep} setUserType={setUserType} />
          <div
            onClick={() => handlePrev()}
            className="absolute bg-primary w-10 h-10 z-50 top-1/3 max-xl:left-[31%] left-[32%] text-white p-2 rounded-full text-center cursor-pointer"
          >
            {'<'}
          </div>
        </>
      )}
    </div>
  )
}

export default Register
