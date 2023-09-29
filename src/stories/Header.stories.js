import { Header } from './Header'

const headerStory = {
  title: 'Example/Header',
  component: Header,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/react/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
}
const LoggedIn = {
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
}

const LoggedOut = {
  args: {},
}
module.exports = {
  headerStory,
  LoggedIn,
  LoggedOut,
}
