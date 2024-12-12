import { useUniStore } from '@/store/store'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
