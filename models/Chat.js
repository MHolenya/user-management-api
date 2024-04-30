import mongoose from 'mongoose'
/**
 * Mongoose schema for chats.
 */
const chatSchema = new mongoose.Schema({
  name: { type: String, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'messages' }]
})

const Chat = mongoose.model('chats', chatSchema)

export default Chat
