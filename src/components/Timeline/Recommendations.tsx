/* eslint-disable @next/next/no-img-element */
import React from 'react'
import UserRecommendations from '../molecules/UserRecommendations'
import GroupRecommendations from '../molecules/GroupRecommendations'

interface Props {
  people?: any[]
  userItemButtonStyle?: string
  containerStyle?: string
  itemStyle?: string
}

// Main Recommendations Container Component
const Recommendations: React.FC<Props> = ({ people, userItemButtonStyle, containerStyle, itemStyle }) => {
  return (
    <div>
      <UserRecommendations />
      <GroupRecommendations />
    </div>
  )
}

export default Recommendations
