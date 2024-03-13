const typeDefs = `#graphql
    type Query {
        college(collegeId: String!): College
        colleges: [College]
        testColleges(limit: Int = 20, seed: Float = 0): [College]
    }

    type College {
        collegeId: String!
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
