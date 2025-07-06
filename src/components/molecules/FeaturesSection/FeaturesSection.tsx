import { ReactNode } from 'react'
import { CiMail } from 'react-icons/ci'
import { HiOutlinePencil } from 'react-icons/hi'
import { HiMiniUserGroup } from 'react-icons/hi2'
import { IoIosSearch } from 'react-icons/io'
import { IoFileTrayStackedOutline } from 'react-icons/io5'
import { PiRobotBold } from 'react-icons/pi'

interface FeaturesSectionProps {
  title: string
  className?: string
}

const features = [
  {
    title: 'Private and Group Messaging',
    description: 'Communicate one-on-one or within groups in a secure and user-friendly interface.',
    icon: <CiMail />,
  },
  {
    title: 'LaTeX Editing',
    description: 'Communicate scientific and mathematical information directly within our platform.',
    icon: <HiOutlinePencil />,
    isUpcoming: true,
  },
  {
    title: 'Large File Transfers',
    description: 'Transfer large files such as ebooks or research material based on your plan.',
    icon: <IoFileTrayStackedOutline />,
    isUpcoming: true,
  },
  {
    title: 'AI Assistant',
    description: 'Ask anything related to your university to our AI Assistant.',
    icon: <PiRobotBold />,
  },
  {
    title: 'Smart Search and Filters',
    description: 'Instantly find your university, courses, clubs, circles, and people.',
    icon: <IoIosSearch />,
  },
  {
    title: 'Intuitive Organization',
    description: 'Have all your universities and groups organized neatly with our intuitive interface.',
    icon: <HiMiniUserGroup />,
  },
]

const FeaturesSection = ({ title, className = '' }: FeaturesSectionProps) => {
  return (
    <section className={`bg-surface-neutral-100 flex flex-col items-center gap-6 md:pt-24 sm:pt-16 pt-12 md:pb-32 sm:pb-20 pb-14 my-10 ${className}`}>
      <div className="lg:max-width-allowed mx-auto px-2 md:px-4 w-full">
        <h2 className="font-poppins md:text-4xl sm:text-3xl text-2xl max-w-lg font-bold text-neutral-700 text-center mx-auto">{title}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:mt-8 sm:mt-6 mt-4 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-start bg-white py-6 px-4 rounded-md shadow-lg text-left gap-3 mx-4 sm:mx-0">
              <div className="xs:p-3 p-2 md:text-2xl xs:text-xl text-lg bg-[#F3F2FF] text-primary-500 rounded-full">{feature.icon}</div>
              <h3 className="font-poppins text-2sm font-semibold text-neutral-700">
                {feature.title}{' '}
                {feature.isUpcoming && <span className="text-primary-500 text-2xs bg-surface-primary-50 px-2 py-1 rounded-full">Upcoming</span>}
              </h3>
              <p className="text-sm text-neutral-500 mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
