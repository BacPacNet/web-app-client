// story for discover component
import Discover from '@/app/discover/page'

const story = {
  title: 'DiscoveryPage',
  component: Discover,
  parameters: {
    layout: 'fullscreen',
  },
}

export default story
const Template = () => <Discover />
export const homePage = Template.bind({})
