import mongoose from 'mongoose'

/**
 * Mongoose schema for token.
 */
const tokenSchema = new mongoose.Schema({
  refresh_token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  refresh_token_expiration: { type: Date, required: true }
})

const Token = mongoose.model('tokens', tokenSchema)

export default Token
