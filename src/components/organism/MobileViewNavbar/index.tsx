import { useUniStore } from '@/store/store'
import Image from 'next/image'
import { FaAngleDown, FaRegUser } from 'react-icons/fa'
import avatar from '@assets/avatar.svg'
import { RxCross2 } from 'react-icons/rx'
import Tooltip from '@/components/atoms/Tooltip'
import SubText from '@/components/atoms/SubText'
import { truncateString } from '@/lib/utils'
import { MdInfoOutline, MdOutlineLock, MdOutlineSettings } from 'react-icons/md'
import { PiChatTextBold, PiPaintBrushDuotone } from 'react-icons/pi'
import { TbLogout } from 'react-icons/tb'
import { usePathname, useRouter } from 'next/navigation'
import { useLogout } from '@/hooks/useLogOut'
import ProfilePicture from '@/components/atoms/RenderProfileDP'
import Link from 'next/link'

interface Props {
  closeLeftNavbar: () => void
  toggleRightMenu: () => void
  showRightMenu: boolean
}

export default function MobileViewNavbar({ closeLeftNavbar, toggleRightMenu, showRightMenu }: Props) {
  const router = useRouter()
  const { userProfileData, userData } = useUniStore()
  const { handleLogout } = useLogout()
  const pathname = usePathname()

  const handleProfileClicked = () => {
    router.push(`/profile/${userData?.id}`)
    toggleRightMenu()
  }
  const handleMenuClicked = (path: string) => {
    router.push(`/${path}`)
    toggleRightMenu()
  }

  const toggleMenu = () => {
    toggleRightMenu()
    closeLeftNavbar()
  }

  const handleLogoutClicked = () => {
    toggleRightMenu()
    handleLogout()
  }

  return (
    <div>
      <div className="lg:hidden flex gap-2 items-center cursor-pointer" onClick={toggleMenu}>
        <Image
          width={40}
          height={40}
          objectFit="cover"
          className="w-[24px] h-[24px] sm:w-[40px] sm:h-[40px] rounded-full object-cover"
          src={userProfileData?.profile_dp?.imageUrl || avatar}
          alt="profile.png"
        />
        <FaAngleDown />
      </div>

      {/* Sidebar Menu (Visible on mobile when open) */}
      {showRightMenu && <div onClick={toggleMenu} className=" lg:hidden w-screen h-screen bg-black opacity-70 absolute right-0 -z-10 "></div>}

      <div
        className={`fixed flex flex-col justify-between top-[40px] sm:top-[68px] right-0 py-6 px-4 h-full w-3/4 md:w-[284px] bg-white transition-transform duration-300 transform border-l-[1px] border-neutral-200 ${
          showRightMenu ? 'translate-x-0' : 'translate-x-full'
        } lg:hidden`}
      >
        <button onClick={toggleMenu} className="p-4 text-black focus:outline-none absolute right-0 -top-2">
          <RxCross2 size={24} className="text-primary" />
        </button>
        <div>
          <div onClick={handleProfileClicked} className=" flex gap-4 cursor-pointer">
            <ProfilePicture userProfileData={userProfileData} />
            <div className="flex flex-col gap-0">
              <p className="text-2xs text-neutral-700 font-semibold ">
                {userData?.firstName} {userData?.lastName}
              </p>

              <Tooltip text={userProfileData?.university_name || ''}>
                <p className="text-3xs font-normal text-neutral-500 font-inter line-clamp-1">{userProfileData?.university_name}</p>
              </Tooltip>
              <p className="text-3xs font-normal text-neutral-500 font-inter line-clamp-1">{userProfileData?.major}</p>
            </div>
          </div>

          <div className="pt-5">
            <ul className="border-b-[1px] border-neutral-200 ">
              <li
                onClick={handleProfileClicked}
                className="h-10 flex py-2  gap-2 items-center text-neutral-700 text-xs font-medium hover:bg-neutral-200 hover:cursor-pointer"
              >
                <FaRegUser size={20} />
                <p>Profile</p>
              </li>
              <li
                onClick={() => handleMenuClicked('setting')}
                className="h-10 flex py-2  gap-2 items-center text-neutral-700 text-xs font-medium hover:bg-neutral-200 hover:cursor-pointer"
              >
                <MdOutlineSettings size={20} />
                <p>Settings</p>
              </li>
              {/* <li
              onClick={() => handleMenuClicked('privacy')}
              className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer"
            >
              <MdOutlineLock />
              <p>Privacy</p>
            </li>

            <li
              onClick={() => handleMenuClicked('preferences')}
              className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer"
            >
              <PiPaintBrushDuotone />
              <p>Preferences</p>
            </li> */}
            </ul>
            <ul className="border-b-[1px] border-neutral-200 ">
              {/* <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
              <MdInfoOutline />
              <p>Help Center</p>
            </li> */}
              <li className=" h-10 flex py-2  gap-2 items-center text-neutral-700 text-xs font-medium hover:bg-neutral-200 hover:cursor-pointer">
                <PiChatTextBold size={20} />
                <p>Feedback</p>
              </li>
            </ul>
            <ul onClick={handleLogoutClicked} className=" border-b-[1px] border-neutral-200 ">
              <li className=" h-10 flex py-2  gap-2 items-center text-neutral-700 text-xs font-medium hover:bg-neutral-200 hover:cursor-pointer">
                <TbLogout size={20} />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        </div>

        <div
          className={`
       w-full mx-auto relative flex flex-col center-v py-2   mb-10 `}
        >
          <div className="w-full text-gray-dark text-sm lg:text-lg">
            <div className="w-full flex flex-col-reverse lg:flex-row items-center justify-center md:justify-between my-4 gap-4 text-sm">
              <div className="flex  flex-col items-center justify-center gap-4 text-neutral-500 text-xs font-medium">
                <Link onClick={toggleRightMenu} href="/privacy-policy">
                  Privacy Policy
                </Link>
                <Link onClick={toggleRightMenu} href="/terms-and-condition">
                  Terms and Conditions
                </Link>
                <Link onClick={toggleRightMenu} href="/user-guidelines">
                  {' '}
                  Usability Guidelines
                </Link>
                <Link onClick={toggleRightMenu} href="/contact">
                  Contact Us
                </Link>
                <p className="">Copyright © 2024, Unibuzz Networks</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
