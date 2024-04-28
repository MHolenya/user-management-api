import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/**
 * Controller handling user-related operations.
 */
const userController = {
  /**
   * Get one user by id.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   */
  getUserByUsername: async (req, res) => {
    try {
      const username = req.params.username
      const user = await User.findOne({ username: username })

      // Check if user exists in the database
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json(user)
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  /**
   * Sign up a new user.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   */
  signUp: async (req, res) => {
    try {
      const { username, email, password } = req.body

      // Check if all fields are filled
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' })
      }

      const hashedPassword = await bcrypt.hash(password, 10)
      const user = new User({
        username,
        email,
        password: hashedPassword
      })

      await user.save()

      res.json({ message: 'User created successfully' })
    } catch (error) {
      console.error('Error in signUp:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  },

  /**
   * Login a user.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   */
  Login: async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await User.findOne({ email })

      // Check if user exists
      if (!user) {
        return res.status(401).json({ message: 'Invalid Email' })
      }
      // Verify password
      const isPassword = bcrypt.compare(password, user.password) // Await bcrypt.compare
      if (!isPassword) {
        return res.status(401).json({ message: 'Invalid Password' })
      }
      delete user.password
      // Generate JWT token
      const accessToken = jwt.sign({ username: user.usermane }, process.env.SECRET_JWT, { expiresIn: '15min' })

      const refreshToken = jwt.sign({ username: user.usermane }, process.env.REFRESH_JWT, { expiresIn: '1d' })
      // Send token as response
      const expireDate = new Date(Date.now() + 1 * 60 * 1000)
      const expireDateRefreshToken = new Date(Date.now() + 24 * 60 * 60 * 1000)

      res.cookie('token', accessToken, {
        secure: true,
        httpOnly: true,
        expires: expireDate
      })

      res.cookie('refresh_token', refreshToken, {
        secure: true,
        httpOnly: true,
        expires: expireDateRefreshToken
      })

      res.json({
        message: 'User logged in successfully',
        username: user.username
      })

    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }

  // Update a user

  // Delete a user
}

export default userController
