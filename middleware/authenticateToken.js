import jwt from 'jsonwebtoken'

/**
 * Middleware to authenticate JWT token.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 * @returns {void}
 */
export function authenticateToken(req, res, next) {
  const token = req.cookies.token
  try {
    // If no token, return 401 Unauthorized
    if (!token) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    // Verify JWT token
    const user = jwt.verify(token, process.env.SECRET_JWT)
    req.user = user
    next()
  } catch (error) {
    // Clear cookie and return 401 Unauthorized on error
    res.clearCookie('token')
    res.status(401).json({ message: 'Unauthorized' })
  }
}

/**
 * Middleware to authenticate refresh JWT token.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 * @returns {void}
 */
export function authenticateRefreshToken(req, res, next) {
  const refreshToken = req.cookies.refresh_token
  try {
    // If no refresh token, return 401 Unauthorized
    if (!refreshToken) {
      res.status(401).json({ message: 'Unauthorized' })
      return
    }

    // Verify refresh JWT token
    const user = jwt.verify(refreshToken, process.env.REFRESH_JWT)
    req.user = user
    next()
  } catch (error) {
    // Clear cookie and return 401 Unauthorized on error
    res.clearCookie('refresh_token')
    res.status(401).json({ message: 'Unauthorized' })
  }
}

/**
 * Middleware to authenticate JWT token and refresh JWT token.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 * @returns {void}
 */
// eslint-disable-next-line space-before-function-paren
export function authenticateJWT(req, res, next) {
  const username = req.body.username
  // Check for access token
  const token = req.cookies.token
  // Check for refresh token
  const refreshToken = req.cookies.refresh_token
  try {
    if (!token && !refreshToken) {
      // If no token or refresh token, return 401 Unauthorized
      return res.status(401).json({ message: 'Unauthorized' })
    }

    let user
    if (token) {
      // Verify JWT token
      user = jwt.verify(token, process.env.SECRET_JWT)
    } else {
      // Verify refresh JWT token
      user = jwt.verify(refreshToken, process.env.REFRESH_JWT)

      // Generate new access token
      const expireDateToken = new Date(Date.now() + 15 * 60 * 1000)
      const expireDateRefreshToken = new Date(Date.now() + 24 * 60 * 60 * 1000)

      const accessToken = jwt.sign({ username }, process.env.SECRET_JWT, { expiresIn: '15m' })
      const newRefreshToken = jwt.sign({ username }, process.env.REFRESH_JWT, { expiresIn: '1d' })

      res.cookie('token', accessToken, {
        secure: true,
        httpOnly: true,
        expires: expireDateToken,
        sameSite: 'strict'
      })
      res.cookie('refresh_token', newRefreshToken, {
        secure: true,
        httpOnly: true,
        expires: expireDateRefreshToken,
        sameSite: 'strict'
      })
    }
    // Set user object in request
    req.user = user
    next()
  } catch (error) {
    // Clear cookies and return 401 Unauthorized on error
    if (token) {
      res.clearCookie('token')
    }
    if (refreshToken) {
      res.clearCookie('refresh_token')
    }
    res.status(401).json({ message: 'Unauthorized' })
  }
}
