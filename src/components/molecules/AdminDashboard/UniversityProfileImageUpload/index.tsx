'use client'

import universityLogoPlaceholder from '@assets/Logo Circle.svg'
import universityPlaceholder from '@assets/universityBackgroudImage.svg'
import { validateSingleImageFile } from '@/lib/utils'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'
import Image from 'next/image'
import { useRef } from 'react'
import { FiUpload } from 'react-icons/fi'

type Props = {
  label: string
  helperText: string
  imageUrl?: string
  variant: 'hero' | 'logo'
  inputId: string
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export default function UniversityProfileImageUpload({ label, helperText, imageUrl, variant, inputId, onFileSelect, disabled = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { isValid, message } = validateSingleImageFile(file)
    if (!isValid) {
      showCustomDangerToast(message)
      return
    }

    onFileSelect(file)

    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const fallbackSrc = variant === 'hero' ? universityPlaceholder : universityLogoPlaceholder
  const hasImage = Boolean(imageUrl)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-2xs font-semibold text-neutral-900">
          {label}
        </label>
        <p className="text-2xs text-neutral-500">{helperText}</p>
      </div>

      <label
        htmlFor={inputId}
        className={`relative block cursor-pointer overflow-hidden ${
          variant === 'hero' ? 'h-[200px] w-full rounded-xl' : 'h-[120px] w-[120px] rounded-full'
        } ${disabled ? 'pointer-events-none opacity-70' : ''}`}
      >
        <Image src={imageUrl || fallbackSrc} alt={label} fill className={variant === 'hero' ? 'object-cover object-center' : 'object-cover'} />

        <div className={`absolute inset-0 flex items-center justify-center bg-black/40 ${variant === 'logo' ? 'rounded-full' : ''}`}>
          <span className="flex items-center gap-2 rounded-lg border border-white px-4 py-2 text-sm font-medium text-white">
            <FiUpload size={16} />
            {hasImage ? 'Current image' : 'Upload image'}
          </span>
        </div>
      </label>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/jpeg,image/png,image/jpg,image/gif"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  )
}
