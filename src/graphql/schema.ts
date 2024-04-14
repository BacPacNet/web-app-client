const typeDefs = `#graphql
    type Query {
        college(collegeId: String!): College
        colleges: [College]
        testColleges(limit: Int = 20, seed: Float = 0): [College]
        user(id:Id!):User
    }
    type User{ 
        email:String
        password:String
        firstName:String
        lastName:String
        gender:String
        dob:String
    }
    input RegisterInput{
        email:String
        password:String
        firstName:String
        lastName:String
        gender:String
        dob:String
    }
    input LoginInput{
        email:String
        password:String
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
    type Mutation {
        registerUser(registerInput:RegisterInput):User
    }
`

export default typeDefs
