import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import fetch from 'cross-fetch'

const uri =
  process.env.NODE_ENV == 'development'
    ? 'http://localhost:3000/api/graphql'
    : 'https://web-app-client-jg2xfkwxj-bacpacs-projects.vercel.app/api/graphql'
const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache(),
})

export default client
