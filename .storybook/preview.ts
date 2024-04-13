/** @type { import('@storybook/react').Preview } */
import '../src/app/globals.css'
import { MockedProvider } from '@apollo/client/testing';
const preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    apolloClient: {
      MockedProvider,
      globalMocks: [
        // whatever mocks you want here
      ],
      // any props you want to pass to MockedProvider on every story
    },
  },
}

export default preview
