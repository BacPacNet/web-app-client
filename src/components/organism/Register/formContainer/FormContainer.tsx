'use client'
import React, { useEffect, useState } from 'react'
import AccountCreationForm from '../forms/AccountCreationForm'
import ProfileSetupForm from '../forms/ProfileSetupForm'
import { FormProvider, useForm } from 'react-hook-form'
import VerificationForm from '../forms/VerificationForm'
import SelectUniversitiesForm from '../forms/SelectUniversitiesForm'
import { useHandleLoginEmailVerification, useHandleRegister_v2, useHandleUserEmailAndUserNameAvailability } from '@/services/auth'
import { useSearchParams } from 'next/navigation'
import { FormDataType, userCheckError, userTypeEnum } from '@/types/RegisterForm'
import useCookie from '@/hooks/useCookie'
import { TRACK_EVENT } from '@/content/constant'
import { useTimeTracking } from '@/hooks/useTimeTracking'

interface Props {
  step: number
  setStep: (value: number) => void
  handlePrev: () => void
}

const FormContainer = ({ step, setStep, handlePrev }: Props) => {
  const [registerData, setRegisterData] = useState<FormDataType | any>(null)
  const [cookieValue, setCookieValue, deleteCookie] = useCookie('register_data')
  const [cookieLoginValue, setCookieLoginValue] = useCookie('login_data')
  const { mutateAsync: handleUserCheck, isPending: handleUserCheckIsPending } = useHandleUserEmailAndUserNameAvailability()
  const {
    mutateAsync: handleUserLoginEmailVerification,
    isSuccess: userLoginEmailVerificationSuccess,
    isPending: userLoginEmailVerificationIsPending,
  } = useHandleLoginEmailVerification()
  const { mutateAsync: HandleRegister, isPending: registerIsPending, data: registeredData } = useHandleRegister_v2()

  const searchParams = useSearchParams()
  const referralCode = searchParams?.get('referralCode')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedData = cookieValue
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
  }, [cookieValue])

  const methods = useForm<FormDataType>({
    defaultValues: {
      email: '',
      userName: '',
      password: '',
      confirmpassword: '',
      birthDate: '',
      gender: '',
      userType: userTypeEnum.Applicant,

      firstName: '',
      lastName: '',
      verificationEmail: '',
      verificationOtp: '',
      universityName: '',
      universityLogo: '',
      universityDomain: [],
      universityId: '',
      UniversityOtp: '',
      UniversityOtpOK: '',
      referralCode: referralCode || '',
      isJoinUniversity: true,
      isEmailVerified: false,
      selectedUniversityIds: [],
    },
  })
  const currEmail = methods.watch('email')

  useEffect(() => {
    if (registerData) {
      methods.reset({
        email: registerData?.email || '',
        userName: registerData?.userName || '',
        password: registerData?.password || '',
        confirmpassword: registerData?.confirmpassword || '',
        birthDate: registerData?.birthDate || '',
        gender: registerData?.gender || '',
        userType: userTypeEnum.Applicant,
        firstName: registerData?.firstName || '',
        lastName: registerData?.lastName || '',
        verificationEmail: registerData?.verificationEmail || '',
        universityId: registerData?.universityId || '',
        verificationOtp: registerData?.verificationOtp || '',
        universityName: registerData?.universityName || '',
        universityLogo: registerData?.universityLogo || '',
        universityDomain: registerData?.universityDomain || [],
        UniversityOtp: registerData?.UniversityOtp || '',
        referralCode: referralCode || registerData?.referralCode || '',
        isJoinUniversity: registerData?.isJoinUniversity || true,
        isEmailVerified: registerData?.isEmailVerified,
        selectedUniversityIds: registerData?.selectedUniversityIds || [],
      })
    }
  }, [registerData, methods, referralCode])

  useTimeTracking(TRACK_EVENT.REGISTER_PAGE_VIEW_DURATION, {
    isRegistrationCompleted: registeredData?.isRegistered || false,
    email: currEmail || '',
    referralCode: referralCode || '',
  })

  const userCheck = async (data: { email: string; userName: string }) => {
    try {
      const dataToSend = {
        email: data.email,
        userName: data.userName,
      }
      const isAvailable = await handleUserCheck(dataToSend)
      return isAvailable
    } catch (error: any) {
      if (error.response.data.message == userCheckError.emailNotAvailable) {
        methods.setError('email', { message: error.response.data.message })
      } else if (error.response.data.message == userCheckError.userNameNotAvailable) {
        methods.setError('userName', { message: error.response.data.message })
      } else {
        methods.setError('email', { message: error.response.data.message })
      }
    }
  }

  const userLoginEmailVerification = async (data: {
    email: string
    verificationOtp: string
    firstName: string
    lastName: string
    birthDate: string
  }) => {
    try {
      const dataToSend = {
        email: data.email,
        verificationOtp: data.verificationOtp,
        universityId: registerData?.universityId,
        name: data?.firstName,
        dob: data?.birthDate,
      }
      const isAvailable = await handleUserLoginEmailVerification(dataToSend)

      if (isAvailable?.isAvailable) {
        methods.setValue('isEmailVerified', true)
      }
      return isAvailable
    } catch (error: any) {
      methods.setError('verificationOtp', { message: error.response.data.message })
      methods.setValue('verificationOtp', '')
    }
  }

  const onSubmit = async (data: FormDataType) => {
    const saveToCookie = (nextStep: number) => {
      const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toUTCString()
      setCookieValue(JSON.stringify({ ...data, step: nextStep, userType: userTypeEnum.Applicant, referralCode: data.referralCode }), expirationDate)
    }

    if (step === 0) {
      if (!data.selectedUniversityIds?.length) {
        methods.setError('selectedUniversityIds', { message: 'Please select at least one university.' })
        return
      }
      handleNext()
      saveToCookie(1)
      return
    }

    if (step === 1) {
      const isAvailable = await userCheck(data)
      if (isAvailable?.isAvailable) {
        handleNext()
        saveToCookie(2)
      }
      return
    }

    if (step === 2) {
      handleNext()
      saveToCookie(3)
      return
    }

    if (step === 3) {
      const isAvailable = await userLoginEmailVerification(data)
      if (!isAvailable?.isAvailable) return

      const isEmailVerified = methods.getValues('isEmailVerified')
      const res = await HandleRegister({ ...data, isEmailVerified, userType: userTypeEnum.Applicant } as FormDataType)
      if (res?.isRegistered) {
        const expirationDateForLoginData = new Date(Date.now() + 1 * 60 * 1000).toUTCString()
        setCookieLoginValue(
          JSON.stringify({ email: data.email, password: data.password, referralCode: data.referralCode }),
          expirationDateForLoginData
        )
        deleteCookie()
        setStep(4)
      }
      return
    }
  }

  const handleNext = () => {
    setStep(step + 1)
  }

  const renderStep = () => {
    if (step === 0) {
      return <SelectUniversitiesForm />
    }

    if (step === 1) {
      return <AccountCreationForm isPending={handleUserCheckIsPending} handlePrev={handlePrev} />
    }

    if (step === 2) {
      return <ProfileSetupForm handlePrev={() => handlePrev()} />
    }

    if (step === 3) {
      return (
        <VerificationForm
          handlePrev={() => handlePrev()}
          isVerificationSuccess={userLoginEmailVerificationSuccess}
          isPending={userLoginEmailVerificationIsPending || registerIsPending}
        />
      )
    }

    return null
  }

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col items-center justify-center w-full" onSubmit={methods.handleSubmit(onSubmit)}>
        {renderStep()}
      </form>
    </FormProvider>
  )
}

export default FormContainer
