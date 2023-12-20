import type { Meta, StoryObj } from '@storybook/react'
import Navbar from '../app/components/Navbar/Navbar'
const navbarStory: Meta = {
  title: 'Navbar',
  component: Navbar,
  parameters: {
    componentSubtitle: 'Navbar with animations',
  },
}

export default navbarStory

type Story = StoryObj<typeof navbarStory>
const Template = () => <Navbar />
// const Template = () => <Navbar withAnimation />
export const simpleNavbar: Story = Template.bind({})
