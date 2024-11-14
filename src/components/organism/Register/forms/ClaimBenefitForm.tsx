import InputBox from '@/components/atoms/Input/InputBox'
import InputWarningText from '@/components/atoms/InputWarningText'
import Button from '@/components/atoms/Buttons'
import SupportingText from '@/components/atoms/SupportingText'
import Title from '@/components/atoms/Title'
import { badgeData } from '@/types/RegisterForm'
import React from 'react'
import { useFormContext } from 'react-hook-form'

const ClaimBenefitForm = () => {
  const {
    register,
    formState: { errors: VerificationFormErrors },
  } = useFormContext()
  return (
    <div className="w-1/2 flex flex-col gap-8 items-center ">
      <div className="text-center px-3">
        <Title>Claim your benefit</Title>
        <SupportingText>Enter your referral code for these perks:</SupportingText>
      </div>
      <div className="flex gap-4  flex-wrap w-10/12 xl:w-10/12 ">
        {badgeData?.map((item) => (
          <p key={item.name} className="rounded-[32px] px-3 py-2 w-max text-xs" style={{ backgroundColor: item.bg, color: item.color }}>
            {item.name}
          </p>
        ))}
      </div>
      <div className="w-10/12 xl:w-10/12 flex flex-col gap-2 ">
        <div className="relative w-full flex flex-col gap-2">
          <label htmlFor=" Referral Code" className="font-medium text-neutral-900">
            Referral Code
          </label>

          <InputBox
            placeholder="ASI132943"
            type="referralCode"
            {...register('referralCode', {
              // required: true,
            })}
            err={!!VerificationFormErrors.referralCode}
          />
          {VerificationFormErrors.referralCode && (
            <InputWarningText>
              {VerificationFormErrors.referralCode.message
                ? VerificationFormErrors.referralCode.message.toString()
                : 'Please enter your referral code!'}
            </InputWarningText>
          )}
          <Button variant="border_primary">Confirm Code</Button>
          <p className="text-xs text-neutral-500 text-center">Plan will immediately apply to account after confirmation.</p>
          {/* <p className="text-xs text-green-500 text-center">Congratulations! You received 1 month of our Upgrade Plan!</p> */}
        </div>
      </div>
      <div className="w-10/12 xl:w-9/12 flex flex-col gap-2">
        <Button variant="primary">Complete Sign Up</Button>
      </div>
    </div>
  )
}

export default ClaimBenefitForm
