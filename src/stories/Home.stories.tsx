import Home from '../app/page'
import { GET_COLLEGES } from '@/graphql/queries'
import { ApolloWrapper } from '@/lib/apollo-provider'
const story = {
  title: 'HomePage',
  component: Home,
  parameters: {
    layout: 'fullscreen',
    apolloClient: {
      // do not put MockedProvider here, you can, but its preferred to do it in preview.js
      mocks: [
        {
          request: {
            query: GET_COLLEGES,
          },
          result: {
            data: {
              viewer: null,
            },
          },
        },
      ],
    },
  },
}

export default story
const Template = () => (
  <ApolloWrapper>
    <Home />
  </ApolloWrapper>
)
export const homePage = Template.bind({})
