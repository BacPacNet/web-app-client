import Loading from '@/app/community/loading'
import { useGetUserSubscribedCommunityGroups } from '@/services/university-community'
import React from 'react'

export default function SubscribedUniversity() {
  const { data: SubscribedData, isFetching } = useGetUserSubscribedCommunityGroups()

  if (isFetching) return <Loading />

  return <div>index</div>
}
