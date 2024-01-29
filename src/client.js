import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import fetch from 'cross-fetch'

// uri = 'https://web-app-client-flame.vercel.app/api/graphql'
let uri
switch (process.env.NEXT_PUBLIC_LOCAL_STATE) {
  case 'development':
    uri = 'http://localhost:3000/api/graphql'
    break
  case 'test':
    uri = 'http://localhost:3000/api/graphql'
    break
  case 'production':
    uri = 'https://web-app-client-lraro1uh2-bacpacs-projects.vercel.app'
    break
  default:
    break
}
console.log('graphql_uri', uri)
const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache(),
})

export default client
