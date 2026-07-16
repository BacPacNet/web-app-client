'use client'

import AdminPillBadge from '@/components/molecules/AdminDashboard/AdminPillBadge'
import ModerationGroupActionMenu from '@/components/molecules/AdminDashboard/ModerationGroupActionMenu'
import ModerationPostItem from '@/components/molecules/AdminDashboard/ModerationPostItem'
import { ModerationGroup } from '@/services/communityAdminModeration'
import { useCommunityGroupPostsForCommunityAdmin } from '@/services/community-post'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { FiChevronDown, FiChevronRight } from 'react-icons/fi'

const GROUP_AVATAR_COLOR_CLASSES = [
  'bg-gradient-to-br from-[#6C63FF] to-[#4F46E5]',
  'bg-gradient-to-br from-[#14B8A6] to-[#0D9488]',
  'bg-gradient-to-br from-[#22C55E] to-[#16A34A]',
  'bg-gradient-to-br from-[#F59E0B] to-[#D97706]',
  'bg-gradient-to-br from-[#EC4899] to-[#DB2777]',
]

function getGroupInitials(title: string) {
  const words = title.trim().split(/\s+/).filter(Boolean)

  if (words.length >= 2) {
    return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase()
  }

  return title.slice(0, 2).toUpperCase()
}

function getGroupAvatarColorClass(groupId: string) {
  const hash = groupId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return GROUP_AVATAR_COLOR_CLASSES[hash % GROUP_AVATAR_COLOR_CLASSES.length]
}

type Props = {
  group: ModerationGroup
  communityId: string
  isExpanded: boolean
  onToggle: () => void
  onGroupRemoved?: () => void
}

export default function ModerationGroupCard({ group, communityId, isExpanded, onToggle, onGroupRemoved }: Props) {
  const [logoFailed, setLogoFailed] = useState(false)
  const postsContainerRef = useRef<HTMLDivElement>(null)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const {
    data,
    isLoading: isPostsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useCommunityGroupPostsForCommunityAdmin(group._id, isExpanded)

  const posts = data?.pages.flatMap((page) => page.finalPost ?? []) ?? []

  useEffect(() => {
    const root = postsContainerRef.current
    const target = loadMoreRef.current

    if (!root || !target || !hasNextPage) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { root, rootMargin: '40px', threshold: 0 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, posts.length])

  const initials = getGroupInitials(group.title)
  const avatarColorClass = getGroupAvatarColorClass(group._id)
  const logoUrl = logoFailed ? null : group.communityGroupLogoUrl?.imageUrl
  const label = group.communityGroupLabel || group.communityGroupType

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex items-center gap-3 px-4 py-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex h-6 w-6 shrink-0 items-center justify-center text-neutral-400 transition-colors hover:text-neutral-600"
          aria-label={isExpanded ? 'Collapse group' : 'Expand group'}
          aria-expanded={isExpanded}
        >
          {isExpanded ? <FiChevronDown size={18} /> : <FiChevronRight size={18} />}
        </button>

        <button type="button" onClick={onToggle} className="flex min-w-0 flex-1 items-center gap-3 text-left">
          {logoUrl ? (
            <Image
              src={logoUrl}
              alt={group.title}
              width={44}
              height={44}
              className="h-11 w-11 shrink-0 rounded-xl object-cover"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white ${avatarColorClass}`}>
              {initials}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-inter text-xs font-semibold text-[#111827]">{group.title}</p>
              {label ? <AdminPillBadge label={label} variant="neutral" className="px-2 py-0.5 text-3xs" /> : null}
            </div>
            <p className="mt-0.5 text-3xs text-[#9CA3AF]">
              {group.memberCount ?? 0} member{(group.memberCount ?? 0) === 1 ? '' : 's'} · {group.postCount} post
              {group.postCount === 1 ? '' : 's'}
            </p>
          </div>
        </button>

        <ModerationGroupActionMenu communityGroupId={group._id} groupName={group.title} communityId={communityId} onRemoved={onGroupRemoved} />
      </div>

      {isExpanded ? (
        <div className="border-t border-neutral-100 px-4 pb-4 pt-3">
          <p className="mb-2 text-3xs font-semibold uppercase tracking-wide text-[#9CA3AF]">All Posts</p>

          {isPostsLoading ? <p className="py-4 text-2xs text-neutral-500">Loading posts...</p> : null}

          {!isPostsLoading && posts.length === 0 ? <p className="py-4 text-2xs text-neutral-500">No posts in this group yet.</p> : null}

          {!isPostsLoading && posts.length > 0 ? (
            <div ref={postsContainerRef} className="max-h-[400px] overflow-y-auto custom-scrollbar">
              <div className="flex flex-col divide-y divide-neutral-100">
                {posts.map((post) => (
                  <ModerationPostItem key={post._id} post={post} communityGroupName={group.title} onRemoved={() => refetch()} />
                ))}
              </div>

              <div ref={loadMoreRef} className="h-1 w-full" aria-hidden />
              {isFetchingNextPage ? <p className="py-3 text-center text-3xs text-neutral-500">Loading more...</p> : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}
