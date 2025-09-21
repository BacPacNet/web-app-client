import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/privacy-policy`
  const ogImage = 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/unibuzz_logo_extralarge.png'

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

function PrivacyPolicyPage() {
  return (
    <main className="max-width-allowed mx-auto sm:px-0 px-4 pt-8 pb-4 text-justify">
      {/*<div className="mx-auto max-w-4xl">*/}
      <p className="text-neutral-500 font-normal md:text-xs text-2xs mb-4">Updated: September 20, 2025</p>

      <h1 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Privacy Policy</h1>

      <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
        Welcome to Unibuzz. At Unibuzz Networks, we are committed to protecting your privacy and handling your data in an open, responsible, and
        transparent manner.
      </p>

      <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
        This Privacy Policy outlines how Unibuzz collects, uses, processes, and shares personal information when you interact with our websites,
        mobile application, and related services (collectively, the &quot;Service&quot;).
      </p>

      <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
        By using Unibuzz, you consent to the collection and use of information in accordance with this policy.
      </p>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Information We Collect</h2>

        <h3 className="font-poppins text-[16px] font-semibold text-neutral-700 mb-4">Directly Provided Information</h3>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          We collect information you provide directly to us when you create an account, use our Service, or communicate with us. This may include:
        </p>
        <ul className="list-disc pl-6 text-neutral-600 font-normal md:text-xs text-2xs space-y-2 mb-6">
          <li>Your name, email address (including university-affiliated email), phone number, and other information you provide.</li>
          <li>Content you submit, such as profile data, messages, photos, posts, or responses.</li>
          <li>Academic or university affiliation details, if you choose to verify your identity to access university communities.</li>
        </ul>

        <h3 className="font-poppins text-[16px] font-semibold text-neutral-700 mb-4">Automatically Collected Usage Information</h3>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">We also automatically collect certain usage information, including:</p>
        <ul className="list-disc pl-6 text-neutral-600 font-normal md:text-xs text-2xs space-y-2">
          <li>Log information such as IP address, browser type, pages visited, and access times.</li>
          <li>Device details such as operating system, device type, and unique identifiers.</li>
          <li>Metadata associated with your content (e.g., timestamp, geolocation if enabled).</li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">How We Use Your Information</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-6 text-neutral-600 font-normal md:text-xs text-2xs space-y-2">
          <li>Provide, personalize, and maintain the Service.</li>
          <li>Set up and manage your account.</li>
          <li>Verify your university affiliation where applicable.</li>
          <li>Respond to inquiries and provide customer support.</li>
          <li>Send transactional and promotional communications (you can opt-out).</li>
          <li>Monitor activity and ensure safety and policy compliance.</li>
          <li>Improve our features based on usage trends and feedback.</li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Sharing of Information</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">We may share personal information as follows:</p>
        <ul className="list-disc pl-6 text-neutral-600 font-normal md:text-xs text-2xs space-y-2">
          <li>With vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.</li>
          <li>
            In response to a request for information if we believe disclosure is in accordance with any applicable law, regulation, or legal process.
          </li>
          <li>
            If we believe your actions are inconsistent with our user agreements or policies, or to protect the rights, property, and safety of
            UniBuzz Networks or others.
          </li>
          <li>
            In connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our
            business by another company.
          </li>
          <li>
            Between and among UniBuzz Networks and our current and future parents, affiliates, subsidiaries, and other companies under common control
            and ownership.
          </li>
          <li>With your consent or at your direction.</li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">International Data Transfers</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          We are based in India, and your data will be processed in accordance with Indian laws.
        </p>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          If you access Unibuzz from outside India, your data may be transferred and processed in jurisdictions that may not offer the same level of
          data protection as your home country.
        </p>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs">By using our services, you consent to these transfers.</p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Your Rights</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">You have the right to:</p>
        <ul className="list-disc pl-6 text-neutral-600 font-normal md:text-xs text-2xs space-y-2 mb-4">
          <li>Access the personal data we hold about you.</li>
          <li>Request correction or deletion of your data.</li>
          <li>Restrict or object to certain processing activities.</li>
          <li>Withdraw consent at any time (where applicable).</li>
        </ul>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          You can make these requests by contacting us through the Contact Us form.
        </p>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs">
          If you believe your rights are not respected, you may also lodge a complaint with a data protection authority in your country.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Data Retention</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          We retain your information as long as your account is active or as needed to provide the Service.
        </p>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          We may also retain data to comply with legal obligations, resolve disputes, and enforce agreements.
        </p>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">You can request account deletion via the settings or contact form.</p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Security</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          We take the security of your personal data seriously and use industry-standard measures to protect it. These include encryption, firewalls,
          and secure access controls.
        </p>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs">
          However, no system is completely secure. We cannot guarantee the absolute security of your information, and you use the Service at your own
          risk.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Changes to This Policy</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          We may update this Privacy Policy from time to time. If we make material changes, we will notify you through the Service, by email, or
          through other reasonable means.
        </p>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs">The date at the top of this document reflects the latest revision.</p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Contact Us</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs">
          If you have any questions or concerns about this Privacy Policy or your data, please contact us through the Contact Us form on our website
          or email us at privacy@unibuzz.com.
        </p>
      </section>
      {/*</div>*/}
    </main>
  )
}

export default PrivacyPolicyPage
