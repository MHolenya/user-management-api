import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model('users', userSchema)

export default User