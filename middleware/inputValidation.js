import { body, validationResult } from 'express-validator'

const inputValidationMiddleware = [
  // Valdiate username
  body('username')
    .matches(/[a-zA-Z]/).withMessage('Username must contain at least one letter')
    .isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters long'),
  // Validate email
  body('email')
    .isEmail().withMessage('Invalid email address'),
  // Validate password
  body('password')
    .isLength({ min: 8, max: 24 }).withMessage('Password must be between 8 and 24 characters long')
    .isString().withMessage('Password must be a string')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one symbol'),

  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

export default inputValidationMiddleware
