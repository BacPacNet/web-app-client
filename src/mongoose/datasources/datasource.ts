// MongoDB Data Source for College
import CollegeModel from '../models/college'
import { MongoDataSource } from 'apollo-datasource-mongodb'
import { ObjectId } from 'mongodb'

interface CollegeDocument {
  _id: ObjectId
  collegeId: string
  name: string
  score: string
  city: string
  country: string
  programs: [Program]
  tutionFee: string
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
      return await CollegeModel.find()
    } catch (error) {
      throw new Error('Failed to fetch colleges')
    }
  }
  // Function to fetch a single college by id
  async getCollegeById(id: string) {
    try {
      return await CollegeModel.findOne({ collegeId: id })
    } catch (error) {
      throw new Error('Failed to fetch college')
    }
  }
}
