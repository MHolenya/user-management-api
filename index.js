import express from 'express'
import userRoute from './routes/userRouter.js'
import connectDB from './controllers/datatabaseController.js'
import dotenv from 'dotenv'

const app = express()
dotenv.config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.MONGODB_URI
app.use(express.json())

app.use('/user', userRoute)
connectDB(MONGODB_URI)

app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`)
})
