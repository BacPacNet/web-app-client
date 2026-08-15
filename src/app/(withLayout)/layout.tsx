import Card from '@/components/atoms/Card'
import LeftNavbar from '@/components/organisms/LeftNavbar'
import Recommendations from '@/components/Timeline/Recommendations'
import FooterLinks from '@/components/molecules/FooterLinks'
import DownloadApp from '@/components/Timeline/rightSidebar/downloadApp'
import RouteLoader from '@/components/molecules/RouteLoader'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface-primary-50">
      <RouteLoader />

      <div className="max-w-[1280px] mx-auto flex h-with-navbar">
        <aside className="hidden lg:block bg-white w-[284px] sticky top-0">
          <LeftNavbar />
        </aside>

        <main className="md:px-12 px-4 overflow-y-auto h-with-navbar flex-1 !outline-none hideScrollbar">{children}</main>

        <aside className="hidden lg:block bg-white w-[284px] sticky top-0">
          <Card className="h-with-navbar custom-scrollbar overflow-y-auto px-4">
            <DownloadApp />
            <Recommendations />
            <FooterLinks isOnLeft={true} />
            <p className="text-neutral-500 text-xs font-normal text-center">Unibuzz Networks © 2024</p>
          </Card>
        </aside>
      </div>
    </div>
  )
}
