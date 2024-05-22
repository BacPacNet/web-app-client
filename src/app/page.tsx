'use client'

import './page.css'
import { useState } from 'react'

import Footer from '../components/Footer/Footer'
import SearchBar from '../components/SearchBar'
import Section2 from '../components/Section-2/Section2'
import Section3 from '../components/Section-3/Section3'
import Sections from '../components/Sections/Sections'
import { motion } from 'framer-motion'
import StarIcon from '../assets/stars.svg'
import Image from 'next/image'
import DiscordIcon from '@assets/discord.svg'
import useCookie from '@/hooks/useCookie'
export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false)

  const LANDING_PAGE_TEXT = ' Search universities worldwide and become part of their online communities'.split(' ')
  const [cookieValue] = useCookie('uni_user_token')
  console.log(cookieValue)

  return (
    <div className="home">
      <main
        className="main h-[34.75rem] md:h-[51.25rem] flex  w-full flex-col items-center justify-start max-h-full bg-[#ffffff]"
        onClick={() => setSearchOpen(!searchOpen)}
      >
        <div className="m-auto center-v flex-col w-[90%] lg:w-[70%]">
          <div className="typing-animation py-5 w-full text-3xl md:text-4xl lg:text-5xl font-bold items-center">
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
          <SearchBar />
          <div className="flex flex-col items-center my-4">
            <div className="flex items-center mt-4  md:mt-16 gap-2">
              <div>
                <Image src={StarIcon} alt="start icon" className="text-xl" />
              </div>
              <div>
                <h2 className="text-sm sm:text-lg md:text-xl font-medium text-left">Already part of your university community?</h2>
              </div>
            </div>
            <div className="flex justify-center items-center w-28 my-3">
              <button className="btn-secondary btn w-28 h-10 center px-4 py-2.5">Login</button>
            </div>
            <div className="checkbox flex justify-center items-center">
              <input type="checkbox" name="login" id="login" className="box w-6 h-6 cursor-pointer" />
              <label htmlFor="login" className="box-text font-medium text-lg cursor-pointer pl-3  text-black">
                Keep me logged in
              </label>
            </div>
          </div>
        </div>
      </main>
      <Sections />
      <Section2 />
      <Section3 />
      <div className=" w-[90%] mx-auto relative flex flex-col center-v pt-8 lg:pt-16">
        <div className="w-full flex flex-col lg:flex-row relative items-center justify-between border-b-2 border-b-gray-light pb-4">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <p className=" text-[#6647FF] font-semibold text-xs lg:text-sm my-4">STILL HAVE QUESTIONS?</p>
            <h1 className="text-[#171717] font-extrabold text-3xl lg:text-4xl w-full">Get to know us better</h1>
            <p className="text-sm lg:text-md my-4 text-[#525252]">Familiarize yourself with Unibuzz&apos;s mission and purpose</p>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end gap-8 my-8">
            <div className="discord">
              <button className="btn btn-disc text-[#6647FF] text-base text-center font-medium py-3 px-4 flex justify-evenly items-center">
                <Image src={DiscordIcon} className="icon mr-2" alt="DiscordIcon" />
                Our Discord
              </button>
            </div>
            <div className="aboutus">
              <button className="btn-sec border border-[#E5E5E5] rounded-md bg-transparent text-[#404040] text-base font-medium">About us</button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
