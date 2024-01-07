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
describe('test to check the data of collegeList', () => {
  let fetchedData
  beforeAll(async () => {
    fetchedData = await fetchData()
  })
  it('the data is of college', () => {
    expect(fetchedData?.data).toHaveProperty('universityList')
    expect(fetchedData?.data?.universityList).toBeInstanceOf(Array)
    expect(fetchedData?.data?.universityList?.length).toBeGreaterThan(0)
  })
  it('the data has specific properties', () => {
    // Reuse fetchedData in the second test
    fetchedData?.data?.universityList?.forEach((college) => {
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
})
