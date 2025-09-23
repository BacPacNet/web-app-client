import { useUniStore } from '@/store/store'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { parse, isValid } from 'date-fns'

import { formatDistanceToNow, differenceInHours, differenceInDays, differenceInMinutes } from 'date-fns'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const useCheckSelfProfile = (userId: string) => {
  const { userData } = useUniStore()

  return userData?.id === userId
}

export function truncateString(input: string): string {
  const words = input.split(' ') // Split the string into words

  if (words.length <= 4) {
    return input // Return the original string if it has 4 words or less
  }

  // Truncate the fourth word to 4 characters followed by ...
  words[3] = words[3].slice(0, 4) + '...'

  // Join the first 4 words and return
  return words.slice(0, 4).join(' ')
}

export const timeAgo = (date: Date | string) => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatRelativeTime = (date: Date | string): string => {
  const givenDate = typeof date === 'string' ? new Date(date) : date

  const minutesDiff = differenceInMinutes(new Date(), givenDate)
  if (minutesDiff < 60) return `${minutesDiff}m`

  const hoursDiff = differenceInHours(new Date(), givenDate)
  if (hoursDiff < 24) return `${hoursDiff}h`

  const daysDiff = differenceInDays(new Date(), givenDate)
  return `${daysDiff}d`
}

export const truncateStringTo = (str: string, num: number): string => {
  if (str.length <= num) return str
  return str.slice(0, num) + '...'
}

export const cleanInnerHTML = (html: string): string => {
  const container = document.createElement('div')
  container.innerHTML = html

  // Remove trailing empty tags (like <h1><br></h1> or just <br>)
  while (
    container.lastElementChild &&
    (container.lastElementChild.innerHTML.trim() === '' || container.lastElementChild.innerHTML.trim() === '<br>')
  ) {
    container.removeChild(container.lastElementChild)
  }

  return container.innerHTML.trim()
}

export const convertToDateObj = (dateStr: string) => {
  const format = 'dd/MM/yyyy'
  const parsed = parse(dateStr, format, new Date())

  return isValid(parsed) ? parsed : null
}

export function convertToISOFormat(dateStr: string) {
  const [dd, mm, yyyy] = dateStr.split('/')
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
}

export const IsUniversityVerified = (): boolean => {
  const { userProfileData } = useUniStore()
  return userProfileData?.email?.some((university) => university.UniversityName === userProfileData.university_name) || false
}

export const validateImageFiles = (files: File[], maxFiles: number = 4, maxSize: number = 5 * 1024 * 1024): { isValid: boolean; message: string } => {
  // Check if the number of files exceeds the limit
  if (files.length > maxFiles) {
    return { isValid: false, message: `You can only upload a maximum of ${maxFiles} images.` }
  }

  // Check if any file exceeds the size limit
  const tooLargeFiles = files.filter((file) => file.size > maxSize)
  if (tooLargeFiles.length > 0) {
    return { isValid: false, message: 'Each image must be less than 5MB.' }
  }

  return { isValid: true, message: '' }
}

export const validateSingleImageFile = (
  file: File,
  maxSize: number = 5 * 1024 * 1024 // 5MB default
): { isValid: boolean; message: string } => {
  if (!file) {
    return { isValid: false, message: 'No file selected.' }
  }

  if (file.size > maxSize) {
    return { isValid: false, message: 'Image must be less than 5 MB.' }
  }

  return { isValid: true, message: '' }
}

export const validateUploadedFiles = (
  files: File[],
  options: {
    maxFiles?: number
    maxSize?: number
  } = {}
): { isValid: boolean; message: string } => {
  const {
    maxFiles = 4,
    maxSize = 5 * 1024 * 1024, // 5MB
  } = options

  // Supported formats
  const allowedTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ]

  if (files.length > maxFiles) {
    return { isValid: false, message: `Maximum ${maxFiles} files allowed` }
  }

  if (files.some((file) => file.size > maxSize)) {
    return { isValid: false, message: 'This file is too large. Maximum allowed size is 5 MB.' }
  }

  if (files.some((file) => !allowedTypes.includes(file.type))) {
    return { isValid: false, message: 'Invalid format' }
  }

  return { isValid: true, message: '' }
}

export const isEmpty = (obj: any) => {
  return Object.keys(obj).length === 0
}

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) {
    return `${bytes} Bytes`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  } else if (bytes < 1024 * 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  } else {
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`
  }
}

export const isPDF = (fileUrl?: string): boolean => {
  if (!fileUrl) return false
  return fileUrl.toLowerCase().endsWith('.pdf')
}

export const imageMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'image/jpg', 'image/gif']

export const getMimeTypeFromUrl = (url: string): string => {
  const extension = url.split('.').pop()?.toLowerCase()
  switch (extension) {
    case 'jpeg':
    case 'jpg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'heic':
      return 'image/heic'
    case 'heif':
      return 'image/heif'
    case 'gif':
      return 'image/gif'
    default:
      return 'other'
  }
}

export const generateFileId = (file: File) => `${file.name}-${file.size}-${file.lastModified}`
