'use client'

import Buttons from '@/components/atoms/Buttons'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { HiOutlineHome } from 'react-icons/hi2'

type Props = {
  title: string
  className?: string
}

export default function AdminPageHeader({ title, className }: Props) {
  const router = useRouter()

  return (
    <div className={cn('flex items-center justify-between gap-4', className)}>
      <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
      <Buttons variant="border" size="small" leftIcon={<HiOutlineHome size={16} />} onClick={() => router.push('/timeline')}>
        Timeline
      </Buttons>
    </div>
  )
}
