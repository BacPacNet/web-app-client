'use client'
import React, { useEffect, useState } from 'react'
import { MdOutlineHome, MdNavigateNext } from 'react-icons/md'
import { FaCircleInfo } from 'react-icons/fa6'
import Image from 'next/image'
import Reviews from '@/components/Reviews/page'
import StarsRating from '@/components/Stars/page'
import ContactCard from '@/components/ContactCard/page'
import { getUniversity } from '@/services/universitySearch'
import st_grey from '../../../../public/stats/st_grey.png'
import st_violet from '../../../../public/stats/st_violet.png'
import ft_grey from '../../../../public/stats/ft_grey.png'
import ft_violet from '../../../../public/stats/ft_violet.png'
import Link from 'next/link'

export default function CollegeDiscovery({ params }) {
  const [loading, setLoading] = useState(true)
  const [college, setCollege] = useState(null)
  const collegeId = params.collegeId

  const [imageIndex, setImageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((prevIndex) => (college?.images ? (prevIndex + 1) % college.images.length : 0))
    }, 5000)

    return () => clearInterval(interval)
  }, [college])

  useEffect(() => {
    const fetchCollege = async () => {
      try {
        console.log('Fetching college data for ', collegeId)
        const data = await getUniversity(collegeId)
        setCollege(data?.result)
      } catch (error) {
        console.error('Error fetching college data: ', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollege()
  }, [collegeId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!college) {
    return <div>No college data available</div>
  }

  return (
    <div>
      <div className="w-screen min-h-screen bg-white text-black">
        {/* Breadcrumb */}
        <div className="px-8 lg:px-28 py-2 flex items-center gap-1 text-base font-medium text-right text-gray">
          <Link href={'/'}>
            <MdOutlineHome size={30} className="text-lg" />
          </Link>
          <MdNavigateNext className="text-lg" />
          <Link href={'/discover'}>
            <span className="text-lg">Discover</span>
          </Link>
          <MdNavigateNext className="text-lg" />
          <span className="text-lg text-purple-600">{college?.name}</span>
        </div>

        {/* Image with Sliding Animation */}
        <div className="relative h-96 overflow-hidden">
          {college.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`College image ${idx}`}
              className={`absolute w-full h-full object-cover transition-transform duration-1000 ${
                idx === imageIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
              }`}
              style={{
                transform: idx === imageIndex ? 'translateX(0)' : 'translateX(100%)',
                transition: 'transform 2s ease-in-out, opacity 1s ease-in-out',
              }}
            />
          ))}
        </div>

        <div className="px-8 lg:px-28 grid grid-cols-1 md:grid-cols-2 justify-center md:justify-between pt-4 gap-8">
          <div className="flex flex-row items-center">
            <div className="mr-10">
              <Image src={college?.logos[1]} alt="" width={100} height={30} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold">{college?.name}</span>
              <span className="text-gray">{college?.wikiInfoBox?.Location}</span>
            </div>
          </div>
          <div className="flex items-center justify-center md:justify-end m-8 md:m-0">
            <button className="p-5 rounded-lg bg-primary text-white">Join Community</button>
          </div>
        </div>

        <div className="px-8 lg:px-28 flex flex-col justify-between py-10 gap-16">
          {/* UniBuzz Stats */}
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex flex-col items-center justify-center mb-8">
              <span className="font-bold">{college?.name}</span>
              <span className="text-gray">UniBuzz Stats</span>
            </div>
            <span className="px-10 lg:px-44 gap-4">
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <li className="flex flex-col items-center justify-center">
                  <span>
                    <Image src={st_grey} alt="" width={100} height={100} />
                  </span>
                  <span className="flex flex-row items-center gap-2.5">
                    <div className="font-bold text-3xl">{college?.topUniInfo?.studentsAndFacultiesData[0]?.['Total students'] || 'No data'}</div>
                    <div className="text-center text-gray w-10">Total Students</div>
                  </span>
                </li>
                <li className="flex flex-col items-center justify-center">
                  <span>
                    <Image src={st_violet} alt="" width={100} height={100} />
                  </span>
                  <span className="flex flex-row items-center gap-2.5 text-primary">
                    <div className="font-bold text-3xl">320</div>
                    <div className="text-center text-gray w-15">Students on UniBuzz</div>
                  </span>
                </li>
                <li className="flex flex-col items-center justify-center">
                  <span>
                    <Image src={ft_grey} alt="" width={100} height={100} />
                  </span>
                  <span className="flex flex-row items-center gap-2.5">
                    <div className="font-bold text-3xl">{college?.topUniInfo?.studentsAndFacultiesData[2]?.['Total faculty staff']}</div>
                    <div className="text-center text-gray w-15">Total Faculty</div>
                  </span>
                </li>
                <li className="flex flex-col items-center justify-center">
                  <span>
                    <Image src={ft_violet} alt="" width={100} height={100} />
                  </span>
                  <span className="flex flex-row items-center gap-2.5 text-primary">
                    <div className="font-bold text-3xl">50</div>
                    <div className="text-center text-gray w-15">Faculty on UniBuzz</div>
                  </span>
                </li>
              </ul>
            </span>
          </div>

          {/* Overview */}
          <div className="flex flex-col gap-5">
            <span className="font-bold">Overview</span>
            <span>
              <p className="py-3">{college?.topUniInfo?.about}</p>
            </span>
            <span className="text-primary">Read Less</span>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-5">
            <span className="flex flex-row gap-1 items-center font-bold">
              Contact info <FaCircleInfo />
            </span>
            <ContactCard contactInfo={college?.collegeBoardInfo} />
          </div>
        </div>

        <div className="flex flex-col gap-8 px-8 lg:px-28">
          <span className="font-bold">Rate and Review</span>
          <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-4">
            <span className="grid grid-cols-2 text-center justify-center items-center gap-2">
              <span className="flex flex-col justify-center items-end p-2">
                <span className="bg-primary text-white px-1 text-center rounded-lg mr-2">Score</span>
                <span className="text-4xl font-bold">7.34</span>
              </span>
              <span className="flex flex-row text-start justify-start items-center font-bold gap-1">
                Ranked: NA <FaCircleInfo />
              </span>
            </span>
            <span className="hidden md:flex flex-row justify-center items-center mx-auto">
              <button className="bg-gray-light text-primary py-3 px-5 rounded-md">Add a review</button>
            </span>
            <StarsRating rating={{ value: 7, totalStars: 10 }} />
            <span className="flex flex-row justify-center items-center text-gray">from 1000+ reviews</span>
            <span className="md:hidden flex-row justify-center items-center mx-auto">
              <button className="bg-gray-light text-primary py-3 px-5 rounded-md">Add a review</button>
            </span>
          </div>
          <div className="flex flex-col gap-4 md:gap-1">
            <Reviews />
            <span className="bg-gray-light text-primary px-8 py-2.5 text-center my-8 mx-auto">Show More Reviews</span>
          </div>
        </div>
      </div>
    </div>
  )
}
