import { ContactForm } from '@/components/organisms/ContactUsContainer'
import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/contact`
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
          width: 52,
          height: 52,
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

const ContactUs = () => {
  return (
    <main className="flex min-h-screen flex-col items-center   bg-neutral-100">
      <div className="flex  flex-col items-center  max-width-allowed w-[90%] py-16 ">
        <div className="md:w-full max-w-[500px] bg-white  p-6 rounded-lg shadow-card">
          <ContactForm />
        </div>
      </div>
    </main>
  )
}

export default ContactUs
