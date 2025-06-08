import React from 'react'
import { Metadata } from 'next'
import { getUniversityByName } from '@/services/universitySearch'
import ClientUniversityProfile from '@/components/template/ClientUniversityProfile'

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/discover/${params.id}`
  const ogImage = 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/unibuzz-logo.png'

  return {
    title: 'Privacy Policy | UniBuzz',
    description: 'Read the UniBuzz Privacy Policy to learn how we collect, use, and protect your personal information when you use our services.',
    openGraph: {
      title: 'Privacy Policy | UniBuzz',
      description: 'Read the UniBuzz Privacy Policy to learn how we collect, use, and protect your personal information when you use our services.',
      url,
      siteName: 'UniBuzz',
      images: [
        {
          url: ogImage,
          width: 256,
          height: 256,
          alt: 'Privacy Policy page on UniBuzz',
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
