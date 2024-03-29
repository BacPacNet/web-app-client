// College Model Creation
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mongoose = require('mongoose')
const { Schema } = mongoose

import { ObjectId } from 'mongodb'

const collegeSchema = new Schema({
  // Define college fields here matching the GraphQL schema
  _id: ObjectId,
  collegeId: String,
  name: { type: String, required: [true, 'A College must have a name'] },
  score: {
    type: Number,
    required: [true, 'A College must have a score'],
  },
  city: {
    type: String,
    required: [true, 'A College must have a associated city'],
  },
  country: {
    type: String,
    required: [true, 'A College must have a associated country'],
  },
  programs: [
    {
      name: { type: String, required: true },
      courses: [
        {
          name: { type: String, required: true },
          degrees: [{ type: String, required: true }],
        },
      ],
    },
  ],
  tuitionFee: {
    type: String,
    required: [true, 'A College must have a tuition fee'],
  },
})

export default mongoose.models.CollegeModel || mongoose.model('CollegeModel', collegeSchema, 'colleges')
