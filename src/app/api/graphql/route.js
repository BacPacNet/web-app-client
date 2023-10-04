import { startServerAndCreateNextHandler } from '@as-integrations/next';
import { ApolloServer } from '@apollo/server';
import { gql } from 'graphql-tag';
import { MongoClient } from 'mongodb';

// The connection string for mongodb connection.
const uri = "mongodb+srv://ayushtiwari110:Ud7JOzOQRw6J93W2@bacpac.i8d4g8c.mongodb.net/";
const client = new MongoClient(uri);

async function getUniversityName(id) {
    try {
      const database = client.db('bacpac');
      const universities = database.collection('universities');
      const university = await universities.findOne({ id });
      return university.name;
    } finally {
      // Ensures that the client will close when you finish/error
      await client.close();
    }
  }

const resolvers = {
  Query: {
    university_name: async (_,args) => {
        return await getUniversityName(args.id);
    }
  },
};

const typeDefs = gql`
  type Query {
    hello: String
    university_name (id: ID!): String
  }
  type Name {
    name: String
  }
`;

const server = new ApolloServer({
  resolvers,
  typeDefs,
});



const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };