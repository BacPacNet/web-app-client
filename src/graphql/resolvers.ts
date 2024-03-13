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
      args: { collegeId: string },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      context: any
    ) => {
      try {
        return await context.dataSources.colleges.getCollegeById(args.collegeId)
      } catch (error) {
        console.log(error)

        throw new Error(`Failed to fetch college with id: ${args.collegeId} `)
      }
    },
    testColleges: async (
      _: unknown,
      args: { limit: number, seed: number},
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      context: any
    ) => {
      try {
        return await context.dataSources.colleges.getTestColleges(args.limit, args.seed)
      } catch (error) {
        throw new Error('Failed to fetch test colleges')
      }
    },
  },
}

export default resolvers
