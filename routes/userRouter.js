const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  res.send({ data: 'USER DATA' })
})

module.exports = router
