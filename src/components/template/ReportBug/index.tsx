'use client'
import Buttons from '@/components/atoms/Buttons'
import SubText from '@/components/atoms/SubText'
import { useCreateReportBug } from '@/services/report-bug'
import { CreateBugReport } from '@/types/ReportBug'
import Image from 'next/image'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function ReportBug() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateBugReport>()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const { mutateAsync: mutateReportBug, isPending } = useCreateReportBug()

  const onSubmit = (data: CreateBugReport) => {
    const formData = new FormData()
    formData.append('description', data.description)
    if (data.steps) formData.append('steps', data.steps)
    if (data.email) formData.append('email', data.email)
    if (data.screenshot?.[0]) formData.append('screenshot', data.screenshot[0])

    mutateReportBug(formData)
    reset()
    setPreviewUrl(null)
  }

  // Watch the file input to generate preview
  const screenshot = watch('screenshot')

  React.useEffect(() => {
    console.log(screenshot, 'screenshot')
    if (screenshot && screenshot.length > 0) {
      const file = screenshot[0]
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)

      // Cleanup the object URL when component unmounts or file changes
      return () => URL.revokeObjectURL(url)
    }
  }, [screenshot])

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 bg-neutral-100">
      <div className="bg-white shadow-card rounded-lg max-w-lg w-full p-6">
        <p className="text-lg-small sm:md-big font-poppins font-extrabold text-neutral-700">Report a Bug</p>
        <p className="text-neutral-600 mb-6">Help us improve by reporting any bugs you encounter.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-neutral-700 mb-1">Description of the Bug *</label>
            <textarea
              {...register('description', { required: 'Description is required', maxLength: 500 })}
              className="w-full border border-neutral-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the bug you encountered..."
              rows={4}
            />
            <div className="text-right text-neutral-500 text-sm">{watch('description')?.length || 0}/500</div>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Steps */}
          <div>
            <label className="block text-neutral-700 mb-1">Steps to Reproduce (optional)</label>
            <textarea
              {...register('steps')}
              className="w-full border border-neutral-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 1. Click this button, 2. Enter this text..."
              rows={3}
            />
          </div>

          {/* Screenshot */}
          <div>
            <label className="block text-neutral-700 mb-1">Attach a Screenshot (optional)</label>
            <input
              {...register('screenshot')}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif"
              className="w-full border border-neutral-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {previewUrl && (
              <div className="mt-2">
                <Image height={48} width={48} src={previewUrl} alt="Screenshot Preview" className="max-h-48 rounded-md border" />
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-neutral-700 mb-1">Your Email (optional)</label>
            <input
              {...register('email', {
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: 'Invalid email format',
                },
              })}
              type="email"
              className="w-full border border-neutral-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <SubText>
            By submitting this form, you agree to allow UniBuzz to contact you regarding this bug report. Please refer to our Privacy Policy for
            details.
          </SubText>

          <Buttons variant="primary" size="large" className="w-full" type="submit" disabled={isPending}>
            Submit Report
          </Buttons>
        </form>
      </div>
    </div>
  )
}
