import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import fetch from 'cross-fetch'

const client = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:3000/api/graphql', fetch }),
  cache: new InMemoryCache(),
})

export default client