import SectionHeader from '@/components/atoms/SectionHeader'
import MegaphoneIcon from '@/assets/facultyLanding/megaphone.svg'
import VerifiedAccessIcon from '@/assets/facultyLanding/verified.svg'
import UniversityWideFeedIcon from '@/assets/facultyLanding/globe.svg'
import DepartmentCourseGroupsIcon from '@/assets/facultyLanding/course.svg'
import ClubsSocietiesIcon from '@/assets/facultyLanding/users.svg'
import PlacementCareerUpdatesIcon from '@/assets/facultyLanding/briefcase.svg'
import MessagingCollaborationIcon from '@/assets/facultyLanding/messagesprimary.svg'
import AdminModerationControlsIcon from '@/assets/facultyLanding/security.svg'
import Image, { StaticImageData } from 'next/image'

const solutionCards: { title: string; description: string; Icon: StaticImageData }[] = [
  {
    title: 'Official announcements',
    description: 'Pin verified updates that every student actually sees.',
    Icon: MegaphoneIcon,
  },
  {
    title: 'Verified access',
    description: 'Verified student, faculty, and admin identities campus-wide.',
    Icon: VerifiedAccessIcon,
  },
  {
    title: 'University-wide feed',
    description: 'One community feed for the whole institution.',
    Icon: UniversityWideFeedIcon,
  },
  {
    title: 'Department & course groups',
    description: 'Structured spaces for every department and cohort.',
    Icon: DepartmentCourseGroupsIcon,
  },
  {
    title: 'Clubs & societies',
    description: 'Give student groups a home with real visibility.',
    Icon: ClubsSocietiesIcon,
  },
  {
    title: 'Placement & career updates',
    description: 'Share drives, openings, and prep in one channel.',
    Icon: PlacementCareerUpdatesIcon,
  },
  {
    title: 'Messaging & collaboration',
    description: 'Direct and group messaging that stays on-platform.',
    Icon: MessagingCollaborationIcon,
  },
  {
    title: 'Admin & moderation controls',
    description: 'Role-based permissions and approval workflows.',
    Icon: AdminModerationControlsIcon,
  },
]

export default function FacultyLandingPageSolution() {
  return (
    <section className="bg-white py-16 sm:py-20 lg:py-[100px] px-4" id="community">
      <div className="mx-auto w-full max-width-allowed">
        <SectionHeader
          badge="The solution"
          badgeVariant="indigo"
          maxWidth="full-width"
          maxtitleWidth="max-w-[800px]"
          title={<>Unibuzz brings the university community into </>}
          highlight="one verified digital space"
          description="Everything campus communication needs — official, structured, and institution-controlled."
          className="sm:mb-[60px]"
        />

        <div className="grid grid-cols-1 gap-4 pt-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {solutionCards.map(({ title, description, Icon }) => (
            <div key={title} className="flex lg:h-[220px] h-[186px] flex-col rounded-xl border border-[#E5E7EB] p-5 pb-0 shadow-md">
              <div className="flex  items-center justify-start ">
                <Image src={Icon} alt={title} width={44} height={44} className="h-[44px] w-[44px]" />
              </div>
              <h3 className="mt-3 font-poppins text-[20px] font-semibold text-[#131A2B]">{title}</h3>
              <p className="font-inter text-xs lg:max-w-none max-w-[230px] text-[#5B6477]">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
