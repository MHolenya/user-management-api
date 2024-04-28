import User from '../models/User.js'
import bcrypt from 'bcryptjs'

/**
 * Controller handling user-related operations.
 */
const userController = {
  /**
   * Get one user by id.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   */
  getUserById: async (req, res) => {
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
  login: async (req, res) => {
    try {
      console.log('entro')
    } catch (error) { }
  },

  // Update a user

  // Delete a user
}

export default userController
