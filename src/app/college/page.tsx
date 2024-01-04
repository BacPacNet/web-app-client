// The "use client" is used to declare a boundary between a Server and Client Component modules.
// This means that by defining a "use client" in a file, all other modules imported into it, including child components, are considered part of the client bundle - and will be rendered by React on the client.
// In this file useSearchParams is a client component.
'use client'

import jsonData from '../../../data/university_data.json'
import { useSearchParams } from 'next/navigation'

interface University {
  name: string,
  id: string,
}

export default function Home() {
  const router = useSearchParams()
  const collegeList: University[] = jsonData as University[]
  const id = router.get('id') as string
  const selectedCollege: University | undefined = collegeList.find((item) => item.id === id)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-5xl font-bold z-10">{selectedCollege?.name}</h1>
    </main>
  )
}
