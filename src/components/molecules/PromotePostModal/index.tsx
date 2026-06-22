'use client'

import Buttons from '@/components/atoms/Buttons'
import { Spinner } from '@/components/spinner/Spinner'
import { useModal } from '@/context/ModalContext'
import { HighlightPostType, useAddUniversityHighlightPost } from '@/services/universitySearch'
import Link from 'next/link'
import { HiArrowRight } from 'react-icons/hi'
import { AiOutlineExclamationCircle } from 'react-icons/ai'

interface PromotePostModalProps {
  postID: string
  isType: 'Community' | 'Timeline'
  universityId: string
  universityName: string
}

const PromotePostModal = ({ postID, isType, universityId, universityName }: PromotePostModalProps) => {
  const { closeModal } = useModal()
  const { mutate: addHighlightPost, isPending } = useAddUniversityHighlightPost(universityId, universityName)

  const handlePromote = () => {
    const postType: HighlightPostType = isType === 'Community' ? 'CommunityPost' : 'UserPost'

    addHighlightPost(
      {
        postId: postID,
        postType,
        position: 0,
      },
      { onSuccess: () => closeModal() }
    )
  }

  return (
    <div className="flex flex-col w-full sm:w-[480px]">
      <h2 className="text-md font-poppins font-bold text-[#18191A] pb-4 border-b border-[#E5E7EB]">Promote this Post</h2>

      <div className="py-6 flex flex-col gap-4">
        <div className="flex gap-3 p-4 bg-neutral-100 rounded-lg">
          <AiOutlineExclamationCircle size={20} className="flex-shrink-0 mt-0.5 text-[#6B7280] color-red-500" />
          <div>
            <p className="text-xs font-semibold font-inter text-[#18191A]">Public Visibility</p>
            <p className="text-xs font-inter text-[#6B7280] mt-1">
              This promotional post will be visible to people outside of the university on the discovery page.
            </p>
          </div>
        </div>

        <Link href="/admin-dashboard" className="flex items-center gap-1 text-xs font-medium font-inter text-primary-500 w-fit hover:underline">
          Manage your posts in the dashboard
          <HiArrowRight size={16} />
        </Link>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <Buttons variant="border" size="medium" onClick={closeModal}>
          Cancel
        </Buttons>
        <Buttons variant="primary" size="medium" onClick={handlePromote} disabled={isPending || !universityId}>
          {isPending ? <Spinner /> : 'Promote Post'}
        </Buttons>
      </div>
    </div>
  )
}

export default PromotePostModal
