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
  async getCollegeById(collegeId: string) {
    try {
      const college = await CollegeModel.findOne({ collegeId })
      return college
    } catch (error) {
      throw new Error('Failed to fetch college')
    }
  }
  // Function to fetch a limited number of colleges
  async getTestColleges(limit: number, seed: number) {
    try {
      const totalColleges = await CollegeModel.countDocuments()
      //Get a random set of colleges (default = 20), by skipping a number of colleges determined by the seed( Float; 0 <= seed <= 1)
      //Seed = 0 means no colleges are skipped, seed = 1 means all colleges are skipped except the last 20.
      let skip = 0
      if (seed >= 0 && seed <= 1) {
        skip = Math.floor(seed * (totalColleges - limit))
      }
      console.log('No. of colleges skipped = ', skip)
      const colleges = await CollegeModel.find().skip(skip).limit(limit)
      return colleges
    } catch (error) {
      throw new Error('Failed to fetch test colleges')
    }
  }
}
