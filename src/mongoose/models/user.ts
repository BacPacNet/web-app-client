import mongoose from 'mongoose'

const { Schema } = mongoose
const userSchema = new Schema(
  {
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password_salt: {
      type: String,
      require: true,
    },
    first_name: {
      type: String,
      require: true,
      unique: true,
    },
    last_name: {
      type: String,
      require: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'], // Specify the possible choices
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)
export default mongoose.models.userModel || mongoose.model('userModel', userSchema, 'user')
