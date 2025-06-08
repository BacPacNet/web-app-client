import DiscoverContainer from '@/components/organisms/DiscoverContainer'
import React from 'react'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/discover`
  const ogImage = 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/unibuzz-logo.png'

  return {
    title: 'Discover | UniBuzz',
    description: 'Explore trending topics, communities, and more on UniBuzz.',
    openGraph: {
      title: 'Discover | UniBuzz',
      description: 'Explore trending topics, communities, and more on UniBuzz.',
      url,
      siteName: 'UniBuzz',
      images: [
        {
          url: ogImage,
          width: 52,
          height: 52,
          alt: 'Discover page on UniBuzz',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    alternates: {
      canonical: url,
    },
  }
}

function Discover() {
  return <DiscoverContainer />
}

export default Discover
