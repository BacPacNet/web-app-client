import Home from '../app/page'

export default {
  title: 'HomePage',
  component: Home,
  parameters: {
    layout: 'fullscreen',
  },
}
const Template = (args) => <Home />
export const homePage = Template.bind({})
