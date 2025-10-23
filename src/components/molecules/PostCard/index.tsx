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
dayjs.extend(relativeTime)

const SharePopup = React.memo(({ postId, type }: { postId: string; type: PostType }) => {
  const postUrl = useMemo(() => `https://${window.location.host}/post/${postId}?isType=${type}`, [postId])

  return (
    <div>
      <h1 className="font-semibold text-gray-dark mb-3">Share</h1>
      <div className="flex items-center justify-between gap-3 border-2 border-primary mt-4 rounded-full py-2 px-2">
        <p className="text-neutral-500 text-sm">{truncateStringTo(postUrl, 30)}</p>
        <button onClick={() => navigator.clipboard.writeText(postUrl)} className="text-white bg-primary px-3 py-2 rounded-full text-xs font-medium">
          Copy
        </button>
      </div>
    </div>
  )
})

SharePopup.displayName = 'SharePopup'

const MemoizedSharePopup = memo(SharePopup)

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
  commentCount: number
  likes: Like[]
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
  showCommentSection: string
  setShowCommentSection: (value: string) => void
  isTimeline?: boolean
  role?: string
  occupation?: string
  affiliation?: string
  isPostVerified?: boolean
  initialComment?: any
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
  }[]
}

const PostCard = React.memo(
  ({
    user,
    source,
    university,
    adminId,
    year,
    text,
    date,
    avatarLink,
    likes,
    type,
    postID,
    images,
    setImageCarasol,
    idx,
    commentCount,
    showCommentSection,
    setShowCommentSection,
    communityGroupId,
    communityId,
    isTimeline = false,
    major,
    role,
    occupation,
    affiliation,
    isPostVerified,
    communityName,
    communityGroupName,
    initialComment,
    isCommunityAdmin,
    isSinglePost,
    filterPostBy,
    isReply,
    commentID,
    communities,
  }: PostProps) => {
    const { userData } = useUniStore()
    const commentSectionRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const searchParams = useSearchParams()

    const [showInitial, setShowInitial] = useState(!!initialComment)
    // Local state for immediate UI feedback
    //const [localLikes, setLocalLikes] = useState<any>(likes)
    const [localIsLiked, setLocalIsLiked] = useState(false)
    //const [localLikeCount, setLocalLikeCount] = useState(likes?.length || 0)
    const debounceTimeoutRef = useRef<NodeJS.Timeout>()

    const { mutate: likeUnlikeGroupPost, isPending: isLikeUnlikeGroupPending } = useLikeUnilikeGroupPost(
      communityId,
      communityGroupId,
      isTimeline,
      isSinglePost,
      filterPostBy
    )
    const { mutate: likeUnlikeTimelinePost, isPending: isLikeUnlikePending } = useLikeUnlikeTimelinePost(source as string, adminId, isSinglePost)

    const handleProfileClicked = useCallback(
      (adminId: string) => {
        router.push(`/profile/${adminId}`)
      },
      [router]
    )

    // Initialize local state
    useEffect(() => {
      setLocalIsLiked(likes?.some((like) => like.userId === userData?.id) || false)
    }, [likes, userData?.id])

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }
      }
    }, [])

    const debouncedLikeUnlike = useCallback(
      (postId: string) => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current)
        }

        debounceTimeoutRef.current = setTimeout(() => {
          if (type === PostType.Timeline) {
            likeUnlikeTimelinePost(postId)
          } else if (type === PostType.Community) {
            likeUnlikeGroupPost(postId)
          }
        }, 500) // 500ms debounce delay
      },
      [type, likeUnlikeTimelinePost, likeUnlikeGroupPost]
    )

    const handleLikeClick = useCallback(
      (postId: string) => {
        // Immediate local state update
        const newIsLiked = !localIsLiked
        setLocalIsLiked(newIsLiked)
        //setLocalLikeCount((prev) => (newIsLiked ? prev + 1 : prev - 1))
        //setLocalLikes((prev: any) => (newIsLiked ? [...prev, { userId: userData?.id }] : prev.filter((like: any) => like.userId !== userData?.id)))

        // Debounced API call
        if (type === PostType.Timeline) {
          return likeUnlikeTimelinePost(postId)
        } else if (type === PostType.Community) {
          return likeUnlikeGroupPost(postId)
        }
        //debouncedLikeUnlike(postId)
      },
      [localIsLiked, userData?.id, debouncedLikeUnlike]
    )

    const postSourceText = useMemo(() => {
      if (type === PostType.Community && communityGroupName) {
        return `Posted in ${communityGroupName} group at ${communityName}`
      }
      if (type === PostType.Community) {
        return `Posted from ${communityName || ''}`
      }
      return null
    }, [type, communityGroupId, communityGroupName, communityName])

    const formattedDate = useMemo(() => format(date as unknown as Date, 'h:mm a · MMM d, yyyy'), [date])

    //const isLiked = useMemo(() => likes?.some((like: any) => like.userId == userData?.id), [likes, userData?.id])

    const PostData = useMemo(
      () => ({
        user,
        avatarLink: avatarLink,
        date,
        university,
        year,
        content: text,
        type,
        adminId,
      }),
      [user, avatarLink, date, university, year, text, type, adminId]
    )

    const toggleCommentSection = useCallback(() => {
      if (initialComment && showCommentSection === postID) {
        setShowInitial(false)
      }

      const handleClick = () => {
        if (!initialComment) return
        setShowInitial(false)

        const params = new URLSearchParams(searchParams.toString())
        params.delete('commentId')

        const newQuery = params.toString()
        const newUrl = `/post/${postID}${newQuery ? `?${newQuery}` : ''}`

        router.replace(newUrl)
      }
      handleClick()
      setShowCommentSection(showCommentSection === postID ? '' : postID)

      // Add a small delay to ensure the comment section is rendered before scrolling
      setTimeout(() => {
        if (showCommentSection !== postID && commentSectionRef.current) {
          commentSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
        }
      }, 100)
    }, [showCommentSection, postID, setShowCommentSection])

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-card"
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
                  {communities?.map((community) => (
                    <PostCommunityHolder key={community._id} logo={community.logo} name={community.name} isVerified={community.isVerifiedMember} />
                  ))}
                </div>
              )}

              <div className="text-primary-500 text-sm md:text-md bg-surface-primary-50 rounded-full flex p-1">
                <PostCartOption isSelfPost={adminId === userData?.id} postID={postID} isType={type} />
              </div>
            </div>
          </div>

          <div className="font-medium text-neutral-700 break-words whitespace-normal mb-2" dangerouslySetInnerHTML={{ __html: text }} />

          <PostCardImageGrid images={images} setImageCarasol={setImageCarasol} idx={idx} type={type} />

          <p className="text-2xs flex items-center mb-2">
            <span className="text-neutral-500 font-normal break-words">
              {formattedDate} · {postSourceText}
            </span>
          </p>
        </div>

        <div className="flex items-center justify-end py-2 border-t border-neutral-200 text-sm text-neutral-500 px-6">
          <div className="flex items-center gap-4">
            <motion.button
              onClick={() => handleLikeClick(postID)}
              className="flex gap-1 items-center cursor-pointer"
              disabled={isLikeUnlikePending || isLikeUnlikeGroupPending}
              whileHover={{ scale: 1.1 }}
            >
              {likes?.length}

              <FiThumbsUp className="mr-1 text-neutral-600 transition-all duration-300" color={localIsLiked ? '#6647FF' : ''} />
            </motion.button>
            <motion.button onClick={toggleCommentSection} className="flex gap-2 items-center cursor-pointer" whileHover={{ scale: 1.1 }}>
              {commentCount} <FiMessageCircle className="mr-1 text-neutral-600" />
            </motion.button>

            <Popover>
              <PopoverTrigger asChild>
                <motion.button className="flex items-center gap-1 text-xs" whileHover={{ scale: 1.1 }}>
                  Share <FiShare2 className="mr-1 text-neutral-600" />
                </motion.button>
              </PopoverTrigger>
              <PopoverContent className="relative -left-5 top-0 w-auto p-5 border-none shadow-lg bg-white shadow-gray-light">
                <MemoizedSharePopup type={type} postId={postID} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Add ref to the comment section wrapper */}
        <div
          ref={commentSectionRef}
          className={`overflow-hidden transition-all duration-500 ease-in-out ${showCommentSection === postID || showInitial ? 'h-auto' : 'max-h-0'}`}
        >
          <PostCommentBox
            handleProfileClicked={handleProfileClicked}
            showCommentSec={showCommentSection}
            setShowCommentSection={setShowCommentSection}
            postID={postID}
            type={type}
            data={PostData}
            setImageCarasol={setImageCarasol}
            initialComment={initialComment}
            setShowInitial={setShowInitial}
            showInitial={showInitial}
            isReplyTrue={isReply}
            commentID={commentID}
          />
        </div>
      </motion.div>
    )
  }
)

PostCard.displayName = 'PostCard'

export default memo(PostCard)
