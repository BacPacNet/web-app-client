import { gql } from '@apollo/client'

const GET_COLLEGES = gql`
  query Colleges {
    colleges {
      id
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
      tutionFee
    }
  }
`

const GET_COLLEGE = gql`
  query College($id: ID!) {
    college(id: $id) {
      id
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
      tutionFee
    }
  }
`
export { GET_COLLEGES, GET_COLLEGE }
