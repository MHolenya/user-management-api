import express from 'express'
import cookieParser from 'cookie-parser'
import userRoute from './routes/userRouter.js'
import dotenv from 'dotenv'
import connectDB from './controllers/datatabaseController.js'
import rateLimitingMiddleware from './middleware/rateLimit.js'
import authenticateApiToken from './middleware/authenticateToken.js'
import cors from 'cors'
import csrf from 'csurf'
import logger from 'morgan'

dotenv.config()
const app = express()
app.use(logger('dev'))

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
const ORIGIN = process.env.ORIGIN.toString()

const csrfProtection = csrf({ cookie: true })

// Middleware to parse JSON bodies
app.use(express.json())
// Midleware cors
app.use(cors({ origin: ORIGIN, credentials: true }))

// Use cookie-parser middleware
app.use(cookieParser())

// Use CSRF protection middleware
app.use(csrfProtection)

// Apply rate limiting middleware
app.use(rateLimitingMiddleware)

// Apply API token middleware
app.use(authenticateApiToken)
// Route for user-related endpoints
app.use('/user', userRoute)

// Connect to MongoDB
connectDB(MONGODB_URI)

// Start the server
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})
