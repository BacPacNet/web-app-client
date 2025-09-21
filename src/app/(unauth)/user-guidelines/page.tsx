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
      <h1 className="font-poppins md:text-4xl text-md-big  font-bold text-neutral-700 mb-6">User Guidelines </h1>

      <p className="text-neutral-500 font-normal md:text-xs text-2xs mb-4">Updated: September 20, 2025</p>
      <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Welcome to the Unibuzz Community</h2>
      <p className="text-neutral-600 font-normal md:text-xs text-2xs mb-16">
        Unibuzz is a space built by students, for students. Our mission is to create an inclusive, empowering environment for students, alumni,
        applicants, and faculty members across universities. We facilitate collaboration on projects, seeking advice, and making lifelong connections,
        ensuring you feel safe, respected, and valued. By using Unibuzz, you agree to follow these rules.
      </p>

      {/* Respectful Conduct */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px] font-bold text-neutral-700 mb-6">Respectful Conduct</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">Treat everyone with kindness. Zero tolerance for harassment, hate speech, bullying, or discrimination.</li>
          <li className="text-gray-700">
            Avoid personal attacks. Disagreements are acceptable, but conversations should focus on ideas, not individuals.
          </li>
          <li className="text-gray-700">Be inclusive. Respect identities, backgrounds, and lived experiences of fellow users.</li>
        </ul>
      </section>

      {/* Authentic Identity */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px]  font-bold text-neutral-700 mb-6">Authentic Identity</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">Use your real name and university affiliation to foster trust within the community.</li>
          <li className="text-gray-700">Do not impersonate others or misrepresent your background.</li>
          <li className="text-gray-700">Your profile should reflect who you are, both socially and academically.</li>
        </ul>
      </section>

      {/* Privacy and Security */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px]  font-bold text-neutral-700 mb-6">Privacy and Security</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">Do not share personal information (e.g., phone numbers, addresses, private messages) without consent.</li>
          <li className="text-gray-700">Never engage in doxxing or attempts to expose others&apos; private data.</li>
          <li className="text-gray-700">
            If you feel unsafe or notice misconduct, report it using the platform&apos;s built-in tools or contact support.
          </li>
        </ul>
      </section>

      {/* Academic and Intellectual Integrity */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px]  font-bold text-neutral-700 mb-6">Academic and Intellectual Integrity</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">Don&apos;t plagiarize. Always credit the original source when sharing materials, notes, or research.</li>
          <li className="text-gray-700">Avoid spreading misinformation. Fact-check before posting, especially in academic groups.</li>
          <li className="text-gray-700">Use the platform to learn and grow, not to cheat or bypass educational standards.</li>
        </ul>
      </section>

      {/* Content Standards */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px]  font-bold text-neutral-700 mb-6">Content Standards</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">Keep content relevant to university life — courses, housing, events, clubs, academic resources, etc.</li>
          <li className="text-gray-700">Do not share or promote illegal content, violence, explicit material, or age-restricted media.</li>
          <li className="text-gray-700">Refrain from spamming, mass invites, or using bots to artificially boost engagement.</li>
        </ul>
      </section>

      {/* Engagement and Collaboration */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px]  font-bold text-neutral-700 mb-6">Engagement and Collaboration</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">Participate actively and meaningfully. Join study sessions, respond to posts, and offer support.</li>
          <li className="text-gray-700">Respect group-specific rules in university or course-based communities.</li>
          <li className="text-gray-700">Don&apos;t derail conversations or use unrelated threads for self-promotion.</li>
        </ul>
      </section>

      {/* Promotions and Advertisements */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px]  font-bold text-neutral-700 mb-6">Promotions and Advertisements</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">Promotional content, including group invites and event links, must be approved by Unibuzz moderators.</li>
          <li className="text-gray-700">DM-based unsolicited promotions are strictly prohibited.</li>
          <li className="text-gray-700">Student-run initiatives, startups, or clubs are welcome but must follow community promotion policies.</li>
        </ul>
      </section>

      {/* Enforcement */}
      <section className="mb-8">
        <h2 className="font-poppins text-[20px]  font-bold text-neutral-700 mb-6">Enforcement</h2>
        <ul className="space-y-3 list-disc pl-4 text-neutral-600 font-normal md:text-xs text-2xs mb-16">
          <li className="text-gray-700">Breaking these rules may result in warnings, content removal, temporary suspension, or permanent bans.</li>
          <li className="text-gray-700">Our moderators are here to help — but abusive behavior toward them will not be tolerated.</li>
          <li className="text-gray-700">False reports or misuse of the reporting system may also result in action.</li>
        </ul>
      </section>
    </main>
  )
}

export default Userguidelines
