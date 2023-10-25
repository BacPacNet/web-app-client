'use client'

import { AiOutlineSearch } from 'react-icons/ai'
import { BsStars } from 'react-icons/bs'
import CollegeResult from './components/CollegeResult'
import Footer from './components/Footer/Footer'
import Image from 'next/image'
import Navbar from './components/Navbar/Navbar'
import bacpacTitle from '../assets/bacpacTitle.png'
import universityData from '../../data/university_data'
import { useState } from 'react'

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
    console.log('search', searchData)
  }
  return (
    <div className="home">
      <Navbar />
      <main className="flex min-h-screen flex-col items-center justify-start max-h-full bg-[#ffffff]">
        <div className="text-9xl font-bold z-20 mt-28">
          <Image src={bacpacTitle} alt="BACPAC" className="w-full h-full" />
        </div>
        <div className="search-box mt-4 border-1 border-black w-4/12 h-12 rounded-2xl">
          <div className="search-icon w-12 absolute h-12 flex justify-center items-center">
            <AiOutlineSearch className="text-xl" />
          </div>
          <input
            type="text"
            onChange={handleSearch}
            placeholder="Search"
            className="w-full h-full rounded-2xl border-2 border-gray-800 indent-14"
          />
          {open && (
            <div className="searchBox border-2 overflow-auto border-gray-300 w-full h-80 mt-4 rounded-lg p-3 bg-white relative">
              {searchData.map((item, index) => (
                <CollegeResult info={item} serialNo={index} key={index} />
              ))}
            </div>
          )}
        </div>
        <div className="login-part w-full mt-24 flex flex-col items-center">
          <div className="flex items-center mb-5 w-full ">
            <h2 className="heading text-xl font-medium  w-full center">
              <BsStars className="text-[#6744FF] text-4xl -ml-3 " />
              Already part of your university community?
            </h2>
          </div>
          <div className="btn flex justify-center items-start w-full mb-3 ">
            <button className=" btn-secondary btn w-40 h-10 ">Login</button>
          </div>
          <div className="checkbox flex justify-center items-center mt-3 w-1/2">
            <input
              type="checkbox"
              name="login"
              id="login"
              className="w-6 h-6 cursor-pointer"
            />
            <label
              htmlFor="login"
              className=" font-medium text-lg cursor-pointer pl-3 w-52"
            >
              Keep me logged in
            </label>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
