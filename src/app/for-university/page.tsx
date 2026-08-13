import FacultyLandingPageHero from '@/components/organisms/FacultyLanding/FacultyLandingPageHero'
import FacultyLandingPageProblem from '@/components/organisms/FacultyLanding/FacultyLandingPageProblem'
import FacultyLandingPageSolution from '@/components/organisms/FacultyLanding/FacultyLandingPageSolution'
import FacultyLandingPageHowItWorks from '@/components/organisms/FacultyLanding/FacultyLandingPageHowItWorks'
import FacultyLandingPageComparison from '@/components/organisms/FacultyLanding/FacultyLandingPageComparison'
import FacultyLandingPagePricing from '@/components/organisms/FacultyLanding/FacultyLandingPagePricing'
import FacultyLandingPageTestimonials from '@/components/organisms/FacultyLanding/FacultyLandingPageTestimonials'
import FacultyLandingPagePartners from '@/components/organisms/FacultyLanding/FacultyLandingPagePartners'
import FacultyLandingPageFooter from '@/components/organisms/FacultyLanding/FacultyLandingPageFooter'

export default function FacultyPage() {
  return (
    <div className="bg-white  mx-auto ">
      <FacultyLandingPageHero />
      <FacultyLandingPageProblem />
      <FacultyLandingPageSolution />
      <FacultyLandingPageHowItWorks />
      <FacultyLandingPageComparison />
      <FacultyLandingPagePricing />
      <FacultyLandingPageTestimonials />
      <FacultyLandingPagePartners />
      <FacultyLandingPageFooter />
    </div>
  )
}
