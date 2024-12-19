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
import { HiCubeTransparent } from 'react-icons/hi'
import { TbLogout } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import useCookie from '@/hooks/useCookie'
import { useLogout } from '@/hooks/useLogOut'
import ProfilePicture from '@/components/atoms/RenderProfileDP'

interface Props {
  closeLeftNavbar: () => void
  toggleRightMenu: () => void
  showRightMenu: boolean
}

export default function MobileViewNavbar({ closeLeftNavbar, toggleRightMenu, showRightMenu }: Props) {
  const router = useRouter()
  const { userProfileData, userData } = useUniStore()
  const [, , deleteCookie] = useCookie('uni_user_token')
  const { handleLogout } = useLogout()
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

  return (
    <div>
      <div className="lg:hidden flex gap-2 items-center cursor-pointer" onClick={toggleMenu}>
        <Image
          width={40}
          height={40}
          objectFit="cover"
          className="w-[40px] h-[40px] rounded-full"
          src={userProfileData?.profile_dp?.imageUrl || avatar}
          alt="profile.png"
        />
        <FaAngleDown />
      </div>

      {/* Sidebar Menu (Visible on mobile when open) */}
      <div
        className={`fixed top-[68px] right-0 py-6 h-full w-3/4 md:w-1/2 bg-white transition-transform duration-300 transform ${
          showRightMenu ? 'translate-x-0' : 'translate-x-full'
        } lg:hidden`}
      >
        <button onClick={toggleMenu} className="p-4 text-black focus:outline-none absolute right-0 top-2">
          <RxCross2 size={32} className="text-primary" />
        </button>
        <div onClick={handleProfileClicked} className="px-4 flex gap-4 cursor-pointer">
          <ProfilePicture userProfileData={userProfileData} />
          <div>
            <p className="text-sm text-neutral-700">
              {userData?.firstName} {userData?.lastName}
            </p>
            <Tooltip text={userProfileData?.university_name || ''}>
              <SubText>{truncateString(userProfileData?.university_name || '')}</SubText>
            </Tooltip>
            <SubText>{userProfileData?.major}</SubText>
          </div>
        </div>

        <div className="pt-5">
          <ul className="border-b-[1px] border-neutral-200 ">
            <li
              onClick={handleProfileClicked}
              className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer"
            >
              <FaRegUser />
              <p>Profile</p>
            </li>
            <li
              onClick={() => handleMenuClicked('setting')}
              className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer"
            >
              <MdOutlineSettings />
              <p>Settings</p>
            </li>
            <li
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
            </li>
          </ul>
          <ul className="border-b-[1px] border-neutral-200 ">
            <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
              <MdInfoOutline />
              <p>Help Center</p>
            </li>
            <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
              <PiChatTextBold />
              <p>Feedback</p>
            </li>
          </ul>
          <ul onClick={handleLogout} className="">
            <li className="flex py-2 px-4 gap-2 items-center text-neutral-600 hover:bg-neutral-200 hover:cursor-pointer">
              <TbLogout />
              <p>Logout</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
