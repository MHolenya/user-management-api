import jwt from 'jsonwebtoken'
import Token from '../models/Token.js'

/**
 * Middleware to authenticate API token.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 * @returns {void}
 */
export function authenticateUserToken(req, res, next) {
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
 * Middleware to authenticate JWT token.
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {function} next - Next middleware function.
 * @returns {void}
 */
export default function authenticateApiToken(req, res, next) {
  try {
    const token = req.headers.authorization
    // If no token, return 401 Unauthorized
    if (!token || token !== process.env.API_TOKEN) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    // If token is valid, proceed to the next middleware
    next()
  } catch (error) {
    // If an error occurs, return 500 Internal Server Error
    console.error('Error in authenticateApiToken middleware:', error)
    res.status(500).json({ message: 'Internal Server Error' })
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
export async function authenticateJWT(req, res, next) {
  const userId = req.headers['X-User-ID']
  const username = req.headers['X-Username']

  // Check for access token
  const token = req.cookies.token
  // Check for refresh token
  const refreshToken = await Token.findOne({ userId })
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
      refreshToken.refresh_token = newRefreshToken
      refreshToken.refresh_token_expiration = expireDateRefreshToken

      await refreshToken.save()
    }
    // Set user object in request
    req.user = user
    next()
  } catch (error) {
    // Clear cookies and return 401 Unauthorized on error
    if (token) {
      res.clearCookie('token')
    }
    res.status(401).json({ message: 'Unauthorized' })
  }
}
