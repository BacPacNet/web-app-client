import React from 'react'

const ComingSoon = () => {
  return (
    <div className='bg-white h-screen flex flex-col sm:flex-row justify-center sm:justify-end items-center'>
      <img src="/mobile.png" alt="" className='sm:hidden h-[464px] pb-11'/>
      <div className='w-full sm:pl-16 lg:pl-28 max-sm:flex max-sm:flex-col max-sm: items-center max-sm:px-4 max-sm:text-center'>
        <p className='font-semibold text-sm text-[#6B7280] pb-1'>UNIVERSITY LIFE BEGINS HERE</p>
        <h1 className='text-[#111827] text-4xl lg:text-5xl font-bold mb-4'>The One Stop Solution</h1>
        <p className='text-lg text-[#404040] pb-[42px]'>Discover the platform that caters to your needs.</p>
        <p className='text-lg font-medium text-[#1E22FB]'>We will be there soon.</p>
      </div>
      <img src="/laptop.png" alt="" className='hidden sm:block lg:h-[504px] h-80'/>
    </div>
  )
}

export default ComingSoon