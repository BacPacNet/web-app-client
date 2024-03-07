const typeDefs = `#graphql
    type Query {
        college(id: String!): College
        colleges: [College]
    }

    type College {
        id: String!
        name: String!
        score: String!
        city: String!
        country: String!
        programs: [Program]
        tuitionFee: String
    }

    type Program {
        name: String!
        courses: [Course]
    }

    type Course {
        name: String!
        degrees: [String!]
    }
`

export default typeDefs
