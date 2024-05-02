import User from '../models/User.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Token from '../models/Token.js'
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
      const user = await User.findOne({ username }, { password: 0 })

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
      const checkemail = await User.findOne({ email })
      const checkuser = await User.findOne({ username })

      if (checkuser) {
        return res.status(400).json({ message: 'User already exists' })
      }
      if (checkemail) {
        return res.status(400).json({ message: 'Email already exist' })
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
      const expireDate = new Date(Date.now() + 15 * 60 * 1000)
      const expireDateRefreshToken = new Date(Date.now() + 24 * 60 * 60 * 1000)

      res.cookie('token', accessToken, {
        secure: true,
        httpOnly: true,
        expires: expireDate,
        sameSite: 'strict'
      })

      const mongoRefreshToken = new Token({
        refresh_token: refreshToken,
        userId: user.id,
        refresh_token_expiration: expireDateRefreshToken
      })
      await mongoRefreshToken.save()
      res.setHeader('x-user-id', user.id)
      res.setHeader('x-username', user.username)

      res.json({
        message: 'User logged in successfully'
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  },
  // Update a user
  updateUser: async (req, res) => {
    try {
      const { username } = req.user
      const { email, newPassword } = req.body

      // Find the user by username
      const user = await User.findOne({ username })

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }

      // Update user's email if provided
      if (email) {
        user.email = email
      }

      // Update user's password if provided
      if (newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
      }
      // Save the updated user
      await user.save()
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  },

  // Delete a user
  deleteUser: async (req, res) => {
    try {
      const { username } = req.user
      // Find the user by username and delete it
      await User.findOneAndDelete({ username })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  },
  LogOut: async (req, res) => {
    const userId = req.headers['x-user-id']
    try {
      await Token.findOneAndDelete({ userId })
      res.removeHeader('x-user-id')
      res.removeHeader('x-username')
      res.json({
        message: 'logout complete'
      })
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}

export default userController
