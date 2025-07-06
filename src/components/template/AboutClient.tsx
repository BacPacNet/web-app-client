'use client'

import Image from 'next/image'
import useDeviceType from '@/hooks/useDeviceType'
import Buttons from '@/components/atoms/Buttons'
import SupportingText from '@/components/atoms/SupportingText'
import { BsDiscord } from 'react-icons/bs'
import { RiMessage2Fill } from 'react-icons/ri'
import image1 from '@assets/image1.svg'
import image2 from '@assets/image2.svg'
import image3 from '@assets/image3.svg'
import image4 from '@assets/image4.svg'
import bannerImage from '@assets/heroTabletBanner.svg'

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
    name: 'Aamil',
    role: 'Full-Stack Engineer',
    image: 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/aamil.png',
  },
]

const AboutClient = () => {
  const { isMobile, isTablet, isDesktop } = useDeviceType()
  return (
    <>
      <div className=" md:pt-32 pt-16 ">
        <main className="flex flex-col items-center justify-center md:gap-28 gap-16">
          {/* JOin UNiversity Section */}
          <section className="lg:px-0 sm:px-8 px-4 flex md:flex-row flex-col justify-between items-center gap-20 w-full max-width-allowed">
            <div className="md:max-w-xl md:text-left text-center">
              <h3 className=" text-primary-500 font-semibold uppercase font-poppins">Join Your University Community</h3>
              <h1 className="md:text-4xl sm:text-3xl text-2xl text-neutral-700 font-bold mt-3 font-poppins">All-in-one university network</h1>
              <SupportingText className="mt-6">The premier social network platform made entirely for university students and faculty.</SupportingText>
            </div>
            <Image src={bannerImage} alt="Mobile UI" width={500} height={100} />
          </section>

          {/* Welcome Unibuzz Section */}
          <section className="lg:px-0 sm:px-8 px-4 flex lg:flex-row flex-col justify-between md:gap-20 gap-10 items-center w-full max-width-allowed">
            <Image src={image1} alt="Welcome Unibuzz" width={507} height={314} />
            <div className="max-w-xl lg:text-left text-center">
              <h1 className="font-poppins md:text-4xl sm:text-3xl text-2xl text-neutral-700 font-bold mt-3">Welcome to Unibuzz!</h1>
              <SupportingText className="mt-4">
                Welcome to Unibuzz, the global university network that caters to your university needs.
              </SupportingText>
            </div>
          </section>

          {/* Search University Section */}
          <section className="lg:px-0 sm:px-8 px-4 flex lg:flex-row flex-col-reverse justify-between md:gap-20 gap-10 items-center max-width-allowed space-x-4">
            <div className="lg:text-left text-center">
              <h1 className="font-poppins md:text-4xl sm:text-3xl text-2xl text-neutral-700 font-bold mt-3">First, search your university.</h1>
              <SupportingText className="mt-4">
                Find your university from our database and get ready to join the vibrant community within it!
              </SupportingText>
            </div>
            <Image src={image2} alt="Search University" width={549} height={220} />
          </section>

          {/* Join University Section */}
          <section className="lg:px-0 sm:px-8 px-4 flex lg:flex-row flex-col justify-between md:gap-20 gap-10 items-center max-width-allowed">
            <Image src={image3} alt="Join University" width={523} height={202} />
            <div className="lg:text-left text-center">
              <h1 className="font-poppins md:text-4xl sm:text-3xl text-2xl text-neutral-700 font-bold mt-3">Join your university community.</h1>
              <p className=" md:max-w-md max-w-2xl text-neutral-500 mt-4">
                Gain access to the university community to communicate with current, past, and future students!
              </p>
            </div>
          </section>

          {/* Enjoy Features Section */}
          <section className="lg:px-0 sm:px-8 px-4 flex lg:flex-row flex-col-reverse justify-between md:gap-20 gap-10 items-center max-width-allowed">
            <div className="lg:text-left text-center">
              <h1 className="font-poppins md:text-4xl sm:text-3xl text-2xl text-neutral-700 font-bold mt-3">Lastly, enjoy the features</h1>
              <p className=" md:max-w-md max-w-2xl text-neutral-500 mt-4">
                With a wide range of social networking features, messaging, and an AI powered assistant, we will make your university life a blast.
                Download our mobile app for syncing!
              </p>
            </div>
            <Image src={image4} alt="Join University" width={466} height={374} />
          </section>
        </main>

        {/* TEam section */}
        <section className="md:py-24 py-16  text-center max-width-allowed mx-auto">
          <h2 className="font-poppins md:text-4xl sm:text-3xl text-2xl font-bold text-neutral-700">Meet our team</h2>
          <p className="text-gray-500 font-medium mt-4">The Unibuzz team is here to help you with your university life</p>
          <div className="flex flex-wrap justify-center md:gap-24 sm:gap-20 gap-10 mt-8">
            {team.map((member, index) => (
              <div key={index} className="flex flex-col items-center">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={112}
                  height={112}
                  className="w-[112px] h-[112px] md:w-[112px] md:h-[112px]  md:min-h-[112px] object-cover rounded-full"
                />
                <h3 className="font-poppins mt-4 font-medium text-neutral-700">{member.name}</h3>
                <p className="text-sm text-neutral-500">{member.role}</p>
              </div>
            ))}
          </div>
        </section>
        {/* Bottom contact cards */}
        <section className="md:py-24 py-10 md:px-8 bg-white">
          <div className="max-width-allowed mx-auto grid grid-cols-1 md:grid-cols-2 md:gap-6 gap-10">
            {/* Discord Community Card */}
            <div className="bg-[#F9FAFB] py-10 md:px-16 sm:px-10 px-6 rounded-sm items-center flex flex-col gap-4">
              <div className="flex justify-center">
                <div className="p-4 bg-[#F3F2FF] rounded-full">
                  <BsDiscord size={25} className="text-[#6744FF]" />
                </div>
              </div>
              <h3 className="font-poppins md:text-md text-sm text-center font-semibold text-neutral-700">Join our Discord Community</h3>
              <p className="sm:text-sm text-xs text-neutral-700  text-center">
                Keep up with the latest updates, send us your thoughts or personal feedback, and take part in the development process.
              </p>
              <Buttons variant="primary">Join Discord</Buttons>
            </div>

            {/* Contact Support Card */}
            <div className="bg-[#F9FAFB] py-10 md:px-16 sm:px-10 px-6 rounded-sm items-center flex flex-col gap-4">
              <div className="flex justify-center">
                <div className="p-4 bg-[#F3F2FF] rounded-full">
                  <RiMessage2Fill size={25} className="text-[#6744FF]" />
                </div>
              </div>
              <h3 className="font-poppins md:text-md text-sm font-semibold text-neutral-700 text-center">Contact customer support</h3>
              <p className="sm:text-sm text-xs text-neutral-700  text-center">
                Do you have any issues while using Unibuzz? Contact us through customer support and we will get back to you asap.
              </p>
              <Buttons variant="primary">Contact Support</Buttons>
            </div>
          </div>
        </section>
        {/* Team section */}
      </div>
    </>
  )
}

export default AboutClient
