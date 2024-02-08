'use client'

import { useEffect, useState } from 'react'

import { BsStars } from 'react-icons/bs'
import Footer from './components/Footer/Footer'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from './components/Navbar/Navbar'
import bacpacTitle from '../assets/bacpacTitle.png'
import bookImgLogo from '../assets/bookimg.png'
import discord from '../assets/discordLog.png'
import SearchBar from '../components/SearchBar'
import client from '../client'
import { query } from '../queries/queries'

export default function Home() {
  const [universityData, setUniversityData] = useState([])
  const [loading, setLoading] = useState(false)
  async function fetchData() {
    try {
      setLoading(true)
      const result = await client.query({ query })
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
      <main className="flex h-full w-full flex-col items-center justify-start max-h-full bg-[#ffffff]">
        <div className="text-9xl font-bold  mt-28">
          <Image src={bacpacTitle} alt="BACPAC" className="w-full h-full" />
        </div>
        <SearchBar data={universityData} loading={loading} />
        <div className="login-part w-5/12 mt-24 flex flex-col items-center">
          <div className="flex items-center mb-5 w-full justify-center">
            <BsStars className="text-[#6744FF] text-4xl -ml-3 center" />
            <h2 className="heading text-lg font-medium center text-black">Already part of your university community?</h2>
          </div>
          <div className="flex justify-center items-center w-full mb-3">
            <button className=" btn-secondary btn w-40 h-10 center mr-1">Login</button>
          </div>
          <div className="checkbox flex justify-center items-center mt-3 w-1/2">
            <input type="checkbox" name="login" id="login" className="w-6 h-6 cursor-pointer" />
            <label htmlFor="login" className=" font-medium text-lg cursor-pointer pl-3 w-52 text-black">
              Keep me logged in
            </label>
          </div>
        </div>
        <div className="details bg-white w-full mt-40">
          <div className="part-1 flex items-center justify-evenly h-96">
            <div className="text w-1/3 h-full">
              <div className="heading h-3/4 flex justify-center flex-col">
                <h1 className="text-4xl font-bold text-black">
                  <p className="leading-8">First time user? </p>
                  <br />
                  <p> Get familiar with the </p> <br /> <p>site first!</p>
                </h1>
              </div>
              <div className="links flex flex-col justify-center">
                <ul className="list-none">
                  <li className="mb-2">
                    <Link href="#" className="text-[#6744FF]">
                      Click here to learn about BACPAC
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="text-[#6744FF]">
                      Click here to learn how to use BACPAC
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bookImg h-full w-1/4 ">
              <Image src={bookImgLogo} alt="BACPAC" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="part-2  h-96 center flex-col mt-20 mb-20 w-full text-black">
            <div className="text text-center center flex-col w-2/4">
              <div className="heading text-4xl font-bold mb-7">
                <h1>Still have questions?</h1>
              </div>
              <div className="para  w-full text-xl">
                Our discord community is ready and eager to help you with <br />
                anything BACPAC related. Make friends along the way!
              </div>
            </div>
            <div className="discord-link flex justify-evenly  items-center mt-10">
              <Image src={discord} alt="BACPAC" className="w-1/6" />
              <button className="btn btn-secondary w-40 h-10">join server</button>
            </div>
            <div className="para mt-11 text-lg">Interested in managing our server? Leave a message!</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
