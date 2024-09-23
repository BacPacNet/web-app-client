'use client'
import React, { useEffect, useState } from 'react'
import AccountCreationForm from '../forms/AccountCreationForm'
import ProfileSetupForm from '../forms/ProfileSetupForm'
import { FormProvider, useForm } from 'react-hook-form'
import VerificationForm from '../forms/VerificationForm'
import UniversityVerificationForm from '../forms/UniversityVerificationForm'
import ClaimBenefitForm from '../forms/ClaimBenefitForm'
import FinalLoginForm from '../forms/FinalLoginForm'
import {
  useHandleLoginEmailVerification,
  useHandleRegister_v2,
  useHandleUniversityEmailVerification,
  useHandleUserEmailAndUserNameAvailability,
} from '@/services/auth'
import { useRouter } from 'next/navigation'

interface data {
  email: string
  userName: string
  password: string
  confirmpassword: string
  birthDate: string
  gender: string
  country: string
  firstName: string
  lastName: string
  verificationEmail: string
  verificationOtp: string
  universityEmail: string
  UniversityOtp: string
  UniversityOtpOK: string
  referralCode: string
}

interface props {
  step: number
  setStep: (value: number) => void
  subStep: number
  setSubStep: (value: number) => void
}

enum userCheckError {
  emailNotAvailable = 'Email is already taken',
  userNameNotAvailable = 'userName Already taken',
}

const FormContainer = ({ step, setStep, setSubStep, subStep }: props) => {
  const [registerData, setRegisterData] = useState<data | any>(null)
  const { mutateAsync: handleUserCheck } = useHandleUserEmailAndUserNameAvailability()
  const { mutateAsync: handleUserLoginEmailVerification, isSuccess: userLoginEmailVerificationSuccess } = useHandleLoginEmailVerification()
  const { mutateAsync: handleUserUniversityEmailVerification, isSuccess: userUniversityEmailVerificationSuccess } =
    useHandleUniversityEmailVerification()

  const { mutateAsync: HandleRegister } = useHandleRegister_v2()
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = localStorage.getItem('registerData')
      if (storedData) {
        try {
          setRegisterData(JSON.parse(storedData))
        } catch (error) {
          console.error('Error parsing registerData from localStorage:', error)
        }
      } else {
        setRegisterData({})
      }
    }
  }, [])

  const methods = useForm({
    defaultValues: {
      email: '',
      userName: '',
      password: '',
      confirmpassword: '',
      birthDate: '',
      gender: '',
      country: '',
      firstName: '',
      lastName: '',
      verificationEmail: '',
      verificationOtp: '',
      universityEmail: '',
      UniversityOtp: '',
      UniversityOtpOK: '',
      referralCode: '',
    },
  })

  useEffect(() => {
    if (registerData) {
      methods.reset({
        email: registerData?.email || '',
        userName: registerData?.userName || '',
        password: registerData?.password || '',
        confirmpassword: registerData?.confirmpassword || '',
        birthDate: registerData?.birthDate || '',
        gender: registerData?.gender || '',
        country: registerData?.country || '',
        firstName: registerData?.firstName || '',
        lastName: registerData?.lastName || '',
        verificationEmail: registerData?.verificationEmail || '',
        verificationOtp: registerData?.verificationOtp || '000000',
        universityEmail: registerData?.universityEmail || '',
        UniversityOtp: registerData?.UniversityOtp || '000000',
        referralCode: registerData?.referralCode || '',
      })
    }
  }, [registerData, methods])

  const userCheck = async (data: data) => {
    try {
      const isAvailable = await handleUserCheck(data)
      return isAvailable
    } catch (error: any) {
      if (error.response.data.message == userCheckError.emailNotAvailable) {
        methods.setError('email', { message: error.response.data.message })
      } else if (error.response.data.message == userCheckError.userNameNotAvailable) {
        methods.setError('userName', { message: error.response.data.message })
      }
    }
  }

  const userLoginEmailVerification = async (data: data) => {
    try {
      const isAvailable = await handleUserLoginEmailVerification(data)
      return isAvailable
    } catch (error: any) {
      methods.setError('verificationOtp', { message: error.response.data.message })
    }
  }

  const userUniversityEmailVerification = async (data: data) => {
    try {
      const isAvailable = await handleUserUniversityEmailVerification(data)

      return isAvailable
    } catch (error: any) {
      methods.setError('UniversityOtp', { message: error.response.data.message })
    }
  }

  const onSubmit = async (data: data) => {
    let currStep = step
    let currSubStep = subStep

    if (step === 2 && subStep === 0) {
      currSubStep += 1
    } else {
      currStep += 1
      currSubStep = 0
    }

    const saveToLocalStorage = () => {
      localStorage.setItem('registerData', JSON.stringify({ ...data, step: currStep, subStep: currSubStep }))
    }

    if (step === 0) {
      const isAvailable = await userCheck(data)
      if (isAvailable?.isAvailable) {
        handleNext()
        saveToLocalStorage()
      }
      return
    }

    if (step === 3) {
      const res = await HandleRegister(data)
      if (res?.isRegistered) {
        localStorage.setItem('registeredEmail', data?.email)
        localStorage.removeItem('registerData')

        router.push('/v2/login')
      }

      return
    }

    if (step === 2 && subStep === 0) {
      const isAvailable = await userLoginEmailVerification(data)
      if (isAvailable?.isAvailable) {
        handleNext()
        saveToLocalStorage()
      }
      return
    }

    if (step === 2 && subStep === 1) {
      const isAvailable = await userUniversityEmailVerification(data)
      if (isAvailable?.isAvailable) {
        handleNext()
        saveToLocalStorage()
      }
      return
    }

    handleNext()
    saveToLocalStorage()
  }

  const handleNext = () => {
    if (step === 2 && subStep === 0) {
      setSubStep(1)
    } else {
      const newStep = step + 1
      setStep(newStep)
      setSubStep(0)
    }
  }

  const handlePrev = () => {
    if (step === 3 && subStep === 1) {
      setSubStep(0)
    } else {
      setStep(step - 1)
      setSubStep(0)
    }
  }
  const renderStep = () => {
    if (step === 0 && subStep === 0) {
      return <AccountCreationForm />
    } else if (step === 1 && subStep === 0) {
      return <ProfileSetupForm />
    } else if (step === 2 && subStep === 0) {
      return <VerificationForm isVerificationSuccess={userLoginEmailVerificationSuccess} />
    } else if (step === 2 && subStep === 1) {
      return <UniversityVerificationForm setStep={setStep} setSubStep={setSubStep} isVerificationSuccess={userUniversityEmailVerificationSuccess} />
    } else if (step === 3) {
      return <ClaimBenefitForm />
    } else if (step === 4) {
      return <FinalLoginForm />
    }
  }

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col items-center justify-center w-2/3" onSubmit={methods.handleSubmit(onSubmit)}>
        {renderStep()}
      </form>
    </FormProvider>
  )
}

export default FormContainer
