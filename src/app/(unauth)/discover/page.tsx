import DiscoverContainer from '@/components/organisms/DiscoverContainer'
import React from 'react'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/discover`
  const ogImage = 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/unibuzz_logo_extralarge.png'
  const title = 'Discover Universities and Communities | UniBuzz'
  const description = 'Discover universities, student communities, and trending campus topics on UniBuzz.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: url,
    },
  }
}

function Discover() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/discover`
  const description = 'Discover universities, student communities, and trending campus topics on UniBuzz.'
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Discover Universities and Communities | UniBuzz',
    description,
    url,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <DiscoverContainer />
    </>
  )
}

export default Discover
