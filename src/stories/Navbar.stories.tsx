import type { Meta } from '@storybook/react'
import Navbar from '@components/Navbar/Navbar'

const navbarStory: Meta = {
  title: 'Navbar',
  component: Navbar,
  parameters: {
    componentSubtitle: 'Navbar with animations',
  },
}

export default navbarStory

const Template = () => <Navbar />
// const Template = () => <Navbar withAnimation />
export const simpleNavbar = Template.bind({})
