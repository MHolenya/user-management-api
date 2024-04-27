const express = require('express')
const userRoute = require('./routes/userRouter')

const app = express()
const PORT = 3000

app.use('/user', userRoute)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
