import mongoose from 'mongoose'

/**
 * Mongoose schema for token.
 */
const tokenSchema = new mongoose.Schema({
  accessToken: { type: String, required: true },
  refreshToken: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  accessTokenExpiration: { type: Date, required: true },
  refreshTokenExpiration: { type: Date, required: true }
})

const Token = mongoose.model('tokens', tokenSchema)

export default Token
