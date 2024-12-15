export interface FormDataType {
  email: string
  userName: string
  password: string
  confirmpassword: string
  birthDate: string
  gender: string
  country: string
  firstName: string
  lastName: string
  userType: string
  year: string
  degree: string
  major: string
  department: string
  occupation: string
  universityId: string
  verificationEmail: string
  verificationOtp: string
  universityEmail: string
  universityName: string
  UniversityOtp: string
  UniversityOtpOK: string
  referralCode: string
}

export const degreeAndMajors = {
  'Bachelor of Science': ['Computer Science', 'Biology', 'Mathematics', 'Physics', 'Chemistry'],
  'Bachelor of Arts': ['English Literature', 'History', 'Psychology', 'Sociology', 'Philosophy'],
  'Bachelor of Technology': [
    'Mechanical Engineering',
    'Computer Science and Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology',
  ],
  'Master of Science': ['Data Science', 'Engineering', 'Biochemistry', 'Environmental Science', 'Applied Mathematics'],
  'Master of Arts': ['Political Science', 'Economics', 'Linguistics', 'International Relations', 'Cultural Studies'],
  'Doctor of Philosophy': ['Theoretical Physics', 'Anthropology', 'Neuroscience', 'Philosophy', 'Computer Science'],
}

export const occupationAndDepartment = {
  Professor: ['Computer Science', 'Biology', 'Mathematics', 'Physics', 'Chemistry'],
  Lecturer: ['Computer Science', 'Biology', 'Mathematics', 'Physics', 'Chemistry'],
  'Associate Professor': [
    'Mechanical Engineering',
    'Computer Science and Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Information Technology',
  ],

  'Adjunct Professor': ['Political Science', 'Economics', 'Linguistics', 'International Relations', 'Cultural Studies'],
  'Research Fellow': ['Theoretical Physics', 'Anthropology', 'Neuroscience', 'Philosophy', 'Computer Science'],
}

export const GenderOptions = ['Male', 'Female']

export const userType = ['Student', 'Faculty', 'Applicant']
export const currYear = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th']
export enum userTypeEnum {
  Student = 'Student',
  Faculty = 'Faculty',
  Applicant = 'Applicant',
}

export enum userCheckError {
  emailNotAvailable = 'email is already taken',
  userNameNotAvailable = 'username already taken',
}

export const badgeData = [
  { name: 'Custom Emojis', bg: '#FDF4FF', color: '#C026D3' },
  { name: 'Unlimited AI Prompts', bg: '#ECFEFF', color: '#0891B2' },
  { name: 'Profile Badge', bg: '#F0FDF4', color: '#16A34A' },
  { name: 'Join Up 100 Groups', bg: '#F3F2FF', color: '#6744FF' },
  { name: '500 MB Upload', bg: '#FFFBEB', color: '#D97706' },
]
