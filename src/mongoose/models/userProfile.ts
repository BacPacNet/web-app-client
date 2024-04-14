import mongoose from 'mongoose'

const { Schema } = mongoose

const userProfileSchema = new Schema(
  {
    users_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      require: true,
    },
    profile_dp: {
      type: String,
      require: true,
    },
    cover_dp: {
      type: String,
      require: true,
      unique: true,
    },
    bio: {
      type: String,
    },
    phone_number: {
      type: String,
      enum: ['male', 'female', 'other'],
      required: true,
    },
    dob: {
      type: Date,
    },
    country: {
      type: String,
    },
    city: {
      type: String,
    },
    university_name: {
      type: String,
      require: true,
    },
    study_year: {
      type: String,
    },
    degree: {
      type: String,
    },
    major: {
      type: String,
    },
    affiliation: {
      type: String,
    },
    occupation: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)
module.exports = mongoose.model('userprofile', userProfileSchema)
