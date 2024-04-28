import { Router } from 'express'
import userController from '../controllers/userController.js'
import { inputValidationSignUp, inputValidationLogin } from '../middleware/inputValidation.js'

/**
 * Express router instance for handling user routes.
 * @type {import('express').Router}
 */
const router = Router()

// Route to get a user by username
router.get('/:username', userController.getUserById)

// Route to sign up a new user
router.post('/signup', inputValidationSignUp, userController.signUp)

// Route to login a user
router.post('/login', inputValidationLogin, userController.login)

export default router
