import mongoose from 'mongoose'
/**
 * Mongoose schema for messages.
 */
const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'chats' },
  timestamp: { type: Date, default: Date.now }
})

const Message = mongoose.model('messages', messageSchema)

export default Message
