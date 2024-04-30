import mongoose from 'mongoose'

/**
 * Mongoose schema for users.
 */
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
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
