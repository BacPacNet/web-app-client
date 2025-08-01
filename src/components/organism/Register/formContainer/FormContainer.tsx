'use client'
import React, { useEffect, useState } from 'react'
import AccountCreationForm from '../forms/AccountCreationForm'
import ProfileSetupForm from '../forms/ProfileSetupForm'
import { FormProvider, useForm } from 'react-hook-form'
import VerificationForm from '../forms/VerificationForm'
import UniversityVerificationForm from '../forms/UniversityVerificationForm'
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
import useCookie from '@/hooks/useCookie'
import { convertToDateObj } from '@/lib/utils'

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
  const [cookieValue, setCookieValue, deleteCookie] = useCookie('register_data')
  const [cookieLoginValue, setCookieLoginValue] = useCookie('login_data')
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
      universityLogo: '',
      department: '',
      occupation: '',
      universityId: '',
      UniversityOtp: '',
      UniversityOtpOK: '',
      referralCode: '',
      isJoinUniversity: true,
      isUniversityVerified: false,
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
        universityLogo: registerData?.universityLogo || '',
        UniversityOtp: registerData?.UniversityOtp || '',
        referralCode: registerData?.referralCode || '',
        isJoinUniversity: registerData?.isJoinUniversity,
        isUniversityVerified: registerData?.isUniversityVerified,
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
    } else if (step === 3 && subStep === 0 && methods.getValues('userType') !== userTypeEnum.Applicant) {
      currSubStep = 1
    } else {
      currStep += 1
      currSubStep = 0
    }

    const saveToLocalStorage = () => {
      const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toUTCString()
      setCookieValue(JSON.stringify({ ...data, step: currStep, subStep: currSubStep }), expirationDate)
    }

    if (step === 0) {
      const isAvailable = await userCheck(data)
      if (isAvailable?.isAvailable) {
        handleNext()
        saveToLocalStorage()
      }
      return
    }

    if (step === 3 && methods.getValues('userType') == userTypeEnum.Applicant) {
      const isAvailable = await userLoginEmailVerification(data)

      if (isAvailable?.isAvailable) {
        // Keep birthDate in dd/MM/yyyy format instead of converting to timestamp
        // const dob = convertToDateObj(data.birthDate)?.getTime().toString()
        // data.birthDate = dob || ''

        const res = await HandleRegister(data)
        if (res?.isRegistered) {
          const expirationDateForLoginData = new Date(Date.now() + 1 * 60 * 1000).toUTCString()
          setCookieLoginValue(JSON.stringify({ email: data?.email, password: data.password }), expirationDateForLoginData)
          deleteCookie()

          setStep(4)
          setSubStep(0)
        }
      }

      return
    }
    if (step === 3 && subStep === 0 && methods.getValues('userType') !== userTypeEnum.Applicant) {
      const isAvailable = await userLoginEmailVerification(data)

      if (isAvailable?.isAvailable) {
        handleNext()
        saveToLocalStorage()
      }

      return
    }
    if (step === 3 && subStep === 1) {
      const isAvailable = await userUniversityEmailVerification(data)
      if (isAvailable?.isAvailable) {
        data.isUniversityVerified = true
        // Keep birthDate in dd/MM/yyyy format instead of converting to timestamp
        // const dob = convertToDateObj(data.birthDate)?.getTime().toString()
        // data.birthDate = dob || ''
        const res = await HandleRegister(data)
        if (res?.isRegistered) {
          const expirationDateForLoginData = new Date(Date.now() + 1 * 60 * 1000).toUTCString()
          setCookieLoginValue(JSON.stringify({ email: data?.email, password: data.password }), expirationDateForLoginData)
          deleteCookie()
          setStep(4)
          setSubStep(0)
        }
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
      const newStep = step + 2
      setStep(newStep)
      return setSubStep(0)
    } else if (step === 1 && subStep === 0 && methods.getValues('userType') !== userTypeEnum.Applicant) {
      return setSubStep(1)
    } else if (step === 1 && subStep === 1) {
      const newStep = step + 2
      setStep(newStep)
      return setSubStep(0)
    } else if (step === 2 && subStep === 0 && methods.getValues('userType') !== userTypeEnum.Applicant) {
      return setSubStep(1)
    } else if (step === 3 && subStep === 0 && methods.getValues('userType') !== userTypeEnum.Applicant) {
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
    else if (step === 3 && subStep === 0) {
      //   return <FinalLoginForm email={registerData?.email || ''} />
      return (
        <VerificationForm
          handlePrev={() => handlePrev()}
          isVerificationSuccess={userLoginEmailVerificationSuccess}
          isPending={userLoginEmailVerificationIsPending}
        />
      )
    } else if (step === 3 && subStep === 1) {
      //   return <FinalLoginForm email={registerData?.email || ''} />
      return (
        <UniversityVerificationForm
          setStep={setStep}
          setSubStep={setSubStep}
          isVerificationSuccess={userUniversityEmailVerificationSuccess}
          isPending={UniversityEmailVerificationIsPending}
        />
      )
    } else if (step === 4) {
      //   return <FinalLoginForm email={registerData?.email || ''} />
      return <div>44</div>
    }
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
