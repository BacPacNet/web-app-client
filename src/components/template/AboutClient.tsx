'use client'

import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import useDeviceType from '@/hooks/useDeviceType'
import Buttons from '@/components/atoms/Buttons'
import SupportingText from '@/components/atoms/SupportingText'
import { BsDiscord } from 'react-icons/bs'
import { RiMessage2Fill } from 'react-icons/ri'
import image1 from '@assets/image1.svg'
import image2 from '@assets/image2.svg'
import image3 from '@assets/image3.svg'
import landingMobile from '@assets/landing-mobile.svg'
import { useRouter } from 'next/navigation'

const team = [
  {
    name: 'Aryan Bansal',
    role: 'CEO',
    image: 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/aryan.png',
  },
  {
    name: 'Robin Park',
    role: 'CPO, Lead Designer',
    image: 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/robin.png',
  },
  {
    name: 'Isha Gupta',
    role: 'CMO',
    image: 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/isha.png',
  },
  {
    name: 'Pratik Yadav',
    role: 'CTO, Lead Developer',
    image: 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/pratik.png',
  },
  {
    name: 'Aamil Shafi',
    role: 'Full-Stack Engineer',
    image: 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/aamil.png',
  },
  {
    name: 'Priyanshi',
    role: 'AI/ML Intern',
    image: 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/priyanshi.jpg',
  },
]

const AboutClient = () => {
  const { isMobile, isTablet, isDesktop } = useDeviceType()

  // Refs for scroll animations
  const heroRef = useRef(null)
  const discoverRef = useRef(null)
  const communityRef = useRef(null)
  const levelUpRef = useRef(null)
  const visionMissionRef = useRef(null)
  const teamRef = useRef(null)
  const contactRef = useRef(null)

  // InView hooks for animations
  const isHeroInView = useInView(heroRef, { once: true, margin: '-100px' })
  const isDiscoverInView = useInView(discoverRef, { once: true, margin: '-100px' })
  const isCommunityInView = useInView(communityRef, { once: true, margin: '-100px' })
  const isLevelUpInView = useInView(levelUpRef, { once: true, margin: '-100px' })
  const isVisionMissionInView = useInView(visionMissionRef, { once: true, margin: '-100px' })
  const isTeamInView = useInView(teamRef, { once: true, margin: '-100px' })
  const isContactInView = useInView(contactRef, { once: true, margin: '-100px' })
  const router = useRouter()

  return (
    <>
      <div className="">
        <main className="flex flex-col items-center justify-center gap-16">
          {/* Hero Section */}
          <motion.section
            ref={heroRef}
            initial={{ opacity: 0, y: 50 }}
            animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="lg:px-0 sm:px-8 px-4 flex flex-col justify-start items-center gap-20 w-full max-width-allowed min-h-screen"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            >
              <Image src={landingMobile} alt="Mobile UI" width={452} height={227} />
            </motion.div>
            <motion.div
              className="max-w-3xl text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            >
              <h1 className="md:text-4xl sm:text-3xl text-2xl text-neutral-700 font-bold mt-3 font-poppins">Welcome to Unibuzz!</h1>
              <SupportingText className="mt-6">
                At UniBuzz, we believe that university life is more than just lectures and exams—it&apos;s about connections, collaborations, and
                opportunities that shape your experience.
              </SupportingText>
            </motion.div>
          </motion.section>

          {/* Discover & Explore Section */}
          <motion.section
            ref={discoverRef}
            initial={{ opacity: 0, y: 50 }}
            animate={isDiscoverInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="lg:px-0 sm:px-8 px-4 flex lg:flex-row flex-col justify-between md:gap-20 gap-10 items-center w-full max-width-allowed mt-6"
          >
            <motion.div
              className="max-w-xl lg:text-left text-center"
              initial={{ opacity: 0, x: -30 }}
              animate={isDiscoverInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            >
              <h1 className="font-poppins text-2xl text-neutral-700 font-semibold mt-3">Discover & Explore Universities!</h1>
              <SupportingText className="mt-4">
                Search for any university and find all essential details in one place—fees, funding, deadlines, scholarships, and more. Stay informed
                and make well-informed decisions about your academic journey.
              </SupportingText>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isDiscoverInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
            >
              <Image src={image1} alt="Welcome Unibuzz" width={478} height={286} />
            </motion.div>
          </motion.section>

          {/* Join your Community Section */}
          <motion.section
            ref={communityRef}
            initial={{ opacity: 0, y: 50 }}
            animate={isCommunityInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="lg:px-0 sm:px-8 px-4 flex lg:flex-row flex-col-reverse justify-between md:gap-20 gap-10 items-center max-width-allowed space-x-4 md:mt-60 mt-16"
          >
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isCommunityInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            >
              <div className="lg:w-[512px] lg:h-[206px] w-[300px] h-[120px]">
                <Image src={image2} alt="Search University" width={512} height={206} className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div
              className="lg:text-left text-center"
              initial={{ opacity: 0, x: 30 }}
              animate={isCommunityInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
            >
              <h1 className="font-poppins text-2xl text-neutral-700 font-semibold mt-3">Join your Community</h1>
              <SupportingText className="mt-4">
                Gain access to the university community to communicate with current, past, and future students! Join university clubs, collaborate on
                projects, discuss assignments, and engage beyond the classroom.
              </SupportingText>
            </motion.div>
          </motion.section>

          {/* Level Up Your Campus Life Section */}
          <motion.section
            ref={levelUpRef}
            initial={{ opacity: 0, y: 50 }}
            animate={isLevelUpInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="lg:px-0 sm:px-8 px-4 flex lg:flex-row flex-col justify-between md:gap-20 gap-10 items-center max-width-allowed md:mt-60 mt-16"
          >
            <motion.div
              className="lg:text-left text-center"
              initial={{ opacity: 0, x: -30 }}
              animate={isLevelUpInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            >
              <h1 className="font-poppins  text-2xl text-neutral-700 font-semibold mt-3">Level Up Your Campus Life</h1>
              <p className=" md:max-w-md max-w-2xl text-neutral-500 mt-4">
                With a wide range of social networking features, messaging, and an AI powered assistant, we will make your university life a blast.
                Download our mobile app for syncing!
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isLevelUpInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
            >
              <Image src={image3} alt="Join University" width={523} height={202} />
            </motion.div>
          </motion.section>
        </main>

        {/* Vision & Mission Section */}
        <motion.section
          ref={visionMissionRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isVisionMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="w-full bg-[#FAFAFA] py-16 my-48 lg:px-0 sm:px-8 px-4"
        >
          <div className="max-width-allowed mx-auto">
            <motion.div
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={isVisionMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-700 mb-2 font-poppins">Vision</h2>
              <SupportingText className=" leading-relaxed">
                To create a global student community where learning, collaboration, and meaningful connections thrive beyond classrooms. We envision a
                space where students can share knowledge, support each other, and make the most of their university life through engaging discussions,
                academic resources, and student-led initiatives.
              </SupportingText>
            </motion.div>
            <motion.hr
              className="border-neutral-300 mb-16"
              initial={{ opacity: 0, scaleX: 0 }}
              animate={isVisionMissionInView ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
            />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isVisionMissionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.8 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold text-neutral-700 mb-2 font-poppins">Mission</h2>
              <SupportingText className=" leading-relaxed">
                Our mission is to empower students by providing a dynamic space where they can learn, grow, and build lasting relationships. Whether
                you&apos;re looking for academic support, extracurricular engagement, or just a place to share your university experience, UniBuzz is
                here to make it happen.
              </SupportingText>
            </motion.div>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          ref={teamRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="py-16  text-center max-width-allowed mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
          >
            <h2 className="font-poppins md:text-4xl sm:text-3xl text-2xl font-bold text-neutral-700">Meet our team</h2>
            <p className="text-neutral-500 font-medium mt-4">The Unibuzz team is here to help you with your university life</p>
          </motion.div>
          <motion.div
            className="flex flex-wrap justify-center md:gap-16 sm:gap-10 gap-10 mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isTeamInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
          >
            {team?.map((member, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isTeamInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, ease: 'easeOut', delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={80}
                  height={80}
                  className="w-[80px] h-[80px] md:w-[80px] md:h-[80px]  md:min-h-[80px] object-cover rounded-full"
                />
                <h3 className="font-poppins mt-4 font-medium text-neutral-700">{member.name}</h3>
                <SupportingText>{member.role}</SupportingText>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Contact Cards Section */}
        <motion.section
          ref={contactRef}
          initial={{ opacity: 0, y: 50 }}
          animate={isContactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
          className="md:py-24 py-10 md:px-8 bg-white"
        >
          <div className="max-width-allowed mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-10">
            {/* Discord Community Card */}
            <motion.div
              className="bg-[#F9FAFB] py-10 md:px-16 sm:px-10 px-4 rounded-sm items-center flex flex-col gap-4"
              initial={{ opacity: 0, x: -30 }}
              animate={isContactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.4 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="flex justify-center">
                <div className="p-4 bg-[#F3F2FF] rounded-full">
                  <BsDiscord size={25} className="text-[#6744FF]" />
                </div>
              </div>
              <h3 className="font-poppins md:text-md text-sm text-center font-semibold text-neutral-700">Join our Discord Community</h3>
              <SupportingText className="sm:text-sm text-xs text-neutral-700  text-center">
                Keep up with the latest updates, send us your thoughts or personal feedback, and take part in the development process.
              </SupportingText>
              <Buttons onClick={() => window.open('https://discord.gg/FRbdHraQj3', '_blank')} variant="primary">
                Join Discord
              </Buttons>
            </motion.div>

            {/* Contact Support Card */}
            <motion.div
              className="bg-[#F9FAFB] py-10 md:px-16 sm:px-10 px-4 rounded-sm items-center flex flex-col gap-4"
              initial={{ opacity: 0, x: 30 }}
              animate={isContactInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
              whileHover={{ y: -5, transition: { duration: 0.3 } }}
            >
              <div className="flex justify-center">
                <div className="p-4 bg-[#F3F2FF] rounded-full">
                  <RiMessage2Fill size={25} className="text-[#6744FF]" />
                </div>
              </div>
              <h3 className="font-poppins md:text-md text-sm font-semibold text-neutral-700 text-center">Send us Feedback</h3>
              <SupportingText className="sm:text-sm text-xs text-neutral-700  text-center">
                Do you have any issues while using Unibuzz? Contact us through the feedback form and we will get back to you ASAP.
              </SupportingText>
              <Buttons onClick={() => router.push('/contact')} variant="primary">
                Contact Support
              </Buttons>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  )
}

export default AboutClient
