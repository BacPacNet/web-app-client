'use client'
import CollegeResult from './components/CollegeResult'
import jsonData from '../../script/web-scraping-script-main/university_data'
import { useState, useEffect } from 'react'
export default function Home() {
  const [open, setOpen] = useState(false)
  const [collegesData, setCollegesData] = useState([])
  const [searchData, setSearchData] = useState([])
  async function handler() {
    setCollegesData(jsonData)
  }
  useEffect(() => {
    handler()
  }, [])
  function handleSearch(e) {
    const length = e.target.value
    const searchData = collegesData
      .filter((item) => {
        let collegeName = item.name.toUpperCase()
        let collegeAddress = item.address.toUpperCase()
        let input = e.target.value.toUpperCase()
        if (collegeName.includes(input)) {
          return item
        } else if (collegeAddress.includes(input)) {
          return item
        }
      })
      .sort(function (a, b) {
        return b.score - a.score
      })
    if (length.length === 0) {
      setOpen(false)
    } else {
      setOpen(true)
      setSearchData(searchData)
    }
  }
  return (
    <main className="flex min-h-screen flex-col items-center justify-start">
      <h1 className="text-9xl font-bold z-20 mt-60">BacPac</h1>
      <div className="searchBox mt-4 border-1 border-black w-4/12 h-12 rounded-2xl">
        <input
          type="text"
          onChange={handleSearch}
          placeholder="Search Colleges..."
          className="w-full h-full indent-2.5 rounded-2xl"
        />
        {open && (
          <div className="searchBox border-2 overflow-auto border-gray-300 w-full h-80 mt-4 rounded-lg p-3 bg-white">
            {open &&
              searchData.map((item, index) => (
                <CollegeResult info={item} serialNo={index} />
              ))}
          </div>
        )}
      </div>
    </main>
  )
}
