import React from 'react'
import universityPlaceholder from '@assets/university_placeholder.jpg'
import Image from 'next/image'
import Buttons from '@/components/atoms/Buttons'
import image from '../../../assets/notloggedinmodalImage.png'
import { useRouter } from 'next/navigation'
import { useModal } from '@/context/ModalContext'
type Props = {
  title: string
  desc: string
}

const NotLoggedInModal = ({ title, desc }: Props) => {
  const router = useRouter()
  const { closeModal } = useModal()
  return (
    <div className="flex flex-col gap-4 justify-center items-center">
      <Image src={image.src} alt="img" width={300} height={200} className="w-full rounded-md" />
      <div>
        <p className="text-neutral-900 font-medium">{title}</p>
        <p className="text-neutral-500 text-xs">{desc}</p>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Buttons
          onClick={() => {
            router.push('/login'), closeModal()
          }}
          className=""
          variant="primary"
        >
          Login
        </Buttons>
        <Buttons
          onClick={() => {
            router.push('/register'), closeModal()
          }}
          variant="border"
        >
          Sign up
        </Buttons>
      </div>
    </div>
  )
}

export default NotLoggedInModal
