import Navbar from '../app/components/Navbar/Navbar'

export default {
  title: 'Navbar',
  component: Navbar,
  parameters: {
    componentSubtitle: 'Navbar with animations',
  },
}
const Template = (args) => <Navbar withAnimation />
export const simpleNavbar = Template.bind({})
