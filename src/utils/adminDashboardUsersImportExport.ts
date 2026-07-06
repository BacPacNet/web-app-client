import { Users } from '@/types/Connections'
import { userTypeEnum } from '@/types/RegisterForm'
import * as XLSX from 'xlsx'

export const STUDENT_TEMPLATE_HEADERS = ['Email', 'First Name', 'Last Name', 'Birthday', 'Major', 'Year', 'Roll Number', 'Password'] as const

export const FACULTY_TEMPLATE_HEADERS = [
  'Email',
  'First Name',
  'Last Name',
  'Birthday',
  'Occupation',
  'Affiliation',
  'Unique ID',
  'Password',
] as const

export const APPLICANT_TEMPLATE_HEADERS = ['Email', 'First Name', 'Last Name', 'Birthday', 'Password'] as const

const STUDENT_EXPORT_ONLY_HEADERS = ['User ID', 'Role'] as const
const FACULTY_EXPORT_ONLY_HEADERS = ['User ID', 'Role'] as const
const APPLICANT_EXPORT_ONLY_HEADERS = ['User ID', 'Role'] as const

const STUDENT_EXPORT_HEADERS = [...STUDENT_TEMPLATE_HEADERS, ...STUDENT_EXPORT_ONLY_HEADERS] as const
const FACULTY_EXPORT_HEADERS = [...FACULTY_TEMPLATE_HEADERS, ...FACULTY_EXPORT_ONLY_HEADERS] as const
const APPLICANT_EXPORT_HEADERS = [...APPLICANT_TEMPLATE_HEADERS, ...APPLICANT_EXPORT_ONLY_HEADERS] as const

type UserSheetType = 'student' | 'faculty' | 'applicant'

const getUserSheetType = (user: Users): UserSheetType => {
  const role = user.profile?.role?.toLowerCase()
  const uniqueId = (user.uniqueId || '').trim().toUpperCase()

  if (role === userTypeEnum.Applicant) return 'applicant'
  if (role === userTypeEnum.Faculty) return 'faculty'
  if (role === userTypeEnum.Student) return 'student'

  if (uniqueId.startsWith('F')) return 'faculty'
  if (uniqueId.startsWith('R')) return 'student'

  const hasFacultyFields = Boolean(user.profile?.occupation?.trim() || user.profile?.affiliation?.trim())
  const hasStudentFields = Boolean(user.profile?.study_year?.trim() || user.profile?.major?.trim())

  if (hasFacultyFields && !hasStudentFields) return 'faculty'
  if (hasStudentFields && !hasFacultyFields) return 'student'
  if (hasFacultyFields) return 'faculty'

  return 'student'
}

const getUserBirthday = (user: Users) => user.profile?.dob || user.dob || ''

const mapUserToStudentExportRow = (user: Users): string[] => [
  user.email || '',
  user.firstName || '',
  user.lastName || '',
  getUserBirthday(user),
  user.profile?.major || '',
  user.profile?.study_year || '',
  user.uniqueId || '',
  '',
  user._id || '',
  user.profile?.role || '',
]

const mapUserToFacultyExportRow = (user: Users): string[] => [
  user.email || '',
  user.firstName || '',
  user.lastName || '',
  getUserBirthday(user),
  user.profile?.occupation || '',
  user.profile?.affiliation || '',
  user.uniqueId || '',
  '',
  user._id || '',
  user.profile?.role || '',
]

const mapUserToApplicantExportRow = (user: Users): string[] => [
  user.email || '',
  user.firstName || '',
  user.lastName || '',
  getUserBirthday(user),
  '',
  user._id || '',
  user.profile?.role || '',
]

export const downloadUserImportTemplate = () => {
  const studentSheet = XLSX.utils.aoa_to_sheet([Array.from(STUDENT_TEMPLATE_HEADERS)])
  const facultySheet = XLSX.utils.aoa_to_sheet([Array.from(FACULTY_TEMPLATE_HEADERS)])
  const applicantSheet = XLSX.utils.aoa_to_sheet([Array.from(APPLICANT_TEMPLATE_HEADERS)])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, studentSheet, 'Students')
  XLSX.utils.book_append_sheet(workbook, facultySheet, 'Faculty')
  XLSX.utils.book_append_sheet(workbook, applicantSheet, 'Applicants')
  XLSX.writeFile(workbook, 'users-import-template.xlsx')
}

export const downloadUsersExportAsImportTemplate = (users: Users[], fileName: string) => {
  const usersById = new Map<string, Users>()
  users.forEach((user, index) => {
    const key = user._id || `row-${index}`
    usersById.set(key, user)
  })

  const uniqueUsers = Array.from(usersById.values())
  const studentRows = uniqueUsers.filter((user) => getUserSheetType(user) === 'student').map(mapUserToStudentExportRow)
  const facultyRows = uniqueUsers.filter((user) => getUserSheetType(user) === 'faculty').map(mapUserToFacultyExportRow)
  const applicantRows = uniqueUsers.filter((user) => getUserSheetType(user) === 'applicant').map(mapUserToApplicantExportRow)

  const studentSheet = XLSX.utils.aoa_to_sheet([Array.from(STUDENT_EXPORT_HEADERS), ...studentRows])
  const facultySheet = XLSX.utils.aoa_to_sheet([Array.from(FACULTY_EXPORT_HEADERS), ...facultyRows])
  const applicantSheet = XLSX.utils.aoa_to_sheet([Array.from(APPLICANT_EXPORT_HEADERS), ...applicantRows])
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, studentSheet, 'Students')
  XLSX.utils.book_append_sheet(workbook, facultySheet, 'Faculty')
  XLSX.utils.book_append_sheet(workbook, applicantSheet, 'Applicants')
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}
