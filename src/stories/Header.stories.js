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
<<<<<<< HEAD
const LoggedIn = {
=======

export default headerStory
export const LoggedIn = {
>>>>>>> d2fbd219736b40e9ebe46e3fc3bb010704ec69ce
  args: {
    user: {
      name: 'Jane Doe',
    },
  },
}

const LoggedOut = {
  args: {},
}
<<<<<<< HEAD
module.exports = {
  headerStory,
  LoggedIn,
  LoggedOut,
}
=======
>>>>>>> d2fbd219736b40e9ebe46e3fc3bb010704ec69ce
