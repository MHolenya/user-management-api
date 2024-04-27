import User from '../models/User.js';
const userController = {
  getUserById: async (req, res) => {
    try {

      const userId = req.params.userId
      const user = await User.findById(userId)

      if (!user) {
        return res.status(404).json({ error: 'User not found' })
      }

      res.json(user)

    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}

export default userController
