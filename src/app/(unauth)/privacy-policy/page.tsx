import { Metadata } from 'next'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/privacy-policy`
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

function PrivacyPolicyPage() {
  return (
    <main className="max-width-allowed mx-auto sm:px-0 px-4 pt-8 pb-4 text-justify">
      {/*<div className="mx-auto max-w-4xl">*/}
      <h1 className="font-poppins md:text-4xl text-md-big font-bold text-neutral-700 mb-6">Privacy Policy</h1>

      <p className="text-neutral-500 font-normal md:text-xs text-2xs mb-4">Effective Date: August 1, 2024</p>

      <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16 ">
        Welcome to UniBuzz. At UniBuzz Networks, we are committed to protecting your privacy and handling your data in an open and transparent manner.
        This Privacy Policy outlines how we collect, use, process, and share your personal information when you use our services, website, and mobile
        application (collectively, the &quot;Service&quot;).
      </p>

      <section className="mb-16">
        <h2 className="font-poppins md:text-md-big text-2sm font-bold text-neutral-700 mb-4">Information We Collect</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          We collect information you provide directly to us when you create an account, use our Service, or communicate with us. This includes but is
          not limited to:
        </p>
        <ul className="list-disc pl-6 text-neutral-600 font-normal md:text-xs text-2xs space-y-2">
          <li>Your name, email address, phone number, and any other information you choose to provide.</li>
          <li>User content (e.g., photos, comments, and other materials) that you post to the Service.</li>
          <li>We also automatically collect information about your use of the Service, such as:</li>
          <li>
            Log information: We log information about your use of the Service, including the type of browser you use, access times, pages viewed, and
            your IP address.
          </li>
          <li>
            Device information: We collect information about the computer or mobile device you use to access our Service, including the hardware
            model, operating system and version, unique device identifiers, and mobile network information.
          </li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-md-big text-2sm font-bold text-neutral-700 mb-4">How We Use Your Information</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-4">
          We use the information we collect to provide, maintain, and improve our services. This includes using information to:
        </p>
        <ul className="list-disc pl-6 text-neutral-600 font-normal md:text-xs text-2xs space-y-2">
          <li>Create and maintain your account.</li>
          <li>Process transactions and send you related information.</li>
          <li>
            Communicate with you about products, services, offers, promotions, and provide news and information we think will be of interest to you.
          </li>
          <li>Monitor and analyze trends, usage, and activities in connection with our Service.</li>
          <li>Personalize and improve the Service and provide advertisements, content, or features that match user profiles or interests.</li>
        </ul>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-md-big text-2sm font-bold text-neutral-700 mb-4">Sharing of Information</h2>
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
        <h2 className="font-poppins md:text-md-big text-2sm font-bold text-neutral-700 mb-4">International Data Transfers</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs">
          We are based in [Country] and the information we collect is governed by [Country] law. By accessing or using the Service or otherwise
          providing information to us, you consent to the processing, transfer, and storage of information in and to the U.S. and other countries,
          where you may not have the same rights and protections as you do under local law.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-md-big text-2sm font-bold text-neutral-700 mb-4">Your Rights</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs">
          You have the right to access, rectify, or erase your personal information, and restrict or object to certain processing of your information.
          Where applicable, you may also have a right to data portability and to lodge a complaint with your local data protection authority.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-md-big text-2sm font-bold text-neutral-700 mb-4">Data Retention</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs">
          We retain your personal information for as long as necessary to provide the Service and fulfill the transactions you have requested, or for
          other essential purposes such as complying with our legal obligations, resolving disputes, and enforcing our policies.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="font-poppins md:text-md-big text-2sm font-bold text-neutral-700 mb-4">Changes to Privacy Policy</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs">
          We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy
          and, in some cases, we may provide you with additional notice (such as adding a statement to our homepage or sending you a notification).
        </p>
      </section>

      <section className="">
        <h2 className="font-poppins md:text-md-big text-2sm font-bold text-neutral-700 mb-4">Contact Information</h2>
        <p className="text-neutral-600 font-normal md:text-xs text-2xs">
          If you have any questions about these Terms, please contact us through our contact form.
        </p>
      </section>
      {/*</div>*/}
    </main>
  )
}

export default PrivacyPolicyPage
