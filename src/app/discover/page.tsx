/* eslint-disable @next/next/no-img-element */
'use client'

import Navbar from '../components/Navbar/Navbar'
import React from 'react'
import SearchBar from '@/components/SearchBar'
import SearchFilter from '@/components/SearchFilter'
import UniversityCard from '@/components/UniversityCard'

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

function Discover() {
  //TODO: Add backend logic to make the UI work as expected.

  return (
    <div>
      <Navbar />
      <div className="w-screen min-h-screen bg-white text-black p-4 sm:pt-16 sm:pb-24 sm:pr-36 sm:pl-36 lg:flex lg:flex-row gap-8 justify-center">
        <SearchFilter filters={filterOptions} />
        <div className="flex flex-col items-center">
          {/* search bar */}
          <SearchBar
            data={[]}
            loading={false}
            className="w-full lg:max-w-none mt-0"
            inputStyle="border-gray-300 rounded-3xl text-[14px]"
            iconDivStyle="pl-4"
            iconStyle="text-gray-500"
            iconSize="1.5rem"
            placeholderText="Search institution"
          />
          {/* Content area */}
          <div className="w-full py-8 flex-col gap-8 grid lg:grid-cols-2 max-w-md md:max-w-lg lg:max-w-none">
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
