
// MongoDB Data Source for College
import CollegeModel from "../models/college";
import { MongoDataSource } from "apollo-datasource-mongodb";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";

interface CollegeDocument {
  _id: ObjectId;
  collegeId: String;
  name: String;
  score: String;
  city: String;
  country: String;
  programs: [Program];
  tutionFee: String;
}
interface Program {
    name: String;
    courses: [Course];
}
interface Course {
    name: String;
    degrees: [String];
}

export default class Colleges extends MongoDataSource<CollegeDocument> {
  // Function to fetch all users
  async getAllColleges() {
    try {
      return await CollegeModel.find();
    } catch (error) {
      throw new Error("Failed to fetch colleges");
    }
  }
    // Function to fetch a single college by id
    async getCollegeById(id: string) {
        try {
            return await CollegeModel.findOne({ collegeId: id });
        } catch (error) {
            throw new Error("Failed to fetch college");
        }
    }
}