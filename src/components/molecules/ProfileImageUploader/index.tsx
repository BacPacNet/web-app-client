import React, { useRef, useState } from 'react'
import { FiCamera } from 'react-icons/fi'
import ImageCropModal from './ImageCropModal'
import { ProfileImageUploaderProps } from './types'
import { validateSingleImageFile } from '@/lib/utils'
import { showCustomDangerToast } from '@/components/atoms/CustomToasts/CustomToasts'

const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  label = 'Group Profile',
  imageFile,
  onImageChange,
  id = 'profileImageUploader',
}) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isCropModalOpen, setIsCropModalOpen] = useState(false)
  const [tempImageSrc, setTempImageSrc] = useState<string>('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const { isValid, message } = validateSingleImageFile(file, 5 * 1024 * 1024)
      if (!isValid) {
        showCustomDangerToast(message)
        return
      }

      const imageUrl = URL.createObjectURL(file)
      setTempImageSrc(imageUrl)
      setIsCropModalOpen(true)
    }
  }

  const handleCropComplete = (croppedImage: File) => {
    onImageChange(croppedImage)
    setIsCropModalOpen(false)
    setTempImageSrc('')
  }

  const handleCropModalClose = () => {
    setIsCropModalOpen(false)
    setTempImageSrc('')
    // Reset the input value so the same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const getImageSrc = () => {
    if (!imageFile) return ''
    return typeof imageFile === 'object' ? URL.createObjectURL(imageFile) : imageFile
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="font-medium text-sm text-neutral-900">
          {label}
        </label>

        <label
          htmlFor={id}
          className="relative border-2 border-neutral-200 bg-white flex items-center justify-center w-[100px] h-[100px] rounded-full cursor-pointer overflow-hidden"
        >
          {imageFile && <img className="w-[100px] h-[100px] rounded-full absolute object-cover" src={getImageSrc()} alt="Uploaded Profile" />}

          <input
            ref={inputRef}
            style={{ display: 'none' }}
            accept="image/jpeg,image/png,image/jpg,image/gif"
            type="file"
            id={id}
            onChange={handleImageChange}
          />

          <div className="relative z-10 flex flex-col items-center">
            {imageFile ? (
              <>
                <div className="w-12 h-12 rounded-full bg-black opacity-50 absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                <FiCamera size={32} className="text-white" />
              </>
            ) : (
              <FiCamera size={32} className="text-slate-400" />
            )}
          </div>
        </label>
      </div>

      <ImageCropModal imageSrc={tempImageSrc} isOpen={isCropModalOpen} onClose={handleCropModalClose} onCropComplete={handleCropComplete} />
    </>
  )
}

export default ProfileImageUploader
