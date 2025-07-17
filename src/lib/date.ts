import { format, parse, isValid } from 'date-fns'

export const parseDateOfBirth = (dob: string | undefined): string => {
  if (!dob) return ''

  try {
    // First, try to parse as timestamp (from registration)
    const timestamp = parseInt(dob)
    if (!isNaN(timestamp)) {
      const date = new Date(timestamp)
      if (isValid(date)) {
        return format(date, 'dd/MM/yyyy')
      }
    }

    // If not a timestamp, try to parse as dd/MM/yyyy format
    if (dob.includes('/')) {
      const parsed = parse(dob, 'dd/MM/yyyy', new Date())
      if (isValid(parsed)) {
        return format(parsed, 'dd/MM/yyyy')
      }
    }

    // If all else fails, try to create a new Date (for ISO strings)
    const date = new Date(dob)
    if (isValid(date)) {
      return format(date, 'dd/MM/yyyy')
    }

    // If nothing works, return empty string
    return ''
  } catch (error) {
    console.warn('Failed to parse date of birth:', dob, error)
    return ''
  }
}
