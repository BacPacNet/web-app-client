import React from 'react'
import { Metadata } from 'next'
import { getUniversityByName } from '@/services/universitySearch'
import ClientUniversityProfile from '@/components/template/ClientUniversityProfile'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const universityName = params.id
  const url = `${baseUrl}/discover/${universityName}`

  // Fetch university data
  let university: any = null
  try {
    const data = await getUniversityByName(universityName)
    university = Array.isArray(data) ? data[0] : data
  } catch (e) {
    // fallback
  }

  const ogImage = university?.logo || 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/unibuzz_logo_extralarge.png'

  return {
    title: university?.name ? `${university.name} | UniBuzz` : 'University | UniBuzz',
    description:
      university?.short_overview || university?.long_description || 'Discover university communities, connect, and explore opportunities on UniBuzz.',
    openGraph: {
      title: university?.name ? `${university.name} | UniBuzz` : 'University | UniBuzz',
      description:
        university?.short_overview ||
        university?.long_description ||
        'Discover university communities, connect, and explore opportunities on UniBuzz.',
      url,
      siteName: 'UniBuzz',
      images: [
        {
          url: ogImage,
          width: 256,
          height: 256,
          alt: university?.name ? `Profile page for ${university.name} on UniBuzz` : 'University profile on UniBuzz',
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

export default function Page({ params }: { params: { id: string } }) {
  return <ClientUniversityProfile universityName={params.id} />
}
