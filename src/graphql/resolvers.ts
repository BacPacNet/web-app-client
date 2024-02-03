const resolvers = {
    Query: {
        colleges: async (
          _: any,
          __: any,
          context: any
        ) => {
          try {
            return await context.dataSources.colleges.getAllColleges();
          } catch (error) {
            throw new Error("Failed to fetch colleges");
          }
        },
        college: async (
          _: any,
          args: { id: string },
          context: any
        ) => {
          try {
            return await context.dataSources.colleges.getCollegeById(args.id);
          } catch (error) {
            throw new Error(`Failed to fetch college with id: ${args.id} `);
          }
        },
    },
  };
  
  export default resolvers;