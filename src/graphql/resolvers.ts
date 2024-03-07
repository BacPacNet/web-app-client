const resolvers = {
  Query: {
    colleges: async (
      _: unknown,
      __: unknown,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      context: any
    ) => {
      try {
        return await context.dataSources.colleges.getAllColleges()
      } catch (error) {
        throw new Error('Failed to fetch colleges')
      }
    },
    college: async (
      _: unknown,
      args: { id: string },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      context: any
    ) => {
      try {
        return await context.dataSources.colleges.getCollegeById(args.id)
      } catch (error) {
        console.log(error)

        throw new Error(`Failed to fetch college with id: ${args.id} `)
      }
    },
  },
}

export default resolvers
