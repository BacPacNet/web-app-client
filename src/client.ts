import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import fetch from 'cross-fetch'

const uri = '/api/graphql'
console.log('GraphQL URI in Client:', uri)
const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache(),
})
export default client
