import ReportBug from '@/components/template/ReportBug'
import React from 'react'

const ContactUs = () => {
  return (
    <main className="flex min-h-screen flex-col items-center   bg-neutral-100">
      <div className="flex  flex-col items-center  max-width-allowed w-[90%] py-16 ">
        <ReportBug />
      </div>
    </main>
  )
}

export default ContactUs
