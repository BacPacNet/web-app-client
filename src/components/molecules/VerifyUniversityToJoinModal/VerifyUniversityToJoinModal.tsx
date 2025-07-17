import React from 'react'
import Buttons from '@/components/atoms/Buttons'
import { useRouter } from 'next/navigation'
import { useModal } from '@/context/ModalContext'

interface GenericInfoModalProps {
  title: string
  description: string | React.ReactNode
  subTitle?: string
  listItems?: string[]
  buttonLabel: string
  onButtonClick?: () => void
  redirectUrl?: string
}

const GenericInfoModal: React.FC<GenericInfoModalProps> = ({ title, description, subTitle, listItems, buttonLabel, onButtonClick, redirectUrl }) => {
  const router = useRouter()
  const { closeModal } = useModal()

  const handleClick = () => {
    closeModal()
    if (onButtonClick) {
      onButtonClick()
    }
    if (redirectUrl) {
      router.push(redirectUrl)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h5 className="font-poppins text-md font-bold text-neutral-700 text-center mb-4">{title}</h5>
      {typeof description === 'string' ? <p className="text-sm text-neutral-700">{description}</p> : description}
      {subTitle && <p className="text-sm text-neutral-700 font-semibold">{subTitle}</p>}
      {listItems && (
        <ul className="list-disc list-inside text-sm text-neutral-700 font-semibold flex flex-col gap-2">
          {listItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      <Buttons onClick={handleClick} className="mt-4 w-max mx-auto" size="large">
        {buttonLabel}
      </Buttons>
    </div>
  )
}

export default GenericInfoModal
