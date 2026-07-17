'use client'

import PostImageSlider from '@/components/atoms/PostImageSlider'
import DiscoverPostCard from '@/components/molecules/DiscoverPostCard'
import { openImageModal } from '@/components/molecules/ImageWrapper/ImageManager'
import { ModerationGroupPost } from '@/services/communityAdminModeration'
import { PostType } from '@/types/constants'
import { useEffect, useState } from 'react'

type Props = {
  post: ModerationGroupPost
  communityGroupName?: string
}

export default function ModerationPostPreviewModal({ post, communityGroupName }: Props) {
  const [imageCarasol, setImageCarasol] = useState<{
    isShow: boolean
    images: { imageUrl: string }[]
    currImageIndex: number | null
  }>({
    isShow: false,
    images: [],
    currImageIndex: null,
  })

  useEffect(() => {
    if (imageCarasol.isShow) {
      openImageModal(<PostImageSlider images={imageCarasol.images} initialSlide={imageCarasol.currImageIndex} messageImage={true} />)
    }
  }, [imageCarasol])

  const authorName = `${post.user.firstName ?? ''} ${post.user.lastName ?? ''}`.trim() || 'Unknown'

  return (
    <div className="w-full">
      <DiscoverPostCard
        user={authorName}
        adminId={post.user._id}
        university={post.userProfile?.university_name ?? ''}
        year={post.userProfile?.study_year ?? ''}
        text={post.content}
        date={post.createdAt ?? new Date().toISOString()}
        avatarLink={post.userProfile?.profile_dp?.imageUrl ?? ''}
        postID={post._id}
        type={PostType.Community}
        images={post.imageUrl ?? []}
        setImageCarasol={setImageCarasol}
        idx={0}
        major={post.userProfile?.major ?? ''}
        affiliation={post.userProfile?.affiliation}
        occupation={post.userProfile?.occupation}
        role={post.userProfile?.role}
        communityName={post.communityName}
        communityGroupName={communityGroupName ?? post.communityGroupName}
        isCommunityAdmin={post.userProfile?.isCommunityAdmin}
        isPostVerified={post.isPostVerified}
        communities={post.userProfile?.communities}
        isModerationPost={true}
      />
    </div>
  )
}
