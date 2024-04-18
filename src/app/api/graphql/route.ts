import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
import { NextRequest } from 'next/server'
import typeDefs from '@/graphql/schema'
import resolvers from '@/graphql/resolvers'
import mongoose from 'mongoose'
import Colleges from '@/mongoose/datasources/datasource'
import CollegeModel from '@/mongoose/models/college'

const uri = process.env.MONGODB_URI

const connectDB = async () => {
  try {
    if (uri) {
      await mongoose.connect(uri)
      console.log('🎉 connected to database successfully')
    }
  } catch (error) {
    console.error(error)
  }
}
connectDB()

const server = new ApolloServer({
  resolvers,
  typeDefs,
})

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req, res) => ({
    req,
    res,
    dataSources: {
      colleges: new Colleges({ modelOrCollection: CollegeModel }),
    },
  }),
})
export async function GET(request: NextRequest) {
  return handler(request)
}
export async function POST(request: NextRequest) {
  return handler(request)
}
