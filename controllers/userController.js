const User = require('../models/User')

const getUserData = async (req, res) => {
  try {
    const users = await User.find()
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body)
    res.status(201).json(newUser)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updatedUser)
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = {
  getUserData,
  createUser,
  updateUser,
  deleteUser
}
