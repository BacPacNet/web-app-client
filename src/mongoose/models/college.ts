// College Model Creation
const mongoose = require("mongoose");
const { Schema } = mongoose;

const collegeSchema = new Schema({
  // Define college fields here matching the GraphQL schema
  collegeId: String, //collegeId is mapped to id in graphql schema and differs from default _id field of mongodb
  name: { type: String, required: [true, "A College must have a name"] },
  score: {
    type: Number,
    required: [true, "A College must have a score"]
  },
  city: {
    type: String,
    required: [true, "A College must have a associated city"],
  },
  country: {
    type: String,
    required: [true, "A College must have a associated country"],
  },
  programs: [{
    name: { type: String, required: true },
    courses: [{
      name: { type: String, required: true},
      degrees: [{ type: String, required: true }],
    }],
  }],
  tutionFee: {
    type: String,
    required: [true, "A College must have a tution fee"],
  },
});

export default mongoose.models.CollegeModel || mongoose.model("CollegeModel", collegeSchema, "colleges");