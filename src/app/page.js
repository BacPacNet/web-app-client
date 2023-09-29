'use client'

import { useEffect, useState } from 'react'

import CollegeResult from './components/CollegeResult'
import jsonData from '../../data/university_data'

export default function Home() {
  const [open, setOpen] = useState(false)
  const [searchData, setSearchData] = useState([])
  // async function handler() {
  //   setCollegesData(jsonData)
  // }
  // useEffect(() => {
  //   handler()
  // }, [])
  function handleSearch(e) {
    let input = e.target.value.toLowerCase()
    const filterData = jsonData
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
    <main className="flex min-h-screen flex-col items-center justify-start">
      <h1 className="text-9xl font-bold z-20 mt-60">BacPac</h1>
      <div className="search-box mt-4 border-1 border-black w-4/12 h-12 rounded-2xl">
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Search Colleges..."
          className="w-full h-full indent-2.5 rounded-2xl"
        />
        {open && (
          <div className="searchBox border-2 overflow-auto border-gray-300 w-full h-80 mt-4 rounded-lg p-3 bg-white">
            {searchData.map((item, index) => (
              <CollegeResult info={item} serialNo={index} key={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
