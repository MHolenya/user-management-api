import jwt from 'jsonwebtoken'

export default function authenticateToken(req, res, next) {
  console.log(req.cookies)
  const token = req.cookies.token

  try {
    // If no token, return 401
    if (!token) {
      return res.sendStatus(401)
    }

    const user = jwt.verify(token, process.env.SECRET_JWT)
    req.user = user
    next()

  } catch (error) {
    res.clearCookie('token')
    res.status(401).json({ message: 'Unauthorized' })
  }
}
