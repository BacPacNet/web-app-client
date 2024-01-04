import Home from '../app/page'

const story = {
  title: 'HomePage',
  component: Home,
  parameters: {
    layout: 'fullscreen',
  },
}

export default story
const Template = () => <Home />
export const homePage = Template.bind({})
