import UniversityCard from '@/components/molecules/UniversityCard'
import PostContainer from '@/components/organisms/PostsContainer'
import UserPostContainer from '@/components/organisms/UserPostContainer'
import { PostInputType, PostType } from '@/types/constants'

export default function Page({ params }: { params: { id: string } }) {
  const communityID = params.id[0]
  const communityGroupID = params.id[1]

  return (
    <>
      <UniversityCard
        universityLogo={''}
        universityName={'Lorem University'}
        isAiPowered={true}
        joinedSince={'07/12/23'}
        description={
          'Official community page for Lorem University. For inquiries contact the Human Resources Department in B-Wing of Northern Campus.'
        }
        memberCount={200}
        communityID={communityID}
        communityGroupID={communityGroupID}
      />
      <UserPostContainer communityID={communityID} communityGroupID={communityGroupID} type={PostInputType.Community} />
      <PostContainer communityID={communityID} communityGroupID={communityGroupID} type={PostType.Community} />
    </>
  )
}
