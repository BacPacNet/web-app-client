import { gql } from '@apollo/client'

// export const query = gql`
//   query getUniversityName($id: ID!) {
//     university_name(id: $id)
//   }
// `
export const query = gql`
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
