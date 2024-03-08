import { gql } from '@apollo/client'

const GET_COLLEGES = gql`
  query Colleges {
    colleges {
      collegeId
      name
      score
      city
      country
      programs {
        name
        courses {
          name
          degrees
        }
      }
      tuitionFee
    }
  }
`

const GET_COLLEGE = gql`
  query College($id: ID!) {
    college(id: $id) {
      collegeId
      name
      score
      city
      country
      programs {
        name
        courses {
          name
          degrees
        }
      }
      tuitionFee
    }
  }
`

const GET_TEST_COLLEGES = gql`
  query testColleges($limit: Int = 20) {
    testColleges(limit: $limit) {
      collegeId
      name
      score
      city
      country
      programs {
        name
        courses {
          name
          degrees
        }
      }
      tuitionFee
    }
  }
`
export { GET_COLLEGES, GET_COLLEGE, GET_TEST_COLLEGES }
