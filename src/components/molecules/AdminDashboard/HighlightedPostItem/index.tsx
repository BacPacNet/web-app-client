'use client'

import RemoveHighlightedPostModal from '@/components/molecules/AdminDashboard/RemoveHighlightedPostModal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useModal } from '@/context/ModalContext'
import { HighlightPostType } from '@/services/universitySearch'
import { truncateStringTo } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FiExternalLink, FiMoreVertical, FiTrash2 } from 'react-icons/fi'
import { RxDragHandleDots2 } from 'react-icons/rx'
import { PostType } from '@/types/constants'

const AVATAR_COLOR_CLASSES = [
  'bg-surface-primary-50 text-primary-500',
  'bg-sky-50 text-sky-600',
  'bg-pink-50 text-pink-600',
  'bg-amber-50 text-amber-600',
  'bg-teal-50 text-teal-600',
]

function getInitials(firstName?: string, lastName?: string) {
  const first = firstName?.trim().charAt(0) ?? ''
  const last = lastName?.trim().charAt(0) ?? ''

  if (first || last) {
    return `${first}${last}`.toUpperCase()
  }

  return '?'
}

function getAvatarColorClass(userId: string) {
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return AVATAR_COLOR_CLASSES[hash % AVATAR_COLOR_CLASSES.length]
}

function getPlainTextContent(html?: string) {
  if (!html) return ''

  const div = document.createElement('div')
  div.innerHTML = html
  return div.textContent?.trim() ?? ''
}

function getPostType(post: any): HighlightPostType {
  return 'communityId' in post ? 'CommunityPost' : 'UserPost'
}

type Props = {
  post: any
  position: number
  universityId: string
  isPrimary?: boolean
  isDragging?: boolean
  isDragOver?: boolean
  onSelect?: () => void
  onDragStart: () => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: () => void
  onDragEnd: () => void
  onRemove?: (postId: string) => void
}

export default function HighlightedPostItem({
  post,
  position,
  universityId,
  isPrimary = false,
  isDragging = false,
  isDragOver = false,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onRemove,
}: Props) {
  const { openModal } = useModal()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  const userId = post?.user?._id ?? post._id
  const authorName = `${post?.user?.firstName ?? ''} ${post?.user?.lastName ?? ''}`.trim() || 'Unknown'
  const avatarUrl = post?.profile?.profile_dp?.imageUrl
  const initials = getInitials(post?.user?.firstName, post?.user?.lastName)
  const avatarColorClass = getAvatarColorClass(userId)
  const preview = truncateStringTo(getPlainTextContent(post?.content), 80)
  const postType = getPostType(post)
  const viewPostUrl = `/post/${post._id}?isType=${postType === 'CommunityPost' ? PostType.Community : PostType.Timeline}`

  const handleRemove = () => {
    setIsMenuOpen(false)
    openModal(
      <RemoveHighlightedPostModal
        universityId={universityId}
        postId={post._id}
        authorName={authorName}
        avatarUrl={avatarUrl}
        initials={initials}
        avatarColorClass={avatarColorClass}
        preview={preview}
        onSuccess={() => onRemove?.(post._id)}
      />,
      'w-[350px] sm:w-[420px] hideScrollbar h-max',
      false
    )
  }

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`flex items-center gap-3 rounded-xl border px-3 py-3 transition-colors bg-[#F3F2FF] ${
        isPrimary ? 'border-primary-500 bg-primary-50/40' : 'border-neutral-200 bg-[#F3F2FF]'
      } ${isDragging ? 'opacity-50' : ''} ${isDragOver && !isDragging ? 'border-primary-300 bg-primary-50/20' : ''}`}
      data-position={position}
    >
      <div
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={onSelect}
        role={onSelect ? 'button' : undefined}
        tabIndex={onSelect ? 0 : undefined}
        onKeyDown={
          onSelect
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect()
                }
              }
            : undefined
        }
        className="flex min-w-0 flex-1 cursor-grab touch-none items-center gap-3 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <div className="flex shrink-0 items-center text-neutral-400">
          <RxDragHandleDots2 size={20} />
        </div>

        {avatarUrl && !imageFailed ? (
          <Image
            src={avatarUrl}
            alt={authorName}
            width={38}
            height={38}
            draggable={false}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${avatarColorClass}`}>
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-2xs font-semibold text-[#374151]">{authorName}</p>
          <p className="truncate text-2xs text-[#374151]">{preview || 'No content'}</p>
        </div>
      </div>

      <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neutral-200 text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600"
            aria-label="Post actions"
          >
            <FiMoreVertical size={16} />
          </button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-44 border-none bg-white p-1 shadow-card">
          <div className="flex flex-col">
            {onRemove ? (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-destructive-600 transition-colors hover:bg-neutral-50"
              >
                <FiTrash2 size={16} />
                <span className="text-2xs font-semibold text-[#374151]">Remove</span>
              </button>
            ) : null}

            <Link
              href={viewPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              <FiExternalLink size={16} />
              <span className="text-2xs font-semibold text-[#374151]">View Post</span>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
