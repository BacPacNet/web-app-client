import React from 'react'
import chatboticon from '@/assets/chatboticon.png'

const HeroSec = () => {
  return (
    <div className=" w-10/12 max-xl:w-11/12 max-md:w-9/12 max-sm:w-11/12 overflow-hidden border-2 border-neutral-300 rounded-lg pb-10">
      {/* top section  */}
      <div className="h-96 max-md:h-[28rem] relative flex max-md:flex-col justify-between max-md:justify-end items-end max-md:items-center ">
        <img
          className="absolute bottom-20 -z-10 object-cover w-full h-full max-md:bottom-52"
          src="https://upload.wikimedia.org/wikipedia/commons/4/40/Nagoya_University_Hospital.jpg"
          alt="bg"
        />
        <div className="flex gap-6 ps-10 max-xl:ps-5 max-md:hidden">
          <div className="flex flex-col items-center max-lg:text-sm">
            <h6 className="font-extrabold">1200</h6>
            <label className="text-neutral-500 font-medium">Total Users </label>
          </div>
          <div className="flex flex-col items-center max-lg:text-sm">
            <h6 className="font-extrabold">1100</h6>
            <label className="text-neutral-500 font-medium">Students</label>
          </div>
          <div className="flex flex-col items-center max-lg:text-sm">
            <h6 className="font-extrabold">100</h6>
            <label className="text-neutral-500 font-medium">Faculty</label>
          </div>
        </div>
        <div className="flex flex-col items-center max-md:gap-2 ">
          <img
            className="w-28 h-28 object-contain border-4 border-neutral-300 rounded-full bg-white"
            src="https://upload.wikimedia.org/wikipedia/en/3/3e/Nagoya_University_logo.svg"
            alt="dp"
          />
          <h5 className="font-semibold text-neutral-900 text-lg text-center max-lg:text-sm max-md:text-lg">Nagoya University</h5>
        </div>
        <div className="flex gap-6 max-md:flex-col-reverse max-md:items-center max-md:pt-3 ">
          <div className="flex flex-col items-center">
            <img className="object-contain" src={chatboticon.src} alt="chatboticon" />
            <label className="text-neutral-500 font-medium max-lg:text-sm">Chatbot Support</label>
          </div>
          <button className="text-[#6647FF]  font-medium bg-[#F3F2FF] px-2 py-1 max-md:py-3 rounded-xl mr-10 max-xl:mr-5 max-lg:text-sm max-md:mr-0">
            Join Community
          </button>
        </div>
      </div>
    </div>
  )
}

export default HeroSec
