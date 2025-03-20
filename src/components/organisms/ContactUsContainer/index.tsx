'use client'

import Buttons from '@/components/atoms/Buttons'
import { useForm } from 'react-hook-form'

import InputWarningText from '@/components/atoms/InputWarningText'
import InputBox from '@/components/atoms/Input/InputBox'

interface FormValues {
  firstName: string
  lastName: string
  university?: string
  message: string
}

export function ContactForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors: registerFormErrors },
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      university: '',
      message: '',
    },
  })

  const message = watch('message') || ''
  const messageLength = message.length

  const onSubmit = (data: FormValues) => {
    console.log(data)
    // Handle form submission here
  }

  return (
    <div className="w-full px-4">
      <div className="text-center mb-8 md:mb-12 lg:mb-16">
        <h2 className="text-lg-small sm:text-4xl font-poppins font-extrabold text-neutral-700 mb-2">Send us a message</h2>
        <p className="text-neutral-700 text-sm ">Contact us regarding any concerns or inquiries.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-[22px]">
          <div className="w-full flex flex-col">
            <InputBox
              type="text"
              label="First Name"
              placeholder="e.g. John"
              {...register('firstName', { required: 'First name is required' })}
              err={!!registerFormErrors.firstName}
            />
            {registerFormErrors.firstName && <InputWarningText>{registerFormErrors.firstName.message}</InputWarningText>}
          </div>

          <div className="w-full flex flex-col">
            <InputBox
              type="text"
              label="Last Name"
              placeholder="e.g. Doe"
              {...register('lastName', { required: 'Last name is required' })}
              err={!!registerFormErrors.lastName}
            />
            {registerFormErrors.lastName && <InputWarningText>{registerFormErrors.lastName.message}</InputWarningText>}
          </div>
        </div>

        <div className="w-full flex flex-col">
          <InputBox
            type="text"
            label="University"
            placeholder="e.g. Harvard University (if any)"
            {...register('university')}
            err={!!registerFormErrors.university}
          />
          {registerFormErrors.university && <InputWarningText>{registerFormErrors.university.message}</InputWarningText>}
        </div>

        <div className="w-full flex flex-col relative">
          <label className="text-[#3a3b3c] mb-2">Additional Message</label>
          <textarea
            className={` border-neutral-200 min-h-[160px] resize-non
           w-full pt-2 pb-4 px-3 border  rounded-lg drop-shadow-sm text-neutral-900 placeholder:text-neutral-400  outline-none p-3`}
            placeholder="Type a message here..."
            maxLength={240}
            {...register('message', {
              maxLength: {
                value: 240,
                message: 'Message cannot exceed 240 characters',
              },
            })}
          />
          <span className="absolute bottom-0 right-3 text-sm text-neutral-500">{messageLength}/240</span>
          {registerFormErrors.message && <InputWarningText>{registerFormErrors.message.message}</InputWarningText>}
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <Buttons variant="primary" type="submit" className="  min-w-[120px]">
            Send Form
          </Buttons>
          <p className="text-2xs text-neutral-500 ">
            By pressing the submit button, I agree to Unibuzz contacting me by email and/or phone to share opportunities exclusively available to
            Select or Enterprise customers. I also understand that any information Ive shared in this form is subject to Unibuzz Privacy Policy.
          </p>
        </div>
      </form>
    </div>
  )
}
