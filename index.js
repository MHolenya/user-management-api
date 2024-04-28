import express from 'express'
import userRoute from './routes/userRouter.js'
import connectDB from './controllers/datatabaseController.js'
import dotenv from 'dotenv'
import rateLimitingMiddleware from './middleware/rateLimit.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

// Middleware to parse JSON bodies
app.use(express.json())

// Apply rate limiting middleware
app.use(rateLimitingMiddleware)

// Route for user-related endpoints
app.use('/user', userRoute)

// Connect to MongoDB
connectDB(MONGODB_URI)

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
