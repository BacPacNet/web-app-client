'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import toast from 'react-hot-toast'
import './page.css'
import styles from '../for-university/page.module.css'
import Footer from '@/components/Footer/Footer'
import Script from 'next/script'

export default function BookDemoPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>('11:00 AM')
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date())
  const router = useRouter()

  // Form states
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [university, setUniversity] = useState('')
  const [occupation, setOccupation] = useState('Administrator')
  const [designation, setDesignation] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  // Helper to determine day of the week for a Date
  const getDayOfWeekName = (date: Date) => {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    return {
      name: dayNames[date.getDay()],
      index: date.getDay(),
    }
  }

  const formatReadableDate = (date: Date) => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
  }

  // Get active time slots based on rules
  const getTimeSlotsForDay = (date: Date) => {
    const { index } = getDayOfWeekName(date)

    switch (index) {
      case 1: // Monday: 8am to 2pm and 5pm to 7pm
        return ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '05:00 PM', '06:00 PM']
      case 2: // Tuesday: 8am to 2pm and 5pm to 7pm
        return ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '05:00 PM', '06:00 PM']
      case 3: // Wednesday: 8am to 2pm and 3pm to 7pm
        return ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM']
      case 4: // Thursday: 1pm to 7pm
        return ['01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM']
      case 5: // Friday: 8am to 7pm
        return ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM']
      case 6: // Saturday: 8am to 2pm
        return ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM']
      default: // Sunday
        return []
    }
  }

  const activeTimeSlots = getTimeSlotsForDay(selectedDate)

  // Automatically update selected time if previous choice is unavailable on the newly selected day
  useEffect(() => {
    if (activeTimeSlots.length > 0) {
      if (!activeTimeSlots.includes(selectedTime)) {
        setSelectedTime(activeTimeSlots[0])
      }
    } else {
      setSelectedTime('')
    }
  }, [selectedDate, activeTimeSlots, selectedTime])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (!fullName.trim()) {
      toast.error('Full Name is required.')
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      toast.error('A valid official email is required.')
      return
    }
    if (!phone.trim()) {
      toast.error('Phone Number is required.')
      return
    }
    if (!university.trim()) {
      toast.error('University / Institution is required.')
      return
    }
    if (!designation.trim()) {
      toast.error('Designation is required.')
      return
    }
    if (activeTimeSlots.length === 0) {
      toast.error('Cannot book a demo on Sunday. Please select another day.')
      return
    }
    if (!selectedTime) {
      toast.error('Please select an available time slot.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/book-demo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          university,
          occupation,
          designation,
          message,
          date: formatReadableDate(selectedDate),
          time: selectedTime,
        }),
      })

      const resData = await response.json()

      if (response.ok && resData.success) {
        toast.success(
          `Your demo has been scheduled for ${getDayOfWeekName(selectedDate).name}, ${formatReadableDate(selectedDate)} at ${selectedTime}!`
        )
        // Reset form fields
        setFullName('')
        setEmail('')
        setPhone('')
        setUniversity('')
        setDesignation('')
        setMessage('')
        router.push('/book-demo/thank-you')
      } else {
        toast.error(resData.message || 'Failed to schedule demo.')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Google Tag Manager */}
      <Script id="gtm-script" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5FM87MGZ');`}
      </Script>
      {/* Google Tag Manager (noscript) */}
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-5FM87MGZ"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      <div
        className={`${styles.landingPageWrapper} meshBg text-on-surface antialiased min-h-screen flex flex-col relative overflow-x-hidden font-sans`}
      >
        {/* Ambient Grid & Particles */}
        <div className="fixed inset-0 gridTexture pointer-events-none z-[-1]" />
        <div aria-hidden="true" className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-primary/5 rounded-full blur-3xl mix-blend-multiply" />
          <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-secondary/5 rounded-full blur-3xl mix-blend-multiply" />
          <div className="particle w-32 h-32 top-[15%] right-[25%]" style={{ animationDelay: '0s' }} />
          <div className="particle w-48 h-48 bottom-[30%] left-[15%]" style={{ animationDelay: '-3s' }} />
          <div className="particle w-24 h-24 top-[60%] right-[10%]" style={{ animationDelay: '-5s' }} />
        </div>

        {/* Main Content */}
        <main className="flex-grow w-full max-width-allowed mx-auto px-2 md:px-4 py-12 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-16">
            {/* Headline & Subtext */}
            <div className="col-span-1 lg:col-span-5 flex flex-col gap-4 order-1">
              <h1 className="text-4xl md:text-5xl font-bold text-on-surface leading-tight">Book Your Personalized Demo</h1>
              <p className="text-lg text-on-surface-variant leading-relaxed" style={{ fontSize: '20px' }}>
                See how Unibuzz can centralize communication, improve student engagement, and simplify campus management for your university.
              </p>
            </div>

            {/* RIGHT PANEL: Booking Form */}
            <div id="booking-form" className="col-span-1 lg:col-span-7 order-2 lg:row-span-6 w-full">
              <div className="glassPanel rounded-[24px] p-8 md:p-12 w-full">
                <h2 className="text-3xl font-bold text-on-surface mb-8">Schedule Your Demo</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  {/* Combined Calendar & Time Selection UI */}
                  <div className="flex flex-col md:flex-row gap-8 pb-8 border-b border-glass-stroke">
                    {/* Mini Calendar */}
                    <div className="w-full md:w-1/2">
                      <div className="flex justify-between items-center mb-4">
                        <span className="font-semibold text-on-surface">
                          {(() => {
                            const monthNames = [
                              'January',
                              'February',
                              'March',
                              'April',
                              'May',
                              'June',
                              'July',
                              'August',
                              'September',
                              'October',
                              'November',
                              'December',
                            ]
                            return `${monthNames[currentMonthDate.getMonth()]} ${currentMonthDate.getFullYear()}`
                          })()}
                        </span>
                        <div className="flex gap-2">
                          <button
                            className="p-1 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-30 disabled:hover:bg-transparent"
                            type="button"
                            onClick={() => {
                              const y = currentMonthDate.getFullYear()
                              const m = currentMonthDate.getMonth()
                              setCurrentMonthDate(new Date(y, m - 1, 1))
                            }}
                            disabled={(() => {
                              const today = new Date()
                              return (
                                currentMonthDate.getFullYear() < today.getFullYear() ||
                                (currentMonthDate.getFullYear() === today.getFullYear() && currentMonthDate.getMonth() <= today.getMonth())
                              )
                            })()}
                          >
                            <span className="material-symbols-outlined text-sm">chevron_left</span>
                          </button>
                          <button
                            className="p-1 hover:bg-surface-variant rounded-full text-on-surface-variant transition-colors focus:ring-2 focus:ring-primary focus:outline-none"
                            type="button"
                            onClick={() => {
                              const y = currentMonthDate.getFullYear()
                              const m = currentMonthDate.getMonth()
                              setCurrentMonthDate(new Date(y, m + 1, 1))
                            }}
                          >
                            <span className="material-symbols-outlined text-sm">chevron_right</span>
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        <div className="text-xs font-semibold text-on-surface-variant">Su</div>
                        <div className="text-xs font-semibold text-on-surface-variant">Mo</div>
                        <div className="text-xs font-semibold text-on-surface-variant">Tu</div>
                        <div className="text-xs font-semibold text-on-surface-variant">We</div>
                        <div className="text-xs font-semibold text-on-surface-variant">Th</div>
                        <div className="text-xs font-semibold text-on-surface-variant">Fr</div>
                        <div className="text-xs font-semibold text-on-surface-variant">Sa</div>
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center">
                        {/* Empty cells for padding */}
                        {Array.from({ length: new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), 1).getDay() }).map((_, idx) => (
                          <div key={`pad-${idx}`} />
                        ))}
                        {/* Days */}
                        {Array.from({ length: new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 0).getDate() }).map(
                          (_, idx) => {
                            const day = idx + 1
                            const dateObj = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), day)
                            const isSelected = dateObj.toDateString() === selectedDate.toDateString()
                            const { name } = getDayOfWeekName(dateObj)
                            const isSunday = name === 'Sunday'

                            // Check if date is in the past
                            const today = new Date()
                            today.setHours(0, 0, 0, 0)
                            const isPast = dateObj.getTime() < today.getTime()
                            const isDisabled = isPast || isSunday

                            return (
                              <button
                                key={day}
                                onClick={() => {
                                  if (!isDisabled) {
                                    setSelectedDate(dateObj)
                                  }
                                }}
                                className={`p-2 text-sm transition-all focus:ring-2 focus:ring-primary focus:outline-none rounded-full ${
                                  isSelected
                                    ? 'font-bold shadow-sm'
                                    : isDisabled
                                    ? 'text-gray-300 cursor-not-allowed hover:bg-transparent'
                                    : 'text-on-surface-variant cursor-pointer hover:bg-primary/10 hover:text-primary'
                                }`}
                                style={isSelected ? { backgroundColor: '#6744ff', color: '#ffffff' } : undefined}
                                type="button"
                                disabled={isDisabled}
                              >
                                {day}
                              </button>
                            )
                          }
                        )}
                      </div>
                    </div>

                    {/* Time Slots */}
                    <div className="w-full md:w-1/2 flex flex-col h-[280px]">
                      <span className="font-semibold text-on-surface mb-2">Available Times ({getDayOfWeekName(selectedDate).name})</span>
                      {activeTimeSlots.length > 0 ? (
                        <div className="timeSlots overflow-y-auto flex flex-col gap-2 pl-1 pr-2">
                          {activeTimeSlots.map((time) => {
                            const isSelected = time === selectedTime
                            return (
                              <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                className={`w-full py-3 px-4 rounded-lg text-sm transition-all text-center focus:ring-2 focus:ring-primary focus:outline-none ${
                                  isSelected
                                    ? 'border-2 border-primary text-primary font-bold shadow-sm'
                                    : 'border border-outline-variant hover:border-primary text-on-surface font-normal'
                                }`}
                                style={
                                  isSelected
                                    ? { backgroundColor: 'rgba(103, 68, 255, 0.05)', borderColor: '#6744ff' }
                                    : { backgroundColor: '#ffffff' }
                                }
                                type="button"
                              >
                                {time}
                              </button>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="text-sm text-red-500 font-medium my-auto text-center p-4 border border-red-200 bg-red-50/50 rounded-lg">
                          Closed on Sundays.
                          <br />
                          Please pick a Monday–Saturday date.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface" htmlFor="fullName">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full bg-surface-white/80 border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        id="fullName"
                        placeholder="Jane Doe"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface" htmlFor="email">
                        Official Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full bg-surface-white/80 border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        id="email"
                        placeholder="jane@university.edu"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface" htmlFor="phone">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full bg-surface-white/80 border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        id="phone"
                        placeholder="+1 (555) 000-0000"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface" htmlFor="university">
                        University / Institution <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full bg-surface-white/80 border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        id="university"
                        placeholder="State University"
                        type="text"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface" htmlFor="occupation">
                        Occupation / Role <span className="text-red-500">*</span>
                      </label>
                      <select
                        className="w-full bg-surface-white/80 border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-on-surface-variant"
                        id="occupation"
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        required
                      >
                        <option>Administrator</option>
                        <option>Faculty / Professor</option>
                        <option>IT / Systems</option>
                        <option>Student Leader</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-semibold text-on-surface" htmlFor="designation">
                        Designation <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full bg-surface-white/80 border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        id="designation"
                        placeholder="e.g. Professor, Dean"
                        type="text"
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-on-surface" htmlFor="message">
                      Message (Optional)
                    </label>
                    <textarea
                      className="w-full bg-surface-white/80 border border-outline-variant rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                      id="message"
                      placeholder="What specific challenges are you looking to solve?"
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                  <button
                    className="w-full bg-primary text-on-primary py-4 rounded-lg font-semibold hover:bg-primary-container transition-colors shadow-sm flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:outline-none disabled:opacity-50"
                    type="submit"
                    disabled={loading || activeTimeSlots.length === 0}
                    style={{ backgroundColor: '#6744ff' }}
                  >
                    {loading ? 'Scheduling...' : 'Schedule Free Demo'}
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Illustration */}
            <div className="col-span-1 lg:col-span-5 rounded-xl overflow-hidden glassPanel relative aspect-[1.34] order-3">
              <Image
                alt="Unibuzz Platform Demo Illustration"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4NjTc9dn06RI93xgsnkWVuYscEltiukKgvSZtgh_q5uxr_qIeMnMEzcS9mCxhMuKHbBy1Xan3nwJKvPBx51xGudCDozc373GxmE-1GQgZS3X-t98JTAKesVotyocI3c_QBcKenFBdksw3GmIo9VQDyTr1Iays9FxnS_2PW8FuBYaxhF0o6ZIaKyQsaM0HKm0x-ykYKCqTxnU6PrcsutwwCvl-fzyfz4n3BChN2KpFHofswLRZBCPLhnOWNceopF09mnBqTlP81a_m"
              />
            </div>

            {/* Benefits Checklist */}
            <div className="col-span-1 lg:col-span-5 flex flex-col gap-4 order-4">
              <h3 className="text-xl font-bold text-on-surface mb-2">What you&apos;ll get:</h3>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                <p className="text-lg text-on-surface-variant" style={{ fontSize: '22px' }}>
                  Personalized platform walkthrough
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                <p className="text-lg text-on-surface-variant" style={{ fontSize: '22px' }}>
                  30-minute live demonstration
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary mt-1">check_circle</span>
                <p className="text-lg text-on-surface-variant" style={{ fontSize: '22px' }}>
                  Answers tailored to your university
                </p>
              </div>
            </div>

            {/* Features Pill Cloud */}
            <div className="col-span-1 lg:col-span-5 pt-6 border-t border-glass-stroke order-5">
              <h4 className="text-xs font-bold text-on-surface-variant mb-4 uppercase tracking-wider">Features Covered</h4>
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">Official Communication</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">Placement Hub</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">Course Communities</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">Student Clubs</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">BuzzBot AI</span>
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">Mobile & Web Experience</span>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="col-span-1 lg:col-span-5 flex items-center gap-6 mt-2 order-6">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                  shield
                </span>
                <span className="text-xs font-semibold">Secure</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                  info
                </span>
                <span className="text-xs font-semibold">No obligation</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                  support_agent
                </span>
                <span className="text-xs font-semibold">Dedicated onboarding</span>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </>
  )
}
