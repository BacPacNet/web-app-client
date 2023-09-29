import { userEvent, within } from '@storybook/testing-library'

import { Page } from './Page'

const pageStory = {
  title: 'Example/Page',
  component: Page,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
}

const LoggedOut = {}

// More on interaction testing: https://storybook.js.org/docs/react/writing-tests/interaction-testing
const LoggedIn = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const loginButton = await canvas.getByRole('button', {
      name: /Log in/i,
    })
    await userEvent.click(loginButton)
  },
}
module.exports = { pageStory, LoggedIn, LoggedOut }
