import React from 'react'
import downloadImage from '@assets/downloadApp/downloadapp.svg'
import Image from 'next/image'
import GoogleStoreSvg from '@assets/downloadApp/googleStore.svg'
import AppleStoreSvg from '@assets/downloadApp/appleStore.svg'
import Link from 'next/link'

const DownloadApp = () => {
  return (
    <div className="flex flex-col gap-4 mb-8">
      <p className="text-xs text-neutral-500 font-bold  py-2 pb-0 uppercase">important updates</p>
      <Image src={downloadImage} alt="download" height={104} className="w-full " />
      <p className="text-xs text-neutral-800     ">
        Download our app today and experience seamless access to all of our features. Available now on iOS and Android.
      </p>
      <div className="flex gap-2 items-center justify-between  w-full">
        <Link href="https://play.google.com/store/apps/details?id=com.unibuzzapp&hl=en-US" rel="noopener noreferrer" target="_blank">
          <Image src={GoogleStoreSvg} alt="download" className="w-auto h-[35px] cursor-pointer" />
        </Link>
        <Link href="https://apps.apple.com/us/app/unibuzz-app/id6751199821" rel="noopener noreferrer" target="_blank">
          <Image src={AppleStoreSvg} alt="download" className="w-auto h-[35px] cursor-pointer" />
        </Link>
      </div>
    </div>
  )
}

export default DownloadApp
