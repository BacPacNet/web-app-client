import React from 'react'
import { MdOutlineHome, MdNavigateNext } from 'react-icons/md'
import { FaCircleInfo } from 'react-icons/fa6'
import Image from 'next/image'
import Reviews from '@/components/Reviews/page'
import StarsRating from '@/components/Stars/page'
import ContactCard from '@/components/ContactCard/page'
import Data from './data'
export default function CollegeDiscovery() {
  const college = Data.collegeData
  const statsImg = Data.statsImgData
  return (
    <div className="w-screen min-h-screen bg-white text-black">
      {/* breadcrumb */}
      <div className="px-8 lg:px-28 py-8 flex items-center gap-1  text-base font-medium text-right text-gray">
        <MdOutlineHome size={30} className="text-lg " />
        <MdNavigateNext className="text-lg" />
        <span className="text-lg ">Discover</span>
        <MdNavigateNext className="text-lg" />
        <span className="text-lg text-purple-600">{college.name}</span>
      </div>
      {/* Image */}
      <div>
        <Image src={college.img} alt="College logo" layout="responsive" width={0} height={0} />
      </div>
      {/* Community Info */}
      <div className="px-8 lg:px-28 grid grid-cols-1 md:grid-cols-2 justify-center md:justify-between py-10 gap-8">
        <div className="flex flex-row items-center">
          <div className="mr-10">
            <Image src={college.logo} alt="" width={100} height={30} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold">{college.name}</span>
            <span className="text-gray">{college.contact.location}</span>
          </div>
        </div>
        <div className="flex items-center justify-center md:justify-end m-8 md:m-0">
          <button className="p-5 rounded-lg bg-primary text-white">Join Community</button>
        </div>
      </div>
      {/* Main Content */}
      <div className="px-8 lg:px-28 flex flex-col justify-between py-10 gap-16">
        {/* Unibuzz stat */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="flex flex-col items-center justify-center mb-8">
            <span className="font-bold ">{college.name}</span>
            <span className="text-gray">UniBuzz Stats</span>
          </div>
          <span className="px-10 lg:px-44 gap-4">
            <ul className="grid grid-cols-2 md:grid-cols-4  gap-4 ">
              <li className="flex flex-col items-center justify-center">
                <span>
                  <Image src={statsImg.a} alt="" width={100} height={100} />{' '}
                </span>
                <span className="flex flex-row items-center gap-2.5">
                  <div className="font-bold text-3xl">30k</div>
                  <div className="text-center text-gray w-10">Total Students</div>
                </span>
              </li>
              <li className="flex flex-col items-center justify-center">
                <span>
                  <Image src={statsImg.b} alt="" width={100} height={100} />{' '}
                </span>
                <span className="flex flex-row items-center gap-2.5 text-primary">
                  <div className="font-bold text-3xl">320</div>
                  <div className="text-center text-gray w-15">Students on Unibuzz</div>
                </span>
              </li>
              <li className="flex flex-col items-center justify-center">
                <span>
                  <Image src={statsImg.c} alt="" width={100} height={100} />{' '}
                </span>
                <span className="flex flex-row items-center gap-2.5">
                  <div className="font-bold text-3xl">5k</div>
                  <div className="text-center text-gray w-15">Total Faculty</div>
                </span>
              </li>
              <li className="flex flex-col items-center justify-center">
                <span>
                  <Image src={statsImg.d} alt="" width={100} height={100} />{' '}
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
          <span className="font-bold ">Overview</span>
          <span>
            <p className="py-3">{college.para1}</p>
            <p className="py-3">{college.para2}</p>
            <p className="py-3">{college.para3}</p>
          </span>
          <span className="text-primary">Read Less</span>
        </div>
        {/* Contact Info */}
        <div className="flex flex-col gap-5">
          <span className="flex flex-row gap-1 items-center font-bold">
            Contact info <FaCircleInfo />{' '}
          </span>
          <ContactCard contactInfo={college.contact} />
        </div>
      </div>
      {/* Rate and Review */}
      <div className="flex flex-col gap-8 px-8 lg:px-28">
        <span className="font-bold">Rate and Review</span>
        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-4">
          <span className="grid grid-cols-2 text-center justify-center items-center gap-2">
            <span className="flex flex-col justify-center items-end p-2">
              <span className="bg-primary text-white px-1 text-center rounded-lg mr-2">Score</span>
              <span className="text-4xl font-bold">7.34</span>
            </span>
            <span className="flex flex-row text-start justify-start items-center font-bold gap-1">
              Ranked:NA <FaCircleInfo />
            </span>
          </span>
          <span className="hidden md:flex flex-row justify-center items-center  mx-auto">
            <button className="bg-gray-light text-primary py-3 px-5 rounded-md">Add a review</button>
          </span>
          <StarsRating rating={{ value: 7, totalStars: 10 }} />
          <span className="flex flex-row justify-center items-center text-gray">from 1000+ reviews</span>
          <span className=" md:hidden flex-row justify-center items-center mx-auto">
            <button className="bg-gray-light text-primary py-3 px-5 rounded-md">Add a review</button>
          </span>
        </div>
        <div className="flex flex-col gap-4 md:gap-1">
          <Reviews />
          <span className="bg-gray-light text-primary px-8 py-2.5 text-center my-8 mx-auto">Show More Reviews</span>
        </div>
      </div>
    </div>
  )
}
