import { ContactForm } from '@/components/organisms/ContactUsContainer'
import React from 'react'

const ContactUs = () => {
  return (
    <main className="flex min-h-screen flex-col items-center   bg-neutral-100">
      <div className="flex  flex-col items-center  max-width-allowed w-full py-16 ">
        <div className="w-11/12 md:w-full max-w-[640px] bg-white p-4 sm:p-8 md:p-12 rounded-lg shadow-[0px_6px_15px_-2px_rgba(16,24,40,0.08),0px_6px_15px_-2px_rgba(16,24,40,0.08)]">
          <ContactForm />
        </div>
      </div>
    </main>
  )
}

export default ContactUs
