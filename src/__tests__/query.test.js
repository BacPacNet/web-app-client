import '@testing-library/jest-dom'

import client from '../client'
import { gql } from '@apollo/client'

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
async function fetchData() {
  const result = await client.query({ query })
  return result
}
test('the data is of college', async () => {
  const result = await fetchData()
  expect(result.data).not.toBeNull()
  expect(result?.data).toHaveProperty('universityList')
  expect(result?.data?.universityList).toBeInstanceOf(Array)
  expect(result?.data?.universityList?.length).toBeGreaterThan(0)
}, 10000)
// test to check the format of data recived by the query
test('the data has specific properties', async () => {
  const result = await fetchData()
  result?.data?.universityList?.forEach((college) => {
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
}, 10000)
