import { body, validationResult } from 'express-validator'

/**
 * Validation middleware for sign-up input.
 * @type {import('express').RequestHandler[]}
 */
export const inputValidationSignUp = [
  // Validate username
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
    .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage('Password must contain at least one symbol')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),

  // Check for validation errors
  /**
   * Middleware function to check for validation errors.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next function.
   */
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]

/**
 * Validation middleware for login input.
 * @type {import('express').RequestHandler[]}
 */
export const inputValidationLogin = [
  // Validate email
  body('email')
    .isEmail().withMessage('Invalid email address')
    .notEmpty().withMessage('Email cannot be empty'),

  // Validate password
  body('password')
    .notEmpty().withMessage('Password cannot be empty'),

  // Check for validation errors
  /**
   * Middleware function to check for validation errors.
   * @param {import('express').Request} req - Express request object.
   * @param {import('express').Response} res - Express response object.
   * @param {import('express').NextFunction} next - Express next function.
   */
  (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    next()
  }
]
