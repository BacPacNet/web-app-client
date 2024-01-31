import gql from 'graphql-tag';

const typeDefs = gql`
    type Query {
        college(id: ID!): [College]
        colleges: [College]
    }

    type College {
        id: ID!
        name: String!
        score: String!
        city: String!
        country: String!
        programs: [Program]
        tutionFee: String
    }

    type Program {
        name: String!
        courses: [Course]
    }

    type Course {
        name: String!
        degrees: [String!]!
    }
`;

export default typeDefs;