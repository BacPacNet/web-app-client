import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import fetch from 'cross-fetch'

const uri = `${process.env.WEB_URI}/api/graphql`
const client = new ApolloClient({
  link: new HttpLink({ uri: uri, fetch }),
  cache: new InMemoryCache(),
})

export default client
