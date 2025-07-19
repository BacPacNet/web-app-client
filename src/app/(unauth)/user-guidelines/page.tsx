import { Metadata } from 'next'
import React from 'react'
export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const url = `${baseUrl}/user-guidelines`
  const ogImage = 'https://unibuzz-uploads.s3.ap-south-1.amazonaws.com/assets/unibuzz_logo_extralarge.png'

  return {
    title: 'User Guidelines | UniBuzz',
    description: 'Read the UniBuzz User Guidelines to understand the rules and expectations for participating in our community.',
    openGraph: {
      title: 'User Guidelines | UniBuzz',
      description: 'Read the UniBuzz User Guidelines to understand the rules and expectations for participating in our community.',
      url,
      siteName: 'UniBuzz',
      images: [
        {
          url: ogImage,
          width: 52,
          height: 52,
          alt: 'User Guidelines page on UniBuzz',
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

function Userguidelines() {
  return (
    <main className="max-width-allowed mx-auto md:px-0 px-4 pt-8 pb-4 text-justify">
      <h1 className="font-poppins md:text-4xl text-md-big  font-bold text-neutral-700 mb-6">User Guidelines</h1>

      <p className="text-neutral-500 font-normal md:text-xs text-2xs mb-4">Effective Date: August 1, 2024</p>
      <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
        By using this platform, you agree to uphold these guidelines, ensuring a safe, collaborative, and enriching space for students.
      </p>

      {/* Respectful Content */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Respectful Content</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">
            Maintain Civility: Engage in discussions with respect and courtesy. Avoid hate speech, harassment, or any form of discrimination based on
            race, ethnicity, national origin, religious affiliation, sexual orientation, sex, gender identity, or disabilities.
          </li>
          <li className="text-gray-700">
            Constructive Engagement: Foster healthy debates and support your peers in academic and extracurricular endeavors.
          </li>
          <li className="text-gray-700">No Trolling or Bullying: Intentionally provoking, insulting, or degrading others will not be tolerated.</li>
        </ul>
      </section>

      {/* Authentic Identity */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px]  font-bold text-neutral-700 mb-6">Authentic Identity</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">
            Use Real Identities: Register with your actual name and university affiliation to build trust within the community.
          </li>
          <li className="text-gray-700">
            Avoid Impersonation: Do not create accounts that misrepresent your identity or falsely attribute content to others.
          </li>
          <li className="text-gray-700">Keep Profiles Honest: Ensure profile information is accurate and does not mislead other users.</li>
        </ul>
      </section>

      {/* Privacy and Security */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px]  font-bold text-neutral-700 mb-6">Privacy and Security</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">
            Protect Personal Information: Refrain from sharing sensitive data publicly. Be mindful of your own and others&apos; privacy.
          </li>
          <li className="text-gray-700">
            Report Misconduct: If you encounter suspicious activities or content that violates these guidelines, report it promptly.
          </li>
          <li className="text-gray-700">
            No Doxxing: Sharing personal information (e.g., phone numbers, addresses) without consent is strictly prohibited.
          </li>
        </ul>
      </section>

      {/* Intellectual Honesty */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px]  font-bold text-neutral-700 mb-6">Intellectual Honesty</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">Avoid Misinformation: Share accurate information and refrain from spreading false or misleading content.</li>
          <li className="text-gray-700">
            Cite Sources: When sharing academic materials or external content, provide proper attribution to original authors.
          </li>
          <li className="text-gray-700">No Plagiarism: Do not claim other&apos;s work as your own or repost content without permission.</li>
        </ul>
      </section>

      {/* Appropriate Content Sharing */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px]  font-bold text-neutral-700 mb-6">Appropriate Content Sharing</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">Relevant Contributions: Post content pertinent to student life, academics, and university events.</li>
          <li className="text-gray-700">
            Prohibited Content: Do not share explicit material, content promoting violence, or any form of illegal activities.
          </li>
          <li className="text-gray-700">
            No Spam or Fake Engagement: Do not artificially boost likes, shares, or comments through bots, multiple accounts, or incentives.
          </li>
        </ul>
      </section>

      {/* Collaborative Engagement */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px]  font-bold text-neutral-700 mb-6">Collaborative Engagement</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">
            Participate Actively: Engage in group discussions, study sessions, and collaborative projects to enrich the community experience.
          </li>
          <li className="text-gray-700">Respect Group Norms: Adhere to the specific rules of groups or forums you join within the platform.</li>
          <li className="text-gray-700">
            No Disruptive Behavior: Refrain from excessive self-promotion, irrelevant content, or hijacking discussions.
          </li>
        </ul>
      </section>

      {/* Compliance & Enforcement */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px]  font-bold text-neutral-700 mb-6">Compliance & Enforcement</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">Follow Platform Rules: Adherence to these guidelines is mandatory for all users.</li>
          <li className="text-gray-700">
            Consequences: Violations may result in content removal, account suspension, or permanent banning, depending on the severity of the
            offense.
          </li>
          <li className="text-gray-700">
            Reporting & Moderation: Use the platform&apos;s reporting tools to flag inappropriate content. False reports will also be subject to
            review.
          </li>
        </ul>
      </section>
    </main>
  )
}

export default Userguidelines
