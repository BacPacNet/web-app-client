'use client'
import { useRouter } from 'next/router'

export default function Page({ params }: { params: { id: string } }) {
  console.log('test', params.id)

  return <h1>My Page</h1>
}
