import { connect } from 'mongoose'

/**
 * Connect to MongoDB.
 * @param {string} MONGODB_URI - MongoDB connection URI.
 */
export const connectDB = async (MONGODB_URI) => {
  try {
    await connect(MONGODB_URI)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log('Error connecting to MongoDB', error)
  }
}

export default connectDB
