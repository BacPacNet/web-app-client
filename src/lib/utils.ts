import { useUniStore } from '@/store/store'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
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
  if (minutesDiff < 60) return `${minutesDiff}m ago`

  const hoursDiff = differenceInHours(new Date(), givenDate)
  if (hoursDiff < 24) return `${hoursDiff}h ago`

  const daysDiff = differenceInDays(new Date(), givenDate)
  return `${daysDiff}d ago`
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
