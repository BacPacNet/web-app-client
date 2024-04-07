'use client'

import './page.css'

import { useEffect, useState } from 'react'

import { BsStars } from 'react-icons/bs'
import Footer from './components/Footer/Footer'
import SearchBar from '../components/SearchBar'
import Section2 from './components/Section-2/Section2'
import Section3 from './components/Section-3/Section3'
import Sections from './components/Sections/Sections'
import client from '../client'
import { query } from '../queries/queries'
import { motion } from 'framer-motion'

export default function Home() {
  const [universityData, setUniversityData] = useState([])
  const [searchOpen, setSearchOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const LANDING_PAGE_TEXT = ' Search universities worldwide and become part of their online communities'.split(' ')
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
      <main
        className="main h-[34.75rem] md:h-[51.25rem] flex  w-full flex-col items-center justify-start max-h-full bg-[#ffffff]"
        onClick={() => setSearchOpen(!searchOpen)}
      >
        <div className="m-auto center-v flex-col w-[90%] lg:w-[70%]">
          <div className="typing-animation py-5 w-full text-3xl md:text-4xl lg:text-5xl font-bold items-center">
            {/*Search <span className="text-primary">universities</span> worldwide and become part of their{' '}
            <span className="text-primary">online communities</span>*/}

            {LANDING_PAGE_TEXT.map((el, i) => (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: i / 10,
                }}
                key={i}
              >
                {el}{' '}
              </motion.span>
            ))}
          </div>
          <SearchBar data={universityData} loading={loading} />
          <div className="flex flex-col items-center my-4">
            <div className="login-text flex items-center mt-8 md:mt-16">
              <BsStars className="star text-[#6744FF] text-4xl -ml-3 center" />
              <h2 className="text-lg font-medium text-center">Already part of your university community?</h2>
            </div>
            <div className="flex justify-center items-center w-28 my-3">
              <button className="btn-secondary btn w-28 h-10 center px-4 py-2.5">Login</button>
            </div>
            <div className="checkbox flex justify-center items-center w-1/2">
              <input type="checkbox" name="login" id="login" className="box w-6 h-6 cursor-pointer" />
              <label htmlFor="login" className="box-text font-medium text-lg cursor-pointer pl-3 w-52 text-black">
                Keep me logged in
              </label>
            </div>
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
