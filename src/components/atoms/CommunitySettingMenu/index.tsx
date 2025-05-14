import React from 'react'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { FiEdit } from 'react-icons/fi'
import { MdDeleteForever } from 'react-icons/md'
import { TbLogout2 } from 'react-icons/tb'
import { BsExclamationCircleFill } from 'react-icons/bs'
import settingIcon from '@assets/settingIcon.svg'
import { status } from '@/types/CommuityGroup'

interface Props {
  isOpen: boolean

  toggleOpen: (open: boolean) => void
  isAdmin: boolean
  groupStatus?: string
  onEdit?: () => void
  onDelete?: () => void
  onLeave?: () => void
}

const CommunitySettingMenu: React.FC<Props> = ({ isOpen, toggleOpen, isAdmin, groupStatus, onEdit, onDelete, onLeave }) => {
  const edit = () => {
    if (!onEdit) return
    onEdit()
    toggleOpen(false)
  }

  const del = () => {
    if (!onDelete) return
    onDelete()
    toggleOpen(false)
  }

  const leave = () => {
    if (!onLeave) return
    onLeave()
    toggleOpen(false)
  }
  return (
    <Popover open={isOpen} onOpenChange={toggleOpen}>
      <PopoverTrigger asChild>
        <div className="relative cursor-pointer">
          <Image src={settingIcon} width={32} height={32} alt="Settings" />
          {groupStatus === status.pending && isAdmin && <BsExclamationCircleFill size={12} className="absolute text-warning-500 top-1 right-0" />}
        </div>
      </PopoverTrigger>

      <PopoverContent className="p-0 relative drop-shadow-lg right-16 top-2 w-40 bg-white shadow-card border-none">
        <div className="flex flex-col">
          {isAdmin && (
            <>
              {/* <div onClick={onEdit} className="flex items-center px-4 py-2 gap-2 hover:bg-neutral-100 cursor-pointer"> */}
              <div onClick={edit} className="flex items-center px-4 py-2 gap-2 hover:bg-neutral-100 cursor-pointer">
                <FiEdit size={16} className="text-primary-500" />
                <p className="font-medium text-neutral-700 text-xs">Edit</p>
                {groupStatus === status.pending && <BsExclamationCircleFill size={16} className="text-warning-500" />}
              </div>

              <div onClick={del} className="flex items-center px-4 py-2 gap-2 hover:bg-neutral-100 cursor-pointer">
                <MdDeleteForever size={16} className="text-destructive-600" />
                <p className="font-medium text-neutral-700 text-xs">Delete</p>
              </div>
            </>
          )}

          {!isAdmin && (
            <div onClick={leave} className="flex items-center px-4 py-2 gap-2 hover:bg-neutral-100 cursor-pointer">
              <TbLogout2 size={16} className="text-red-500" />
              <p className="font-medium text-neutral-700 text-xs">Leave</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default CommunitySettingMenu
