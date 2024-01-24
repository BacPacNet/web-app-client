import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import fetch from 'cross-fetch'

const uri = process.env.LOCAL_STATE === 'development' ? 'http://localhost:3000/api/graphql' : 'https://web-app-client-flame.vercel.app/api/graphql'
console.log('graphql_uri', uri)
const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache(),
})

export default client
