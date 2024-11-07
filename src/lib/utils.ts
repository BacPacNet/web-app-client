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
