import Image from 'next/image'
import { Check } from 'lucide-react'
import SectionHeader from '@/components/atoms/SectionHeader'
import SectionBadge from '@/components/atoms/SectionBadge'

const features = [
  {
    badge: 'Promote & grow',
    title: 'Promote your university',
    description: 'Showcase your university to prospective students and applicants to boost admissions and increase revenue.',
    bullets: ['Promoted university posts', 'Promoted university blogs and stories', 'Direct pipeline to admissions'],
    image: '/promote.jpg',
    imageAlt: 'Students Collaborating',
    reversed: false,
  },
  {
    badge: 'Communicate & engage',
    title: 'Centralize official communication',
    description: 'Replace scattered chats and missed emails with pinned official announcements, a university-wide feed, and on-platform messaging.',
    bullets: ['Pinned official announcements', 'University-wide community feed', 'Messaging & collaboration'],
    image: '/centralize.jpg',
    imageAlt: 'Campus communication',
    reversed: true,
  },
  {
    badge: 'Verify & onboard',
    title: 'Bring your verified campus online',
    description:
      "Set up your institution's space, verify students, faculty, and admins, and structure departments, courses, clubs, and official groups.",
    bullets: ['Verified student, faculty & admin identities', 'Role-based access and permissions', 'Department, course & club structure'],
    image: '/bring.jpg',
    imageAlt: 'Aerial Campus View',
    reversed: false,
  },
]

export default function FacultyLandingPageHowItWorks() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-[100px] px-4" id="discover">
      <div className="mx-auto w-full max-width-allowed">
        <SectionHeader
          badge="How it works"
          badgeVariant="indigo"
          maxWidth="full-width"
          maxtitleWidth="max-w-[800px]"
          title={<>Enhance university visibility and student satisfaction for </>}
          align="start"
          highlight="increased revenue."
          description="Unify your entire university community on a single platform to boost visibility and student satisfaction, driving greater revenue."
        />

        <div className="mt-12 flex flex-col gap-8 lg:gap-16 p-5 lg:p-0 ">
          {features.map(({ badge, title, description, bullets, image, imageAlt, reversed }) => (
            <div
              key={title}
              className={`grid items-center gap-3 lg:gap-10  ${
                reversed ? 'grid-cols-1 lg:grid-cols-[1.1fr_1fr]' : 'grid-cols-1 lg:grid-cols-[1fr_1.1fr]'
              }`}
            >
              <div className={`flex flex-col lg:gap-5 gap-3 order-2 ${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
                <SectionBadge variant="indigo" className="w-fit">
                  {badge}
                </SectionBadge>
                <h3 className="font-poppins text-[20px] lg:text-lg-small font-semibold text-[#131A2B]">{title}</h3>
                <p className="font-inter text-xs lg:text-2sm text-[#5B6477] max-w-lg">{description}</p>
                <ul className=" flex flex-col gap-2.5">
                  {bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center  lg:gap-3 gap-2   ">
                      <div className="lg:w-5 lg:h-5 w-4 h-4 bg-[#E7F6ED] rounded-full flex items-center justify-center">
                        <Check size={14} className="shrink-0 text-[#1F9D57]" />
                      </div>
                      <p className="text-[13px] lg:text-sm font-inter font-medium text-[#131A2B]">{bullet}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`flex overflow-hidden rounded-3xl order-1 ${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
                <Image
                  src={image}
                  alt={imageAlt}
                  width={566}
                  height={420}
                  className="h-[238px] lg:h-[420px] lg:w-[566px] object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
