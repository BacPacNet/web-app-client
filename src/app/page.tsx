'use client'

import './page.css'

import { useEffect, useState } from 'react'

import { BsStars } from 'react-icons/bs'
import Footer from '../components/Footer/Footer'
import Navbar from '../components/Navbar/Navbar'
import SearchBar from '../components/SearchBox/SearchBar'
import Section2 from '../components/Section-2/Section2'
import Section3 from '../components/Section-3/Section3'
import Sections from '../components/Sections/Sections'
import client from '../client'
import { query } from '../queries/queries'

export default function Home() {
  const [universityData, setUniversityData] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  async function fetchData() {
    try {
      setLoading(true)
      const result = await client.query({ query })
      console.log('universityList', result)
      setUniversityData(result?.data?.universityList)
    } catch (error) {
      console.log('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])
  return (
    <div className="home">
      <Navbar />
      <main
        className="main flex h-full w-full flex-col items-center justify-start max-h-full bg-[#ffffff]"
        onClick={() => setSearchOpen(!searchOpen)}
      >
        <div className="typing-box text-9xl font-bold mt-48 flex flex-col items-center">
          <div className="typing-animation">Search universities worldwide and become part of their online communities</div>
        </div>
        <SearchBar data={universityData} loading={loading} />
        <div className="login-part mt-14 flex flex-col items-center">
          <div className="login-text flex items-center mb-3 w-full justify-center">
            <BsStars className="star text-[#6744FF] text-4xl -ml-3 center" />
            <h2 className="text-lg font-medium center text-black">Already part of your university community?</h2>
          </div>
          <div className="flex justify-center items-center w-28">
            <button className="btn-secondary btn w-28 h-10 center mr-1 px-4 py-2.5">Login</button>
          </div>
          <div className="checkbox flex justify-center items-center mt-4 w-1/2">
            <input type="checkbox" name="login" id="login" className="box w-6 h-6 cursor-pointer" />
            <label htmlFor="login" className="box-text font-medium text-lg cursor-pointer pl-3 w-52 text-black">
              Keep me logged in
            </label>
          </div>
        </div>
      </main>
      <Sections />
      <Section2 />
      <Section3 />
      <Footer />
    </div>
  )
}
