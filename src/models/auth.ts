export interface LoginForm {
  email: string
  password: string
}

export interface UserResponseType {
  user: User
  tokens: Tokens
}

export interface User {
  firstName: string
  lastName: string
  email: string
  gender: string
  dob: string
  role: string
  isEmailVerified: boolean
  id: string
}

export interface Tokens {
  access: Access
  refresh: Refresh
}

export interface Access {
  token: string
  expires: string
}

export interface Refresh {
  token: string
  expires: string
}
