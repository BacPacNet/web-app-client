'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import facultyHero from '@assets/facultyLanding/facultyhero-1.svg'
import Buttons from '@/components/atoms/Buttons'
import { HiArrowRight, HiCheck, HiOutlinePlayCircle } from 'react-icons/hi2'
import { IoClose } from 'react-icons/io5'

const heroFeatures = ['Institution-controlled', 'Role-based verified access', 'Built for campus engagement'] as const
const HOW_IT_WORKS_VIDEO_ID = '20DexMA35Ng'

export default function FacultyLandingPageHero() {
  const router = useRouter()
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  useEffect(() => {
    if (!isVideoOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsVideoOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isVideoOpen])

  return (
    <>
      <section className="mx-auto px-4 py-10 sm:py-16 lg:py-20 max-width-allowed">
        <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-10 lg:gap-8">
          <div className="w-full lg:w-[487px] flex flex-col items-center lg:items-start gap-6 text-center lg:text-left">
            <h1 className="font-poppins font-extrabold text-lg-small lg:text-[38px] text-[#131A2B] leading-[1.1] tracking-[-1.5px]">
              <span className="text-primary-500">All in One</span> Campus <br />
              Communication and <br />
              Student Acquisition
            </h1>

            <p className="text-[#5B6477] lg:text-neutral-900 font-inter text-sm sm:text-2sm leading-relaxed max-w-xl">
              Centralize official communication, student groups, clubs, placements, events, and campus engagement. Showcase your university by letting
              applicants digitally explore your campus, facilities, programmes, and student life, all in one place.
            </p>

            <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-auto">
              <Buttons type="button" variant="primary" size="medium" className="w-full lg:w-auto gap-2" onClick={() => router.push('/book-demo')}>
                Book a Demo <HiArrowRight className="w-4 h-4" />
              </Buttons>
              <Buttons
                type="button"
                variant="border"
                size="medium"
                className="w-full lg:w-auto"
                onClick={() => setIsVideoOpen(true)}
                leftIcon={<HiOutlinePlayCircle className="w-[18px] h-[18px]" />}
              >
                See How It Works
              </Buttons>
            </div>

            <div className="flex flex-col items-center lg:items-start gap-3 mt-2.5">
              {heroFeatures.map((label) => (
                <div key={label} className="flex items-center gap-2.5 text-xs font-medium font-inter text-[#5B6477]">
                  <HiCheck className="shrink-0 text-[#1F9D57] w-4 h-4" aria-hidden />
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center">
            <Image
              src={facultyHero}
              alt="Unibuzz campus communication platform on desktop and mobile"
              width={675}
              height={600}
              priority
              className="w-full h-auto lg:h-[600px] max-w-[675px] object-contain"
            />
          </div>
        </div>
      </section>

      {isVideoOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="See How It Works video"
        >
          <button type="button" className="absolute inset-0 bg-black/70" aria-label="Close video" onClick={() => setIsVideoOpen(false)} />
          <div className="relative z-10 w-full max-w-4xl">
            <button
              type="button"
              onClick={() => setIsVideoOpen(false)}
              className="absolute -top-10 right-0 sm:-right-2 rounded-md p-2 text-white hover:bg-white/10"
              aria-label="Close video"
            >
              <IoClose size={28} />
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
              <iframe
                src={`https://www.youtube.com/embed/${HOW_IT_WORKS_VIDEO_ID}?autoplay=1&rel=0`}
                title="See How It Works"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
