import jwt from 'jsonwebtoken'

export default function authenticateToken(req, res, next) {
  const SECRET_JWT = process.env.SECRET_JWT
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  // If no token, return 401
  if (token == null) {
    return res.sendStatus(401)
  }
  console.log(SECRET_JWT)
  jwt.verify(token, SECRET_JWT, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
