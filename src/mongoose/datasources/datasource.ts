// MongoDB Data Source for College

import CollegeModel from '../models/college'
import { MongoDataSource } from 'apollo-datasource-mongodb'
import { ObjectId } from 'mongodb'

interface CollegeDocument {
  _id: ObjectId
  id: string
  name: string
  score: string
  city: string
  country: string
  programs: [Program]
  tuitionFee: string
}
interface Program {
  name: string
  courses: [Course]
}
interface Course {
  name: string
  degrees: [string]
}

export default class Colleges extends MongoDataSource<CollegeDocument> {
  // Function to fetch all users
  async getAllColleges() {
    try {
      const colleges = await CollegeModel.find()
      return colleges
    } catch (error) {
      throw new Error('Failed to fetch colleges')
    }
  }
  // Function to fetch a single college by id
  async getCollegeById(id: string) {
    try {
      const college = await CollegeModel.findOne({ id })
      return college
    } catch (error) {
      throw new Error('Failed to fetch college')
    }
  }
}
