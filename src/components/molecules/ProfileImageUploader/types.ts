export interface ProfileImageUploaderProps {
  label?: string
  imageFile: File | string | null
  onImageChange: (file: File) => void
  id?: string
}

export interface ImageCropModalProps {
  imageSrc: string
  isOpen: boolean
  onClose: () => void
  onCropComplete: (croppedImage: File) => void
}
