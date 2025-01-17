import React from 'react'
import unibuzzLogo from '@assets/unibuzz_logo.svg'
import Image from 'next/image'
import RegisterStepper from '../stepper/RegisterStepper'
import { IoIosArrowBack } from 'react-icons/io'
interface props {
  step: number
  subStep: number
  onPrev: () => void
}

const StepHeaders = [
  { header: 'Just a few steps', desc: "We're thrilled to have you on board. First create your account to join your university community!" },
  { header: 'A simple form', desc: 'You can add more to your profile later. We just require the essentials for now!' },
  { header: 'A simple form', desc: 'You can add more to your profile later. We just require the essentials for now!' },
  { header: 'Verify your account', desc: 'To keep our platform safe from bots and exclusive to university students, we require verification.' },
  { header: 'Almost there...', desc: 'Users who verify their university email get additional perks!' },
  {
    header: 'Referred by a friend?',
    desc: 'Enter your referral code and get 1 month free of our Upgrade Plan! Every user gets 1 referral code to share!',
  },
  { header: 'All done.', desc: 'You can now join communities, interact with students and faculty, receive consultation, and more!' },
]
const RegisterSIdebar = ({ step, subStep, onPrev }: props) => {
  const stepIndex = step == 3 ? step + 2 : step == 4 ? step + 2 : step == 2 ? step + subStep + 1 : step + subStep

  return (
    <div className="bg-neutral-100 w-1/3 flex flex-col items-center justify-center ">
      <div className="flex flex-col w-10/12 gap-8">
        <div>
          <Image src={unibuzzLogo} alt="BACPAC LOGO" width={119} height={27} className="h-full cursor-pointer" />
          {step !== 0 && (
            <div onClick={onPrev} className="  text-neutral-600  flex items-center rounded-full text-start cursor-pointer">
              <IoIosArrowBack />
              back
            </div>
          )}
        </div>
        <div>
          <h4 className="text-neutral-900 font-semibold text-[28px]">{StepHeaders[stepIndex].header}</h4>

          <p className="text-xs text-neutral-600">{StepHeaders[stepIndex].desc}</p>
        </div>
        <RegisterStepper step={step} subStep={subStep} />
      </div>
    </div>
  )
}

export default RegisterSIdebar
