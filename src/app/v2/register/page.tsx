'use client'
import FormContainer from '@/components/organism/Register/formContainer/FormContainer'
import RegisterSIdebar from '@/components/organism/Register/sidebar/RegisterSIdebar'
import React, { useEffect, useState } from 'react'
import Loading from './loading'

const Register = () => {
  const [step, setStep] = useState<number>(0)
  const [subStep, setSubStep] = useState(0)
  const [loading, setLoading] = useState(true)

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
  return (
    <div className="flex h-screen bg-white">
      {loading ? (
        <Loading />
      ) : (
        <>
          <RegisterSIdebar step={step} subStep={subStep} />
          <FormContainer step={step} setStep={setStep} subStep={subStep} setSubStep={setSubStep} />
        </>
      )}
    </div>
  )
}

export default Register
