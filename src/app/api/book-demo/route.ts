import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phone, university, occupation, designation, message, date, time } = body

    // 1. Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      return NextResponse.json({ success: false, message: 'Full Name is required.' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'A valid official email is required.' }, { status: 400 })
    }

    if (!phone || typeof phone !== 'string' || phone.trim() === '') {
      return NextResponse.json({ success: false, message: 'Phone Number is required.' }, { status: 400 })
    }

    if (!university || typeof university !== 'string' || university.trim() === '') {
      return NextResponse.json({ success: false, message: 'University / Institution is required.' }, { status: 400 })
    }

    if (!occupation || typeof occupation !== 'string' || occupation.trim() === '') {
      return NextResponse.json({ success: false, message: 'Occupation / Role is required.' }, { status: 400 })
    }

    if (!designation || typeof designation !== 'string' || designation.trim() === '') {
      return NextResponse.json({ success: false, message: 'Designation is required.' }, { status: 400 })
    }

    if (!date) {
      return NextResponse.json({ success: false, message: 'Please select a date.' }, { status: 400 })
    }

    if (!time || typeof time !== 'string' || time.trim() === '') {
      return NextResponse.json({ success: false, message: 'Please select a time slot.' }, { status: 400 })
    }

    // 2. SMTP Transporter Setup
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    })

    // 3. Tabular Data Email Body
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
        <div style="background-color: #6744ff; color: white; padding: 20px; text-align: center;">
          <h2 style="margin: 0; font-size: 24px;">New Demo Booking Request</h2>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Unibuzz Student Community Platform</p>
        </div>
        <div style="padding: 20px;">
          <p>Hello Admin,</p>
          <p>A new demo has been scheduled. Below are the details submitted by the user:</p>
          
          <table style="border-collapse: collapse; width: 100%; margin: 20px 0; font-size: 14px; text-align: left;">
            <tbody>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold; color: #6744ff; width: 35%;">Full Name</td>
                <td style="padding: 12px; color: #222;">${fullName}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee; background-color: #fbfbfe;">
                <td style="padding: 12px; font-weight: bold; color: #6744ff;">Official Email</td>
                <td style="padding: 12px; color: #222;"><a href="mailto:${email}" style="color: #6744ff; text-decoration: none;">${email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold; color: #6744ff;">Phone Number</td>
                <td style="padding: 12px; color: #222;">${phone}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee; background-color: #fbfbfe;">
                <td style="padding: 12px; font-weight: bold; color: #6744ff;">University</td>
                <td style="padding: 12px; color: #222;">${university}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold; color: #6744ff;">Occupation / Role</td>
                <td style="padding: 12px; color: #222;">${occupation}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee; background-color: #fbfbfe;">
                <td style="padding: 12px; font-weight: bold; color: #6744ff;">Designation</td>
                <td style="padding: 12px; color: #222;">${designation}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 12px; font-weight: bold; color: #6744ff;">Preferred Date</td>
                <td style="padding: 12px; color: #222; font-weight: bold;">${date}</td>
              </tr>
              <tr style="border-bottom: 1px solid #eee; background-color: #fbfbfe;">
                <td style="padding: 12px; font-weight: bold; color: #6744ff;">Preferred Time</td>
                <td style="padding: 12px; color: #222; font-weight: bold;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 12px; font-weight: bold; color: #6744ff; vertical-align: top;">Message</td>
                <td style="padding: 12px; color: #555; white-space: pre-line;">${message || 'No message provided.'}</td>
              </tr>
            </tbody>
          </table>

          <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 15px;">
            This email was automatically generated and sent from your Unibuzz platform.
          </p>
        </div>
      </div>
    `

    const recipients = [
      // 'isha.vishank@gmail.com',
      // 'catcharyan.23@gmail.com',
      // 'info@unibuzz.org',
      // 'ishagupta.may6@gmail.com',
      // 'parkkanidon@gmail.com',
      // 'park.joohyun@outlook.com',
      'pavank@cheenti.com'
    ]

    // 4. Send Email
    await transporter.sendMail({
      from: `"Unibuzz Platform" <${process.env.EMAIL_FROM || 'bacpactech@gmail.com'}>`,
      to: recipients.join(', '),
      subject: `New Demo Request: ${fullName} - ${university}`,
      html: htmlBody,
    })

    return NextResponse.json({ success: true, message: 'Demo request received and email sent.' })
  } catch (error: any) {
    console.error('Email sending error:', error)
    return NextResponse.json({ success: false, message: 'Internal Server Error while sending email.' }, { status: 500 })
  }
}
