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
import ProfileStudentForm from '../forms/ProfileStudentForm'
import ProfileFacultyForm from '../forms/ProfileFacultyForm'
import { FormDataType, userCheckError, userTypeEnum } from '@/types/RegisterForm'

interface Props {
  step: number
  setStep: (value: number) => void
  subStep: number
  setSubStep: (value: number) => void
  setUserType: (value: string) => void
  handlePrev: () => void
}

const FormContainer = ({ step, setStep, setSubStep, subStep, setUserType, handlePrev }: Props) => {
  const [registerData, setRegisterData] = useState<FormDataType | any>(null)
  const { mutateAsync: handleUserCheck, isPending: handleUserCheckIsPending } = useHandleUserEmailAndUserNameAvailability()
  const {
    mutateAsync: handleUserLoginEmailVerification,
    isSuccess: userLoginEmailVerificationSuccess,
    isPending: userLoginEmailVerificationIsPending,
  } = useHandleLoginEmailVerification()
  const {
    mutateAsync: handleUserUniversityEmailVerification,
    isSuccess: userUniversityEmailVerificationSuccess,
    isPending: UniversityEmailVerificationIsPending,
  } = useHandleUniversityEmailVerification()

  const { mutateAsync: HandleRegister, isPending: registerIsPending } = useHandleRegister_v2()
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

  const methods = useForm<FormDataType>({
    defaultValues: {
      email: '',
      userName: '',
      password: '',
      confirmpassword: '',
      birthDate: '',
      gender: '',
      userType: '',
      country: '',
      firstName: '',
      lastName: '',
      year: '',
      degree: '',
      major: '',
      verificationEmail: '',
      verificationOtp: '',
      universityName: '',
      department: '',
      occupation: '',
      universityId: '',
      UniversityOtp: '',
      UniversityOtpOK: '',
      referralCode: '',
    },
  })
  const currUserType = methods.watch('userType')
  useEffect(() => {
    if (registerData) {
      methods.reset({
        email: registerData?.email || '',
        userName: registerData?.userName || '',
        password: registerData?.password || '',
        confirmpassword: registerData?.confirmpassword || '',
        birthDate: registerData?.birthDate || '',
        gender: registerData?.gender || '',

        userType: registerData?.userType || '',
        country: registerData?.country || '',
        firstName: registerData?.firstName || '',
        lastName: registerData?.lastName || '',
        year: registerData?.year || '',
        degree: registerData?.degree || '',
        major: registerData?.major || '',
        occupation: registerData?.occupation || '',
        department: registerData?.department || '',
        verificationEmail: registerData?.verificationEmail || '',
        universityId: registerData?.universityId || '',
        verificationOtp: registerData?.verificationOtp || '',
        universityName: registerData?.universityName || '',
        UniversityOtp: registerData?.UniversityOtp || '',
        referralCode: registerData?.referralCode || '',
      })
    }
  }, [registerData, methods])

  useEffect(() => {
    setUserType(currUserType)
  }, [currUserType])

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
      }
    }
  }

  const userLoginEmailVerification = async (data: { email: string; verificationOtp: string }) => {
    try {
      const dataToSend = {
        email: data.email,
        verificationOtp: data.verificationOtp,
      }
      const isAvailable = await handleUserLoginEmailVerification(dataToSend)
      return isAvailable
    } catch (error: any) {
      methods.setError('verificationOtp', { message: error.response.data.message })
      methods.setValue('verificationOtp', '')
    }
  }

  const userUniversityEmailVerification = async (data: { universityEmail: string; UniversityOtp: string }) => {
    try {
      const dataToSend = {
        universityEmail: data.universityEmail,
        UniversityOtp: data.UniversityOtp,
      }
      const isAvailable = await handleUserUniversityEmailVerification(dataToSend)

      return isAvailable
    } catch (error: any) {
      methods.setError('UniversityOtp', { message: error.response.data.message })
      methods.setValue('UniversityOtp', '')
    }
  }

  const onSubmit = async (data: FormDataType) => {
    let currStep = step
    let currSubStep = subStep

    if (step === 1 && subStep === 0 && methods.getValues('userType') !== userTypeEnum.Applicant) {
      currSubStep += 1
    } else if (step == 1 && subStep == 0 && methods.getValues('userType') == userTypeEnum.Applicant) {
      currStep = 2
    } else if (step === 2 && subStep === 0 && methods.getValues('userType') !== userTypeEnum.Applicant) {
      currSubStep += 1
    } else if (step === 2 && subStep === 0 && methods.getValues('userType') == userTypeEnum.Applicant) {
      currStep = 3
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
        handleNext()
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
    if (step === 1 && subStep === 0) {
      handleNext()
      saveToLocalStorage()

      return
    }

    handleNext()
    saveToLocalStorage()
  }

  const handleNext = () => {
    if (step === 1 && subStep === 0 && methods.getValues('userType') == userTypeEnum.Applicant) {
      const newStep = step + 1
      setStep(newStep)
      return setSubStep(0)
    } else if (step === 1 && subStep === 0 && methods.getValues('userType') !== userTypeEnum.Applicant) {
      return setSubStep(1)
    } else if (step === 1 && subStep === 1) {
      const newStep = step + 1
      setStep(newStep)
      return setSubStep(0)
    } else if (step === 2 && subStep === 0 && methods.getValues('userType') !== userTypeEnum.Applicant) {
      return setSubStep(1)
    } else {
      const newStep = step + 1
      setStep(newStep)
      setSubStep(0)
    }
  }

  const renderStep = () => {
    if (step === 0 && subStep === 0) {
      return <AccountCreationForm isPending={handleUserCheckIsPending} />
    } else if (step === 1 && subStep === 0) {
      return <ProfileSetupForm handlePrev={() => handlePrev()} />
    } else if (step === 1 && subStep === 1 && methods.getValues('userType') == userTypeEnum.Student) {
      return <ProfileStudentForm handlePrev={() => handlePrev()} />
    } else if (step === 1 && subStep === 1 && methods.getValues('userType') == userTypeEnum.Faculty) {
      return <ProfileFacultyForm handlePrev={() => handlePrev()} />
    } else if (step === 2 && subStep === 0) {
      return (
        <VerificationForm
          handlePrev={() => handlePrev()}
          isVerificationSuccess={userLoginEmailVerificationSuccess}
          isPending={userLoginEmailVerificationIsPending}
        />
      )
    } else if (step === 2 && subStep === 1) {
      return (
        <UniversityVerificationForm
          setStep={setStep}
          setSubStep={setSubStep}
          isVerificationSuccess={userUniversityEmailVerificationSuccess}
          isPending={UniversityEmailVerificationIsPending}
        />
      )
    }
    //else if (step === 3) {
    //  return <ClaimBenefitForm isPending={registerIsPending} />
    //}
    else if (step === 3) {
      return <FinalLoginForm email={registerData?.email || ''} />
    }
  }

  return (
    <FormProvider {...methods}>
      <form className="flex flex-col items-center justify-center w-2/3 max-lg:w-full" onSubmit={methods.handleSubmit(onSubmit)}>
        {renderStep()}
      </form>
    </FormProvider>
  )
}

export default FormContainer
