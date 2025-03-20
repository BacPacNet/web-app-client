import { ContactForm } from '@/components/organisms/ContactUsContainer'
import React from 'react'

const ContactUs = () => {
  return (
    <main className="flex min-h-screen flex-col items-center   bg-[#ffffff]">
      <div className="flex  flex-col items-center  max-width-allowed w-full my-16">
        <div className="w-full max-w-[640px]">
          <ContactForm />
        </div>
      </div>
    </main>
  )
}

export default ContactUs
