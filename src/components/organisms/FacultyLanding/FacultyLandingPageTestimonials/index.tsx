'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeader from '@/components/atoms/SectionHeader'

const testimonials = [
  {
    quote:
      '“One of the key challenges we encountered was that details about student clubs, activities, and campus events were scattered across various platforms. As a result, many students were unaware of the opportunities available to them and often missed chances to participate. Unibuzz has helped solve this issue by creating a single space where students can easily find clubs, join communities, keep track of upcoming events, and take a more active role in campus life.”',
    author: 'Dr. Abhas Kanungo, Assistant Dean SW',
    role: 'KIET Group of Institutions',
    logo: 'https://unibuzz.org/_next/image?url=https%3A%2F%2Funibuzz-uploads-prod.s3.ap-south-1.amazonaws.com%2Funiversity%2FKIET%2BLogo.jpg&w=1920&q=75',
  },
  {
    quote:
      '“Based on my experience while working on the platform, I believe that Unibuzz will facilitate the interaction among the students. What I particularly love about Unibuzz is the ability of students to connect with seniors regarding projects, guidance, etc. without revealing their contact information. Group chats provide a good opportunity to meet like-minded people and get updated about the campus happenings.”',
    author: 'Reyansh Singh',
    role: 'KIET Group of Institutions',
    logo: 'https://unibuzz.org/_next/image?url=https%3A%2F%2Funibuzz-uploads-prod.s3.ap-south-1.amazonaws.com%2Funiversity%2FKIET%2BLogo.jpg&w=1920&q=75',
  },
  {
    quote:
      '“UniBuzz is a promising initiative that can enhance student engagement, communication, and campus participation.I appreciate the efforts being made to create a more interactive and student-centric college ecosystem, and I wish UniBuzz continued success in supporting higher education communities”',
    author: 'Dr. Sachin Garg',
    role: 'Aggarwal College, Ballabhgarh',
    logo: 'https://unibuzz.org/_next/image?url=https%3A%2F%2Funibuzz-uploads.s3.ap-south-1.amazonaws.com%2Fuploads%2Ftimeline%2F68e8e63d799d9b0a2790f8da%2Fagg_col_bal-526c893a-faf6-46c2-8b0e-aeef2afda164.jpeg&w=1920&q=75',
  },
]

export default function FacultyLandingPageTestimonials() {
  const [testimonialIndex, setTestimonialIndex] = useState(0)
  const current = testimonials[testimonialIndex]

  const handleNext = () => {
    setTestimonialIndex((prev) => (prev + 1) % testimonials.length)
  }

  const handlePrev = () => {
    setTestimonialIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-[100px] px-4" id="testimonials">
      <div className="mx-auto w-full max-width-allowed">
        <SectionHeader
          badge="Testimonials"
          badgeVariant="indigo"
          maxWidth="full-width"
          title={
            <>
              Trusted by <span className="text-primary-500">universities,</span>
              <br />
              loved by <span className="text-primary-500">students</span>
            </>
          }
          align="center"
        />
        <div className=" mt-8 relative mx-auto flex flex-col items-center justify-center max-w-[800px] min-h-[405px] rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg ">
          <blockquote className="mb-6 max-w-xl font-inter text-2sm  text-neutral-900 mx-auto">{current.quote}</blockquote>
          <div className="flex flex-col items-center gap-3">
            <Image src={current.logo} alt="Partner logo" width={84} height={84} className="mx-auto  h-[84px] w-[84px] rounded-full object-contain" />
            <div className="flex flex-col items-center gap-1">
              <p className="font-inter text-xs font-medium text-neutral-900">{current.author}</p>
              <p className="font-inter text-xs text-neutral-500">{current.role}</p>
            </div>
          </div>

          <div className="mt-[30px] flex justify-center gap-5 lg:absolute lg:left-[-80px] lg:right-[-80px] lg:top-1/2 lg:mt-0 lg:justify-between lg:-translate-y-1/2">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1e1b4b] shadow-sm transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="Next testimonial"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200 bg-white text-[#1e1b4b] shadow-sm transition-all duration-200 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
