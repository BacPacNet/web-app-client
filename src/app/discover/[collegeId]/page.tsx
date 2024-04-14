import React from 'react'
import { MdOutlineHome, MdNavigateNext, MdEmail } from 'react-icons/md'
import { FaCircleInfo, FaStar, FaLink, FaClock } from 'react-icons/fa6'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { FaPhoneAlt } from 'react-icons/fa'
import { TiHome } from 'react-icons/ti'
import { HiMiniPrinter } from 'react-icons/hi2'
import Image from 'next/image'
export default function CollegeDiscovery() {
    return (
        <div>
            <div className="w-screen min-h-screen bg-white text-black">
                <div className="px-8 lg:px-28 py-8 flex items-center gap-1  text-base font-medium text-right text-gray">
                    <MdOutlineHome size={30} className="text-lg " />
                    <MdNavigateNext className="text-lg" />
                    <span className="text-lg ">Discover</span>
                    <MdNavigateNext className="text-lg" />
                    <span className="text-lg text-purple-600">Nagoya University</span>
                </div>

                <div style={{ height: '500px', overflow: 'hidden' }}>
                    <Image src="/demo_cd/img.png" alt="" width={1440} height={500} />
                </div>
                <div className="px-8 lg:px-28 grid grid-cols-1 md:grid-cols-2 justify-center md:justify-between py-10">
                    <div className="flex flex-row items-center">
                        <div className="mr-10">
                            <Image src="/demo_cd/logo.png" alt="" width={100} height={30} />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold">Nagoya University</span>
                            <span className="text-gray">Furo-cho, Chikusa-ku, Nagoya, 464-8601, Japan</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-center md:justify-end m-8 md:m-0">
                        <button className="p-5 rounded-lg bg-primary text-white">Join Community</button>
                    </div>
                </div>
                <div className=" px-8 md:px-28 flex flex-col justify-between py-10 gap-16">
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="flex flex-col items-center justify-center mb-8">
                            <span className="font-bold ">Nagoya University</span>
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
                            <p className="py-3">
                                Nagoya University(名古屋大学,Nagoya daigaku), abbreviated toMeidai(名大)orNU, is aJapanese Research University located in Chikusa-ku,
                                Japan. Nagoya University, since its foundation in 1939, is one of seven imperial universities which has developed into one of the
                                nation’s leading universities. This success is attributed to the liberal and vibrant character of Nagoya University which encourages
                                education and research that is free from traditional and rigid thinking.
                            </p>
                            <p className="py-3">
                                Nagoya University is one of the top ranked universities in Japan. Here, students and scholars work together, engage in top-notch
                                research to pursue scientific discoveries and invent new state-of-the-art technologies. Six Nobel Prizes have been awarded to scholars
                                associated with Nagoya University.
                            </p>
                            <p className="py-3">
                                Today, Nagoya University is internationalizing the campus and promoting diversity. For more than a decade, we have offered
                                English-taught programs as an essential part of our mission. Just before the COVID-19 pandemic, the number of international students
                                reached almost 3,000. Students came from over 100 countries and regions. Although the number of students dropped because of the
                                pandemic, the number of applicants for the Global 30 international Programs hit a record high in 2021. We continue to promote
                                internationalization.
                            </p>
                        </span>
                        <span className="text-primary">Read Less</span>
                    </div>
                    <div className="flex flex-col gap-5">
                        <span className="flex flex-row gap-1 items-center font-bold">
                            Contact info <FaCircleInfo />{' '}
                        </span>
                        <span className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-between">
                            <div className="border-2 border-gray rounded-lg p-2">
                                <ul className="flex flex-col gap-8">
                                    <li>
                                        <span className="flex felx-row items-center font-bold">
                                            <MdEmail className="mx-1" size={20} /> Email
                                        </span>
                                        <span className="text-gray">apply@g30.nagoya-u.ac.jp</span>
                                    </li>
                                    <li>
                                        <span className="flex felx-row items-center font-bold">
                                            <FaPhoneAlt className="mx-1" size={20} /> Phone
                                        </span>
                                        <span className="text-gray">TEL:+81-52-747-6556 </span>
                                    </li>
                                    <li>
                                        <span className="flex felx-row items-center font-bold">
                                            <HiMiniPrinter className="mx-1" size={20} /> Fax
                                        </span>
                                        <span className="text-gray">TEL:+81-52-747-6556 </span>
                                    </li>
                                </ul>
                            </div>
                            <div className="border-2 border-gray rounded-lg p-2">
                                <ul className="flex flex-col gap-8">
                                    <li>
                                        <span className="flex felx-row items-center font-bold">
                                            <FaLink className="mx-1" size={20} /> Link
                                        </span>
                                        <span className="text-gray">https://en.nagoya-u.ac.jp/index.html</span>
                                    </li>
                                    <li>
                                        <span className="flex felx-row items-center font-bold">
                                            <TiHome className="mx-1" size={20} /> Address
                                        </span>
                                        <span className="text-gray">Furo-cho, Chikusa-ku, Nagoya, 464-8601, Japan</span>
                                    </li>
                                    <li>
                                        <span className="flex felx-row items-center font-bold">
                                            <FaClock className="mx-1" size={20} /> Office Hours
                                        </span>
                                        <span className="text-gray">Monday to Friday 9:00 am - 12:00 p.m. and 1:00 p.m - 5:00 p.m</span>
                                    </li>
                                </ul>
                            </div>
                        </span>
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
                        <span className="flex flex-row justify-center items-center">
                            <ul className="flex flex-row gap-4">
                                <li>
                                    <FaStar size={20} color="orange" />
                                </li>
                                <li>
                                    <FaStar size={20} color="orange" />
                                </li>
                                <li>
                                    <FaStar size={20} color="orange" />
                                </li>
                                <li>
                                    <FaStar size={20} color="orange" />
                                </li>
                                <li>
                                    <FaStar size={20} color="orange" />
                                </li>
                                <li>
                                    <FaStar size={20} color="orange" />
                                </li>
                                <li>
                                    <FaStar size={20} color="orange" />
                                </li>
                                <li>
                                    <FaStar size={20} color="gray" />
                                </li>
                                <li>
                                    <FaStar size={20} color="gray" />
                                </li>
                                <li>
                                    <FaStar size={20} color="gray" />
                                </li>
                            </ul>
                        </span>
                        <span className="flex flex-row justify-center items-center text-gray">from 1000+ reviews</span>
                        <span className=" md:hidden flex-row justify-center items-center mx-auto">
                            <button className="bg-gray-light text-primary py-3 px-5 rounded-md">Add a review</button>
                        </span>
                    </div>
                    <div className="flex flex-col gap-4 md:gap-1">
                        <div className="flex flex-col gap-4 text-gray-dark">
                            <span className="flex flex-row gap-2">
                                <div>
                                    <Image src="/demo_cd/Avatars.png" alt="avatar" width={50} height={50} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold">Kathryn Murphy </span>
                                    <span>Nagoya University</span>
                                    <span>3rd Yr. Undergraduate</span>
                                </div>
                            </span>
                            <span>Reviewer’s Rating: 8/10</span>
                            <span>
                                Studying in Nagoya is one of the best hcances I have ever had. I got the chance to live in a new environment with people from
                                different countries. The biggest challege for me when I came to NU was learning a Japanese language... To compete with international
                                minds in a foreign language was and still is pretty tough...
                            </span>
                            <span className=" flex flex-row gap-1 justify-end items-center text-right text-primary">
                                <span>Read More</span> <RiArrowDropDownLine color="black" size={20} />{' '}
                            </span>
                        </div>
                        <div className="flex flex-col gap-4 text-gray-dark">
                            <span className="flex flex-row gap-2">
                                <div>
                                    <Image src="/demo_cd/Avatars.png" alt="avatar" width={50} height={50} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold">Kathryn Murphy </span>
                                    <span>Nagoya University</span>
                                    <span>3rd Yr. Undergraduate</span>
                                </div>
                            </span>
                            <span>Reviewer’s Rating: 8/10</span>
                            <span>
                                Studying in Nagoya is one of the best hcances I have ever had. I got the chance to live in a new environment with people from
                                different countries. The biggest challege for me when I came to NU was learning a Japanese language... To compete with international
                                minds in a foreign language was and still is pretty tough...
                            </span>
                            <span className=" flex flex-row gap-1 justify-end items-center text-right text-primary">
                                <span>Read More</span> <RiArrowDropDownLine color="black" size={20} />{' '}
                            </span>
                        </div>
                        <span className="bg-gray-light text-primary px-8 py-2.5 text-center my-8 mx-auto">Show More Reviews</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
