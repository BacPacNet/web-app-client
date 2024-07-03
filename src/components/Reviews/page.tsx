import React from 'react'
import Image from 'next/image'
import { RiArrowDropDownLine } from 'react-icons/ri'
const Reviews = () => {
  return (
    <div>
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
          Studying in Nagoya is one of the best hcances I have ever had. I got the chance to live in a new environment with people from different
          countries. The biggest challege for me when I came to NU was learning a Japanese language... To compete with international minds in a
          foreign language was and still is pretty tough...
        </span>
        <span className=" flex flex-row gap-1 justify-end items-center text-right text-primary">
          <span>Read More</span> <RiArrowDropDownLine color="black" size={20} />{' '}
        </span>
      </div>
      <div className="flex flex-col gap-4 text-gray-dark">
        <span className="flex flex-row gap-2">
          <div>
            <Image
              src="https://github.com/BacPacNet/web-app-client/blob/BI-64_college_discovery_page/public/demo_cd/Avatars.png?raw=true'"
              alt="avatar"
              width={50}
              height={50}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold">Kathryn Murphy </span>
            <span>Nagoya University</span>
            <span>3rd Yr. Undergraduate</span>
          </div>
        </span>
        <span>Reviewer’s Rating: 8/10</span>
        <span>
          Studying in Nagoya is one of the best hcances I have ever had. I got the chance to live in a new environment with people from different
          countries. The biggest challege for me when I came to NU was learning a Japanese language... To compete with international minds in a
          foreign language was and still is pretty tough...
        </span>
        <span className=" flex flex-row gap-1 justify-end items-center text-right text-primary">
          <span>Read More</span> <RiArrowDropDownLine color="black" size={20} />{' '}
        </span>
      </div>
    </div>
  )
}

export default Reviews
