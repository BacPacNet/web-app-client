'use client'

import { AiOutlineSearch } from 'react-icons/ai'
import { BsStars } from 'react-icons/bs'
import CollegeResult from './components/CollegeResult'
import Footer from './components/Footer/Footer'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from './components/Navbar/Navbar'
import bacpacTitle from '../assets/bacpacTitle.png'
import bookImgLogo from '../assets/bookimg.png'
import discord from '../assets/discordLog.png'
import universityData from '../../data/university_data'
import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import UnderConstructionPage from './components/UnderConstructionPage/UnderConstructionPage'

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
      <UnderConstructionPage />
      <Footer />
    </div>
  )
}
