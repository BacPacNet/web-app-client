'use client'

import './Section2.css'
import 'aos/dist/aos.css'

import { useRef } from 'react'

//import AOS from 'aos'
import Image from 'next/image'
//import { TypeAnimation } from 'react-type-animation'
import Institution from '../../../assets/institution.png'
import sectionNumber from '../../../assets/Number2.png'
import UnibuzzStudent from '../../../assets/unibuzz-student.png'
import BackgroundImg from '../../../assets/section2bg.png'

const Section2: React.FC = () => {
  //  const [typingStart, setTypingStart] = useState<boolean>(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  //  useEffect(() => {
  //    AOS.init({ duration: 300 })
  //    const observer = new IntersectionObserver((entries) => {
  //      entries.forEach((entry) => {
  //        if (entry.isIntersecting) {
  //          setTypingStart(true)
  //        } else {
  //          setTypingStart(false)
  //        }
  //      })
  //    })

  //    // Observe the section
  //    if (sectionRef.current) {
  //      observer.observe(sectionRef.current)
  //    }

  //    // Clean up the observer
  //    return () => {
  //      if (sectionRef.current) {
  //        observer.unobserve(sectionRef.current)
  //      }
  //    }
  //  }, [])

  return (
    <div className="bg-white flex flex-col items-center px-4 md:px-6 lg:px-12 my-16 md:my-32 lg:my-50" ref={sectionRef}>
      <div className="flex justify-center flex-col items-center my-12">
        <Image src={sectionNumber} alt="1" className=" w-14 h-10" />
        <h3 className="font-inter font-extrabold text-4xl leading-12 tracking-tight text-center text-[#171717] py-4">Join your institute</h3>
      </div>
      <div className="flex flex-col items-center lg:items-start lg:flex-row gap-8 lg:gap-[4.25rem]">
        <div className="relative w-full lg:w-1/2 flex justify-center lg:justify-end">
          <Image src={Institution} alt="l" className="object-cover" />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col gap-4 items-center lg:items-start">
          <div className="h1 text-4xl font-extrabold">One click to join</div>
          <div className="desc text-center lg:text-left px-4  w-full lg:w-3/4">
            After searching for the institution you&apos;re interested in, click &apos;Join&apos; to become part of the university&apos;s group. This
            grants you access to the university page and its full range of features. Join now to seamlessly explore and engage with the university
            community.
          </div>
        </div>
      </div>

      <div className="w-full my-32 flex flex-col items-center gap-[1.5rem] relative">
        <Image src={BackgroundImg} alt="Unibuzz College" className="absolute" />

        <div>
          <Image src={UnibuzzStudent} alt="Unibuzz College" className="object-cover relative" />
        </div>
        <div className="flex flex-col gap-[1.5rem] items-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900">Connect, Collaborate, and Elevate</h2>
          <p className="text-gray-dark text-3xl text-center md:text-4xl">Enhanced Academic Communication with Unibuzz</p>
        </div>
      </div>

      {/*<div className="college-info flex flex-col items-center relative">
        <div className="h2">
          {typingStart && (
            <TypeAnimation
              style={{ whiteSpace: 'pre-line', display: 'block' }}
              className="typing-effect hp1"
              cursor={false}
              sequence={[1000, 'Connect, Collaborate, and Elevate']}
              speed={60}
              repeat={0}
            />
          )}
          <p className="hp2">Enhanced Academic Communication with Unibuzz</p>
        </div>
        <div className="college-pic mt-6 flex flex-col items-center">
          <Image src={banner} alt="Unibuzz College" className="pic-1" />
          <Image src={users} alt="users" className="pic-2" />
        </div>
      </div>*/}
    </div>
  )
}

export default Section2
