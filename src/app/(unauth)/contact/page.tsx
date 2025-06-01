import { ContactForm } from '@/components/organisms/ContactUsContainer'
import React from 'react'

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
