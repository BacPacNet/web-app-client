'use client'
import React from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import Footer from '@/components/Footer/Footer'
import SectionFirst from '@/components/molecules/LandingPage/SectionFirst/Index'
import SectionTwo from '@/components/molecules/LandingPage/SectionTwo'
import SectionThree from '@/components/molecules/LandingPage/SectionThree'
import SectionFour from '@/components/molecules/LandingPage/SectionFour'
import SectionFive from '@/components/molecules/LandingPage/SectionFive'
import SectionSix from '@/components/molecules/LandingPage/SectionSix'
import FeaturesSection from '@/components/molecules/FeaturesSection'

export default function LandingPage() {
  const section1Ref = useRef(null)
  const section2Ref = useRef(null)
  const section3Ref = useRef(null)
  const section4Ref = useRef(null)
  const section5Ref = useRef(null)
  const featuresRef = useRef(null)
  const section6Ref = useRef(null)

  const isSection1InView = useInView(section1Ref, { once: true, margin: '-100px' })
  const isSection2InView = useInView(section2Ref, { once: true, margin: '-100px' })
  const isSection3InView = useInView(section3Ref, { once: true, margin: '-100px' })
  const isSection4InView = useInView(section4Ref, { once: true, margin: '-100px' })
  const isSection5InView = useInView(section5Ref, { once: true, margin: '-100px' })
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: '-100px' })
  const isSection6InView = useInView(section6Ref, { once: true, margin: '-100px' })

  return (
    <div className="bg-white mt-8 sm:mt-16">
      <div className="px-2 md:px-4 lg:max-width-allowed mx-auto">
        <motion.div
          ref={section1Ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isSection1InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <SectionFirst />
        </motion.div>

        <motion.div
          ref={section2Ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isSection2InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <SectionTwo />
        </motion.div>

        <motion.div
          ref={section3Ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isSection3InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <SectionThree />
        </motion.div>

        <motion.div
          ref={section4Ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isSection4InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <SectionFour />
        </motion.div>

        <motion.div
          ref={section5Ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isSection5InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
        >
          <SectionFive />
        </motion.div>
      </div>

      <motion.div
        ref={featuresRef}
        initial={{ opacity: 0, y: 50 }}
        animate={isFeaturesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
        <FeaturesSection title="Features made for everything university related." />
      </motion.div>

      <motion.div
        ref={section6Ref}
        initial={{ opacity: 0, y: 50 }}
        animate={isSection6InView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
        <SectionSix />
      </motion.div>

      <Footer />
    </div>
  )
}
