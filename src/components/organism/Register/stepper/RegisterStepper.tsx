import React from 'react'
import indicator from '@/assets/Indicator.svg'
import Image from 'next/image'

import { motion } from 'framer-motion'

const stepVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: () => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0,
    },
  }),
}

const stepData = [
  { title: 'Account Creation', des: 'Login information' },
  { title: 'Profile Setup', des: 'User Information' },
  { title: 'User Verification', des: 'Sync university email' },
  { title: 'Completion', des: 'Review and finalize account' },
]

const CompletedStep = ({ title, des, idx }: any) => {
  return (
    <motion.li custom={idx} initial="hidden" animate="visible" variants={stepVariants} className="relative ms-2 flex gap-4">
      <div className="flex items-center justify-center w-8 h-8 bg-primary-500 rounded-full -start-4">
        <svg className="w-3.5 h-3.5 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5" />
        </svg>
      </div>
      <div className="flex flex-col ">
        <label className="font-semibold text-neutral-900 text-sm">{title}</label>
        <label className="text-xs text-neutral-500 ">{des}</label>
      </div>
      {idx !== 3 && <span className="absolute left-[14px] top-8 h-[118%] border-2 border-neutral-400"></span>}
    </motion.li>
  )
}

const UnCompleteStep = ({ title, des, idx }: any) => {
  return (
    <li className="relative ms-2 flex gap-4">
      <span className="flex items-center justify-center w-8 h-8 bg-neutral-50 rounded-full -start-4 ring-4 ring-neutral-400 text-neutral-500">
        0{idx + 1}
      </span>
      <div className="flex flex-col ">
        <label className="font-semibold text-neutral-900 text-sm">{title}</label>
        <label className="text-xs text-neutral-500 ">{des}</label>
      </div>
      {idx !== 3 && <span className="absolute left-[14px] top-9 h-[102%] border-2 border-neutral-400"></span>}
    </li>
  )
}
const CurrentStep = ({ title, des, idx }: any) => {
  return (
    <div className="relative ms-2 flex gap-2">
      <div className="flex items-center justify-center w-10 h-10  rounded-full ">
        <Image className="me-2 mb-2" src={indicator} alt="in" />
      </div>
      <div className="flex flex-col ">
        <label className="font-semibold text-neutral-900 text-sm">{title}</label>
        <label className="text-xs text-neutral-500 ">{des}</label>
      </div>
      {idx !== 3 && <span className="absolute left-[14px] top-8 h-[105%] border-2 border-neutral-400"></span>}
    </div>
  )
}

const Step = ({ data, idx, currentStep, subStep }: any) => {
  const isCurrentStep = idx === currentStep && subStep < 2

  return (
    <>
      {idx < currentStep ? (
        <CompletedStep title={data.title} des={data.des} idx={idx} />
      ) : isCurrentStep ? (
        <CurrentStep title={data.title} des={data.des} idx={idx} />
      ) : (
        <UnCompleteStep title={data.title} des={data.des} idx={idx} />
      )}
    </>
  )
}

interface props {
  step: number
  subStep: number
}
const RegisterStepper = ({ step, subStep }: props) => {
  return (
    <ol className="relative flex flex-col gap-10  text-gray-500   ">
      {stepData.map((item, key) => (
        <Step key={key} data={item} idx={key} currentStep={step} subStep={subStep} />
      ))}
    </ol>
  )
}

export default RegisterStepper
