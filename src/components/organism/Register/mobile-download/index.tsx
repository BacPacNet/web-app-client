'use client'
import Card from '@/components/atoms/Card'
import React, { useEffect } from 'react'
import Image from 'next/image'
import GoogleStoreSvg from '@/assets/downloadApp/googleStore.svg'
import AppleStoreSvg from '@/assets/downloadApp/appleStore.svg'
import RightSideSvg from '@/assets/downloadApp/download-right-side.svg'
import RightSideMobileSvg from '@/assets/downloadApp/mobile-app-small.svg'
import { FaSquareCheck } from 'react-icons/fa6'
import Buttons from '@/components/atoms/Buttons'
import { useHandleLogin } from '@/services/auth'
import useCookie from '@/hooks/useCookie'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/atoms/spinner'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { TRACK_EVENT } from '@/content/constant'
import { trackEvent } from '@/mixpanel/track'
const MobileAppDownload = () => {
  const router = useRouter()
  const [cookieLoginValue] = useCookie('login_data')
  const { mutate: login, isPending, isSuccess } = useHandleLogin()

  const features = ['Access all features on the go', 'Sync seamlessly across devices', 'Push notifications for real-time updates']

  const handleLogin = () => {
    if (cookieLoginValue) {
      login(JSON.parse(cookieLoginValue), {
        onSuccess: () => {
          router.push('/timeline')
        },
      })
    } else {
      toast.error('Please login to continue')
    }
  }

  useEffect(() => {
    if (cookieLoginValue) {
      const loginData = JSON.parse(cookieLoginValue)
      if (loginData) {
        trackEvent(TRACK_EVENT.REGISTRATION_COMPLETE, {
          email: loginData?.email,
        })
      }
    }
  }, [cookieLoginValue])

  return (
    <div className="md:h-with-navbar flex   bg-neutral-100 flex-col items-center justify-center px-8 ">
      <Card className="rounded-lg  md:overflow-hidden flex flex-col-reverse  md:flex-row gap-8 pt-12 pb-12  md:p-12 ">
        <div className="flex justify-center items-center px-8 md:px-0">
          <div className="max-w-[462px] flex flex-col gap-8">
            <div className="flex flex-col gap-4 md:gap-8">
              <h1 className="text-[#18191A] text-md-big md:text-xl font-poppins font-extrabold">Get Our Mobile App</h1>
              <p className="text-xs md:text-sm text-neutral-700">
                Download our app today and experience seamless access to all of our features. Available now on iOS and Android.
              </p>
            </div>
            <div className="flex gap-4">
              <Link href="https://play.google.com/store/apps/details?id=com.unibuzzapp&hl=en-US" rel="noopener noreferrer" target="_blank">
                <Image src={GoogleStoreSvg} alt="Download on Google Play" className="w-[135px] h-[40px] md:w-[150px] md:h-[50px]" />
              </Link>
              <Link href="https://apps.apple.com/us/app/unibuzz-app/id6751199821" rel="noopener noreferrer" target="_blank">
                <Image src={AppleStoreSvg} alt="Download on App Store" className="w-[135px] h-[40px] md:w-[150px] md:h-[50px]" />
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <FaSquareCheck className="text-primary-500 text-[20px] md:text-[21px]" />
                  <p className="text-[#18191A] text-xs md:text-sm ">{feature}</p>
                </div>
              ))}
            </div>
            <Buttons onClick={handleLogin} variant="border" disabled={isPending} className="text-neutral-700" size="large">
              {isPending ? <Spinner /> : 'Continue with browser'}
            </Buttons>
          </div>
        </div>
        {/* right side  */}
        <div className="md:block hidden">
          <Image src={RightSideSvg} alt="Download on App Store" width={230} height={500} />
        </div>
        <div className="block md:hidden ">
          <Image src={RightSideMobileSvg} alt="Download on App Store" className="w-full" height={180} />
        </div>
      </Card>
    </div>
  )
}

export default MobileAppDownload
