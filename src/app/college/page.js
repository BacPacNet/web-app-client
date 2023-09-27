'use client'
import { useSearchParams } from 'next/navigation'
import jsonData from '../../../script/web-scraping-script-main/university_data'
import { useEffect, useState } from 'react'
export default function Home() {
  const router = useSearchParams()
  const collegeList = jsonData
  const [collegeData, setCollegeData] = useState({})
  const id = router.get('id')
  function fetchCollege() {
    const data = collegeList.find((item) => item.id === id)
    console.log('data', data)
    setCollegeData(data)
  }
  useEffect(() => {
    fetchCollege()
  }, [id])
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-5xl font-bold z-10">{collegeData.name}</h1>
    </main>
  )
}
