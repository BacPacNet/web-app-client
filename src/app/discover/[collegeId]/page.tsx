import React from 'react'
import { MdOutlineHome, MdNavigateNext } from 'react-icons/md'
import { FaCircleInfo } from 'react-icons/fa6'
import Image from 'next/image'
import Reviews from '@/components/Reviews/page'
import StarsRating from '@/components/Stars/page'
import ContactCard from '@/components/ContactCard/page'

export default function CollegeDiscovery() {
  const college = {
    name: 'Nagoya University',
    img: '/demo_cd/img.png',
    logo: '/demo_cd/logo.png',
    contact: {
      link: 'https://en.nagoya-u.ac.jp/index.html',
      officeHours: 'Monday to Friday 9:00 am - 12:00 p.m. and 1:00 p.m - 5:00 p.m',
      email: 'apply@g30.nagoya-u.ac.jp',
      phone: 'TEL:+81-52-747-6556',
      fax: 'TEL:+81-52-747-6556 ',
      location: 'Furo-cho, Chikusa-ku, Nagoya, 464-8601, Japan',
    },
    para1: `Nagoya University(名古屋大学,Nagoya daigaku), abbreviated toMeidai(名大)orNU, is aJapanese Research University located in Chikusa-ku,
    Japan. Nagoya University, since its foundation in 1939, is one of seven imperial universities which has developed into one of the
    nation’s leading universities. This success is attributed to the liberal and vibrant character of Nagoya University which encourages
    education and research that is free from traditional and rigid thinking.`,
    para2: ` Nagoya University is one of the top ranked universities in Japan. Here, students and scholars work together, engage in top-notch
    research to pursue scientific discoveries and invent new state-of-the-art technologies. Six Nobel Prizes have been awarded to scholars
    associated with Nagoya University.`,
    para3: ` Today, Nagoya University is internationalizing the campus and promoting diversity. For more than a decade, we have offered
    English-taught programs as an essential part of our mission. Just before the COVID-19 pandemic, the number of international students
    reached almost 3,000. Students came from over 100 countries and regions. Although the number of students dropped because of the
    pandemic, the number of applicants for the Global 30 international Programs hit a record high in 2021. We continue to promote
    internationalization.`,
  }

  return (
    <div>
      <div className="w-screen min-h-screen bg-white text-black">
        <div className="px-8 lg:px-28 py-8 flex items-center gap-1  text-base font-medium text-right text-gray">
          <MdOutlineHome size={30} className="text-lg " />
          <MdNavigateNext className="text-lg" />
          <span className="text-lg ">Discover</span>
          <MdNavigateNext className="text-lg" />
          <span className="text-lg text-purple-600">{college.name}</span>
        </div>
        <div style={{ height: '500px', overflow: 'hidden' }}>
          <Image src={college.img} alt="" width={1440} height={500} />
        </div>
        <div className="px-8 lg:px-28 grid grid-cols-1 md:grid-cols-2 justify-center md:justify-between py-10">
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
        <div className=" px-8 md:px-28 flex flex-col justify-between py-10 gap-16">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="flex flex-col items-center justify-center mb-8">
              <span className="font-bold ">{college.name}</span>
              <span className="text-gray">UniBuzz Stats</span>
            </div>
            <span className="px-10 lg:px-44 gap-4">
              <ul className="grid grid-cols-2 md:grid-cols-4  gap-4 align-center justify-center ">
                <li className="flex flex-col items-center justify-center">
                  <span>
                    <Image src="/demo_cd/1.png" alt="" width={100} height={100} />{' '}
                  </span>
                  <span className="flex flex-row items-center gap-2.5">
                    <div className="font-bold text-3xl">30k</div>
                    <div className="text-center text-gray w-10">Total Students</div>
                  </span>
                </li>
                <li className="flex flex-col items-center justify-center">
                  <span>
                    <Image src="/demo_cd/2.png" alt="" width={100} height={100} />{' '}
                  </span>
                  <span className="flex flex-row items-center gap-2.5 text-primary">
                    <div className="font-bold text-3xl">320</div>
                    <div className="text-center text-gray w-15">Students on Unibuzz</div>
                  </span>
                </li>
                <li className="flex flex-col items-center justify-center">
                  <span>
                    <Image src="/demo_cd/3.png" alt="" width={100} height={100} />{' '}
                  </span>
                  <span className="flex flex-row items-center gap-2.5">
                    <div className="font-bold text-3xl">5k</div>
                    <div className="text-center text-gray w-15">Total Faculty</div>
                  </span>
                </li>
                <li className="flex flex-col items-center justify-center">
                  <span>
                    <Image src="/demo_cd/4.png" alt="" width={100} height={100} />{' '}
                  </span>
                  <span className="flex flex-row items-center gap-2.5 text-primary">
                    <div className="font-bold text-3xl">50</div>
                    <div className="text-center text-gray w-15">Faculty on UniBuzz</div>
                  </span>
                </li>
              </ul>
            </span>
          </div>
          <div className="flex flex-col gap-5">
            <span className="font-bold ">Overview</span>
            <span>
              <p className="py-3">{college.para1}</p>
              <p className="py-3">{college.para2}</p>
              <p className="py-3">{college.para3}</p>
            </span>
            <span className="text-primary">Read Less</span>
          </div>
          <div className="flex flex-col gap-5">
            <span className="flex flex-row gap-1 items-center font-bold">
              Contact info <FaCircleInfo />{' '}
            </span>
            <ContactCard contactInfo={college.contact} />
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
    </div>
  )
}
