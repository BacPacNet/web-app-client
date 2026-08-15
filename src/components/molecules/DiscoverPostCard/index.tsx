'use client'
import React, { useCallback, useMemo, memo, useState, useRef, useEffect } from 'react'
import avatar from '@assets/avatar.svg'
import PostCartOption from '@/components/atoms/PostCardOption/PostCartOption'
import PostCardImageGrid from '@/components/atoms/PostCardImagesGrid'
import { FiMessageCircle, FiShare2, FiThumbsUp } from 'react-icons/fi'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import PostCommentBox from '../PostCommentBox'
import { useUniStore } from '@/store/store'
import { useLikeUnilikeGroupPost } from '@/services/community-university'
import { useLikeUnlikeTimelinePost } from '@/services/community-timeline'
import { PostType } from '@/types/constants'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/Popover'
import { useRouter, useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { truncateStringTo } from '@/lib/utils'
import UserCard from '@/components/atoms/UserCard'
import { motion } from 'framer-motion'
import PostCommunityHolder from '../PostCommunityHolder'
import { ContentType } from '@/content/constant'
import { formatHtmlContentForCodeBlocks } from '@/lib/formatHtmlContentForCodeBlocks'

dayjs.extend(relativeTime)

interface PostProps {
  isModerationPost?: boolean
  user: string
  university: string
  communityName?: string
  communityGroupName?: string
  major: string
  adminId: string
  year: string
  text: string
  link?: string
  date: string
  avatarLink: string
  communityGroupId?: string
  communityId?: string
  postID: string
  type: PostType.Community | PostType.Timeline
  images: {
    imageUrl: string
  }[]
  setImageCarasol: React.Dispatch<
    React.SetStateAction<{
      isShow: boolean
      images: any
      currImageIndex: number | null
    }>
  >
  idx: number
  isTimeline?: boolean
  role?: string
  occupation?: string
  affiliation?: string
  isPostVerified?: boolean
  isCommunityAdmin?: boolean
  isSinglePost?: boolean
  filterPostBy?: string
  isReply?: boolean
  commentID?: string
  communities?: {
    _id: string
    name: string
    logo: string
    isVerifiedMember: boolean

    isCommunityAdmin?: boolean
  }[]
}

const DiscoverPostCard = React.memo(
  ({
    user,
    university,
    adminId,
    year,
    text,
    date,
    avatarLink,
    type,
    postID,
    images,
    setImageCarasol,
    idx,

    major,
    role,
    occupation,
    affiliation,
    isPostVerified,
    communityName,
    communityGroupName,
    communityGroupId,
    isCommunityAdmin,
    communities,
    isModerationPost = false,
  }: PostProps) => {
    const router = useRouter()

    const postSourceText = useMemo(() => {
      if (type === PostType.Community && communityGroupName) {
        return `Posted in ${communityGroupName} group at ${communityName}`
      }
      if (type === PostType.Community) {
        return `Posted from ${communityName || ''}`
      }
      return null
    }, [type, communityGroupId, communityGroupName, communityName])

    const postCategory = useMemo(() => {
      if (type === PostType.Community && communityGroupName) {
        return ContentType.COMMUNITY_GROUP_POST
      }
      if (type === PostType.Community) {
        return ContentType.COMMUNITY_POST
      }
      return ContentType.USER_POST
    }, [type, communityGroupId, communityGroupName, communityName])

    const formattedDate = useMemo(() => format(date as unknown as Date, 'h:mm a · MMM d, yyyy'), [date])
    const formattedText = useMemo(() => formatHtmlContentForCodeBlocks(text), [text])

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-white rounded-lg  ${isModerationPost ? 'border-none' : 'border border-neutral-300'} w-full`}
      >
        <div className="px-6 flex flex-col gap-4">
          <div className="flex items-start pt-4 gap-2 justify-between">
            <UserCard
              user={user}
              university={university}
              year={year}
              major={major}
              avatar={avatarLink || avatar}
              adminId={adminId}
              postID={postID}
              type={type}
              handleProfileClicked={() => {}}
              affiliation={affiliation}
              occupation={occupation}
              isPost={true}
              isVerified={isPostVerified}
              isCommunityAdmin={isCommunityAdmin}
              role={role}
            />

            <div className="flex items-center gap-2">
              {communities?.length && communities?.length > 0 ? (
                <div className="flex items-center gap-2">
                  {communities
                    ?.slice()
                    .sort((a, b) => {
                      const aIsAdmin = a?.isCommunityAdmin
                      const bIsAdmin = b?.isCommunityAdmin

                      const aIsVerified = a?.isVerifiedMember
                      const bIsVerified = b?.isVerifiedMember

                      if (aIsAdmin !== bIsAdmin) return aIsAdmin ? -1 : 1
                      if (aIsVerified !== bIsVerified) return aIsVerified ? -1 : 1

                      return 0
                    })
                    .map((community) => (
                      <PostCommunityHolder
                        key={community?._id}
                        logo={community?.logo}
                        name={community?.name}
                        isVerified={community?.isVerifiedMember}
                        isCommunityAdmin={community.isCommunityAdmin || false}
                      />
                    ))}
                </div>
              ) : null}
            </div>
          </div>

          <div
            className="post-content font-medium text-neutral-700 break-words whitespace-normal mb-2"
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />

          <PostCardImageGrid images={images} setImageCarasol={setImageCarasol} idx={idx} type={type} />

          <p className="text-2xs flex items-center mb-2">
            <span className="text-neutral-500 font-normal break-words">
              {formattedDate} · {postSourceText}
            </span>
          </p>
        </div>
      </motion.div>
    )
  }
)

DiscoverPostCard.displayName = 'discoverPostCard'

export default memo(DiscoverPostCard)
