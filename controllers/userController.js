import User from '../models/User.js'
import bcrypt from 'bcryptjs'

const userController = {
  // Get one user by id
  getUserById: async (req, res) => {
    try {

      const userId = req.params.userId
      const user = await User.findById(userId)

      // Check if user exist in the database
      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json(user)

    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  },

  // Sign up a new user
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
  }
}

export default userController
