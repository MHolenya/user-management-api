import express from 'express'
import cookieParser from 'cookie-parser';
import userRoute from './routes/userRouter.js'
import dotenv from 'dotenv'
import connectDB from './controllers/datatabaseController.js'
import rateLimitingMiddleware from './middleware/rateLimit.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI

// Middleware to parse JSON bodies
app.use(express.json())
// Use cookie-parser middleware
app.use(cookieParser())

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
