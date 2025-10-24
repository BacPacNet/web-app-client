'use client'
import React, { useCallback, useMemo, memo, useState, useRef, useEffect } from 'react'
import avatar from '@assets/avatar.svg'
import PostCartOption from '@/components/atoms/PostCardOption/PostCartOption'
import PostCardImageGrid from '@/components/atoms/PostCardImagesGrid'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useUniStore } from '@/store/store'
import { communityPostUpdateStatus, PostType } from '@/types/constants'
import PendingPostCardOption from '@/components/molecules/PendingPostCardOptions'
import { useRouter } from 'next/navigation'
import UserCard from '@/components/atoms/UserCard'
import { motion } from 'framer-motion'
import { useCreateGroupPostStatusChange } from '@/services/community-university'
import { communityPostStatus } from '@/types/CommuityGroup'
import { userTypeEnum } from '@/types/RegisterForm'
import PostCommunityHolder from '../PostCommunityHolder'
dayjs.extend(relativeTime)

interface Like {
  userId: string
}

interface PostProps {
  user: string
  source?: string
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
  role: userTypeEnum
  occupation?: string
  affiliation?: string
  isPostVerified?: boolean

  isCommunityAdmin?: boolean
  isSinglePost?: boolean
  borderColor?: 'yellow' | 'red' | 'none'
  communityGroupAdminId: string
  isPostLive: boolean
  postStatus: communityPostStatus
  communities?: {
    _id: string
    name: string
    logo: string
    isVerifiedMember: boolean
    isCommunityAdmin?: boolean
  }[]
}

const PendingPostCard = React.memo(
  ({
    user,
    university,
    adminId,
    year,
    text,
    avatarLink,

    type,
    postID,
    images,
    setImageCarasol,
    idx,
    major,
    occupation,
    affiliation,
    isPostVerified,
    isCommunityAdmin,
    role,
    borderColor = 'yellow',
    communityGroupAdminId,
    postStatus,
    isPostLive,
    communities,
  }: PostProps) => {
    const { userData } = useUniStore()

    const { mutate } = useCreateGroupPostStatusChange(postID)
    const router = useRouter()

    const debounceTimeoutRef = useRef<NodeJS.Timeout>()

    const handleProfileClicked = useCallback(
      (adminId: string) => {
        router.push(`/profile/${adminId}`)
      },
      [router]
    )

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }
      }
    }, [])

    const borderColorClass = useMemo(() => {
      return communityGroupAdminId.toString() == userData?.id?.toString()
        ? 'border-none'
        : postStatus == communityPostStatus.REJECTED
        ? 'border-red-500'
        : 'border-yellow-400'
    }, [postStatus, communityGroupAdminId])

    const updatePostStatus = (status: communityPostUpdateStatus) => {
      mutate(status)
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`bg-white rounded-lg shadow-card border-l-4 ${borderColorClass}`}
      >
        <div className="px-6 flex flex-col gap-4 ">
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
              handleProfileClicked={handleProfileClicked}
              affiliation={affiliation}
              occupation={occupation}
              isPost={true}
              isVerified={isPostVerified}
              isCommunityAdmin={isCommunityAdmin}
              role={role}
            />

            <div className="flex items-center gap-2">
              {communities?.length && communities?.length > 0 && type === PostType.Community && (
                <div className="flex items-center gap-2">
                  {communities
                    ?.slice()
                    .sort((a, b) => {
                      const aIsAdmin = a.isCommunityAdmin
                      const bIsAdmin = b.isCommunityAdmin

                      const aIsVerified = a.isVerifiedMember
                      const bIsVerified = b.isVerifiedMember

                      if (aIsAdmin !== bIsAdmin) return aIsAdmin ? -1 : 1
                      if (aIsVerified !== bIsVerified) return aIsVerified ? -1 : 1

                      return 0
                    })
                    .map((community) => (
                      <PostCommunityHolder
                        key={community._id}
                        logo={community.logo}
                        name={community.name}
                        isVerified={community.isVerifiedMember}
                        isCommunityAdmin={community.isCommunityAdmin || false}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="font-medium text-neutral-700 break-words whitespace-normal mb-2" dangerouslySetInnerHTML={{ __html: text }} />

          <PostCardImageGrid images={images} setImageCarasol={setImageCarasol} idx={idx} type={type} />

          {communityGroupAdminId.toString() == userData?.id?.toString() ? (
            <PendingPostCardOption
              variant="review"
              title="Admin Review Required: This post is awaiting moderation approval."
              text="Once you take action, the author will be notified of the decision."
              acceptLabel="Accept"
              rejectLabel="Reject"
              onAccept={() => updatePostStatus(communityPostUpdateStatus.LIVE)}
              onReject={() => updatePostStatus(communityPostUpdateStatus.REJECTED)}
            />
          ) : postStatus === communityPostStatus.PENDING ? (
            <PendingPostCardOption
              variant="pending"
              text="This post is awaiting approval from the community admin. It will be visible to other members once approved."
            />
          ) : (
            <PendingPostCardOption variant="rejected" text="Post has been rejected and will not be visible to other group members." />
          )}
        </div>
      </motion.div>
    )
  }
)

PendingPostCard.displayName = 'PostCard'

export default memo(PendingPostCard)
