import { ContactForm } from '@/components/organisms/ContactUsContainer'
import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/contact`
  const ogImage = 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/unibuzz_logo_extralarge.png'

  return {
    title: 'Contact | UniBuzz',
    description:
      'Get in touch with UniBuzz. Reach out for support, inquiries, or feedback. We are here to help you connect with your university community.',
    openGraph: {
      title: 'Contact | UniBuzz',
      description:
        'Get in touch with UniBuzz. Reach out for support, inquiries, or feedback. We are here to help you connect with your university community.',
      url,
      siteName: 'UniBuzz',
      images: [
        {
          url: ogImage,
          width: 52,
          height: 52,
          alt: 'Contact page on UniBuzz',
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
