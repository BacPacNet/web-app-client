'use client'

import UserSearchInput from '@/components/atoms/UserSearchBox'

type Props = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function StudentSearchBar({ value, onChange, placeholder = 'Search by name, email or major...', className = '' }: Props) {
  return <UserSearchInput value={value} onChange={onChange} placeholder={placeholder} iconPosition="left" className={className} />
}
