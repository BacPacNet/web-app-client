/* eslint-disable @next/next/no-img-element */
'use client'

import Navbar from '../components/Navbar/Navbar'
import React from 'react'
import SearchBar from '@/components/SearchBar'
import SearchFilter from '@/components/SearchFilter'

const filterOptions = [
  {
    label: 'Region',
    options: [
      { value: 'region1', label: 'Region 1' },
      { value: 'region2', label: 'Region 2' },
    ],
  },
  {
    label: 'Country',
    options: [
      { value: 'country1', label: 'Country 1' },
      { value: 'country2', label: 'Country 2' },
    ],
  },
  {
    label: 'City',
    options: [
      { value: 'city1', label: 'City 1' },
      { value: 'city2', label: 'City 2' },
    ],
  },
  {
    label: 'Type',
    options: [
      { value: 'type1', label: 'Type 1' },
      { value: 'type2', label: 'Type 2' },
    ],
  },
]

function UniversityCard({ name, image, logo }: { name: string; image: string; logo: string }) {
  return (
    <div className="rounded-lg shadow-md overflow-hidden relative">
      <img src={image} alt={name} className="w-full h-52 object-cover transition-all duration-500" style={{ opacity: 0.7 }} />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-200/30 to-transparent transition-all duration-500 opacity-0 hover:opacity-100"></div>
      <div className="px-8 py-2 text-gray-700 flex flex-row items-center justify-between gap-24">
        <div className="w-10 h-10 rounded-full">
          <img src={logo} alt={name} className="object-cover" />
        </div>
        <p className="font-semibold text-lg">{name}</p>
      </div>
    </div>
  )
}

function Discover() {
  // const [open, setOpen] = React.useState(false)
  // const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const input = e.target.value.trim().toLowerCase()
  //   // const filterData = searchAlgorithm(input, data).sort((a, b) => +b.score - +a.score)
  //   setOpen(input.length !== 0)
  // }

  return (
    <div>
      <Navbar />
      <div className="w-screen min-h-screen bg-white text-black p-4 sm:pt-16 sm:pr-36 sm:pl-36 sm:pb-24 lg:flex lg:flex-row gap-8">
        {/* For Large Screen Sizes */}
        <div className="border-2 border-gray-300 rounded-lg pb-4 max-h-[380px] hidden lg:block">
          <p className="p-[18px] pr-[61px] mb-4 border-b-2 bg-gray-100 font-medium text-[16px] whitespace-nowrap">Search Filter</p>
          <SearchFilter filters={filterOptions} />
        </div>
        <div className="pb-4 max-h-[380px] block lg:hidden">
          <p className="font-medium text-2xl pb-3">Search Filters</p>
          <div className="flex flex-row items-center justify-between flex-wrap">
            <div className="flex flex-row gap-3 flex-wrap py-2">
              <p className="border-2 border-gray-300 rounded-3xl py-2 px-4 font-medium">Region</p>
              <p className="border-2 border-gray-300 rounded-3xl py-2 px-4 font-medium">Country</p>
              <p className="border-2 border-gray-300 rounded-3xl py-2 px-4 font-medium">City</p>
              <p className="border-2 border-gray-300 rounded-3xl py-2 px-4 font-medium">Type</p>
            </div>
            <button className="px-4 py-2 rounded-3xl hover:bg-indigo-500 transition-colors duration-300 border-indigo-500 border-2 text-indigo-500 font-medium">
              Reset
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center">
          {/* search bar */}
          <SearchBar
            data={[]}
            loading={false}
            className="w-full"
            inputStyle="border-gray-300 rounded-3xl text-[14px]"
            iconDivStyle="pl-4"
            iconStyle="text-gray-500"
            iconSize="1.5rem"
            placeholderText="Search institution"
          />
          <div className="w-full py-8 flex-col gap-8 grid lg:grid-cols-2">
            {' '}
            {/* Content area */}
            <UniversityCard
              name="University of Atlantis"
              image="/university-atlantis.png" // Replace with actual image path
              logo="/uni-logo-sample.png"
            />
            <UniversityCard
              name="University of Kombucha"
              image="/university-kombucha.png" // Replace with actual image path
              logo="/uni-logo-sample.png"
            />
            <UniversityCard
              name="University of Kombucha"
              image="/university-kombucha.png" // Replace with actual image path
              logo="/uni-logo-sample.png"
            />
            <UniversityCard
              name="University of Atlantis"
              image="/university-atlantis.png" // Replace with actual image path
              logo="/uni-logo-sample.png"
            />
            {/* ... more university cards */}
          </div>
          <button className="mt-4 py-2 text-center text-purple-500 bg-violet-100 rounded-lg font-medium hover:bg-violet-200 hover:border-violet-400 hover:border-[1px] w-60">
            Show More Universities
          </button>
        </div>
      </div>
      {/* <Footer /> */}
      <div className="border-t-[1px]">
        <div className="bg-white flex lg:hidden gap-6 font-medium text-gray-500 pl-8 pt-8">
          <p>Overview</p>
          <p>Terms</p>
          <p>Jobs</p>
          <p>Help</p>
          <p>Privacy</p>
        </div>
        <div className="h-32 px-8 lg:px-32 flex justify-between bg-white text-gray-600 items-center">
          <p>@2023LogoName</p>
          <div className="gap-6 font-medium hidden lg:flex">
            <p>Overview</p>
            <p>Terms</p>
            <p>Jobs</p>
            <p>Help</p>
            <p>Privacy</p>
          </div>
          {/* social logos */}
          <div className="flex gap-6">
            <img src="/social/facebook.png" alt="facebook" className="w-6 h-6" />
            <img src="/social/twitter.png" alt="twitter" className="w-6 h-6" />
            <img src="/social/linkedin.png" alt="linkedin" className="w-6 h-6" />
            <img src="/social/instagram.png" alt="instagram" className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Discover
