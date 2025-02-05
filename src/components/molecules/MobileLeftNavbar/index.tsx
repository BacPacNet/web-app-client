import LeftNavbar from '@/components/organisms/LeftNavbar'

interface Props {
  isOpen: boolean
  toggleLeftNavbar: () => void
}

export default function MobileLeftNavbar({ isOpen, toggleLeftNavbar }: Props) {
  return (
    <div
      className={`fixed top-[40px] sm:top-[68px] left-0 z-50 h-full w-full md:w-1/2 bg-white transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:hidden`}
    >
      <LeftNavbar toggleLeftNavbar={toggleLeftNavbar} />
    </div>
  )
}
