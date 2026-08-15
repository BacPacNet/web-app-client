'use client'

import ModerationPostPreviewModal from '@/components/molecules/AdminDashboard/ModerationPostPreviewModal'
import RemoveModerationPostModal from '@/components/molecules/AdminDashboard/RemoveModerationPostModal'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useModal } from '@/context/ModalContext'
import { ModerationGroupPost } from '@/services/communityAdminModeration'
import { truncateStringTo } from '@/lib/utils'
import { PostType } from '@/types/constants'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FiExternalLink, FiHeart, FiImage, FiMessageCircle, FiMoreVertical, FiTrash2 } from 'react-icons/fi'

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

type Props = {
  post: ModerationGroupPost
  communityGroupName?: string
  onRemoved?: () => void
}

export default function ModerationPostItem({ post, communityGroupName, onRemoved }: Props) {
  const { openModal } = useModal()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)

  const userId = post.user._id
  const authorName = `${post.user.firstName ?? ''} ${post.user.lastName ?? ''}`.trim() || 'Unknown'
  const avatarUrl = post.userProfile?.profile_dp?.imageUrl
  const initials = getInitials(post.user.firstName, post.user.lastName)
  const avatarColorClass = getAvatarColorClass(userId)
  const plainText = getPlainTextContent(post.content)
  const imageCount = Array.isArray(post.imageUrl) ? post.imageUrl.length : 0
  const preview = plainText ? truncateStringTo(plainText, 100) : imageCount > 0 ? 'Image' : 'No content'
  const likeCount = Array.isArray(post.likeCount) ? post.likeCount.length : 0
  const commentCount = post.commentCount ?? 0
  const viewPostUrl = `/post/${post._id}?isType=${PostType.Community}`

  const handleRemove = () => {
    setIsMenuOpen(false)
    openModal(
      <RemoveModerationPostModal
        postId={post._id}
        authorName={authorName}
        avatarUrl={avatarUrl}
        initials={initials}
        avatarColorClass={avatarColorClass}
        preview={preview}
        onSuccess={onRemoved}
      />,
      'w-[350px] sm:w-[420px] hideScrollbar h-max',
      false
    )
  }

  const handlePreview = () => {
    openModal(
      <ModerationPostPreviewModal post={post} communityGroupName={communityGroupName} />,
      'h-max max-h-[85vh] w-[350px] sm:w-[560px] hideScrollbar',
      false
    )
  }

  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-neutral-50">
      <button type="button" onClick={handlePreview} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        {avatarUrl && !imageFailed ? (
          <Image
            src={avatarUrl}
            alt={authorName}
            width={36}
            height={36}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarColorClass}`}>{initials}</div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-2xs font-semibold text-[#111827]">{authorName}</p>
          <p className="truncate text-2xs text-[#6B7280]">{preview}</p>
          <div className="mt-1 flex items-center gap-3 text-3xs text-[#9CA3AF]">
            <span className="inline-flex items-center gap-1">
              <FiHeart size={12} />
              {likeCount}
            </span>
            <span className="inline-flex items-center gap-1">
              <FiMessageCircle size={12} />
              {commentCount}
            </span>
            {imageCount > 0 ? (
              <span className="inline-flex items-center gap-1">
                <FiImage size={12} />
                {imageCount}
              </span>
            ) : null}
          </div>
        </div>
      </button>

      <Popover open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Post actions"
          >
            <FiMoreVertical size={16} />
          </button>
        </PopoverTrigger>

        <PopoverContent align="end" className="w-44 border-none bg-white p-1 shadow-card">
          <div className="flex flex-col">
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 rounded-md px-3 py-2 text-left transition-colors hover:bg-neutral-50"
            >
              <FiTrash2 size={14} className="text-destructive-600" />
              <span className="text-2xs font-semibold text-destructive-600">Remove</span>
            </button>

            <Link
              href={viewPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-neutral-50"
            >
              <FiExternalLink size={14} className="text-[#242526]" />
              <span className="text-2xs font-semibold text-[#374151]">View Post</span>
            </Link>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
