"use client";
import Navbar from '../components/Navbar/Navbar'
import React from 'react'
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
import SearchFilter from '@/components/SearchFilter'
import SearchBar from '@/components/SearchBar';
import Footer from '../components/Footer/Footer';

const filterOptions = [
  {
    label: 'Region',
    options: [
      { value: 'region1', label: 'Region 1' },
      { value: 'region2', label: 'Region 2' },
      // Add more region options here
    ],
  },
  {
    label: 'City',
    options: [
      { value: 'country1', label: 'Country 1' },
      { value: 'country2', label: 'Country 2' },
      // Add more country options here
    ],
  },
  {
    label: 'Type',
    options: [
      { value: 'country1', label: 'Country 1' },
      { value: 'country2', label: 'Country 2' },
      // Add more country options here
    ],
  },
];


// ... UniversityCard component (replace with your implementation)
function UniversityCard({ name, image, logo }: { name: string; image: string, logo: string }) {
  return (
    <div className="rounded-lg shadow-md overflow-hidden">
      <img src={image} alt={name} className="w-full h-48 object-cover" />
      <div className="px-4 py-2 text-gray-700 flex flex-row items-center justify-between">
        <div className='w-10 h-10 rounded-full'>
          <img src={logo} alt={name} className=" object-cover" />
        </div>
        <p className="font-medium text-lg">{name}</p>
      </div>
    </div>
  );
}

function Discover() {

  const [open, setOpen] = React.useState(false)
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.trim().toLowerCase()
    // const filterData = searchAlgorithm(input, data).sort((a, b) => +b.score - +a.score)
    setOpen(input.length !== 0)
  }


  return (
    <div>
      <Navbar />
      <div className="w-screen min-h-screen bg-white text-black pt-16 pr-12 pl-24 pb-24 flex flex-row gap-8">
        <div className="border-2 border-gray-300 rounded-lg pb-4 max-h-[380px]">
          <p className='p-4 pr-16 border-b-2 bg-gray-100 font-medium text-lg'>Search Filter</p>
          <SearchFilter filters={filterOptions} />
        </div>
        <div className='flex flex-col items-center'>
          {/* search bar */}
          <SearchBar data={[]} loading={false} className="w-full" />
          <div className="w-full px-8 py-14 flex flex-col gap-8 grid md:grid-cols-2 sm:grid-cols-3 md:grid-cols-4"> {/* Content area */}
            <UniversityCard
              name="University of Atlantis"
              image="/university-atlantis.png" // Replace with actual image path
              logo="/icons/icon-192x192.png"
            />
            <UniversityCard
              name="University of Kombucha"
              image="/university-kombucha.png" // Replace with actual image path
              logo="/icons/icon-192x192.png"
            />
            <UniversityCard
              name="University of Kombucha"
              image="/university-kombucha.png" // Replace with actual image path
              logo="/icons/icon-192x192.png"
            />
            <UniversityCard
              name="University of Atlantis"
              image="/university-atlantis.png" // Replace with actual image path
              logo="/icons/icon-192x192.png"
            />
            {/* ... more university cards */}
          </div>
          <button className="py-2 text-center text-indigo-500 bg-indigo-100 text-white rounded-md font-medium hover:bg-blue-700 w-60">
            Show More Universities
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Discover
