'use client'

import AdminLiveUpdateNotice from '@/components/molecules/AdminDashboard/AdminLiveUpdateNotice'
import AdminSectionHeader from '@/components/molecules/AdminDashboard/AdminSectionHeader'
import Buttons from '@/components/atoms/Buttons'
import HighlightedPostsList, { HighlightedPostOrderItem } from '@/components/molecules/AdminDashboard/HighlightedPostsList'
import Loading from '@/components/atoms/Loading'
import PostImageSlider from '@/components/atoms/PostImageSlider'
import DiscoverPostCard from '@/components/molecules/DiscoverPostCard'
import { openImageModal } from '@/components/molecules/ImageWrapper/ImageManager'
import { useGetUniversitiesHighlightedPostd, useUpdateUniversityHighlightPostPositions } from '@/services/universitySearch'
import { useUniStore } from '@/store/store'
import { PostType } from '@/types/constants'
import { useEffect, useState } from 'react'
import { FaCheck, FaChevronLeft, FaChevronRight } from 'react-icons/fa'
function buildPostOrder(posts: { _id: string; communityId?: string }[]): HighlightedPostOrderItem[] {
  return posts.map((post, index) => ({
    postId: post._id,
    postType: 'communityId' in post ? 'CommunityPost' : 'UserPost',
    position: index,
  }))
}

function isSamePostOrder(a: HighlightedPostOrderItem[], b: HighlightedPostOrderItem[]) {
  if (a.length !== b.length) return false
  return a.every((item, index) => item.postId === b[index]?.postId && item.position === b[index]?.position)
}

export default function FromTheUniversityTab() {
  const { university_id: universityId } = useUniStore()
  const { data: highlightedPosts, isLoading } = useGetUniversitiesHighlightedPostd(universityId)
  const { mutate: updatePostPositions, isPending: isSaving } = useUpdateUniversityHighlightPostPositions(universityId)
  const [orderedPosts, setOrderedPosts] = useState<any[]>([])
  const [postOrder, setPostOrder] = useState<HighlightedPostOrderItem[]>([])
  const [savedPostOrder, setSavedPostOrder] = useState<HighlightedPostOrderItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [imageCarasol, setImageCarasol] = useState<{
    isShow: boolean
    images: any
    currImageIndex: number | null
  }>({
    isShow: false,
    images: [],
    currImageIndex: null,
  })

  const totalPosts = orderedPosts.length
  const currentPost = orderedPosts[currentIndex]

  const hasOrderChanges = !isSamePostOrder(postOrder, savedPostOrder)

  useEffect(() => {
    if (imageCarasol.isShow) {
      openImageModal(<PostImageSlider images={imageCarasol.images} initialSlide={imageCarasol.currImageIndex} messageImage={true} />)
    }
  }, [imageCarasol])

  useEffect(() => {
    if (highlightedPosts?.length) {
      const order = buildPostOrder(highlightedPosts)
      setOrderedPosts(highlightedPosts)
      setPostOrder(order)
      setSavedPostOrder(order)
      setCurrentIndex(0)
    } else {
      setOrderedPosts([])
      setPostOrder([])
      setSavedPostOrder([])
      setCurrentIndex(0)
    }
  }, [highlightedPosts])

  useEffect(() => {
    setCurrentIndex(0)
  }, [universityId])

  const handleOrderChange = (order: HighlightedPostOrderItem[], posts: any[]) => {
    const currentPostId = orderedPosts[currentIndex]?._id
    setPostOrder(order)
    setOrderedPosts(posts)

    const newIndex = posts.findIndex((post) => post._id === currentPostId)
    setCurrentIndex(newIndex >= 0 ? newIndex : 0)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === totalPosts - 1 ? 0 : prev + 1))
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalPosts - 1 : prev - 1))
  }

  const handleRemove = (postId: string) => {
    const newPosts = orderedPosts.filter((post) => post._id !== postId)
    const order = buildPostOrder(newPosts)
    setOrderedPosts(newPosts)
    setPostOrder(order)
    setSavedPostOrder(order)
    setCurrentIndex((prev) => Math.min(prev, Math.max(newPosts.length - 1, 0)))
  }

  const handleSave = () => {
    updatePostPositions(postOrder, {
      onSuccess: () => setSavedPostOrder(postOrder),
    })
  }

  if (!universityId) {
    return (
      <div>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
          University information is required to manage promoted posts.
        </div>
      </div>
    )
  }

  if (isLoading) return <Loading />

  return (
    <div>
      <div className="flex flex-col gap-6">
        <AdminLiveUpdateNotice />

        <div className="flex flex-col gap-6 rounded-xl bg-white p-6">
          <AdminSectionHeader
            title="From the University: Promoted Posts"
            description="Posts shown in the 'From the University' carousel. Drag to reorder or remove a post."
          />

          {orderedPosts.length > 0 ? (
            <>
              <div className="flex min-h-[500px] w-full flex-col items-center justify-center">
                <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center gap-4 md:flex-row">
                  <div
                    onClick={handlePrev}
                    className="hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center self-center rounded-full bg-primary-500 md:flex"
                  >
                    <FaChevronLeft color="white" strokeWidth={2} />
                  </div>

                  {currentPost && (
                    <div className="flex min-h-0 w-full flex-1 items-start justify-center">
                      <DiscoverPostCard
                        key={currentPost._id}
                        user={currentPost?.user?.firstName + ' ' + currentPost?.user?.lastName}
                        adminId={currentPost?.user?._id}
                        university={currentPost?.profile?.university_name}
                        year={currentPost?.profile?.study_year}
                        text={currentPost?.content}
                        date={currentPost?.createdAt}
                        avatarLink={currentPost?.profile?.profile_dp?.imageUrl}
                        postID={currentPost?._id}
                        type={'communityId' in currentPost ? PostType.Community : PostType.Timeline}
                        images={currentPost?.imageUrl || []}
                        setImageCarasol={setImageCarasol}
                        idx={currentIndex}
                        major={currentPost?.profile?.major}
                        affiliation={currentPost?.profile?.affiliation}
                        occupation={currentPost?.profile?.occupation}
                        role={currentPost?.profile?.role}
                        communityName={currentPost?.communityName}
                        communityGroupName={currentPost?.communityGroupName}
                        isCommunityAdmin={currentPost?.profile?.isCommunityAdmin}
                        communities={currentPost?.profile?.communities}
                      />
                    </div>
                  )}

                  <div
                    onClick={handleNext}
                    className="hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center self-center rounded-full bg-primary-500 md:flex"
                  >
                    <FaChevronRight color="white" strokeWidth={2} />
                  </div>

                  <div className="flex items-center justify-center gap-4 md:hidden">
                    <div
                      onClick={handlePrev}
                      className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary-500"
                    >
                      <FaChevronLeft color="white" strokeWidth={2} />
                    </div>
                    <div
                      onClick={handleNext}
                      className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-primary-500"
                    >
                      <FaChevronRight color="white" strokeWidth={2} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Buttons
                  variant="primary"
                  size="extra_small"
                  leftIcon={<FaCheck size={12} />}
                  onClick={handleSave}
                  disabled={!hasOrderChanges || isSaving}
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Buttons>
              </div>

              <HighlightedPostsList
                posts={orderedPosts}
                universityId={universityId}
                selectedIndex={currentIndex}
                onSelectPost={setCurrentIndex}
                onOrderChange={handleOrderChange}
                onRemove={handleRemove}
              />
            </>
          ) : (
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5 text-sm text-neutral-600">
              No promoted posts yet. Posts added here will appear in the &apos;From the University&apos; carousel.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
