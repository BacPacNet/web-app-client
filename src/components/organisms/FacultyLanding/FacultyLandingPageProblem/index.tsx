import type { LucideIcon } from 'lucide-react'
import SectionHeader from '@/components/atoms/SectionHeader'
import whatsappIcon from '@/assets/facultyLanding/whatsappGroupIcon.svg'
import emailIcon from '@/assets/facultyLanding/missedEmail.svg'
import clubIcon from '@/assets/facultyLanding/clubs.svg'
import userSearchIcon from '@/assets/facultyLanding/student.svg'
import barChartIcon from '@/assets/facultyLanding/engagement.svg'
import layoutGridIcon from '@/assets/facultyLanding/campus.svg'
import Image, { StaticImageData } from 'next/image'

const problemCards: { title: string; description: string; Icon: StaticImageData }[] = [
  {
    title: 'Informal WhatsApp groups',
    description: 'Open chat groups are hard to control, easy to leave, and impossible to verify.',
    Icon: whatsappIcon,
  },
  {
    title: 'Email updates get missed',
    description: 'Important official communication is buried in crowded inboxes and rarely read.',
    Icon: emailIcon,
  },
  {
    title: 'Clubs and events lack visibility',
    description: 'Activity is scattered, so participation stays low and momentum is lost.',
    Icon: clubIcon,
  },
  {
    title: "Students can't discover peers",
    description: 'Finding the right people, groups, and opportunities is left to chance.',
    Icon: userSearchIcon,
  },
  {
    title: 'Admins lack engagement visibility',
    description: "Leadership has no reliable view of what's working across campus.",
    Icon: barChartIcon,
  },
  {
    title: 'Campus life is scattered',
    description: 'Communication is spread across too many disconnected platforms.',
    Icon: layoutGridIcon,
  },
]

export default function FacultyLandingPageProblem() {
  return (
    <section className="bg-slate-50 py-16 sm:py-20 lg:py-[100px] mx-auto px-4 " id="problem">
      <div className="mx-auto w-full max-width-allowed">
        <SectionHeader
          badge="The problem"
          badgeVariant="red"
          title="Campus communication is fragmented and student"
          highlight=" outreach falls flat."
          highlightClassName="text-red-500"
          description="University communication is spread across informal tools that institutions can't verify, control, or measure. At the same time, universities struggle to effectively showcase their campus, culture, and opportunities to prospective students."
          descriptionClassName="max-w-[600px]"
          maxWidth="max-w-[800px]"
        />

        <div className="mt-10 grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
          {problemCards.map(({ title, description, Icon }) => (
            <div key={title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
              <div className="mb-2 flex items-center justify-start ">
                <Image src={Icon} alt={title} width={44} height={44} className="h-[44px] w-[44px]" />
              </div>
              <h3 className="mt-4 font-poppins text-[20px] font-semibold text-[#131A2B]">{title}</h3>
              <p className="mt-1.5 font-inter text-xs text-[#5B6477]">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
