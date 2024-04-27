import { Router } from 'express'
import userController from '../controllers/userController.js'
import inputValidationMiddleware from '../middleware/inputValidation.js'
const router = Router()

router.get('/:userId', userController.getUserById)
router.post('/signup', inputValidationMiddleware, userController.signUp)

export default router
