'use client'
import Card from '@/components/atoms/Card'
import Image from 'next/image'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  description: string
  steps?: string
  email?: string
  screenshot?: FileList
}

export default function ReportBug() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onSubmit = (data: FormData) => {
    //if (data.screenshot && data.screenshot.length > 0) {
    //}
    // Handle submission logic here
    reset()
    setPreviewUrl(null)
  }

  // Watch the file input to generate preview
  const screenshot = watch('screenshot')

  React.useEffect(() => {
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
      <div className="bg-white shadow-card rounded-lg max-w-lg w-full p-8">
        <h1 className="text-2xl font-semibold mb-2">Report a Bug</h1>
        <p className="text-gray-600 mb-6">Help us improve by reporting any bugs you encounter.</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-1">Description of the Bug *</label>
            <textarea
              {...register('description', { required: 'Description is required', maxLength: 500 })}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Describe the bug you encountered..."
              rows={4}
            />
            <div className="text-right text-gray-500 text-sm">{watch('description')?.length || 0}/500</div>
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
          </div>

          {/* Steps */}
          <div>
            <label className="block text-gray-700 mb-1">Steps to Reproduce (optional)</label>
            <textarea
              {...register('steps')}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g. 1. Click this button, 2. Enter this text..."
              rows={3}
            />
          </div>

          {/* Screenshot */}
          <div>
            <label className="block text-gray-700 mb-1">Attach a Screenshot (optional)</label>
            <input
              {...register('screenshot')}
              type="file"
              accept="image/jpeg,image/png,image/jpg,image/gif"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {previewUrl && (
              <div className="mt-2">
                <Image height={48} width={48} src={previewUrl} alt="Screenshot Preview" className="max-h-48 rounded-md border" />
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 mb-1">Your Email (optional)</label>
            <input
              {...register('email', {
                pattern: {
                  value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: 'Invalid email format',
                },
              })}
              type="email"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <p className="text-xs text-gray-500">
            By submitting this form, you agree to allow UniBuzz to contact you regarding this bug report. Please refer to our Privacy Policy for
            details.
          </p>

          <button type="submit" className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 transition-colors">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  )
}
