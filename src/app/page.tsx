'use client'
import Image from 'next/image'
import React from 'react'
import bannerImage from '@assets/landing-mobile.svg'
import section3 from '@assets/section-3.svg'
import section4 from '@assets/section-4.svg'
import section5 from '@assets/section-5.svg'
import lightningIcon from '@assets/lightningIcon.svg'
import Title from '@/components/atoms/Title'
import { FaCheckCircle } from 'react-icons/fa'
import { motion } from 'framer-motion'
import LoginButtons from '@/components/atoms/LoginButtons'

export default function LandingPage() {
  const contentVariants = {
    hidden: { x: '-100vw', opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: 'twin', stiffness: 50 },
    },
  }

  return (
    <div className="bg-white w-[95%] lg:w-[85%] mx-auto ">
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between mb-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={contentVariants}
          className="flex flex-col text-center lg:text-left justify-start h-full lg:w-1/2"
        >
          <p className="text-primary-500 text-xs lg:text-sm mb-4">YOU&apos;RE ALMOST THERE</p>
          <Title className="mb-4">Search your university!</Title>
          <p className="text-neutral-600 text-xs lg:text-sm mb-5">
            University not listed? Send us feedback and we will add your university to the database, along with extra perks for you
          </p>
          <div style={{ width: '-webkit-fill-available' }}>
            <input
              style={{ width: '-webkit-fill-available' }}
              className="py-2 px-4 border-2 border-neutral-300 rounded-full focus:outline-none focus:border-gray-500"
              type="text"
              placeholder="Search Institute"
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ x: '100vw' }} // Start from the right
          animate={{ x: 0 }} // Move to the center
          transition={{ type: 'twin', stiffness: 50 }}
        >
          <Image width={650} height={650} src={bannerImage} alt={bannerImage} />
        </motion.div>
      </div>
      {/*Section 2*/}
      <div className="text-center mb-20">
        <Title className="w-[95%] lg:w-1/2 mx-auto">Connect, Collaborate, and Elevate with Unibuzz</Title>
        <p className="text-neutral-600 text-xs lg:text-sm mt-3 mb-5">Familiarize yourself with Unibuzz’s mission and purpose. </p>
      </div>
      {/*Section 3 Connect*/}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between my-20 gap-14">
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left justify-start h-full gap-6">
          <div className="flex gap-1 bg-surface-primary-50 rounded-full py-1 px-4 w-fit ">
            <Image width={18} height={18} src={lightningIcon} alt={lightningIcon} />
            <p className="text-primary-500">Connect</p>
          </div>
          <div>
            <p className="font-poppins text-sm lg:text-[32px] font-normal tracking-tighter ">
              Courses, clubs, circles and more. Join all the groups imaginable.
            </p>
            <ul className="font-normal text-left text-xs lg:text-sm">
              <li className="flex items-center gap-3 my-6">
                <div>
                  <FaCheckCircle className="text-[#22C55E] text-md" />
                </div>
                <p>Join university groups or create your own</p>
              </li>
              <li className="flex gap-3 my-5">
                <div>
                  <FaCheckCircle className="text-[#22C55E] text-md" />
                </div>
                <p>Distinguish between university approved groups and casual groups</p>
              </li>
              <li className="flex gap-3 my-5">
                <div>
                  <FaCheckCircle className="text-[#22C55E] text-md" />
                </div>
                <p>All social networking done within these groups</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="lg:w-1/2">
          <Image width={650} height={650} src={section3} alt={section3} className="shadow-xl" />
        </div>
      </div>
      {/*Section 4*/}
      <div className="flex flex-col lg:flex-row items-center justify-between my-20 gap-14">
        <div className="lg:w-1/2">
          <Image className="shadow-xl" width={650} height={650} src={section4} alt={section4} />
        </div>
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left justify-start h-full gap-6">
          <div className="flex gap-1 bg-surface-primary-50 rounded-full py-1 px-4 w-fit ">
            <Image width={18} height={18} src={lightningIcon} alt={lightningIcon} />
            <p className="text-primary-500">Collaborate</p>
          </div>
          <div>
            <p className="font-poppins text-sm lg:text-[32px] font-normal tracking-tighter ">
              Create new connections and freely message with others.
            </p>
            <ul className="font-normal text-left text-xs lg:text-sm">
              <li className="flex items-center gap-3 my-6">
                <div>
                  <FaCheckCircle className="text-[#22C55E] text-md" />
                </div>
                <p>Private messages, group messages, and forum posts</p>
              </li>
              <li className="flex gap-3 my-5">
                <div>
                  <FaCheckCircle className="text-[#22C55E] text-md" />
                </div>
                <p>Connect with people you know and keep up with their university life</p>
              </li>
              <li className="flex gap-3 my-5">
                <div>
                  <FaCheckCircle className="text-[#22C55E] text-md" />
                </div>
                <p>Edit your profile to your liking; university life is a fresh start</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/*Section 5 Connect*/}
      <div className="flex flex-col-reverse lg:flex-row items-center justify-between my-20 gap-14">
        <div className="lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left justify-start h-full gap-6">
          <div className="flex gap-1 bg-surface-primary-50 rounded-full py-1 px-4 w-fit ">
            <Image width={18} height={18} src={lightningIcon} alt={lightningIcon} />
            <p className="text-primary-500">Elevate</p>
          </div>
          <div>
            <p className="font-poppins text-sm lg:text-[32px] font-normal tracking-tighter ">
              Use our AI assistant among other features to enrich your university life.
            </p>
            <ul className="font-normal text-left text-xs lg:text-sm">
              <li className="flex items-center gap-3 my-6">
                <div>
                  <FaCheckCircle className="text-[#22C55E] text-md" />
                </div>
                <p>AI assistant that answers all questions related to your university</p>
              </li>
              <li className="flex gap-3 my-5">
                <div>
                  <FaCheckCircle className="text-[#22C55E] text-md" />
                </div>
                <p>LaTeX syntax for academic for communication of scientific documents and technical note-taking</p>
              </li>
              <li className="flex gap-3 my-5">
                <div>
                  <FaCheckCircle className="text-[#22C55E] text-md" />
                </div>
                <p>Move up to 5gb of files within platform for ebooks, research data, etc</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="lg:w-1/2">
          <Image className="shadow-xl" width={650} height={650} src={section5} alt={section5} />
        </div>
      </div>
      {/*section 6*/}
      <div className="flex flex-col gap-3 text-center">
        <div>
          <p className="text-primary-500 text-xs lg:text-sm">BECOME A PART OF YOUR UNIVERSITY</p>
        </div>
        <div>
          <Title>Create an Account to Get Started</Title>
        </div>
        <div>
          <p>Search universities worldwide and become part of their online communities </p>
        </div>
        <div className="flex gap-4 justify-center">
          <LoginButtons>Get Started</LoginButtons>
          <LoginButtons variant="shade">Get Started</LoginButtons>
        </div>
      </div>
    </div>
  )
}
