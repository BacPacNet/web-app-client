import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
import { ApolloServerPluginLandingPageLocalDefault, ApolloServerPluginLandingPageProductionDefault } from '@apollo/server/plugin/landingPage/default'
import { gql } from 'graphql-tag'
import { MongoClient } from 'mongodb'

// The connection string for mongodb connection.
const uri = process.env.MONGODB_URI || ''
const client = new MongoClient(uri)

async function getUniversityName(id) {
  try {
    const database = client.db('bacpac')
    const universities = database.collection('universities')
    const university = await universities.findOne({ id })
    return university.name
  } catch (error) {
    console.log(error)
  }
}

const resolvers = {
  Query: {
    university_name: async (_, args) => {
      return await getUniversityName(args.id)
    },
  },
}

const typeDefs = gql`
  type Query {
    university_name(id: ID!): String
  }
`

let plugins = []
const graphQLref = process.env.GRAPHQL_REF || ''
//Next.js auto assigns NODE_ENV value as development for 'next dev' command, and production for other commands
if (process.env.NODE_ENV === 'production') {
  plugins = [
    ApolloServerPluginLandingPageProductionDefault({
      embed: true,
      graphRef: graphQLref,
    }),
  ]
} else {
  plugins = [ApolloServerPluginLandingPageLocalDefault({ embed: true })]
}

const server = new ApolloServer({
  resolvers,
  typeDefs,
  plugins,
})

const handler = startServerAndCreateNextHandler(server)

//Exports the handler function to be used as a Next.js API route handler.
export { handler as GET, handler as POST }
