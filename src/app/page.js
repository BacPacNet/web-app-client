'use client'

import universityData from '../../data/university_data'
import { useState } from 'react'
import ComingSoon from '@/components/ComingSoon'

export default function Home() {
  const [open, setOpen] = useState(false)
  const [searchData, setSearchData] = useState([])
  function handleSearch(e) {
    let input = e.target.value.toLowerCase()
    const filterData = universityData
      .filter((item) => {
        let collegeName = item.name.toLowerCase()
        let collegeAddress = item.address.toLowerCase()
        return collegeName.includes(input) || collegeAddress.includes(input)
      })
      .sort((a, b) => b.score - a.score)
    setOpen(input.length !== 0)
    setSearchData(filterData)
  }
  return (
    <div className="home">
      <ComingSoon />
    </div>
  )
}
