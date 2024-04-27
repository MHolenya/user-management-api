import { Router } from 'express'
import userController from '../controllers/userController.js';
const router = Router()

router.get('/:userId', userController.getUserById)

export default router
