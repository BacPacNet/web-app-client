import '@testing-library/jest-dom'

import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

import fetch from 'cross-fetch'
import { gql } from '@apollo/client'

interface College {
  id: string
  name: string
  score: string
  city: string
  country: string
}

const query = gql`
  query getUniversityList {
    universityList {
      id
      name
      score
      country
      city
    }
  }
`

const uri = 'https://web-app-client-b69l4yjrq-bacpacs-projects.vercel.app/api/graphql'
console.log('GraphQL URI in tests:', uri)
const client = new ApolloClient({
  link: new HttpLink({ uri, fetch }),
  cache: new InMemoryCache(),
})
// test to check the data is not empty
test('the data is of college', async () => {
  const result = await client.query({ query })

  expect(result?.data).not.toBeNull()
  expect(result?.data).toHaveProperty('universityList')
  expect(result?.data?.universityList).toBeInstanceOf(Array)
  expect(result?.data?.universityList?.length).toBeGreaterThan(0)
})
// test to check the format of data recived by the query
test('the data has specific properties', async () => {
  const result = await client.query({ query })

  result?.data?.universityList?.forEach((college: College) => {
    // check for id property
    expect(college).toHaveProperty('id')
    expect(college?.id).not.toBeNull()
    expect(typeof college?.id).toBe('string')
    // check for name property
    expect(college).toHaveProperty('name')
    expect(college?.name).not.toBeNull()
    expect(typeof college?.name).toBe('string')
    // check for score property
    expect(college).toHaveProperty('score')
    expect(college?.score).not.toBeNull()
    expect(typeof college?.score).toBe('string')
    // check for country property
    expect(college).toHaveProperty('country')
    expect(college?.country).not.toBeNull()
    expect(typeof college?.country).toBe('string')
  })
})
