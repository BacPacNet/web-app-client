//useSearchParams only works in Client Components.So, Add we need  "use client" directive at the top of the file to use it
'use client'

import jsonData from '../../../data/university_data'
import { useSearchParams } from 'next/navigation'

export default function Home() {
  const router = useSearchParams()
  const collegeList = jsonData
  const id = router.get('id')
  const selectedCollege = collegeList.find((item) => item.id === id)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-5xl font-bold z-10">{selectedCollege?.name}</h1>
    </main>
  )
}
