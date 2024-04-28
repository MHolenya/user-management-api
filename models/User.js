import mongoose from 'mongoose'

/**
 * Mongoose schema for user.
 */
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  jwtoken: String,
  refreshToken: String,
  refreshTokenExpiresAt: Date,
  isVerified: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

/**
 * Mongoose model for user.
 */
const User = mongoose.model('users', userSchema)

export default User
