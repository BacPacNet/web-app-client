import React, { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'

const CommunityProfileAccesibility = () => {
  const [currFontSize, setCurrFontSize] = useState(1)
  return (
    <div className="py-10 px-12 flex flex-col gap-16">
      {/* Language  */}
      <div className="flex justify-between text-black ">
        <div className="flex flex-col gap-2 max-w-md">
          <h6 className="font-bold text-lg">Language</h6>
          <label className="font-medium ">Select the language you’d like to experience the unibuzz interface in.</label>
          <label className="text-[#6647FF] flex gap-2 items-center">
            English (US) <IoIosArrowDown />
          </label>
        </div>
      </div>

      {/* Theme  */}
      <div className="flex justify-between text-black ">
        <div className="flex flex-col gap-2 max-w-md">
          <h6 className="font-bold text-lg">Theme</h6>
          <div className="flex gap-4">
            <div className="inline-flex items-center ">
              <div className="relative inline-block w-8 h-4 rounded-full cursor-pointer">
                <input
                  defaultChecked
                  id="switch-1"
                  type="checkbox"
                  className="absolute w-8 h-4 transition-colors duration-300 rounded-full appearance-none cursor-pointer peer bg-gray-dark checked:bg-blue-500 peer-checked:border-blue-500 peer-checked:before:bg-blue-500"
                />
                <label
                  htmlFor="switch-1"
                  className="before:content[''] absolute top-2/4 -left-1 h-5 w-5 -translate-y-2/4 cursor-pointer rounded-full border border-blue-gray-100 bg-white shadow-md transition-all duration-300 before:absolute before:top-2/4 before:left-2/4 before:block before:h-10 before:w-10 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity hover:before:opacity-10 peer-checked:translate-x-full peer-checked:border-blue-500 peer-checked:before:bg-blue-500"
                >
                  <div className="inline-block p-5 rounded-full top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4" data-ripple-dark="true"></div>
                </label>
              </div>
            </div>
            <div>
              <label className="font-medium ">Toggle Light/Dark Mode</label>
              <p>This will change the contrast of the site</p>
            </div>
          </div>
        </div>
      </div>
      {/* //size  */}
      <div className="flex flex-col gap-2 ">
        <h6 className="font-bold text-lg">Font Size</h6>
        <div className="">
          <ol className="flex justify-center items-center">
            <p className="font-medium pt-4"> Aa</p>
            <li
              onClick={() => setCurrFontSize(1)}
              className="relative w-[150px] text-center text-sm font-light italic
                after:content-[''] after:absolute after:left-[50%] after:top-[200%] after:w-5 after:h-5 
                after:bg-black after:rounded-full after:z-50
                "
            ></li>
            <li
              onClick={() => setCurrFontSize(2)}
              className={`relative w-[150px] text-center text-sm font-light italic
            before:content-[''] before:absolute before:left-[-50%] before:top-[calc(200%+0.5rem)] before:w-full before:h-1 
            ${currFontSize >= 2 ? 'before:bg-black  after:bg-black' : 'before:bg-neutral-500  after:bg-neutral-500'}
            
            after:content-[''] after:absolute after:left-[50%] after:top-[200%] after:w-5 after:h-5 
            after:rounded-full after:z-50
  `}
            ></li>

            <li
              onClick={() => setCurrFontSize(3)}
              className={`relative w-[150px] text-center text-sm font-light italic
            before:content-[''] before:absolute before:left-[-50%] before:top-[calc(200%+0.5rem)] before:w-full before:h-1 
            ${currFontSize >= 3 ? 'before:bg-black  after:bg-black' : 'before:bg-neutral-500  after:bg-neutral-500'}
            after:content-[''] after:absolute after:left-[50%] after:top-[200%] after:w-5 after:h-5 
             after:rounded-full after:z-50
                `}
            ></li>
            <li
              onClick={() => setCurrFontSize(4)}
              className={`relative w-[150px] text-center text-sm font-light italic
            before:content-[''] before:absolute before:left-[-50%] before:top-[calc(200%+0.5rem)] before:w-full before:h-1 
            ${currFontSize >= 4 ? 'before:bg-black  after:bg-black' : 'before:bg-neutral-500  after:bg-neutral-500'}
            after:content-[''] after:absolute after:left-[50%] after:top-[200%] after:w-5 after:h-5 
            after:rounded-full after:z-50
                `}
            ></li>
            <li
              onClick={() => setCurrFontSize(5)}
              className={`relative w-[150px] text-center text-sm font-light italic
            before:content-[''] before:absolute before:left-[-50%] before:top-[calc(200%+0.5rem)] before:w-full before:h-1 
            ${currFontSize >= 5 ? 'before:bg-black  after:bg-black' : 'before:bg-neutral-500  after:bg-neutral-500'}
            after:content-[''] after:absolute after:left-[50%] after:top-[200%] after:w-5 after:h-5 
             after:rounded-full after:z-50
                `}
            ></li>
            <p className="font-medium pt-4 text-2xl ps-4"> Aa</p>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default CommunityProfileAccesibility
